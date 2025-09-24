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
async function addEvent(event){
    // returns unsuccessfuly
    if (!event)
        return null;

    // attempts to add event to the event table
    try {
        // add row to table
        const { data, error } = await supabase
            .from('events')
            .insert([
            { some_column: 'someValue', other_column: 'otherValue' },
            ])
            .select();
        return data;
        
    } catch (error) {   
        console.error("Unable to add event to table:", error);
        return null;
    }
}



// --------------------------------------------------------------------------------
// REST API routes

router.get("/fetchEvents", (req, res)=>{

    try {
        // fetch data from supabase
        const data = fetchEvent();
        
        // return as json array
        res.json(data);
    }catch(error){
        console.error("Unable to fulfill request:", error);
        // return empty results
        res.json([]);
    }
});


router.post("/addEvent", (req, res)=>{
    const request_body = req.body;
    try {
        // add event to table
        const new_event = addEvent(request_body);
        res.json(new_event);
        console.log("New event was made successfully");

    } catch (error) {
        // catch request error
        console.error("Unable to add event:", error);
        res.json(null);
    }

});


// export routes
module.exports = router;