/**
 * 
 * 
 * this file is the server entry point
 * for express
 * 
 * route modules get imported here
 * 
 * basic middleware is also set here
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
const { load_env }  = require("./helpers/env_variables.js")

// ====================================================
// CHOOSE ENVIRONMENT VARIABLE
// ====================================================
load_env();

// Now check the final NODE_ENV to determine if we're in production
const isProdEnv = (process.env.NODE_ENV && (process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "production")) ? true : false;

// ====================================================
// CREATE APP INSTANCE
// ====================================================
const app           = express();
const PORT          = process.env.PORT || 3000;
const DOMAIN        = process.env.DOMAIN;

// ====================================================
// ADD MIDDLEWARE
// ====================================================
app.use(bodyParser.urlencoded({extended:true, limit: '50mb'}));
app.use(express.json({limit: '50mb'}));  

// path to dist directory with react build
const BUILD_DIR = path.join(__dirname, "../client/dist");

// Health check endpoint (before static files, doesn't require client build)
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        port: PORT, 
        domain: DOMAIN,
        buildDir: BUILD_DIR,
        buildDirExists: require('fs').existsSync(BUILD_DIR)
    });
});

// Serve static files if build directory exists
if (require('fs').existsSync(BUILD_DIR)) 
{
    app.use(express.static(BUILD_DIR));
    console.log("Serving static files from:", BUILD_DIR);
} else 
{
    console.error("WARNING: Build directory not found:", BUILD_DIR);
    app.get("/", (req, res) => {
        res.status(500).send("Client build not found. Build directory missing: " + BUILD_DIR);
    });
} 

const allowedOrigins = [
    'http://localhost:8080', // nodejs dev server
    'http://localhost:5173',                     
    'http://localhost:3000',
];

// Add LoadBalancer domain if set
if (process.env.DOMAIN) 
{
    const domainUrl = process.env.DOMAIN.replace(/\/$/, ''); // Remove trailing slash
    allowedOrigins.push(domainUrl);
    // Also add without http:// prefix in case it's needed
    if (domainUrl.startsWith('http://')) {
        allowedOrigins.push(domainUrl.replace('http://', 'https://'));
    }
}

// Adding GoDaddy domain (www.thedreamscollective.org) to allowed origins
allowedOrigins.push('http://www.thedreamscollective.org');
allowedOrigins.push('https://www.thedreamscollective.org');
allowedOrigins.push('http://thedreamscollective.org');
allowedOrigins.push('https://thedreamscollective.org');

// In production, allow all origins since we're serving the client from the same origin
// Also allow requests with no origin (same-origin requests, curl, etc.)
const corsOptions = isProdEnv ? {
    origin: true, // Allow all origins in production
    methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
} : {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
  
app.use(cors(corsOptions));

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
// ADD CATCH ALL ROUTE FOR SPA
// ====================================================
// Serve index.html for all non-API routes (SPA routing)
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    // Skip if it's a static file request (Express static middleware handles these)
    const indexPath = path.join(BUILD_DIR, "index.html");
    if (require('fs').existsSync(indexPath)) {
        res.status(200).sendFile(indexPath);
    } else {
        res.status(500).send("index.html not found in build directory");
    }
});

// home route
app.get("/", (req, res) => {
    const indexPath = path.join(BUILD_DIR, "index.html");
    if (require('fs').existsSync(indexPath)) {
        res.status(200).sendFile(indexPath);
    } else {
        res.status(500).send("index.html not found in build directory");
    }
});


// ====================================================
// SERVER LISTENER
// ====================================================
if (!PORT) 
{
    console.error("ERROR: PORT environment variable is not set!");
    process.exit(1);
}

const server = app.listen(PORT, "0.0.0.0" ,()=> {
    console.log("=========================================");
    console.log("Node server is listening on PORT |", PORT);
    console.log("Server Domain/IP                 |", DOMAIN);
    console.log("Production Mode Set To           |", isProdEnv);
    console.log("Build Directory                  |", BUILD_DIR);
    console.log("Build Directory Exists           |", require('fs').existsSync(BUILD_DIR));
    console.log("=========================================");
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
