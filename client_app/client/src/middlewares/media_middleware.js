/**
 * this file has all api endpoint entry ways
 * for the react app to abstract complexity
 */


//------------------------------------------------------
// import env varibles to interact with server
//------------------------------------------------------
const BASE_URL              = import.meta.env.VITE_BASE_URL || "";
const REST_PORT             = import.meta.env.VITE_REST_API_PORT;
const MEDIA_API_ENTRY      = "/api/media";

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
 * 
 * @param {*} formData FormData object containing the file and metadata
 * @returns  http request status response RC_RESPONSE()
 */
export async function uploadFileObject(formData)
{
    // handle incorrect params
    if (!formData) { return null; }
    if (!(formData instanceof FormData)) { return null; }

    // make requets to server
    try
    {
        const response = await fetch(
            `${API_BASE_URL}${MEDIA_API_ENTRY}/upload/file`,{
            method:     "POST",
            body:       formData
        });

        // parse response
        const data = await response.json();

        // handle response by return status code
        switch(data.status)
        {
            case 200:
                console.log("uploaded successfully");
                return data;
            
            default:
                console.error("Error when attempting to upload:", data);
                return null;
        }

    }catch(error)
    {
        console.error("Unable to upload image:", error);
        return null
    }
}
