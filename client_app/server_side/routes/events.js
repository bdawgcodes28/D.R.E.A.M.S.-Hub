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
    // get all events ids needed
    const id_list = req.body.id_list;

    if (!id_list || id_list.length == 0)
    {
        console.error("No event ids given:", id_list);
        return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST));
    }

    let hm = {};
    const client = getSqlClient();
    // get media for each event
    for (let i=0;i<id_list.length;i++)
    {
        const id = id_list[i];

        try {
            // get images id
            const image_ids = await client.invokeSQL(`
                SELECT image_id FROM event_images
                WHERE event_id = '${id}'    
            `);

            // get url for each image
            let urls = new Set();

            for(let j=0;j<image_ids.length; j++){
                // Extract image_id from the row object
                const image_id = image_ids[j].image_id;

                // get the url for that image
                const url_result = await client.invokeSQL(`
                    SELECT url FROM images
                    WHERE id = '${image_id}' 
                `);
                
                // Extract url from the row object and add to set
                if (url_result && url_result.length > 0) {
                    urls.add(url_result[0].url);
                }
            }

            // add set to array of urls to the hash map
            hm[`${id}`] = urls.size > 0 ? Array.from(urls) : [];

        } catch (error) {
                console.error("Unable to get media:", error, "For event:", id);
        }
    }
    req.media_map = hm;
    next();
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
