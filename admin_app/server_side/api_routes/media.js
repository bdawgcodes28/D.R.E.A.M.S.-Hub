/**
 * @author Elias Lopes
 * @Date   09/30/2025
 * @description 
 *  this file will be the main file with
 *  logic for all requests relating to media
 * 
 *  - crud applications
 *  - database specific functions through supabase client
 * 
 *  - uses commonjs modules
 */

// import modules
const express   = require("express");
const router    = express.Router();
const supabase  = require("../utils/supabase.js");


function createMediaId(){
    return -1;
}

async function addMedia(media){}

async function fetchMedia(id){}
