/**
 * @author Elias Lopes
 * @Date   09/30/2025
 * @description 
 *  this file will be the main file with
 *  logic for all requests relating to media
 * 
 *  - crud applications
 *  - database specific functions through supabase client
 * 
 *  - uses commonjs modules
 */

// import modules
const express   = require("express");
const router    = express.Router();
const supabase  = require("../utils/supabase.js");
const { STANDARD_RESPONSE, authorizeUse } = require("../utils/endpoint_helpers.js");
const crypto    = require("crypto");

/**
 * checks if media passed to request
 * is valid, and has minimum data
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function verifyMedia(req, res, next){
    const mediaObject   = req.body.media;
    const foreignKey    = req.body.foreignKey;

    // catch bad media or no foreignKey
    if (!mediaObject || !foreignKey) 
        return res.json(STANDARD_RESPONSE(404, "No media object or foreign key given"));

    // clean up no id objects by generating new UUID
    if (!mediaObject.id) mediaObject.id = crypto.randomUUID();

    // catch no file data for new uploads or no preview for existing media
    if (!mediaObject.file && !mediaObject.preview) 
        return res.json(STANDARD_RESPONSE(404,"No media file or preview given"));
    
    console.log("Media Is Verified...")
    return next();

}

function getFilePathFromUrl(url) {
    // Handle different input types
    if (!url) return null;
    
    // If it's an array, take the first element
    if (Array.isArray(url)) {
        url = url[0];
    }
    
    // If it's still not a string, return null
    if (typeof url !== 'string') {
        console.error('getFilePathFromUrl: Expected string URL, received:', typeof url, url);
        return null;
    }
    
    console.log('getFilePathFromUrl - Input URL:', url);
    
    // Try different URL patterns for Supabase storage
    let filePath = null;
    
    // Pattern 1: /object/public/bucket/path/to/file
    if (url.includes('/object/public/')) {
        const parts = url.split('/object/public/');
        if (parts.length >= 2) {
            // Remove the bucket name (first segment) and join the rest
            const pathSegments = parts[1].split('/');
            if (pathSegments.length > 1) {
                filePath = pathSegments.slice(1).join('/');
            } else {
                filePath = parts[1];
            }
        }
    }
    // Pattern 2: Direct path without /object/public/
    else if (url.includes('/storage/v1/object/')) {
        const parts = url.split('/storage/v1/object/');
        if (parts.length >= 2) {
            filePath = parts[1];
        }
    }
    // Pattern 3: Just try to extract the last part of the path
    else {
        console.log('getFilePathFromUrl - Unrecognized URL pattern, trying to extract path from end');
        const urlParts = url.split('/');
        // Look for patterns like: .../media/uploads/filename.ext
        const mediaIndex = urlParts.findIndex(part => part === 'media');
        if (mediaIndex !== -1 && mediaIndex < urlParts.length - 1) {
            filePath = urlParts.slice(mediaIndex + 1).join('/');
        }
    }
    
    console.log('getFilePathFromUrl - Extracted file path:', filePath);
    return filePath;
  }

//--------------------------------------------------------------------------------------------------

/**
 * uploads media content
 * to S3 storage bucket
 * @param {*} media 
 * @param {*} storageBucket 
 * @returns id of storage bucket
 */
