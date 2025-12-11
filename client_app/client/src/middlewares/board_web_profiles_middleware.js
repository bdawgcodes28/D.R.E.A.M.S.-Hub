/**
 * this file has all api endpoint entry ways
 * for the react app to abstract complexity
 */

import * as CACHE from "../hooks/useEventsCache"

//------------------------------------------------------
// import env varibles to interact with server
//------------------------------------------------------
const BASE_URL                          = import.meta.env.VITE_BASE_URL || "http://localhost";
const REST_PORT                         = import.meta.env.VITE_REST_API_PORT || "3000";
const BOARD_WEB_PROFILES_API_ENTRY      = "/api/board_members";

const API_BASE_URL = REST_PORT 
    ? `${BASE_URL}:${REST_PORT}`
    : BASE_URL;

// Validate URL construction
if (!BASE_URL || BASE_URL === "undefined") {
    console.error("VITE_BASE_URL is not set correctly. Current value:", BASE_URL);
}

//------------------------------------------------------
// Cache configuration
//------------------------------------------------------
const BOARD_PROFILES_CACHE_KEY              = 'dreams_board_profiles_cache';
const BOARD_PROFILES_CACHE_TIMESTAMP_KEY    = 'dreams_board_profiles_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Load board member profiles from localStorage cache
 * @returns {Object|null} Cached data if valid, null otherwise
 */
function loadFromCache() {
    try {
        const cachedProfiles = localStorage.getItem(BOARD_PROFILES_CACHE_KEY);
        const cacheTimestamp = localStorage.getItem(BOARD_PROFILES_CACHE_TIMESTAMP_KEY);

        if (cachedProfiles && cacheTimestamp) {
            const timestamp = parseInt(cacheTimestamp, 10);
            const now = Date.now();
            
            // Check if cache is still valid (within cache duration)
            if (now - timestamp < CACHE_DURATION) {
                return JSON.parse(cachedProfiles);
            }
        }
    } catch (err) {
        console.warn('Error loading board profiles from cache:', err);
    }
    
    return null;
}

/**
 * Save board member profiles to localStorage cache
 * @param {Array} profilesData - The profiles data to cache
 */
function saveToCache(profilesData) {
    try {
        localStorage.setItem(BOARD_PROFILES_CACHE_KEY, JSON.stringify(profilesData));
        localStorage.setItem(BOARD_PROFILES_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
        console.warn('Error saving board profiles to cache:', err);
    }
}


/**
 * fetches the profile data from server
 * as well as images that go to each 
 * board member
 */
export async function loadBoardMemberProfiles()
{
    // check cache before you make api request
    const cachedData = loadFromCache();
    if (cachedData) {
        console.log("Loading board members from cache");
        return cachedData;
    }

    try 
    {
        const url = `${API_BASE_URL}${BOARD_WEB_PROFILES_API_ENTRY}/fetch/members`;
        console.log("Fetching board members from:", url);
        
        // make http request to REST api
        const response = await fetch(url, {
            method:     "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response is actually JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Received non-JSON response:", text.substring(0, 200));
            throw new Error(`Expected JSON but received ${contentType}`);
        }

        const data = await response.json();
        if (data.status == 200) 
        { 
            // cache the data in local storage before return
            saveToCache(data.data);

            return data.data; 
        }
        
        return [];

    } catch (error) 
    {
        console.error("Unable to fetch member data:", error);
        // If API failed, try to return stale cache as fallback
        try {
            const staleCache = localStorage.getItem(BOARD_PROFILES_CACHE_KEY);
            if (staleCache) {
                console.log("API request failed, returning stale cache data");
                return JSON.parse(staleCache);
            }
        } catch (cacheError) {
            console.warn("Could not load stale cache:", cacheError);
        }
        return [];
    }
}