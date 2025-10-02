/**
 * @author Elias Lopes
 * @Date   09/16/2025
 * @description 
 *  this file will be the main file with
 *  logic for all requests relating to events
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


// -----------------------------------------------------------------------

// custom http responses
function STANDARD_RESPONSE(status, message){
    return {
        status: status,
        message: message
    };
} 

// -----------------------------------------------------------------------
//implement supabase client fucntions

/**
 * fetches all events given a 
 * filter configuration
 * @param {*} active_only 
 * @param {*} use_limit 
 * @returns array of event objects
 */
async function fetchEvent(active_only=false, use_limit=null){
    try {
        // simple select all request
        let { data: events, error } = await supabase
        .from('events')
        .select('*');
        
        if (error) {
            console.error("Supabase error:", error);
            return [];
        }
        
        return events || [];
    } catch (error) {
        console.error("Unable to fetch events with given configuration:", error);
        return [];
    }
}

/**
 * adds an event to the events database,
 * after event is added, the events will be returned
 * so it can be linked to any media content that is tied to the
 * event
 * @param {*} event 
 * @returns created event row
 */
async function addEvent(req, res, next){
    console.log("Adding event!");
    
        const event = req.body.event;

        if (!event) return null;
        // attempt to add to database
        try {
            const { data, error } = await supabase
                    .from("events")
                    .insert([
                        {
                        name: event.name || "",
                        date: event.date || null,
                        location: event.location || "",
                        description: event.description || "",
                        active: false,
                        media_id: event.media_id || null,
                        start_time: event.start_time || null,
                        end_time: event.end_time || null
                        },
                    ])
                    .select();

            if (data){
                req.inserted_event = data;
                next();
            }else{
                return res.json(STANDARD_RESPONSE(404, "Unable to add event to database: No row returned"));
            }   

        } catch (error) {
            console.error("Unable to add event to database:", error);
            return res.json(STANDARD_RESPONSE(404, "Unable to add event to database"));
        }
}

/**
 * updates an event at a certain 
 * id, in the database
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns status, event, message
 */
async function updateEvent(req, res, next){
    // get new event details
    const event = req.body.event;
    // check if event exists
    if (!event) return res.json(STANDARD_RESPONSE(404, "No event was passed"));

    try {
        // sql code to update the row
        const { data, error } = await supabase
        .from('events')
        .update({
            name: event.name || "",
            date: event.date || null,
            location: event.location || "",
            description: event.description || "",
            active: false,
            media_id: event.media_id || null,
            start_time: event.start_time || null,
            end_time: event.end_time || null
        })
        .eq('id', event.id) // filter by the specific UUID
        .select();  

        // add row to HTTP request
        if (data){
            req.updated_event = data;
            next();
        }else{
            console.log("Unable to update row");
            return res.json(STANDARD_RESPONSE(403, "Unable to update row"));
        }
    } catch (error) {
        console.log("Unable to update row:", error);
        return res.json(STANDARD_RESPONSE(404, "Unable to update row"));
    }
}

/**
 * removes an event from the
 * database by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns
 */
async function deleteEvent(req, res, next){
    const event = req.body.event;
    // no event was passed to HTTP body
    if (!event || !event.id) return res.json(STANDARD_RESPONSE(403, "No event was passed to be deleted"));

    try {
        // uses supabase client to delete row at a specific uid
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', event.id);

        // handle database errors
        if (error) {
            console.error("Supabase error:", error);
            return res.json(STANDARD_RESPONSE(403, "Unable to delete row"));
        }
        // send to next route handler
        next();

    } catch (error) {
        console.error("Error when attempting to delete event:", error);
        return res.json(STANDARD_RESPONSE(403, "Error when attempting to delete event"));
    }
}

//-----------------------------------------------------------------------------------------

/**
 * makes sure that user session
 * has permission to do certain 
 * operations and access certain 
 * API requests
 * @param {*} allowList 
 * @returns 
 */
function authorizeUse(allowList=[], hasReqBody=true){
    return (req, res, next)=>{
        // no restriction on permissons
        if (allowList.length == 0)
            return next();

        let session;
        // access session data
        if (hasReqBody)
            session = req.body.session.token;
        else
            session = req.headers["session"]["token"];

        // checks if user exists
        if (session)
            // if user has permission
            if (allowList.includes(session.role))
                return next();
            // handle user not permitted
            else
                return res.json(STANDARD_RESPONSE(403, "User not permitted to access route")); // not permitted to access route
        // handle user not found error
        else
            return res.json(STANDARD_RESPONSE(404, "User not found")); // user not found
    }
}



// --------------------------------------------------------------------------------
// REST API routes
router.post("/fetchEvents", authorizeUse(allowList= [],hasReqBody=true), async (req, res)=>{
    try {
        // fetch data from supabase
        const data = await fetchEvent();
        console.log("Found events:", data);
        // return as json array
        return res.json(data || []);
    }catch(error){
        console.error("Unable to fulfill request:", error);
        // return empty results
        return res.json([]);
    }
});

router.post("/addEvent", authorizeUse(allowList=["General"], hasReqBody=true), addEvent,(req, res)=>{
    return res.json({
        ...STANDARD_RESPONSE(200, "Event was added successfully"),
        new_event: req.inserted_event || null
    });
});

router.put("/updateEvent", authorizeUse(allowList=["General", "Admin"], hasReqBody=true), updateEvent, (req, res)=>{
    return res.json({
        ...STANDARD_RESPONSE(200, "Event was updated successfully"),
        updated_event: req.updated_event || null
    });
});

router.delete("/deleteEvent", authorizeUse(allowList=['General',"Admin"], hasReqBody=true), deleteEvent, (req, res)=>{
    return res.json( STANDARD_RESPONSE(200, "Event was updated successfully") );
});


// export routes
module.exports = router;