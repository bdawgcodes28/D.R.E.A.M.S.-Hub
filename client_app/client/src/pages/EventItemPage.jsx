import React, { useState, useEffect }   from 'react'
import { useLocation }                  from 'react-router-dom'
import Navbar                           from '../components/layout/Navbar'
import { Footer }                       from '../components/layout/Footer'
import GradientOverlay                  from '../components/ui/GradientOverlay'
import ImageCarousel                    from '../components/ui/ImageCarousel'
import DEFAULT_IMG                      from "../assets/default-event-item-img.jpg"
import { FaArrowDownLong }              from "react-icons/fa6";
import { COLORS_CONSTANTS } from '../styles/StyleConstants'

export default function EventItemPage() {
  // Get event data from route state
  const location  = useLocation()
  const event     = location.state?.event

  // check for media paths
  const hasMedia = event.images.length > 0;
  
  // Typing animation state
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping]           = useState(true)
  
  useEffect(() => {
    if (!event?.name) return
    
    setDisplayedText('')
    setIsTyping(true)
    let currentIndex = 0
    const typingSpeed = 100 // milliseconds per character
    
    const typingInterval = setInterval(() => {
      if (currentIndex < event.name.length) {
        setDisplayedText(event.name.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        // Hide cursor after typing is complete
        setTimeout(() => {
          setIsTyping(false)
        }, 500)
      }
    }, typingSpeed)
    
    return () => clearInterval(typingInterval)
  }, [event?.name])
  

  // Handle case where event data is missing
  if (!event) {
    return (
      <div className="w-screen h-screen flex flex-col overflow-x-hidden">
        <Navbar/>
        <div className="flex-1 overflow-y-scroll flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-gray-600">The event information could not be loaded.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    // full screen container with proper scrolling
    <div 
    className="w-screen h-screen flex flex-col overflow-x-hidden duration-[.4s]">

      {/* navigation */}
      <Navbar/>

      {/* flex area with content */}
      <div className="flex-1 overflow-y-scroll flex flex-col">

        {/* hero section */}
        <div className="w-full h-[90%] bg-[gray] overflow-hidden relative shrink-0">

            {/* background img */}
            <img 
            className='object-cover w-full h-full absolute'
            src={!event.images.length > 0 ? event.images[0] : DEFAULT_IMG} 
            alt="" />

            {/* overlay - gradient fade */}
            <GradientOverlay intensity={0.99} direction="bottom" />

            {/* event name */}
        
            <div 
            className="flex flex-col absolute justify-center items-center 
            p-[20px] w-full h-full">

                <h1
                className='text-6xl text-[white]'
                style={{fontWeight: "bold"}}
                >
                  {displayedText}
                  {isTyping && <span className="animate-blink">|</span>}
                </h1>

                <FaArrowDownLong 
                  className={`text-[white] mt-[30vh] absolute animate-arrow-scroll cursor-pointer hover:opacity-80 transition-opacity`} 
                  size={60}
                  onClick={() => {
                    document.getElementById('event-details')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                />

            </div>

          </div> 

           {/* event content */}
        <div id="event-details" className="w-full bg-whitw min-h-[500px] p-[20px] flex gap-[20px] justify-center">

            {/* event description */}
            <div className="border-0 border-[border] w-[50%] max-w-[550px] p-[10px] flex flex-col justify-center">
              <h1
              className='text-4xl text-center'
              style={{fontWeight:"bold"}}
              >ABOUT EVENT</h1>

              <p
              className='text-[17px] mt-[10px] text-center'
              >{event.description}</p>

            </div>
            {/* event details */}
            <div className=" w-[50%] max-w-[550px] flex flex-col justify-center gap-[5px]">
              
              <div 
              className={`w-full flex-1 border-0 border-[border] rounded-[5px] flex items-center justify-center bg-[#444343] hover:bg-[#7a4ce6] transition-colors duration-300`}>
                <h1 className='text-white text-5xl font-bold'>{event.date}</h1>
              </div>
              <div 
              className={`w-full flex-1 border-0 border-[border] rounded-[5px] flex items-center justify-center bg-[#444343] hover:bg-[#7a4ce6] transition-colors duration-300`}>
                <h1 className='text-white text-5xl font-bold'>{event.time}</h1>
              </div>
              <div 
              className={`w-full flex-1 border-0 border-[border] rounded-[5px] flex items-center justify-center bg-[#444343] hover:bg-[#7a4ce6] transition-colors duration-300`}>
                <h1 className='text-white text-[20px] font-bold'>{event.location}</h1>
              </div>
              
             
            </div>

        </div>
          {/* media carosel if has media files */}
          <div 
            className="w-full h-[50vh] min-h-[500px] border-0 border-black "
            style={{ backgroundColor: COLORS_CONSTANTS.DREAMS_PURPLE }}
          >

                  <ImageCarousel 
                  images={event.images}
                  autoPlay={true}
                  className={`${hasMedia? "block" : "hidden"}`}
                  />

          </div>

      </div>

        {/* footer */}
        <Footer/>

    </div>
  )
}
