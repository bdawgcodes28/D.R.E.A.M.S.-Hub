/**
 * this file defines a aws sdk client
 * object that can be used to interact
 * with our DB, S3, and other aws tools 
 */


const { S3Client, 
        PutObjectCommand,
        GetObjectCommand, 
        DeleteObjectCommand}            = require("@aws-sdk/client-s3");
const fs                                = require("fs");
const path                              = require("path");
const { getSignedUrl }                  = require("@aws-sdk/s3-request-presigner");
const { error }                         = require("console");

class S3Bucket 
{

    bucket;
    folderPath;
    s3;

    //----------------------------------
    constructor (bucket="dreams-media-a", folderPath=null)
    {
        this.bucket         = bucket;
        this.folderPath     = folderPath? folderPath : "";
        
        // Configure S3Client with region and credentials
        const s3Config = {
            region: process.env.AWS_REGION || "us-east-2",
        };
        
        // Add credentials if provided via environment variables
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
            s3Config.credentials = {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            };
        }
        // Otherwise, AWS SDK will use default credential provider chain
        
        this.s3 = new S3Client(s3Config);
    }

    //----------------------------------

    /**
     * upload a file (via file path) or a file object (via file input)
     * to s3 bucket in aws
     * @param {string|object}           filePath - Local file path (string) or file object from HTML input
     * @param {Buffer|Stream|string}    body - File content (optional if filePath is a local path or file object)
     * @param {string}                  destination - Optional destination folder path in S3
     * @param {boolean}                 fileObjectPassed - Set to true if filePath is a file object from HTML input
     * @returns object of uploaded objects to bucket
     */
    async uploadFile(filePath=null, body=null, destination=null, fileObjectPassed=false)
    {
        if (!filePath)
            return null;

        let fileBody = body;
        let s3Key = null;
        let fileName = null;

        // Handle file object from HTML input (e.g., from multer, form-data, etc.)
        if (fileObjectPassed || (typeof filePath === 'object' && filePath !== null)) {
            const fileObj = filePath;
            
            // Extract file body from various possible formats
            if (fileObj.buffer) {
                // Multer-style file object
                fileBody = fileObj.buffer;
                fileName = fileObj.originalname || fileObj.name || 'uploaded-file';
            } else if (fileObj.data) {
                // Base64 data or buffer
                if (Buffer.isBuffer(fileObj.data)) {
                    fileBody = fileObj.data;
                } else if (typeof fileObj.data === 'string') {
                    // Handle base64 string
                    const base64Match = fileObj.data.match(/^data:([^;]+);base64,(.+)$/);
                    if (base64Match) {
                        fileBody = Buffer.from(base64Match[2], 'base64');
                    } else {
                        fileBody = Buffer.from(fileObj.data, 'base64');
                    }
                } else {
                    fileBody = Buffer.from(JSON.stringify(fileObj.data));
                }
                fileName = fileObj.originalname || fileObj.name || fileObj.filename || 'uploaded-file';
            } else if (Buffer.isBuffer(fileObj)) {
                // Direct buffer
                fileBody = fileObj;
                fileName = 'uploaded-file';
            } else if (fileObj.path && fs.existsSync(fileObj.path)) {
                // File object with path property (multer temp file)
                fileBody = fs.readFileSync(fileObj.path);
                fileName = fileObj.originalname || fileObj.name || path.basename(fileObj.path);
            } else {
                console.error("Unable to extract file data from file object");
                return null;
            }

            // Use provided body if available, otherwise use extracted body
            if (body) {
                fileBody = body;
            }

            if (!fileBody) {
                console.error("No file body available for upload");
                return null;
            }

            // Construct S3 key using filename
            const folderPath = destination ? destination : this.folderPath;
            // Clean folder path (remove leading/trailing slashes) and construct key
            const cleanFolderPath = folderPath ? folderPath.replace(/^\/+|\/+$/g, '') : '';
            s3Key = cleanFolderPath ? `${cleanFolderPath}/${fileName}` : fileName;

        } else {
            // Handle local file path (string)
            const localPath = filePath;
            
            // Check if file exists
            if (!fs.existsSync(localPath)) {
                console.error(`File not found: ${localPath}`);
                return null;
            }

            // Read file if body not provided
            if (!fileBody) {
                fileBody = fs.readFileSync(localPath);
            }

            // Extract filename from path for S3 key
            fileName = path.basename(localPath);
            const folderPath = destination ? destination : this.folderPath;
            // Clean folder path (remove leading/trailing slashes) and construct key
            const cleanFolderPath = folderPath ? folderPath.replace(/^\/+|\/+$/g, '') : '';
            s3Key = cleanFolderPath ? `${cleanFolderPath}/${fileName}` : fileName;
        }

        // Ensure we have a body to upload
        if (!fileBody) {
            console.error("No file body available for upload");
            return null;
        }

        const params = {
            Bucket: this.bucket,
            Key: s3Key,
            Body: fileBody,
        };

        try {
            const response = await this.s3.send(new PutObjectCommand(params));
            console.log("response:", response);

            // get public url returned as well
            // Ensure s3Key doesn't start with / to avoid double slashes
            const cleanKey = s3Key.startsWith('/') ? s3Key.substring(1) : s3Key;
            const publicUrl = `https://${this.bucket}.s3.us-east-2.amazonaws.com/${cleanKey}`;
            const extended_info = {
                ...response,
                public_url: publicUrl,
                key: s3Key,
                filename: fileName
            };

            return extended_info;
        } catch (error) {
            console.error("Unable to upload file:", error);
            return null;
        }

    }

    /**
     * gets a upload by the bucket and media
     * @param {*} bucket 
     * @param {*} key 
     * @param {*} expire 
     * @returns public url of an upload
     */
    async getUpload(bucket=this.bucket, key=null, expire=259200)
    {
        if(!bucket || !key){
            console.error("No bucket set");
            return null;
        }

        try {
            const command = new GetObjectCommand({Bucket: bucket, Key: key});
            const url     = await getSignedUrl(this.s3, command, { expire });
            return url;

        } catch (error) {
            console.error("Unable to get upload:", error);
            return null;
        }

    }

    async removeUpload(bucket=this.bucket, key=null)
    {
        if (!key)
        {
            console.error("No key was given to upload");
            return null;
        }

        const params = {
            Bucket: bucket,
            Key:    key
        };

        try {
            // request to delete from bucket
            const result = await this.s3.send(new DeleteObjectCommand(params));
            return result;

        } catch (error) {
            console.error("Unable to remove object:", error);
            return null;
        }
            
    }

    //--------------------------------------------------------------
    setBucket(bucketName){ this.bucket = bucketName; }

}

//------------------------------------------------------------------------

module.exports = { S3Bucket };
