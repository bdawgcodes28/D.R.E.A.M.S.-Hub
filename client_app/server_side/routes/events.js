/**
 * this files holds all event related api endpoints
 */
const { RC_RESPONSE }       = require("../helpers/endpoint_helpers.js");
const { RC_CODES }          = require("../helpers/errors.js");
const express               = require("express");
const router                = express.Router();
const { MySQLConnector }    = require("../helpers/sql_wrapper.js");

// client to interact with RDS database - lazy initialization
let sqlClient;
function getSqlClient() {
    if (!sqlClient) {
        sqlClient = new MySQLConnector(null, null, null, "dreams_main");
    }
    return sqlClient;
}
//-----------------------------------------------------------------------------
// endpoint helper functions
//-----------------------------------------------------------------------------

/**
 * SELECT * FROM events;
 * @returns arrays of js event objects
 */
async function getEvents(req, res, next)
{
    try {
        const client = getSqlClient();
        const result = await client.selectAllRows("events");
        req.events_found = result;
        return next();
    } catch (error) {
        return res.json(
            RC_RESPONSE(RC_CODES.BAD_REQUEST, {
                error: error.message
            })
        );
    }
}

async function getEventMedia(req, res, next)
{
    try {
        // Ensure request body is parsed correctly
        if (!req.body) {
            console.error("Request body is missing or not parsed");
            return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST, {
                error: "Request body is missing or could not be parsed"
            }));
        }

        // get all event_ids needed
        const id_list = req.body.id_list;

        if (!id_list || !Array.isArray(id_list) || id_list.length == 0)
        {
            console.error("No event ids given or invalid format:", id_list);
            return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST, {
                error: "id_list is required and must be a non-empty array",
                received: id_list
            }));
        }

        let hm = {};
        const client = getSqlClient();
        
        // get media for each event
        for (let i=0;i<id_list.length;i++)
        {
            const id = id_list[i];

            try 
            {
                // Validate id is a non-empty string
                if (!id || typeof id !== 'string' || id.trim().length === 0) {
                    console.error("Invalid event id (empty or not a string):", id);
                    hm[`${id}`] = [];
                    continue;
                }

                // get url for each image using parameterized query
                let urls = new Set();

                // Use parameterized query to prevent SQL injection (works with UUIDs/varchar)
                const event_urls = await client.invokeSQL(`
                    SELECT url
                    FROM event_images inner join images
                    ON event_images.image_id = images.id
                    WHERE event_id = ?
                `, [id]);
                
                // filling set with the images
                if (event_urls && Array.isArray(event_urls)) {
                    for (let j=0;j<event_urls.length;j++){ 
                        urls.add(event_urls[j].url); 
                    }
                }

                // add set to array of urls to the hash map
                hm[`${id}`] = (urls && urls.size > 0) ? Array.from(urls) : [];

            } catch (error) 
            {
                console.error("Unable to get media:", error, "For event:", id);
                // Set empty array for this event on error
                hm[`${id}`] = [];
            }
        }
        req.media_map = hm;
        next();
    } catch (error) {
        // Catch any unhandled errors (like SQL connection failures)
        console.error("Error in getEventMedia:", error);
        return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            error: error.message || "Failed to retrieve event media"
        }));
    }
}

//-----------------------------------------------------------------------------
// Implement endponts
//-----------------------------------------------------------------------------
router.get("/fetch", getEvents, (req, res)=>{
    return res.json(
        RC_RESPONSE(
            RC_CODES.SUCCESS,
            {
                data : req.events_found
            }
        )
    );
});

router.post("/retrieve/media", getEventMedia, (req, res)=>{
    return res.json(RC_RESPONSE(
        RC_CODES.SUCCESS,
        {
            data : req.media_map
        }
    ));
});

//-----------------------------------------------------------------------------
// export endpoints
//-----------------------------------------------------------------------------
module.exports = router;
