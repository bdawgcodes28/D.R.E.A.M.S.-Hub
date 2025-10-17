/**
 * @author Elias Lopes
 * @Date   09/18/2025
 * @description 
 *  This file will have the supabase client
 * for the node server
 */

// import modules
const { createClient }  = require('@supabase/supabase-js');

// fetch environement variables
const supabaseUrl       = process.env.SUPABASE_URL;
const supabaseKey       = process.env.SUPABASE_SECRET;

// create client object
const supabase          = createClient(supabaseUrl, supabaseKey);


module.exports          = supabase;
