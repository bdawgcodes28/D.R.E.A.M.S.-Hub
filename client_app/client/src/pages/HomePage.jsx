import React                from 'react'
import Navbar               from "../components/Navbar";
import Banner               from "../components/Banner";
import HomeMissionStatement from '../components/HomeMissionStatement';
import HomeMetrics          from '../components/HomeMetrics';


export default function HomePage() {

  return (
    // full screen container with proper scrolling
    <div 
    className="w-screen h-screen flex flex-col overflow-x-hidden">    
        {/* navbar component  */}
        <Navbar />
        {/* scrollable content area */}
        <div className="flex-1 overflow-y-auto">
            {/* banner component  */}
            <Banner />
            {/* mission statement */}
            <HomeMissionStatement/>
            {/* short peek at metrics  */}
            <HomeMetrics/>
        </div>

    </div>
  )
}