async function uploadToStorage(media, storageBucket){
    const supportedBuckets = ["media"];

    // checks for unsupported buckets
    if (!supportedBuckets.includes(storageBucket)){
        console.error("Unsupported storage bucket...");
        return null;
    }

    // upload file object to S3 storage bucket
    try {
        if (!media) {
            console.error("No media provided to uploadToStorage");
            return null;
        }

        // media expected as Data URL string: data:<mime>;base64,<payload>
        let mimeType = "application/octet-stream";
        let base64Payload = null;

        if (typeof media === "string") {
            const dataUrlMatch = media.match(/^data:([^;]+);base64,(.+)$/);
            if (dataUrlMatch) {
                mimeType = dataUrlMatch[1];
                base64Payload = dataUrlMatch[2];
            } else {
                // If it's just raw base64 without data URL prefix
                base64Payload = media;
            }
        } else if (media && typeof media === "object" && media.data && media.type) {
            // fallback path if an object is sent
            mimeType = media.type;
            base64Payload = media.data;
        }

        if (!base64Payload) {
            console.error("Invalid media format. Expecting base64 data or data URL");
            return null;
        }

        const buffer = Buffer.from(base64Payload, "base64");

        // derive extension from mime type
        const mimeToExt = {
            "image/png": "png",
            "image/jpeg": "jpg",
            "image/jpg": "jpg",
            "image/webp": "webp",
            "image/gif": "gif",
            "video/mp4": "mp4",
            "video/quicktime": "mov",
            "application/pdf": "pdf"
        };
        const fileExt = mimeToExt[mimeType] || "bin";

        // create unique file path
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `uploads/${fileName}`; // prefix folder for organization

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(storageBucket)
            .upload(filePath, buffer, { contentType: mimeType, upsert: true });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return null;
        }

        const { data: publicData } = supabase
            .storage
            .from(storageBucket)
            .getPublicUrl(filePath);

        return publicData && publicData.publicUrl ? publicData.publicUrl : null;

    } catch (err) {
        console.error("Unexpected error uploading to storage:", err);
        return null;
    }

}

/**
 * adds a media record to the 
 * event/programs_event
 * table
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns status
 */
async function appendMedia(req, res, next){
    const mediaFile     = req.body.media.file;
    const foreignKey    = req.body.foreignKey;

    // upload media to media bucket
    const contentURL = await uploadToStorage(mediaFile, "media");
    console.log("Supabase bucket URL:", contentURL);

    // attempt to insert media into media table
    try {
        const { data, error } = await supabase
        .from("event_media")
        .insert([
            {
                media_reference:    foreignKey,
                preview:            contentURL
            }
        ])
        .select();

        // check if row was returned
        if (data){
            console.log("Data Has Been Appended....");
            return next();
        }else{
            console.log("Data Could Not Be Appended....");
            return res.json(STANDARD_RESPONSE(404, "Data Could Not Be Appended...."));
        }
        
    } catch (error) {
        console.error("Couldnt fulfill media append request:", error);
        return res.json(STANDARD_RESPONSE(404, "Couldnt fulfill media append request"));
    }
}

/**
 * Fetches media from S3 bucket
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns status and array of media
 */
async function fetchMedia(req, res, next){
    // variables to verify
    const mediaType = req.body.mediaType;
    const mediaPK   = req.body.mediaRef;

    // supported media types
    const supportedTypes = ["Event", "Program"]; // add more types if needed

    // verify fields
    if (!mediaPK)
        return res.json(STANDARD_RESPONSE(404, "Invalid field [MEDIA PK] given"));

    if (!mediaType || !supportedTypes.includes(mediaType))
        return res.json(STANDARD_RESPONSE(404, "Invalid field [MEDIA TYPE] given"));

    // fetch media content from database
    try {
        let { data: event_media, error } = await supabase
        .from('event_media')
        .select("*")
        .eq("media_reference", mediaPK);

        if (error) {
            console.error("Supabase error fetching media:", error);
            return res.json(STANDARD_RESPONSE(404, "Error attempting to fetch media content"));
        }

        //console.log("Fetched media:", event_media);
        // add response section
        req.media_fetched = event_media || [];
        return next();

    } catch (error) {
        console.log("Error attempting to fetch media content:", error);
        return res.json(STANDARD_RESPONSE(404, "Error attempting to fetch media content"));
    }
}

