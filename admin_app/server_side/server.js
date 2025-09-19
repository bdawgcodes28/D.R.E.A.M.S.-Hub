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

// load all environment variables
const envPath    = path.join(__dirname, ".env");
dotenv.config({ path: envPath });
const PORT       = process.env.PORT;

// create server runtime
const app        = express();

// set up middlewares
app.use(express.static(path.join(__dirname, "../admin/dist"))); // locates directory of react build
app.use(bodyParser.urlencoded({extended:true}));                // allows for passing info through url
app.use(express.json());                                        // allows for json request and responces


// -----------------------------------------------------------------------------------------------------------------------

const REACT_BUILD = path.join(__dirname, "../admin/dist/index.html");


// initial route that serves the webpage
app.get("/", (req, res)=>{
    // home route, initial request
    res.sendFile(REACT_BUILD);
});





// final 404 handler (catch-all)
app.use((req, res)=>{
    res.status(404).type(".html");
    res.send(`
        <h1>404 request couldnt be completed</h1>
    `);
});


// -----------------------------------------------------------------------------------------------------------------------

// node server listener at PORT
app.listen(PORT, ()=>{
    console.log("Server is listening at PORT:", PORT);
});