/**
 * this files holds all event related api endpoints
 */
const { RC_RESPONSE }       = require("../helpers/endpoint_helpers.js");
const { RC_CODES }           = require("../helpers/errors.js");
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

//-----------------------------------------------------------------------------
// export endpoints
//-----------------------------------------------------------------------------
module.exports = router;
