import React, { useState } from 'react'
import { FaPhoneAlt }       from "react-icons/fa";
import { FaInstagram }      from "react-icons/fa";
import { FaLinkedin }       from "react-icons/fa";
import { FaFacebook }       from "react-icons/fa";
import { Link }             from 'react-router-dom';
import { useIsMobile }      from '../hooks/useIsMobile';
import { IoMdMenu }         from "react-icons/io";
import { IoMdClose }        from "react-icons/io";
import { COLORS_CONSTANTS } from '../styles/StyleConstants';
import DreamsLogo           from "../assets/dreamsLogo.png"

export default function Navbar() {

    // listen for change in screen size with hook
    const isMobile = useIsMobile();
    
    // state for mobile dropdown menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    //===========================================
    // NAVBAR HELPERS
    //===========================================
    const socials = [
        {Name: "Instagram", Icon: <FaInstagram color={COLORS_CONSTANTS.WHITE} size={25}/>,    Link: "/"},
        {Name: "LinkedIn",  Icon: <FaLinkedin  color={COLORS_CONSTANTS.WHITE} size={25}/>,    Link: "/"},
        {Name: "Facebook",  Icon: <FaFacebook  color={COLORS_CONSTANTS.WHITE} size={25}/>,    Link: "/"},
    ];

    const navigationLinks = [
        {Name: "home",     Link: "/"},
        {Name: "about",     Link: "/about"},
        {Name: "events",    Link: "/events"},
        {Name: "programs",  Link: "/"},
        {Name: "contact",   Link: "/"},
    ];

    // Mobile Navbar Component
    const MobileNavbar = () => {
        
        const toggleDropdown = () => {
            if (isDropdownOpen) {
                // Start closing animation
                setIsClosing(true);
                setTimeout(() => {
                    setIsDropdownOpen(false);
                    setIsClosing(false);
                }, 300);
            } else {
                setIsDropdownOpen(true);
                setIsClosing(false);
            }
        };

        const closeDropdown = () => {
            if (isDropdownOpen) {
                // Start closing animation
                setIsClosing(true);
                setTimeout(() => {
                    setIsDropdownOpen(false);
                    setIsClosing(false);
                }, 300);
            }
        };

        return (
            <div className="relative w-full">
                {/* Main navbar */}
                <div className=" w-full h-[60px] flex items-center justify-between px-4" style={{ backgroundColor: COLORS_CONSTANTS.DREAMS_PINK }}>
                    {/* hamburger menu button */}
                    <button 
                        onClick={toggleDropdown}
                        className="ml-[20px] p-2 hover:opacity-70 transition-opacity duration-300"
                    >
                        {isDropdownOpen ? (
                            <IoMdClose className='size-[30px] md:size-[35px]' style={{ color: COLORS_CONSTANTS.WHITE }}/>
                        ) : (
                            <IoMdMenu className='size-[30px] md:size-[35px]' style={{ color: COLORS_CONSTANTS.WHITE }}/>
                        )}
                    </button>
                    
                    {/* Logo/Brand */}
                    <div className="text-[white] font-bold text-lg">D.R.E.A.M.S Collective</div>
                    
                    {/* Empty space for balance */}
                    <div className="w-[60px]"></div>
                </div>

                {/* Dropdown Menu - Full Screen Pink Overlay */}
                {isDropdownOpen && (
                    <div 
                        className="fixed top-0 left-0 w-full h-screen z-50"
                        style={{ 
                            backgroundColor: COLORS_CONSTANTS.DREAMS_PINK,
                            animation: isClosing ? 'slideUp 0.3s ease-out' : 'slideDown 0.3s ease-out',
                            transform: isClosing ? 'translateY(-100%)' : 'translateY(-100%)',
                            animationFillMode: 'forwards'
                        }}
                        onClick={closeDropdown}
                    >
                        {/* Full screen content area */}
                        <div className="p-8 h-full flex flex-col">
                            {/* Empty space for future content */}
                             {
                                 navigationLinks.map((link, idx)=>{
                                     return (
                                         <div key={idx} className=" text-[white] w-full p-[15px] border-b-2 border-[white] h-[80px] flex items-center">
                                             <Link to={link.Link}> {link.Name} </Link>
                                         </div>
                                     )
                                 })
                             }
                            {/* socials  */}
                            <div className="w-full p-[15px] flex gap-[40px] justify-center mt-[2vh]">
                                {socials.map((social, idx)=>{
                                    return (
                                        <div key={idx} className="cursor-pointer hover:opacity-70 transition-opacity duration-300">
                                            {social.Icon}
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        )
    };

    // Desktop Navbar Component
    const DesktopNavbar = () => (
        <div className="w-full h-[20%] max-h-[90px] border-0 border-black flex flex-col">
            {/* socials sub nav  */}
            <div className="w-full  h-[50%] max-h-[40px] flex items-center justify-start gap-[20px] pl-[10%]" style={{ backgroundColor: COLORS_CONSTANTS.DREAMS_PINK }}>
                {/* call section  */}
                <div className="flex gap-[10px] items-center p-[5px] border-black w-fit ml-[10px]" style={{ color: COLORS_CONSTANTS.WHITE }}>
                    <FaPhoneAlt size={15} color={COLORS_CONSTANTS.WHITE}/>
                    <p className=' text-[13px]' style={{ color: COLORS_CONSTANTS.WHITE }}>+1 888-575-2222</p>
                </div>

                {/* slogan / short phrase  */}
                <p className='text-[13px]' style={{ color: COLORS_CONSTANTS.WHITE }}>Helping the youth discover things they never could imagine</p>

                {/* socials section  */}
                <div className=" ml-auto w-fit mr-[100px] border-0 border-black p-[0px] max-w-[800px] flex gap-[25px] items-center pr-[10%]">
                    {socials.map((social, idx)=>{
                        return (
                            <div key={idx} className="cursor-pointer hover:opacity-70 hover:mb-[1vh] transition-all duration-300">
                                {social.Icon}
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* sub nav with navigation options  */}
            <div className=" w-full flex-1 border-0 h-[50%] max-h-[50px] pl-[10%] pr-[10%] flex" style={{ backgroundColor: COLORS_CONSTANTS.BLACK }}>
                
                {/* dreams logo  */}
                <div className="h-full w-[200px] border-0 border-[white] flex justify-center items-center">
                   {/* <img src={DreamsLogo} alt="" className='w-full h-full object-cover' /> */}
                </div>

                {/* list of navigation links  */}
                <div className="border-2 border-[black] flex gap-[20px] justify-center items-center ml-auto w-fit">
                    {navigationLinks.map((link, idx)=>{
                            return (
                                <Link 
                                key={idx}
                                className='p-[5px] transition-colors duration-300'
                                style={{ color: COLORS_CONSTANTS.WHITE }}
                                to={ link.Link } 
                                onMouseEnter={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
                                onMouseLeave={(e) => e.target.style.color = COLORS_CONSTANTS.WHITE}
                                >{ link.Name }</Link>
                            );
                        })}
                </div>

                {/* join us button  */}
                <div className="bg-[white] hover:bg-gray-300  
                duration-300 min-w-[120px] h-full flex justify-center items-center 
                border-0 border-black ml-[1vw] cursor-pointer" style={{ borderColor: COLORS_CONSTANTS.BLACK }}>
                    <p style={{ color: COLORS_CONSTANTS.BLACK, fontWeight: 'bold', fontSize: '14px' }}>Donate Now</p>
                </div>

            </div>
        </div>
    );

    // Conditional rendering based on screen size
    return isMobile ? <MobileNavbar /> : <DesktopNavbar />;
}
