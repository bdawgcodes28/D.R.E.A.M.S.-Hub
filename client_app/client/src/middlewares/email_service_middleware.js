
//------------------------------------------------------
// import env varibles to interact with server
//------------------------------------------------------
const BASE_URL                          = import.meta.env.VITE_BASE_URL || "http://localhost";
const REST_PORT                         = import.meta.env.VITE_REST_API_PORT || "3000";
const EMAIL_SERVICE_API_ENTRY           = "/api/email/service";

const API_BASE_URL = REST_PORT 
    ? `${BASE_URL}:${REST_PORT}`
    : BASE_URL;

// Validate URL construction
if (!BASE_URL || BASE_URL === "undefined") {
    console.error("VITE_BASE_URL is not set correctly. Current value:", BASE_URL);
}

export async function sendEmail(formInfo){
    if (!formInfo) return null;

    try {
        // create endpoint url
        const url = `${API_BASE_URL}${EMAIL_SERVICE_API_ENTRY}/send/email`;
        
        // send request
        // make http request to REST api
        const response = await fetch(url, {
            method:     "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formInfo
            })
        });

        // handle 
        switch(response.status)
        {
            case 200:
                console.log("Successfuly sent!")
                return response;

            default:
                return null;
        }

    } catch (error) {
        console.error("Error when sending email:", error);
        return null;
    }

}