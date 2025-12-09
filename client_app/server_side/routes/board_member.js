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


//----------------------------------------------------------------------------

/**
 * selects all rows from the board
 * member profile table
 */
async function getMemberData(req, res, next)
{
    try 
    {
        // get sql client
        const sql    = getSqlClient();

        // get all rows
        const result = await sql.selectAllRows("board_member_website_profiles");
        // handle no data found
        if (result.length == 0){ return res.json(RC_RESPONSE(RC_CODES.NOT_FOUND)); }
        
        // get headshots images


        // add data to req packet
        req.data = result;

        next();

    } catch (error) 
    {
        console.error("Error when trying to get member data:", error);
        return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR));
    }
}

//----------------------------------------------------------------------------

router.get("/fetch/members", getMemberData, (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    return res.json(RC_RESPONSE(
        RC_CODES.SUCCESS,
        {
            data: req.data
        }
    ));
});

//----------------------------------------------------------------------------
module.exports = router;