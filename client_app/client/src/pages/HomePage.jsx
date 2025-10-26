import React                from 'react'
import Navbar               from "../components/Navbar";
import Banner               from "../components/Banner";

export default function HomePage() {

  return (
    // full screen container 
    <div 
    className="w-screen h-screen flex items-center flex-col">
        
        {/* navbar component  */}
        <Navbar />

        {/* banner component  */}
        <Banner />

        

    </div>
  )
}
