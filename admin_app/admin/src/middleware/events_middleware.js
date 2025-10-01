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
      

      // set events array
      let data = await serverResponse.json();

      // convert to array if not array
      if (data || !(data.instanceof(Array))) data = Array.from(data);

      return data;

    } catch (error) {
      console.error('Could not fulfill request:', error);
      return [];
    }
  }