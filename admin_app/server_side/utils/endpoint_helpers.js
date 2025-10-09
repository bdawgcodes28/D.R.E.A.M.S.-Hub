
/**
 * @author Elias Lopes
 * @Date   09/30/2025
 * @description 
 *  This file contains permission and authorization utilities
 *  for API route protection and user access control
 * 
 *  - CommonJS module format
 *  - Reusable authorization functions
 *  - Standard response formatting
 */

//------------------------------------------------------------------
// Standard response formatting
//------------------------------------------------------------------

/**
 * Creates a standardized response object for API endpoints
 * @param {number} status - HTTP status code
 * @param {string} message - Response message
 * @returns {object} Standardized response object
 */
function STANDARD_RESPONSE(status, message) {
    return {
        status: status,
        message: message
    };
}

//------------------------------------------------------------------
// Authorization Functions
//------------------------------------------------------------------

/**
 * makes sure that user session
 * has permission to do certain 
 * operations and access certain 
 * API requests
 * @param {Array} allowList - Array of allowed user roles
 * @param {boolean} hasReqBody - Whether the request has a body
 * @returns {Function} Express middleware function
 */
function authorizeUse(allowList = [], hasReqBody = true) {
    return (req, res, next) => {
        // no restriction on permissions
        if (allowList.length === 0)
            return next();

        let session;
        // access session data
        if (hasReqBody)
            session = req.body.session.token;
        else
            session = req.headers["session"]["token"];

        // checks if user exists
        if (session)
            // if user has permission
            if (allowList.includes(session.role))
                return next();
            // handle user not permitted
            else
                return res.json(STANDARD_RESPONSE(403, "User not permitted to access route")); // not permitted to access route
        // handle user not found error
        else
            return res.json(STANDARD_RESPONSE(404, "User not found")); // user not found
    }
}

//------------------------------------------------------------------
// Module Exports
//------------------------------------------------------------------

module.exports = {
    STANDARD_RESPONSE,
    authorizeUse
};