/**
 * @author Elias Lopes
 * @Date   09/30/2025
 * @description 
 *  This file will handle event related utilities
 * and endpoints that access node.js rest api
 */

//------------------------------------------------------------------

/**
 * checks if minimum fields
 * are filled out before event is added
 * @param {*} event 
 * @returns bool
 */
export function isValidEvent(event){
    if (!event) return false;

    switch(event){
      case (!event.name || event.name.length == 0):
        return false;
      case (!event.description || event.description.length == 0):
        return false;
      case (!event.location || event.location.length == 0):
        return false;
    }

    return true;
}


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
      if (!data || !(data instanceof Array)) data = Array.from(data || []);

      return data;

    } catch (error) {
      console.error('Could not fulfill request:', error);
      return [];
    }
  }

/**
 * adds a new event to the database
 * @param {*} event 
 * @returns status of request
 */
export async function appendEvent(event, user) {
  if (!event) return {status: 404, message: "No event was given"};
  try {

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const serverResponse = await fetch(`${BASE_URL}/api/events/addEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: user, event: event })
    });

    const data = await serverResponse.json();

    if (data.status && data.status == 200){
      // return request success status
      return {
        status: 200,
        message: "Event was added successfully"
      };

    }else{
        return {
          status: data.status || 404,
          message: "Error when attempting to add event"
        };
    }

  } catch (error) {

    console.error("Could not fulfill request:", error);
    // return request fail status
    return {
      status: 404,
      message: "Error when attempting to add event"
    };
  }
}

/**
 * upadates pre-exisiting row in
 * events table, by making request to server
 * @param {*} event 
 * @param {*} user 
 * @returns status, updated row
 */
export async function updateEvent(event, user){
  if (!event) return {status: 404, message: "No event was given"};
  try {

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const serverResponse = await fetch(`${BASE_URL}/api/events/updateEvent`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: user, event: event })
    });

    const data = await serverResponse.json();

    if (data.status && data.status == 200){
      // return request success status
      return {
        status: 200,
        message: "Event was updated successfully"
      };

    }else{
        console.error("Response:", data);
        return {
          status: data.status || 404,
          message: "Error when attempting to update event"
        };
    }

  } catch (error) {

    console.error("Could not fulfill request:", error);
    // return request fail status
    return {
      status: 404,
      message: "Error when attempting to update event"
    };
  }
}

/**
 * sends delete request to
 * remove an event at a certain id
 * @param {*} event 
 * @param {*} user 
 * @returns status of request
 */
export async function deleteEvent(event, user){
  if (!event) return {status: 404, message: "No event was given"};
  try {
    console.log("Sending delete request...");
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const serverResponse = await fetch(`${BASE_URL}/api/events/deleteEvent`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: user, event: event })
    });

    const data = await serverResponse.json();

    if (data.status && data.status == 200){
      console.log("delete request successful:", data);
      // return request success status
      return {
        status: 200,
        message: "Event was delete successfully"
      };

    }else{
        console.error("Response:", data);
        return {
          status: data.status || 404,
          message: "Error when attempting to delete event"
        };
    }

  } catch (error) {

    console.error("Could not fulfill request:", error);
    // return request fail status
    return {
      status: 404,
      message: "Error when attempting to delete event"
    };
  }

} 