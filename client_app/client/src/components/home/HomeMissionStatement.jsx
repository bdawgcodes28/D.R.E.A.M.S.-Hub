import React                from 'react'
import useIsMobile          from '../../hooks/useIsMobile'
import { COLORS_CONSTANTS } from '../../styles/StyleConstants'
import { Link }             from 'react-router-dom'
import kidsHandsUp          from "../../assets/kids-learning2.jpg"

export default function HomeMissionStatement() {

  // check for break point
  const isMobile = useIsMobile();


  return (
    <div className={`w-full bg-[#ffffff] h-[90vh] max-h-[800px] flex gap-[30px] p-[20px] overflow-x-hidden overflow-y-hidden`}>
            {/* FIXME: image graphic */}
            <div className={`${isMobile? "hidden" : "flex"} w-[50%] h-[90%] border-0 border-[black] flex justify-center items-center relative bg-white`}>
                    <img src={kidsHandsUp} alt="" className=" rounded-b-full absolute w-full h-full object-cover [clip-path:polygon(15%_20%,35%_20%,35%_80%,15%_80%)]" style={{transform: 'rotate(-25deg)'}} />
                    <img src={kidsHandsUp} alt="" className="absolute w-full h-full object-cover [clip-path:polygon(40%_10%,60%_10%,60%_90%,40%_90%)] rounded-[300px]" style={{transform: 'rotate(-25deg)'}} />
                    <img src={kidsHandsUp} alt="" className="absolute w-full h-full object-cover [clip-path:polygon(65%_20%,85%_20%,85%_80%,65%_80%)] rounded-[300px]" style={{transform: 'rotate(-25deg)'}} />
            </div>

            {/* content text */}
            <div className={` ${isMobile? "w-full" : "w-[50%]"} h-[90%] border-0 border-[black] flex flex-col p-[20px] justify-center`}>
                <p className={`${isMobile? "text-[15px]": "text-[20px]" } font-bold`} style={{color: COLORS_CONSTANTS.DREAMS_PINK, fontWeight:"500"}}>Welcome to D.R.E.A.M.S Collective</p>
                <p className={`${isMobile? "text-[30px]" : "text-[40px]"} `} style={{fontWeight: "bold"}}>Empowering Young Minds to Dream, Discover, and Do.</p>
                
                <p className={` ${isMobile? "w-full": "w-[80%]"} w-[80%] mt-[2vh]`}>The D.R.E.A.M.S. Collective empowers underrepresented 
                    youth through engaging, hands-on STEM education. We 
                    connect students with mentors and real-world experiences 
                    that spark curiosity, build confidence, and inspire future 
                    leaders in science, technology, engineering, and math.</p>
                
                {/* meet the team link/button  */}
                <div className={`${isMobile? "w-full flex justify-center" : ""} w-full min-h-fit mt-[4vh] border-0 border-[black]`}>
                    <Link to={"/about"} className={`${isMobile? "w-full text-center" : ""} p-[12px] text-[white] `} style={{backgroundColor: COLORS_CONSTANTS.DREAMS_PINK}}>Meet the team</Link>
                </div>
                
            </div>
    </div>
  )
}
