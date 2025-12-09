import { useState, useEffect } from 'react';
import { loadEvents, loadMedia } from '../middlewares/events_middleware';

const EVENTS_CACHE_KEY = 'dreams_events_cache';
const MEDIA_CACHE_KEY = 'dreams_events_media_cache';
const CACHE_TIMESTAMP_KEY = 'dreams_events_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Custom hook to manage events and media with localStorage caching
 * @returns {{ events: Array, media: Object, isLoading: boolean, error: Error | null, refetch: Function }}
 */
export function useEventsCache() {
    const [events, setEvents] = useState([]);
    const [media, setMedia] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Load events and media from localStorage
     */
    const loadFromCache = () => {
        try {
            const cachedEvents = localStorage.getItem(EVENTS_CACHE_KEY);
            const cachedMedia = localStorage.getItem(MEDIA_CACHE_KEY);
            const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

            if (cachedEvents && cachedMedia && cacheTimestamp) {
                const timestamp = parseInt(cacheTimestamp, 10);
                const now = Date.now();
                
                // Check if cache is still valid (within cache duration)
                if (now - timestamp < CACHE_DURATION) {
                    return {
                        events: JSON.parse(cachedEvents),
                        media: JSON.parse(cachedMedia),
                        isValid: true
                    };
                }
            }
        } catch (err) {
            console.warn('Error loading from cache:', err);
        }
        
        return { events: null, media: null, isValid: false };
    };

    /**
     * Save events and media to localStorage
     */
    const saveToCache = (eventsData, mediaData) => {
        try {
            localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(eventsData));
            localStorage.setItem(MEDIA_CACHE_KEY, JSON.stringify(mediaData));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (err) {
            console.warn('Error saving to cache:', err);
        }
    };

    /**
     * Fetch events and media from API
     */
    const fetchFromAPI = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch events
            const eventsData = await loadEvents();
            
            if (!eventsData || eventsData.length === 0) {
                throw new Error('No events returned from API');
            }

            // Fetch media for events
            const eventIds = eventsData.map(event => event.id);
            let mediaData = {};
            
            if (eventIds.length > 0) {
                try {
                    mediaData = await loadMedia(eventIds);
                } catch (mediaError) {
                    console.warn('Could not fetch media:', mediaError);
                    // Continue without media if fetch fails
                }
            }

            // Save to cache
            saveToCache(eventsData, mediaData);

            // Update state
            setEvents(eventsData);
            setMedia(mediaData);

            return { events: eventsData, media: mediaData };
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refetch events and media (bypass cache)
     */
    const refetch = async () => {
        return await fetchFromAPI();
    };

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            
            // Try to load from cache first
            const cached = loadFromCache();
            
            if (cached.isValid) {
                // Use cached data
                setEvents(cached.events);
                setMedia(cached.media);
                setIsLoading(false);
                
                // Optionally fetch in background to update cache
                fetchFromAPI().catch(() => {
                    // Silently fail background fetch
                });
            } else {
                // No valid cache, fetch from API
                try {
                    await fetchFromAPI();
                } catch (err) {
                    // Error already handled in fetchFromAPI
                }
            }
        };

        loadData();
    }, []);

    return {
        events,
        media,
        isLoading,
        error,
        refetch
    };
}

