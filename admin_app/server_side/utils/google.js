/**
 * @author Elias Lopes
 * @Date   09/25/2025
 * @description 
 *  This file will handle google related api
 *  requests like authentication
 */

// import modules
const express           = require("express");
const router            = express.Router();
const supabase          = require("../utils/supabase.js");
const { OAuth2Client }  = require("google-auth-library");
const jwt               = require('jsonwebtoken');

require("dotenv").config();

// google client
const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

// helper methods----------------------------------------------------------------------

/**
 * decodes and verifies given
 * JWT, and passes to next callback()
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function decodeToken(req, res, next){
    console.log("Google auth endpoint hit");
    console.log("Request body:", req.body);
    
    const token = req.body.token || req.body.idToken || req.body;
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,
        });

        // extract values from signed token
        const payload = ticket.getPayload();

        // add new section to http request
        req.user = {
            googleId: payload.sub,
            email: payload.email,
            fullName: payload.name,
            firstName: payload.given_name,
            lastName: payload.family_name,
            picture: payload.picture,
          };
          // go to next middleware layer
          next();

    }catch(error){
        console.error("Couldnt verify google JWT:", error);
        return res.json({
            status: -1,
            message: "Couldnt verify google JWT"
        });
    }

}

/**
 * checks users table to see if
 * user exists in the database
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function userExists(req, res, next){
    if (!req.user) {
        return res.json({
            status: -1,
            message: "User does not exist"
        });
    }

    try{
        console.log("\nSearching for user with email:", req.user.email);
        console.log("\nUser data:", req.user);
        
        let { data: users, error } = await supabase
        .from('users')
        .select("*")
        .eq("email", req.user.email);

        if (error) {
            console.error("Supabase error:", error);
            return res.json({
                status: -1,
                message: "Database error"
            });
        }

        // if any results
        if (users && users.length > 0){
            const user = users[0];
            req.found_user = user;
            console.log("\nFound user:", user);
            // sends to next callback()
            next();
        } else {
            console.log("No user found in database");
            return res.json({
                status: -1,
                message: "User does not exist in database"
            });
        }

    }catch(error){
        console.error("Error finding user in database:", error);
        return res.json({
            status: -1,
            message: "User does not exist"
        });
    }
}

/**
 * creates a custom JWT for user session
 * that allows use to not be dependent
 * on Google API after we get the first JWT
 * @param {*} token 
 * @returns custom JWT for user
 */
function createJwtForUser(googlePayload, account){
    if (!googlePayload)
        return null;

    // create json token
    const userData = {
        id: googlePayload.sub,
        email: googlePayload.email,
        name: googlePayload.name,
        picture: googlePayload.picture,
      };
      
    return jwt.sign(userData, process.env.JWT_SECRET, { 
        expiresIn: '7d' // 7 days until expiration
    });
}


// ------------------------------------------------------------------------------------

router.post("/auth", decodeToken, userExists, (req, res)=>{
    try {
        console.log('creating token');
        const customToken = createJwtForUser({
            sub: req.user.googleId,
            email: req.found_user.email,
            name: `${req.found_user.first_name} ${req.found_user.last_name}`,
            picture: req.user.picture || null
        });
        console.log('token completed');

        // send back response
        res.json({
            status: 200,
            userToken: "sjhsshj"
        });
        // res.json({
        //     status: 200,
        //     userToken: customToken
        // });
    } catch(err){
        console.error("Error in /auth route:", err);
        res.status(500).json({ status:-1, message:"Server error" });
    }
});


// export routes
module.exports = router;