async function deleteMedia(req, res, next){
    const { mediaURL }      = req.body;
    const { mediaType }     = req.body;

    // add all supported media types with media table name
    const supportedTypes    = {
        // media_type : table_name
        "event"     : "event_media", 
        "program"   : "program_media"
    };

    if (!mediaType || !supportedTypes.has(mediaType)){
        console.error("Unsupported media type:", mediaType);
    }


    // make sure URL was passed to request body
    if (!mediaURL){
        console.error("No URL was extracted...");
        return res.json(STANDARD_RESPONSE(404, "No URL given..."));
    }

    try {
        console.log("Removing media...");
        console.log("mediaURL received:", mediaURL, "type:", typeof mediaURL);
        
        // get file path from public URL
        const filePath = getFilePathFromUrl(mediaURL);
        
        if (!filePath) {
            console.error("Could not extract file path from URL:", mediaURL);
            return res.json(STANDARD_RESPONSE(404, "Invalid URL format - could not extract file path"));
        }
        
        console.log("Extracted file path:", filePath);
        console.log("Attempting to remove from 'media' bucket with path:", filePath);
        
        // First, let's check if the file exists in the bucket
        console.log("Checking if file exists in bucket...");
        
        // Try to list files in the uploads directory to see what's there
        const { data: listData, error: listError } = await supabase
            .storage
            .from('media')
            .list('uploads');
        
        console.log("Files in uploads directory:", listData);
        console.log("List error:", listError);
        
        // Check if our specific file exists
        const fileName = filePath.split('/').pop();
        const fileExists = listData && listData.some(file => file.name === fileName);
        console.log("Target file exists:", fileExists, "Looking for:", fileName);
        
        // Now attempt to remove the file
        console.log("Attempting to remove file with path:", filePath);
        console.log("File path type:", typeof filePath);
        console.log("File path length:", filePath ? filePath.length : 'null');
        
        const { data, error } = await supabase
        .storage
        .from('media')
        .remove([filePath])

        // Log the full response for debugging
        console.log("Supabase remove response - data:", data);
        console.log("Supabase remove response - error:", error);

        if (error){
            console.error("Error when trying to remove media:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            console.error("Error message:", error.message);
            console.error("Error status:", error.status);
            return res.json(STANDARD_RESPONSE(404, `Error attempting to remove media from bucket: ${error.message || 'Unknown error'}`));
        } else {
            console.log("Storage removal successful! Removed files:", data);
        }

        // remove media preview from event/program table
        const { data: deleteData, error: deleteError } = await supabase
        .from(supportedTypes[mediaType])
        .delete()
        .eq('preview', mediaURL)

        // verify database deletion response
        if (deleteError){
            console.error("Error when trying to remove media from database:", deleteError);
            return res.json(STANDARD_RESPONSE(404, `Error attempting to remove media from database: ${deleteError.message || 'Unknown error'}`));
        } else {
            console.log("Media removed successfully from both storage and database...");
            console.log("Storage removal result:", data);
            req.removed_urls = (data && data instanceof Array) ? data : [];
            return next();
        }
    
    } catch (error) {
        console.error("Error attempting to remove media from bucket:", error);
        return res.json(STANDARD_RESPONSE(500, "Error attempting to remove media from bucket..."));
    }
}

//-----------------------------------------------------------------------------------------------------
router.post("/registerMedia", authorizeUse(allowList=[]), verifyMedia, appendMedia, (req, res)=>{
    res.json(STANDARD_RESPONSE(200, "Media registered successfully"));
});

router.post("/fetchMedia", authorizeUse(allowList=[]), fetchMedia, (req, res)=>{
    res.json({
        ...STANDARD_RESPONSE(200, "Media fetched successfully"),
        media: req.media_fetched
    });
});

router.delete("/deleteMedia", authorizeUse(allowList=[]), deleteMedia, (req, res)=>{
    res.json({
        ...STANDARD_RESPONSE(200, "Media removed successfully"),
        removed_urls: req.removed_urls
    });
});

// Temporary debug endpoint to test storage operations
router.get("/debugStorage/:path", authorizeUse(allowList=[]), async (req, res) => {
    const { path } = req.params;
    
    try {
        console.log("Debug: Checking storage for path:", path);
        
        // List files in uploads directory
        const { data: listData, error: listError } = await supabase
            .storage
            .from('media')
            .list('uploads');
        
        console.log("Debug: Files in uploads directory:", listData);
        console.log("Debug: List error:", listError);
        
        // Try to get public URL for the path
        const { data: publicData } = supabase
            .storage
            .from('media')
            .getPublicUrl(path);
        
        console.log("Debug: Public URL for path:", publicData);
        
        res.json({
            status: 200,
            message: "Debug info collected",
            listData,
            listError,
            publicData,
            requestedPath: path
        });
        
    } catch (error) {
        console.error("Debug error:", error);
        res.json({
            status: 500,
            message: "Debug failed",
            error: error.message
        });
    }
});

module.exports = router;