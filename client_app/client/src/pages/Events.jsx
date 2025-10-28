import React, { useState, useEffect }   from 'react'
import Navbar                           from '../components/Navbar'
import { Footer }                       from '../components/Footer'
import { COLORS_CONSTANTS }             from '../styles/StyleConstants';
import { FaArrowLeft }                  from "react-icons/fa";
import { FaArrowRight }                 from "react-icons/fa";

export default function Events() {

    // used to toggle what kind of events / components are visible
    const eventTypes                                = ["Upcoming", "Recent", "All"];
    const [eventTypeSelected, setEventTypeSelected] = useState("Upcoming");
    const [displayedEventType, setDisplayedEventType] = useState("Upcoming");
    const [isAnimating, setIsAnimating] = useState(false);
    const [eventsLoaded, setEventsLoaded] = useState(false);
    const [carouselRef, setCarouselRef] = useState(null);

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
        if (carouselRef) {
            carouselRef.scrollBy({
                left: -400, // Scroll by 400px to the left
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (carouselRef) {
            carouselRef.scrollBy({
                left: 400, // Scroll by 400px to the right
                behavior: 'smooth'
            });
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
            date: "2024-02-15",
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
            date: "2024-02-22",
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
            date: "2024-03-01",
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
            date: "2024-03-08",
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
            date: "2024-03-15",
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
            date: "2024-03-22",
            time: "8:00 AM - 12:00 PM",
            images: [
                "/src/assets/kids-hands-up.jpg",
                "/src/assets/kids-learning2.jpg"
            ]
        }
    ]; // test events for now

  return (
    // full screen container with proper scrolling
    <div 
    className="w-screen h-screen flex flex-col overflow-x-hidden duration-[.4s]">    
        {/* navbar component  */}
        <Navbar/>
        {/* scrollable content area */}
        <div className="flex-1 overflow-y-auto">
            <div className="flex w-full h-full gap-[30px]">
                {/* event type chooser  */}
                <div className="border-0 border-[black] w-[30%] max-w-[400px] h-[80vh] md:m-[2vw] md:flex-col flex gap-[20px] justify-center">
                    {/* options */}
                    <div className="flex gap-[10px] w-full h-fit justify-center items-center p-[5px]">
                        {eventTypes.map((type, id)=>{
                            return <button 
                                    onClick={() => handleEventTypeChange(type)}
                                    className={`p-[5px] border-[1.5px] w-fit min-w-[120px] duration-[.4s] ${eventTypeSelected == type ? "bg-[black]" : "" }`}
                                    style={{
                                        borderColor: (eventTypeSelected == type) ? "white" :  COLORS_CONSTANTS.DREAMS_PINK, 
                                        color: (eventTypeSelected == type) ? "white" :  COLORS_CONSTANTS.DREAMS_PINK 
                                    }}
                                    >   
                                    {type}</button>
                        })}
                    </div>
                    {/* header for selected type */}
                    <div 
                        className={`flex-col flex p-[10px] transition-all duration-500 ease-out ${
                            isAnimating 
                                ? 'opacity-0 transform translate-y-4' 
                                : 'opacity-100 transform translate-y-0'
                        }`}
                    >
                        <p 
                            className="text-6xl" 
                            style={{fontWeight:'bold'}}
                        >
                            {displayedEventType} Events
                        </p>
                        <div className="border-[3px] border-[black] w-[40%] mt-[1vh]"></div>
                    </div>
                    {/* short text */}
                    <p className='text-[gray]'>
                        {(eventTypeSelected != "All") ? `Come view some of our ${eventTypeSelected} events.` : "Come view all of our events."}
                    </p>

                    {/* buttons to slide carosel */}
                    <div 
                    className=" flex gap-[40px] justify-center items-center 
                    border-0 border-[black] w-fit ">
                        <button 
                            onClick={scrollLeft}
                            className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                            aria-label="Scroll left"
                        >
                            <FaArrowLeft size={30}/>
                        </button>
                        <button 
                            onClick={scrollRight}
                            className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                            aria-label="Scroll right"
                        >
                            <FaArrowRight size={30}/>
                        </button>
                    </div>
                </div>

                {/* list of events in carosel */}
                <div ref={setCarouselRef}
                     className={`flex-1 border-0 border-[black] m-[1vh] overflow-x-scroll flex gap-[20px] p-[50px] relative scrollbar-hide transition-all duration-1000 ease-out ${
                    eventsLoaded 
                        ? 'transform translate-x-0 opacity-100' 
                        : 'transform translate-x-full opacity-0'
                }`}
                     style={{
                         maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                         WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
                     }}>
                    {testEvents.map((event, id)=>{
                        return <div key={event.id} 
                        className="border-2 border-[black] aspect-square p-[30px] flex flex-col justify-end items-start w-[33vw] min-h-[400px]">
                            <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                            <p className="text-sm text-gray-600 mb-2"><strong>Location:</strong> {event.location}</p>
                            <p className="text-sm text-gray-600 mb-2"><strong>Date:</strong> {event.date}</p>
                            <p className="text-sm text-gray-600 mb-2"><strong>Time:</strong> {event.time}</p>
                            <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
        
        <Footer/>
    </div>
  )
}
