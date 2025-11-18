import React                from 'react'
import Navbar               from "../components/layout/Navbar";
import Banner               from "../components/ui/Banner";
import HomeMissionStatement from '../components/home/HomeMissionStatement';
import HomeMetrics          from '../components/home/HomeMetrics';
import { Footer } from '../components/layout/Footer';
import Testimonal from '../components/ui/Testimonal';


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
            {/* testimonals  */}
            <Testimonal/>

            {/* footer  */}
            <Footer/>
        </div>

    </div>
  )
}
