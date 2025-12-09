/**
 * this file has all api endpoint entry ways
 * for the react app to abstract complexity
 */


//------------------------------------------------------
// import env varibles to interact with server
//------------------------------------------------------
const BASE_URL                          = import.meta.env.VITE_BASE_URL || "http://localhost";
const REST_PORT                         = import.meta.env.VITE_REST_API_PORT || "3000";
const BOARD_WEB_PROFILES_API_ENTRY      = "/api/board_members";

const API_BASE_URL = REST_PORT 
    ? `${BASE_URL}:${REST_PORT}`
    : BASE_URL;

// Validate URL construction
if (!BASE_URL || BASE_URL === "undefined") {
    console.error("VITE_BASE_URL is not set correctly. Current value:", BASE_URL);
}


/**
 * fetches the profile data from server
 * as well as images that go to each 
 * board member
 */
export async function loadBoardMemberProfiles()
{
    try 
    {
        const url = `${API_BASE_URL}${BOARD_WEB_PROFILES_API_ENTRY}/fetch/members`;
        console.log("Fetching board members from:", url);
        
        // make http request to REST api
        const response = await fetch(url, {
            method:     "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response is actually JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Received non-JSON response:", text.substring(0, 200));
            throw new Error(`Expected JSON but received ${contentType}`);
        }

        const data = await response.json();
        console.log("res:", data);
        if (data.status == 200) { return data.data; }
        
        return [];

    } catch (error) 
    {
        console.error("Unable to fetch member data:", error);
        return [];
    }
}