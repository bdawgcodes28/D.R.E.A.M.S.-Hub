/**
 * @author Elias Lopes
 * @Date   09/16/2025
 * @description 
 *  this file will have the supabase client,
 *  this client will be imported across the web app to
 *  avoid using extra memory, creating new clients
 * 
 *  - uses ES6 modules
 */

import { createClient } from "@supabase/supabase-js";

// creates supabase client (import this in all files that interact with supabase)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BASE_URL = import.meta.env.VITE_BASE_URL;
const USERS_ROUTE_BASE_URL=`${BASE_URL}/api/users`


//---------------------------------------------------------------------------------------------------------

// Authentication fucntions

/**
 * checks if a user is authorized to
 * login to the admin app
 * @param {*} user 
 * @returns user object or null
 */
export async function validUser(user_credentials) {
    // null value is passed as arg
    if (!user_credentials) return null;

    // Validate required fields
    if (!user_credentials.email || !user_credentials.password) {
        console.error("Email and password are required");
        return null;
    }

    try{
      // fetch data from table on server side
      const serverResponse = await fetch(`${USERS_ROUTE_BASE_URL}/user/login/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user_credentials })
      });

      const data = await serverResponse.json();

      // check status
      if (data.status != 200){
        console.error("[ERROR] issue on http request", data.message);
        return null;
      }else{
        console.log("[SUCCESS] User successfully logged in");
        return data.account;
      }
      
    }catch(error){
      // supabase error catch and or server failure
      console.error("Couldn't complete request:", error);
      return null;
    }
}

















//---------------------------------------------------------------------------------------------------------