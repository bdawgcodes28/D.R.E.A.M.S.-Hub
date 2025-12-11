/**
 * 
 * 
 * this file holds functions that help 
 * devs easily interact with environment vaiables
 * 
 */

const dotenv    = require("dotenv");
const path      = require("path");


// chooses which env file to load variables from
function load_env(envPath=null){

    // default location of env file
    let envFile = "../env/.env";

    // check system for NODE_ENV varible to see if it set or not
    if (process.env.NODE_ENV)
    {
        // Use system-level NODE_ENV to choose environment file
        if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
            envFile = '../env/.env.production';
        } else if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
            envFile = '../env/.env.developement';
        }
        // Load the environment file (system NODE_ENV doesn't mean all vars are loaded)
        dotenv.config({ path: envFile, override: false });
    }else
    {
        // No system NODE_ENV, load default .env first to get NODE_ENV
        dotenv.config();
        // Now choose environment file based on loaded NODE_ENV
        if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
            envFile = '../env/.env.production';
        } else if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
            envFile = '../env/.env.developement';
        }
        
        // Reload with the correct environment file
        dotenv.config({ path: envFile, override: true });

    }


}

module.exports = { load_env };