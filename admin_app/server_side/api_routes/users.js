/**
 * @author Elias Lopes
 * @Date   09/18/2025
 * @description 
 * This file will hold the API routes for
 * users, this will interact with the supabase data base
 */

// import modules
const express                             = require("express");
const bcrypt                              = require("bcrypt");
const router                              = express.Router();
const supabase                            = require("../utils/supabase.js");
const { STANDARD_RESPONSE, authorizeUse } = require("../utils/endpoint_helpers.js");
const { use } = require("./users.js");

//------------------------------------ helper functions ------------------------------------

/**
 * turns password into a UUID
 * @param {*} rawPassword 
 * @returns status, hashed password
 */
async function hashPassword(req, res, next) {
    // extract raw from request
    const rawPassword       = req.body.rawPassword;
    if (!rawPassword)
        return res.json(STANDARD_RESPONSE(404, "No raw password given"));

    // create multi-layer hash password
    const hashRounds        = 10; // 10 layers of hashing
    const hashedPassword    = await bcrypt.hash(rawPassword, hashRounds);
    console.log('Hashed password:', hashedPassword);

    req.hashed_password     = hashedPassword;
    return next();
}

/**
 * creates UUID with readable password
 * @param {*} password 
 * @returns hashed version of readable password
 */
async function manualPasswordHashReq(password){
    if (!password)
        return null;
    // create multi-layer hash password
    const hashRounds        = 10; // 10 layers of hashing
    const hashedPassword    = await bcrypt.hash(password, hashRounds);
    console.log('Hashed password:', hashedPassword);

    return hashedPassword;
}

/**
 * send supabase request to add new user 
 * in users table
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns status, new user request
 */
async function appendUser(req, res, next){
    // extract user from request
    const user = req.body.user_credentials;

    if (!user){
        console.error("No user passed to request:", user);
        return res.json(STANDARD_RESPONSE(404, "No user passed to request"));
    }

    // attempt to add a user to users table
    try {
        const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()

        if (error) {
            console.error('Error inserting user:', error);
            return res.json(STANDARD_RESPONSE(404, "Error on append request"));
        } else {
            console.log('User inserted:', data);
            req.new_user = data;
            return next();
        }
        
    } catch (error) {
        console.error("Error on append request:", error);
        return res.json(STANDARD_RESPONSE(404, "Error on append request"));
    }

}

async function findUser(req, res, next){
    // extract email and password from request
    const {email, password} = req.body.user;

    // make sure email and password exists
    if (!email || !password){
        console.error("[ERROR] no email or password given:");
        console.log("Email:", email);
        console.log("Password:", password);
        return res.json({
            ...STANDARD_RESPONSE(404,"[ERROR] no email or password given"),
            user_session: null
        });
    }

    // First, find the user by email only
    let { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq("email", email);

    if (error){
        console.error("[ERROR] Error on supabase select request:", error);
        return res.json({
            ...STANDARD_RESPONSE(500, "[ERROR] Error on supabase select request"),
            session: null
        });
    }

    if (users && users.length > 0){
        const user = users[0];
        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid && user.approved){
            req.user_result = user;
            next();
        } else {
            return res.json({
                ...STANDARD_RESPONSE(401, "[ERROR] Invalid credentials"),
                session: null
            });
        }
    }else{
        return res.json({
            ...STANDARD_RESPONSE(401, "[ERROR] Invalid credentials"),
            session: null
        });
    }
}

// API route implemention -------------------------------------------
/**
 * Fetches all users from users table
 */
router.post("/fetchUsers", async (req, res)=>{
    // set response type
    res.type("json");

    // fetch all users from table
    try {
        // SELECT * FROM users;
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

router.post("/user/register/password", hashPassword, (req, res) => {
    console.log("Password is:", req.hashed_password);
    // send back hashed password
    return res.json({
        ...STANDARD_RESPONSE(200, 'Password sucessfully hashed...'),
        hashPassword : req.hashed_password
    });
});

router.post("/user/register/add", appendUser, (req, res) => {
    console.log("User has been added to request queue successfully:", req.new_user);
    return res.json({
        ...STANDARD_RESPONSE(200, "User has been added to request queue successfully"),
        user: req.new_user
    });
});

router.post("/user/login/attempt", findUser, (req, res) => {
    const user = req.user_result;
    console.log("User has been found:", user);

    // Normalize the user object to match the structure expected by the frontend
    // This matches the structure that Google OAuth provides
    const normalizedUser = {
        token: {
            first_name: user.first_name,
            lastName: user.last_name, // Note: Google OAuth uses 'lastName' not 'last_name'
            email: user.email,
            role: user.role,
            picture: null, // Email/password users don't have a profile picture
            id: user.id
        }
    };

    return res.json({
        ...STANDARD_RESPONSE(200, "User has been found"),
        account: normalizedUser
    });
});




// export routes
module.exports = router;