import React, { useEffect, useState }                    from 'react'
import StemKids                 from "../../assets/kids-stem-img.jpg"
import { MdAccountCircle }      from "react-icons/md";
import { COLORS_CONSTANTS }     from '../../styles/StyleConstants';
import useIsMobile              from '../../hooks/useIsMobile';
import { Link }                 from 'react-router-dom';
import * as BOARD_MEMBER_MIDDLEWARE  from "../../middlewares/board_web_profiles_middleware"

export default function Banner() {
    //===========================================
    // BANNER HELPERS
    //===========================================

    const isMobile = useIsMobile();

    const [theTeam, setTheTeam] = useState([
        {Name: null, image: null},
        {Name: null, image: null},
        {Name: null, image: null},
        {Name: null, image: null},
        {Name: null, image: null},
        {Name: null, image: null},
    ]);

    useEffect(()=>{
        async function getBoardMembers()
        {
            const response = await BOARD_MEMBER_MIDDLEWARE.loadBoardMemberProfiles();
            setTheTeam(response);
        }
        getBoardMembers();
    }, []);


    return (
        <div className="relative w-full h-[80%] min-h-fit max-h-[800px] overflow-hidden block" style={{ backgroundColor: COLORS_CONSTANTS.BANNER_BG }}>
            {/* image and overlay container */}
            <div className="absolute inset-0 w-full h-full">
                {/* image of children  */}
                <img 
                className='w-full h-full object-cover'
                src={StemKids} 
                alt="" />

                {/* dark fade overlay */}
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
                        zIndex: 10
                    }}
                ></div>
            </div>

            <div className={`z-10 ${isMobile? "w-full" : "w-[80%]"} h-full p-[10px] flex flex-col border-0 border-[white] justify-center ${isMobile? "items-center" : ""} `}>

                <div className={`z-20 w-fit h-fit border-0 border-[white] p-[20px] ${isMobile? "" : "ml-[100px]"} animate-fade-in  rounded-lg`}>
                    <p className='font-weight-5 text-[20px] animate-fade-in-delay-1' style={{ color: COLORS_CONSTANTS.WHITE }}>Where Curiosity Meets Discovery.</p>

                    <p className={`${ isMobile? 'text-[45px]' : "text-[60px]"} font-weight-900 max-w-[700px] animate-fade-in-delay-2`} style={{ color: COLORS_CONSTANTS.WHITE }}>Empowering the Next Generation of Thinkers</p>

                    <p className='font-weight-200 text-[17px] animate-fade-in-delay-3' style={{ color: COLORS_CONSTANTS.DREAMS_PINK_LIGHT }}>Developing Real Educational Adventures in Math & Science.</p>
                
                    {/* learn more button  */}
                    <div className="h-fit min-h-[50px] w-fit min-w-[150px] border-0 border-[white] mt-[30px] flex gap-[20px] items-center">
                        <Link
                        to="/about"
                        className={`flex justify-center items-center h-full min-h-[50px] w-full max-w-[150px]`}
                        style={{ 
                            color: COLORS_CONSTANTS.WHITE, 
                            backgroundColor: COLORS_CONSTANTS.DREAMS_PINK 
                        }}
                        >Learn more</Link>

                        <div className="flex border-[white] border-0 gap-[20px] h-full flex-1 ">
                            {/* load in images of the team  */}
                            {!isMobile ? theTeam.map((member, idx)=>{
                                return (member && member.image) ? 
                                <img 
                                className='size-[75px] aspect-square rounded-full object-cover'
                                key={idx} 
                                src={member.image} 
                                alt="" 
                                srcset="" />
                                : null
                            }) : null}
                        </div>
                    </div>
                </div>
                
            </div>

        </div>
    )
}
