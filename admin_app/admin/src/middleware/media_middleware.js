/**
 * @author Elias Lopes
 * @Date   10/2/2025
 * @description 
 *  This file will handle media related utilities
 * and endpoints that access node.js rest api
 */

// -------------------------------------------------------------------------------------

// configurations and constants
const BASE_URL = import.meta.env.VITE_BASE_URL;
const MEDIA_ROUTE_BASE_URL = `${BASE_URL}/api/media`;






// -------------------------------------------------------------------------------------



/**
 * registers media content into data base
 * @param {*} media 
 * @returns request status and message
 */
// foreignKey = reference to a users ID from users table
// media = array of media objects
export async function registerMedia(media=[], foreignKey=null, user=null){
    // catch bad input early
    if (!media || media.length === 0 || !user) return {status: 404, message: "No media content given"};

    // make request to server to register media content
    try {
        // convert to array if incorrect input
        if (!(media instanceof Array)) media = Array.from(media);

        // registers each media content object
        const results = [];
        for(let m of media){
            console.log("REGISTERING:", m);
            
            // Convert file to base64 for JSON transmission
            let fileData = null;
            if (m.file) {
                fileData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(m.file);
                });
            }

            const response = await fetch(`${MEDIA_ROUTE_BASE_URL}/registerMedia`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    session: user, 
                    media: {
                        ...m,
                        file: fileData
                    }, 
                    foreignKey: foreignKey
                })
            });
            
            // add request response
            const result = await response.json();
            results.push(result);
        }

        return {
            status: 200,
            message: "Media registered successfully",
            results: results
        };
        
    } catch (error) {
        console.error("Error registering media:", error);
        return {
            status: 500,
            message: "Error registering media: " + error.message
        };
    }
}

/**
 * fetches media content
 * for programs and events
 * @param {*} mediaType 
 * @param {*} mediaRef 
 * @returns array of media results
 */
export async function getMediaBy(userSession=null, mediaType="Event", mediaRef=null){
    // no user or no one logged in
    if (!userSession) {
        console.error("No user session detected....");
        return [];
    }

    // incorrect or invalid parameters
    if (!mediaType || !mediaRef || mediaRef === "") {
        console.error("Missing key parameters...");
        return [];
    }

    // make request to server to fetch media
    try {
        
        const response = await fetch(`${MEDIA_ROUTE_BASE_URL}/fetchMedia`, {
                method:     "POST",
                headers:    { "Content-Type": "application/json" },
                body:       JSON.stringify({ 
                session:    userSession, 
                mediaType:  mediaType, 
                mediaRef:   mediaRef,
            })
        });

        // serialize http response
        const data = await response.json();

        // check if valid response is given back
        if (data){
            if (!data instanceof Array) {
                return data.status === 200 ? Array.from(data.media) : [];
            }
            else{
                return data.status === 200 ? data.media : [];
            }
        }
        else{
            return [];
        }
           


    } catch (error) {
        console.error("Error attempting to get response from server");
        return [];
    }
}

/**
 * Removes media by url
 * @param {*} userSession 
 * @param {*} mediaURL 
 * @returns array of URLs of deleted media
 */
export async function deleteMedia(userSession=null, mediaURL=null){
    // checks if user session is found
    if(!userSession){
        console.error("No user session found...");
        return null;
    }
    // verifies url(s) are given
    if(!mediaURL){
        console.error("No media URL given...");
        return null;
    }
    
    // Handle array input - take first element
    if (Array.isArray(mediaURL)) {
        console.warn("deleteMedia received array, taking first element:", mediaURL);
        mediaURL = mediaURL[0];
    }
    
    // Verify we have a valid string URL
    if (typeof mediaURL !== 'string') {
        console.error("deleteMedia: Expected string URL, received:", typeof mediaURL, mediaURL);
        return null;
    }
    
    try {
        // make delete request 
        const response = await fetch(`${MEDIA_ROUTE_BASE_URL}/deleteMedia`, {
            method:     "DELETE",
            headers:    { "Content-Type": "application/json" },
            body:       JSON.stringify({ 
                session:    userSession,  
                mediaURL:   mediaURL,
                mediaType:   "event"
            })});

        // parse response
        const data = await response.json();
        
        // check status of request
        if (response.status === 200){
            console.log("Media removed successfully:", data.removed_urls);
            return data.removed_urls || null;
        }else{
            console.error("Media unable to be removed. Status:", response.status, "Response:", data);
            return null;
        }

    } catch (error) {
        console.error("Unable to complete delete request:", error);
        return null;
    }
}