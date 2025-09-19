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


//---------------------------------------------------------------------------------------------------------

// Authentication fucntions

/**
 * checks if a user is authorized to
 * login to the admin app
 * @param {*} user 
 * @returns user object or null
 */
export async function validUser(user) {
    // null value is passed as arg
    if (!user) return null;

    // Validate required fields
    if (!user.email || !user.password) {
        console.error("Email and password are required");
        return null;
    }

    try{
      // fetch data from table user credentials with proper filtering
      let { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq("email", user.email)
        .eq("password", user.password);

      if (error) {
        console.error("Supabase error:", error);
        return null;
      }

      // returns the matching user or null if no match found
      return users && users.length > 0 ? users[0] : null;
    }catch(error){
      // supabase error catch and or server failure
      console.error("Couldn't complete request:", error);
      return null;
    }
}

















//---------------------------------------------------------------------------------------------------------