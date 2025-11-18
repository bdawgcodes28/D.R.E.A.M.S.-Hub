import React, { useState, useEffect, useRef }   from 'react'
import Navbar                                   from '../components/layout/Navbar'
import { Footer }                               from '../components/layout/Footer'
import { COLORS_CONSTANTS }                     from '../styles/StyleConstants';
import EventCardContent                         from '../components/events/EventCardContent';
import EventCarousel                            from '../components/events/EventCarousel';
import EventTypeChooser                         from '../components/events/EventTypeChooser';
import useIsMobile                              from '../hooks/useIsMobile';
import CalendarApp from '../components/events/CalendarApp';

export default function EventsPage() {

    // =========================================================
    // HOOKS
    // =========================================================
    const isMobile = useIsMobile(); 


    // used to toggle what kind of events / components are visible
    const eventTypes                                    = ["Upcoming", "Recent", "All"];
    const [eventTypeSelected, setEventTypeSelected]     = useState("Upcoming");
    const [displayedEventType, setDisplayedEventType]   = useState("Upcoming");
    const [isAnimating, setIsAnimating]                 = useState(false);
    const [eventsLoaded, setEventsLoaded]               = useState(false);
    const carouselRef                                   = useRef(null);

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
        }
    ]; // test events for now

    const events = testEvents;

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
                <EventCarousel ref={carouselRef} isLoaded={eventsLoaded}>
                    {testEvents.map((event)=>{
                        return <div 
                            key={event.id}
                            className={`relative border-0 ${isMobile ? "w-full h-full snap-center shrink-0" : "aspect-square w-[33vw]"} shadow-2xl block ${isMobile ? "" : "min-h-[400px]"}`}
                        >
                            <img 
                                className="block object-cover w-full h-full"
                                src={event.images[0]} 
                                alt="" 
                            />
                            <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
                            <EventCardContent event={event} />
                        </div>
                    })}
                </EventCarousel>
            </div>
             {/* calendar view */}
            <div className="w-full h-[40vh] bg-white p-[30px]">
                <CalendarApp eventList={events}/>
            </div>
        
        </div>

        <Footer/>
    </div>
  )
}
