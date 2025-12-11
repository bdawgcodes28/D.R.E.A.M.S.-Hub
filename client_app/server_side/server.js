/**
 * 
 * 
 * 
 * 
 * 
 * 
 */

//===================================================================================
// IMPORT MODULES
//===================================================================================
const express       = require("express");
const bodyParser    = require("body-parser");
const dotenv        = require("dotenv");
const cors          = require("cors");
const path          = require("path");

// ====================================================
// CHOOSE ENVIRONMENT VARIABLE
// ====================================================
// First check system-level NODE_ENV (set by system or process)
// If not set, load default .env to get NODE_ENV, then reload with correct file
let envFile = './env/.env'; // default env file path

// Check if NODE_ENV is already set at system level
if (process.env.NODE_ENV) {
    // Use system-level NODE_ENV to choose environment file
    if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
        envFile = './env/.env.production';
    } else if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
        envFile = './env/.env.developement';
    }
    // Load the environment file (system NODE_ENV doesn't mean all vars are loaded)
    dotenv.config({ path: envFile, override: false });
} else {
    // No system NODE_ENV, load default .env first to get NODE_ENV
    dotenv.config();
    
    // Now choose environment file based on loaded NODE_ENV
    if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
        envFile = './env/.env.production';
    } else if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
        envFile = './env/.env.developement';
    }
    
    // Reload with the correct environment file
    dotenv.config({ path: envFile, override: true });
}

// Now check the final NODE_ENV to determine if we're in production
const isProdEnv = (process.env.NODE_ENV && process.env.NODE_ENV == "prod") ? true : false;

// ====================================================
// CREATE APP INSTANCE
// ====================================================
const app           = express();
const PORT          = process.env.PORT;
const DOMAIN        = process.env.DOMAIN;

// ====================================================
// ADD MIDDLEWARE
// ====================================================
app.use(bodyParser.urlencoded({extended:true, limit: '50mb'}));
app.use(express.json({limit: '50mb'}));  

// path to dist directory with react build
const BUILD_DIR = path.join(__dirname, "../client/dist");
app.use(express.static(BUILD_DIR)); 

const allowedOrigins = [
    'http://localhost:8080', // nodejs dev server
    'http://localhost:5173',                     
    'http://localhost:3000',                      
];
  
app.use(cors({
origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
    callback(null, true);
    } else {
    callback(new Error('Not allowed by CORS'));
    }
},
methods: ['POST', 'GET', 'OPTIONS'],
credentials: true
}));

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "same-origin-allow-popups"); 
    next();
});
// ====================================================
// IMPORT MODULE ROUTES
// ====================================================
const event_routes          = require("./routes/events.js");
const media_routes          = require("./routes/media.js");
const board_member_routes   = require("./routes/board_member.js");
const email_service_routes  = require("./routes/email_service.js");

// ====================================================
// USE MODULE ROUTES
// ====================================================
app.use("/api/events",        event_routes);
app.use("/api/media",         media_routes);
app.use("/api/board_members", board_member_routes);
app.use("/api/email/service", email_service_routes);
// ====================================================
// ADD CATCH ALL ROUTE
// ====================================================
app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(BUILD_DIR, "index.html"));
    //res.status(200).json({ message: "Server is running!" });
});


// ====================================================
// SERVER LISTENER
// ====================================================
const server = app.listen(PORT, ()=>{
    console.log("Node server is listening on PORT |", PORT);
    console.log("Server Domain/IP                 |", DOMAIN);
    console.log("Production Mode Set To           |", isProdEnv);
});

// Add error handling
server.on('error', (err) => {
    console.error('Server error:', err);
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

// Keep the process alive
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
