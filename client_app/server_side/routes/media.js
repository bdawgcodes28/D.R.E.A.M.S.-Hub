/**
 * use this file to handle media specific
 * operations, like CRUD for media object 
 * and linking them to programs and events
 */

const { RC_RESPONSE }       = require("../helpers/endpoint_helpers.js");
const { RC_CODES }          = require("../helpers/errors.js");
const express               = require("express");
const router                = express.Router();
const { MySQLConnector }    = require("../helpers/sql_wrapper.js");
const { S3Bucket }          = require("../helpers/s3.js");
const { randomUUID }        = require('crypto');
const multer                = require("multer");

//----------------------------------------------------------------------------
// create singleton clients for sql and s3

let sqlClient;
function getSqlClient()
{
    if (!sqlClient) {
        sqlClient = new MySQLConnector(null, null, null, "dreams_main");
    }
    return sqlClient;
}

let s3Client;
function getS3Client()
{
    if (!s3Client) {
        s3Client = new S3Bucket();
    }
    return s3Client;
}

// media handling 
const upload = multer({
    storage: multer.memoryStorage()
});

//----------------------------------------------------------------------------
// endpoints helpers
async function uploadFile(req, res, next)
{
    // get upload info (event,file_object)
    const { id, upload_type } = req.body;
    const { bucket }          = req.body || null;

    // choose key
    let s3Key = null;
    switch(upload_type)
    {
        case "event":
            s3Key = "event-media";
            break;
        case "program":
            s3Key = "program-media";
            break;
        default:
            s3Key = "event-media";
            break;
    }

    // handle bad request params
    if (!id || id.length == 0)               { return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST)) }
    if (!upload_type || id.upload_type == 0) { return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST)) }

    try 
    {
        // get s3 client
        const s3    = getS3Client();

        // set bucket if its overwritten in request body
        if (bucket) { s3.setBucket(bucket); }

        // get sql client
        const sql   = getSqlClient();

        // upload file to s3 bucket
        // returns s3key and public url
        const upload_response = await s3.uploadFile(
            req.file,
            null,
            s3Key,
            true
        );

        /**
         * insert into images table
         * - create/save a uuid()
         * - insert the id, url, key
         */

        const image_id  = randomUUID(); // will be used later in this method to insert into 2 tables
        const url       = upload_response.public_url;
        const s3_key    = upload_response.key;

        // insert row in table
        const images_query_result = await sql.insertIntoTable(
            "images",                 // table name
            ["id", "url", "s3_key"],  // columns being inserted
            [[image_id, url, s3_key]] // values being inserted | only 1 is being inserted here
        );

        /**
         * insert into linked table | for example event_images, program_images, etc
         */

        const   linked_row_id = randomUUID();
        let     linked_table  = null;
        const   event_id      = id;

        switch(upload_type)
        {
            case "event":
                linked_table = "event_images";
                break;
            case "program":
                linked_table = "program_images";
                break;
            default:
                linked_table = "event_images";
                break;
        }

        // insert a row that links the image upload to a event/program/etc
        const linked_table_query_result = await sql.insertIntoTable(
            linked_table,
            ["id", "event_id", "image_id"],
            [[linked_row_id, event_id, image_id]]
        );

        next();

    } catch (error) 
    {
        console.log("error:", error);
        next();
    }

    
}


//----------------------------------------------------------------------------

// http endpoints
router.post("/upload/file", upload.single("media"), uploadFile, (req, res) => {
    
    return res.json(RC_RESPONSE(RC_CODES.SUCCESS));
});


//----------------------------------------------------------------------------
module.exports = router;