/**
 * this file will be the main entry point for 
 * all server/api requests
 * 
 * convnentions are as follow (For more reference coding_conventions.conf):
 *  - Make designated files for specfific api requests and logic (example: users, curriculums, events, etc)
 * 
 *  - Make sure code is readable, with purposeful comments for all methods
 * 
 *  - No need for really complex methods that are A. inefficent and or B. easily simplifiable 
 * 
 *  - Try your best to have semetrical alignement with your code
 * 
 *      example:
 *              x               = 3;
 *              long_var_name   = 29202020;
 * 
 *  - User headers for all files made as so...
 *      @author Elias Lopes
 *      @Date   00/00/0000
 *      @description Description here....
 * 
 */


/**
 * @author Elias Lopes
 * @Date   09/16/2025
 * @description 
 *  this file will be the main entry point for 
 *  all server/api requests
 * 
 *  - uses commonjs modules
 */

// import all node modules
const express    = require("express");
const dotenv     = require("dotenv");
const url        = require("url");
const fs         = require("fs");
const path       = require("path");
const bodyParser = require("body-parser");

// load all environment variables FIRST
const envPath    = path.join(__dirname, ".env");
dotenv.config({ path: envPath });
const PORT       = process.env.PORT;

// import all route modules AFTER environment variables are loaded
const eventsRoutes = require("./api_routes/events.js");

// create server runtime
const app        = express();

// set up middlewares
app.use(bodyParser.urlencoded({extended:true}));                // allows for passing info through url
app.use(express.json());                                        // allows for json request and responces

// -----------------------------------------------------------------------------------------------------------------------
const BUILD_PATH   = path.join(__dirname, "../admin/dist");

// START add routes for modules ----------------------

// event routes
app.use("/api/events", eventsRoutes);

// END add routes for modules ------------------------

// static file serving (must come after API routes)
app.use(express.static(path.join(__dirname, "../admin/dist"))); // locates directory of react build

// initial route that serves the webpage
app.get("/", (req, res)=>{
    // home route, initial request
    res.sendFile(path.join(BUILD_PATH, "index.html"));
});

// catch all route
app.use((req, res) => {
    res.sendFile(path.join(BUILD_PATH, "index.html"));
});


// -----------------------------------------------------------------------------------------------------------------------

// node server listener at PORT
app.listen(PORT, async ()=>{
    console.log("Server is listening at PORT:", PORT);
});