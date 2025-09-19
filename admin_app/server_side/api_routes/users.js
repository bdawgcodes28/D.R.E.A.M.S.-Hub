/**
 * @author Elias Lopes
 * @Date   09/18/2025
 * @description 
 * This file will hold the API routes for
 * users, this will interact with the supabase data base
 */

// import modules
const express   = require("express");
const router    = express.Router();
const supabase  = require("../utils/supabase.js");



// API route implemention


/**
 * Fetches all users from users table
 */
router.get("/fetchUsers", async (req, res)=>{
    // set response type
    res.type("json");

    // fetch all users from table
    try {
        // SELECT * FROM user;
        let { data: users, error } = await supabase
        .from('users')
        .select('*');

        // checks for non-200 status code that dont throw error
        if (data.status % 1000 != 2){
            console.error("Non 200 status code returned:", data.status);
            res.json({"users": []});
            return;
        }

    } catch (error) {
        // catch error and return no users
        console.error("Unable to complete request");
        res.json({"users": []});
        return;
    }
 
});










// export routes
module.exports = router;