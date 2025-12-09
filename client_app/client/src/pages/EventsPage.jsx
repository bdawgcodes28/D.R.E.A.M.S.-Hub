import React, { useState, useEffect, useRef }   from 'react'
import Navbar                                   from '../components/layout/Navbar'
import { Footer }                               from '../components/layout/Footer'
import { COLORS_CONSTANTS }                     from '../styles/StyleConstants';
import EventCardContent                         from '../components/events/EventCardContent';
import EventCarousel                            from '../components/events/EventCarousel';
import EventTypeChooser                         from '../components/events/EventTypeChooser';
import useIsMobile                              from '../hooks/useIsMobile';
import CalendarApp from '../components/events/CalendarApp';
import { parseDateString }                      from '../components/events/eventTransformers';

export default function EventsPage() {

    // =========================================================
    // HOOKS
    // =========================================================
    const isMobile = useIsMobile(); 


    // used to toggle what kind of events / components are visible
    const eventTypes                                    = ["All", "Upcoming", "Past"];
    const [eventTypeSelected, setEventTypeSelected]     = useState("All");
    const [displayedEventType, setDisplayedEventType]   = useState("All");
    const [isAnimating, setIsAnimating]                 = useState(false);
    const [eventsLoaded, setEventsLoaded]               = useState(false);
    const [eventsFadeIn, setEventsFadeIn]               = useState(false);
    const [allEvents, setAllEvents]                     = useState(() => {
        // Initialize with test events as fallback
        return [
            {
                id: 1,
                name: "STEM Workshop: Robotics Basics",
                location: "Dreams Hub - Main Lab",
                description: "Learn the fundamentals of robotics programming and build your first robot. Perfect for beginners!",
                date: "11. 05. 2025.",
                time: "10:00 AM - 2:00 PM",
                images: [
                    "/src/assets/kids-stem-img.jpg",
                    "/src/assets/kids-learning2.jpg",
                    "/src/assets/kids-hands-up.jpg"
                ]
            },
            {
                id: 2,
                name: "Coding Bootcamp: Python Fundamentals",
                location: "Dreams Hub - Computer Lab A",
                description: "Master Python programming from scratch. We'll cover variables, loops, functions, and more.",
                date: "11. 12. 2025.",
                time: "9:00 AM - 4:00 PM",
                images: [
                    "/src/assets/kids-learning2.jpg",
                    "/src/assets/kids-stem-img.jpg"
                ]
            },
            {
                id: 3,
                name: "Science Fair Preparation",
                location: "Dreams Hub - Conference Room",
                description: "Get help preparing your science fair project with guidance from our expert mentors.",
                date: "11. 19. 2025.",
                time: "2:00 PM - 5:00 PM",
                images: [
                    "/src/assets/kids-hands-up.jpg",
                    "/src/assets/kids-stem-img.jpg",
                    "/src/assets/kids-learning2.jpg"
                ]
            },
            {
                id: 4,
                name: "3D Printing Workshop",
                location: "Dreams Hub - Maker Space",
                description: "Design and print your own 3D models. Learn about CAD software and 3D printing technology.",
                date: "11. 26. 2025.",
                time: "11:00 AM - 3:00 PM",
                images: [
                    "/src/assets/kids-stem-img.jpg",
                    "/src/assets/kids-hands-up.jpg"
                ]
            },
            {
                id: 5,
                name: "Math Olympiad Training",
                location: "Dreams Hub - Study Room B",
                description: "Advanced problem-solving techniques and competition strategies for math olympiad preparation.",
                date: "12. 03. 2025.",
                time: "1:00 PM - 4:00 PM",
                images: [
                    "/src/assets/kids-learning2.jpg",
                    "/src/assets/kids-stem-img.jpg",
                    "/src/assets/kids-hands-up.jpg"
                ]
            },
            {
                id: 6,
                name: "Environmental Science Field Trip",
                location: "Local Nature Reserve",
                description: "Explore local ecosystems and learn about environmental conservation through hands-on activities.",
                date: "12. 10. 2025.",
                time: "8:00 AM - 12:00 PM",
                images: [
                    "/src/assets/kids-hands-up.jpg",
                    "/src/assets/kids-learning2.jpg"
                ]
            },
            {
                id: 7,
                name: "Past Event: Summer Coding Camp",
                location: "Dreams Hub - Main Lab",
                description: "A comprehensive summer program covering web development and mobile app creation.",
                date: "08. 15. 2024.",
                time: "9:00 AM - 3:00 PM",
                images: [
                    "/src/assets/kids-stem-img.jpg",
                    "/src/assets/kids-learning2.jpg"
                ]
            },
            {
                id: 8,
                name: "Past Event: Robotics Competition",
                location: "Dreams Hub - Competition Hall",
                description: "Students showcased their robotics projects in a friendly competition.",
                date: "09. 20. 2024.",
                time: "10:00 AM - 4:00 PM",
                images: [
                    "/src/assets/kids-hands-up.jpg",
                    "/src/assets/kids-stem-img.jpg"
                ]
            }
        ];
    });
    const [isLoadingEvents, setIsLoadingEvents]         = useState(true);
    const carouselRef                                   = useRef(null);

    // Fetch events from server on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoadingEvents(true);
                // Use environment variable for API URL if set, otherwise use relative path (proxy will handle it)
                const apiUrl = import.meta.env.VITE_API_URL;
                const fetchUrl = apiUrl ? `${apiUrl}/api/events/fetch` : '/api/events/fetch';
                
                console.log('Fetching events from:', fetchUrl);
                console.log('VITE_API_URL:', apiUrl || 'not set (using proxy)');
                
                const response = await fetch(fetchUrl);
                
                // Check content type to ensure we got JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Received non-JSON response:', text.substring(0, 200));
                    setAllEvents(testEvents);
                    return;
                }
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Events fetched successfully:', result);
                    // Check if the response has the expected structure
                    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                        setAllEvents(result.data);
                    } else {
                        // Fallback to test events if server returns empty or invalid data
                        console.warn('Server returned empty or invalid data, using test events');
                        setAllEvents(testEvents);
                    }
                } else {
                    // Fallback to test events if fetch fails
                    console.warn(`Server returned status ${response.status}, using test events`);
                    setAllEvents(testEvents);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                // Fallback to test events on error
                setAllEvents(testEvents);
            } finally {
                setIsLoadingEvents(false);
            }
        };

        fetchEvents();
    }, []);

    // Trigger slide-in animation on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setEventsLoaded(true);
        }, 100); // Small delay to ensure component is mounted
        
        return () => clearTimeout(timer);
    }, []);

    // Handle event type change with delayed text update
    const handleEventTypeChange = (newType) => {
        if (newType === eventTypeSelected) return; // Don't animate if same type
        
        setIsAnimating(true);
        // Update the actual state immediately for button styling
        setEventTypeSelected(newType);
        
        // Delay the displayed text change until after fade-out completes
        setTimeout(() => {
            setDisplayedEventType(newType);
            // Start fade-in after text has changed
            setTimeout(() => {
                setIsAnimating(false);
            }, 50); // Small delay to ensure text has updated
        }, 250); // Half of animation duration for fade-out
    };


    // =========================================================
    // CAROUSEL SCROLL FUNCTIONS
    // =========================================================
    const scrollLeft = () => {
        if (carouselRef.current && typeof carouselRef.current.scrollLeft === 'function') {
            carouselRef.current.scrollLeft(400);
        }
    };

    const scrollRight = () => {
        if (carouselRef.current && typeof carouselRef.current.scrollRight === 'function') {
            carouselRef.current.scrollRight(400);
        }
    };

    // =========================================================
    // EVENT HELPERS
    // =========================================================
    const testEvents = [
        {
            id: 1,
            name: "STEM Workshop: Robotics Basics",
            location: "Dreams Hub - Main Lab",
            description: "Learn the fundamentals of robotics programming and build your first robot. Perfect for beginners!",
            date: "11. 05. 2025.",
            time: "10:00 AM - 2:00 PM",
            images: [
                "/src/assets/kids-stem-img.jpg",
                "/src/assets/kids-learning2.jpg",
                "/src/assets/kids-hands-up.jpg"
            ]
        },
        {
            id: 2,
            name: "Coding Bootcamp: Python Fundamentals",
            location: "Dreams Hub - Computer Lab A",
            description: "Master Python programming from scratch. We'll cover variables, loops, functions, and more.",
            date: "11. 12. 2025.",
            time: "9:00 AM - 4:00 PM",
            images: [
                "/src/assets/kids-learning2.jpg",
                "/src/assets/kids-stem-img.jpg"
            ]
        },
        {
            id: 3,
            name: "Science Fair Preparation",
            location: "Dreams Hub - Conference Room",
            description: "Get help preparing your science fair project with guidance from our expert mentors.",
            date: "11. 19. 2025.",
            time: "2:00 PM - 5:00 PM",
            images: [
                "/src/assets/kids-hands-up.jpg",
                "/src/assets/kids-stem-img.jpg",
                "/src/assets/kids-learning2.jpg"
            ]
        },
        {
            id: 4,
            name: "3D Printing Workshop",
            location: "Dreams Hub - Maker Space",
            description: "Design and print your own 3D models. Learn about CAD software and 3D printing technology.",
            date: "11. 26. 2025.",
            time: "11:00 AM - 3:00 PM",
            images: [
                "/src/assets/kids-stem-img.jpg",
                "/src/assets/kids-hands-up.jpg"
            ]
        },
        {
            id: 5,
            name: "Math Olympiad Training",
            location: "Dreams Hub - Study Room B",
            description: "Advanced problem-solving techniques and competition strategies for math olympiad preparation.",
            date: "12. 03. 2025.",
            time: "1:00 PM - 4:00 PM",
            images: [
                "/src/assets/kids-learning2.jpg",
                "/src/assets/kids-stem-img.jpg",
                "/src/assets/kids-hands-up.jpg"
            ]
        },
        {
            id: 6,
            name: "Environmental Science Field Trip",
            location: "Local Nature Reserve",
            description: "Explore local ecosystems and learn about environmental conservation through hands-on activities.",
            date: "12. 10. 2025.",
            time: "8:00 AM - 12:00 PM",
            images: [
                "/src/assets/kids-hands-up.jpg",
                "/src/assets/kids-learning2.jpg"
            ]
        },
        {
            id: 7,
            name: "Past Event: Summer Coding Camp",
            location: "Dreams Hub - Main Lab",
            description: "A comprehensive summer program covering web development and mobile app creation.",
            date: "08. 15. 2024.",
            time: "9:00 AM - 3:00 PM",
            images: [
                "/src/assets/kids-stem-img.jpg",
                "/src/assets/kids-learning2.jpg"
            ]
        },
        {
            id: 8,
            name: "Past Event: Robotics Competition",
            location: "Dreams Hub - Competition Hall",
            description: "Students showcased their robotics projects in a friendly competition.",
            date: "09. 20. 2024.",
            time: "10:00 AM - 4:00 PM",
            images: [
                "/src/assets/kids-hands-up.jpg",
                "/src/assets/kids-stem-img.jpg"
            ]
        }
    ]; // test events for now

    /**
     * Filters events based on the selected type (All, Upcoming, Past)
     * @param {Array} events - Array of event objects
     * @param {string} filterType - "All", "Upcoming", or "Past"
     * @returns {Array} - Filtered array of events
     */
    const filterEventsByDate = (events, filterType) => {
        if (filterType === "All") {
            return events;
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

        return events.filter(event => {
            if (!event.date) return false;
            
            const dateComponents = parseDateString(event.date);
            if (!dateComponents) return false;

            const { year, month, day } = dateComponents;
            const eventDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

            if (filterType === "Upcoming") {
                return eventDate >= now;
            } else if (filterType === "Past") {
                return eventDate < now;
            }

            return true;
        });
    };

    // Get filtered events based on selected type
    const filteredEvents = filterEventsByDate(allEvents, eventTypeSelected);

    // Trigger fade-in animation when filtered events change
    useEffect(() => {
        setEventsFadeIn(false);
        const timer = setTimeout(() => {
            setEventsFadeIn(true);
        }, 50); // Small delay to ensure DOM has updated
        
        return () => clearTimeout(timer);
    }, [eventTypeSelected, allEvents]);

  return (
    // full screen container with proper scrolling
    <div 
    className="w-screen h-screen flex flex-col overflow-x-hidden duration-[.4s]">    
        {/* navbar component  */}
        <Navbar/>
        {/* scrollable content area */}
        <div className="flex-1 overflow-y-auto">
            <div className={`flex w-full h-full gap-[30px] ${isMobile? "flex-col" : "flex-row"} `}>
                {/* event type chooser  */}
                <div className={`border-0 border-[black] ${isMobile? "w-full gap-[30px]" : "w-[30%] max-w-[400px] h-[80vh] justify-center gap-[20px]"} md:m-[2vw] md:flex-col flex`}>
                    <EventTypeChooser 
                        eventTypes={eventTypes}
                        selectedType={eventTypeSelected}
                        onSelect={handleEventTypeChange}
                        displayedEventType={displayedEventType}
                        isAnimating={isAnimating}
                        onScrollLeft={scrollLeft}
                        onScrollRight={scrollRight}
                    />
                </div>

                {/* list of events in carousel */}
                <EventCarousel ref={carouselRef} isLoaded={eventsLoaded && !isLoadingEvents}>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index)=>{
                            // Handle both test data (with images array) and server data (may have different structure)
                            const imageUrl = event.images && event.images.length > 0 
                                ? event.images[0] 
                                : (event.image || "/src/assets/default-event-item-img.jpg");
                            
                            return <div 
                                key={`${event.id}-${eventTypeSelected}`}
                                className={`relative border-0 ${isMobile ? "w-full h-full snap-center shrink-0" : "aspect-square w-[33vw]"} shadow-2xl block ${isMobile ? "" : "min-h-[400px]"}`}
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    animation: eventsFadeIn ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                                    opacity: eventsFadeIn ? 1 : 0
                                }}
                            >
                                <img 
                                    className="block object-cover w-full h-full"
                                    src={imageUrl} 
                                    alt={event.name || "Event"} 
                                />
                                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
                                <EventCardContent event={event} />
                            </div>
                        })
                    ) : (
                        <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{
                                animation: eventsFadeIn ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                                opacity: eventsFadeIn ? 1 : 0
                            }}
                        >
                            <p className="text-gray-500 text-xl">No {eventTypeSelected.toLowerCase()} events found.</p>
                        </div>
                    )}
                </EventCarousel>
            </div>
             {/* calendar view */}
            <div className="w-full h-[40vh] bg-white p-[30px]">
                <CalendarApp eventList={filteredEvents}/>
            </div>
        
        </div>

        <Footer/>
    </div>
  )
}
