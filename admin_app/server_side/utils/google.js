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
const { RC_RESPONSE }   = require('./endpoint_helpers.js');
const { RC_CODES }      = require('./errors.js');

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
        return res.json(RC_RESPONSE(RC_CODES.UNAUTHORIZED, {
            details: "Google JWT verification failed",
            error: error.message
        }));
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
        return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST, {
            details: "User data not found in request"
        }));
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
            return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
                details: "Database query failed",
                error: error.message
            }));
        }

        // if any results
        if (users && users.length > 0){
            const user = users[0];
            req.found_user      = user;
            req.user.uid        = user.id;
            req.user.role       = user.role;
            req.user.approved   = user.approved;
            console.log("\nFound user:", user);

            if (!user.approved){
                return res.json(RC_RESPONSE(RC_CODES.FORBIDDEN, {
                    details: "User account not approved",
                    userApproved: user.approved
                }));
            }

            // sends to next callback()
            next();
        } else {
            console.log("No user found in database");
            return res.json(RC_RESPONSE(RC_CODES.NOT_FOUND, {
                details: "User not found in database",
                email: req.user.email
            }));
        }

    }catch(error){
        console.error("Error finding user in database:", error);
        return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            details: "Unexpected error during user lookup",
            error: error.message
        }));
    }
}

/**
 * creates a custom JWT for user session
 * that allows use to not be dependent
 * on Google API after we get the first JWT
 * @param {*} token 
 * @returns custom JWT for user
 */
function createJwtForUser(googlePayload){
    if (!googlePayload)
        return null;

    // create json token
    const userData = {
        googleId:       googlePayload.googleId,
        uid:            googlePayload.uid,
        email:          googlePayload.email,
        name:           googlePayload.name,
        first_name:     googlePayload.firstName,
        lastName:       googlePayload.lastName,
        picture:        googlePayload.picture,
        role:           googlePayload.role,
        approved:       googlePayload.approved,
      };

    const secret = process.env.JWT_SECRET || "development_secret";
    console.log("Using JWT secret:", secret);
    return jwt.sign(userData, secret, { expiresIn: '7d' });
}


// ------------------------------------------------------------------------------------

router.post("/auth", decodeToken, userExists, (req, res)=>{
    try {
        console.log('creating token');

        const payload = req.user || null; // user found
        const customToken = createJwtForUser(payload);
        console.log('token completed');

        // send back response
        res.json(RC_RESPONSE(RC_CODES.SUCCESS, {
            userToken: customToken
        }));

    } catch(err){
        console.error("Error in /auth route:", err);
        res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            details: "Unexpected error during authentication",
            error: err.message
        }));
    }
});


// export routes
module.exports = router;