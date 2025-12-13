/**
 * this file has all api endpoint entry ways
 * for the react app to abstract complexity
 */


//------------------------------------------------------
// import env varibles to interact with server
//------------------------------------------------------
const BASE_URL              = import.meta.env.VITE_BASE_URL || "";
const REST_PORT             = import.meta.env.VITE_REST_API_PORT;
const EVENTS_API_ENTRY      = "/api/events";

// Construct the full API URL
// Use relative URLs if BASE_URL is empty (for production when served from same origin)
// Handle both cases: BASE_URL with or without port
const API_BASE_URL = BASE_URL 
    ? (REST_PORT ? `${BASE_URL}:${REST_PORT}` : BASE_URL)
    : "";

//------------------------------------------------------
// implement middleware
//------------------------------------------------------

/**
 * gets events from server
 * @returns array of event objects
 */
export async function loadEvents()
{
    try {
        // make http request to REST api
        const response = await fetch(
            `${API_BASE_URL}${EVENTS_API_ENTRY}/fetch`,{
            method:     "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status == 200)
        {
            return data.data;
        }
        
        return [];
        
    } catch (error) {
        console.error("Unable to fetch events:", error);
        return [];
    }
}

/**
 * returns media for events by id
 * @param {*} id 
 * @returns array of public URL's
 */
export async function loadMedia(ids=[])
{
    
    if (!ids || ids.length == 0)
        return {};

    try {

        // request to server to access s3
        const response = await fetch(
            `${API_BASE_URL}${EVENTS_API_ENTRY}/retrieve/media`,{
            method:     "POST",
            headers:    { "Content-Type" : "application/json" },
            body:       JSON.stringify({id_list: ids})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const parsed_data = await response.json();
        //console.log("Media map:", parsed_data);
        // cache on frontend?

        // return content
        return parsed_data.data;
        
    } catch (error) {
        console.error("Unable to fetch media:", error);
        return {};
    }
}

export async function uploadMediaPrivateForm(formData){
    // makes request to server
    
}