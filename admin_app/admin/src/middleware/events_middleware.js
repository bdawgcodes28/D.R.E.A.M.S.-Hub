/**
 * @author Elias Lopes
 * @Date   09/30/2025
 * @description 
 *  This file will handle event related utilities
 * and endpoints that access node.js rest api
 */

//------------------------------------------------------------------

/**
 * Fetches event from database
 */
export async function fetchEvents(user){
    
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const serverResponse = await fetch(`${BASE_URL}/api/events/fetchEvents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: user })
      });

      // If server responded with non-OK status, log and return empty
      if (!serverResponse.ok) {
        console.error('Server returned non-OK status:', serverResponse.status, await serverResponse.text());
        return [];
      }

      // Make sure the response is JSON before parsing
      const contentType = serverResponse.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // If HTML (likely index.html), log it for debugging
        const text = await serverResponse.text();
        console.error('Expected JSON but received:', contentType, text.slice(0, 200));
        return [];
      }

      let data = await serverResponse.json();

      // normalize to array
      if (!Array.isArray(data)) {
        try {
          data = Array.from(data) || [];
        } catch (err) {
          data = [];
        }
      }

      return data;

    } catch (error) {
      console.error('Could not fulfill request:', error);
      return [];
    }
  }