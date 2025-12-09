import React, { useState }          from 'react'
import { COLORS_CONSTANTS }         from '../../styles/StyleConstants'
import { Link, useNavigate }        from 'react-router-dom';
import useIsMobile                  from '../../hooks/useIsMobile';
import { formatDateReadable }       from './eventTransformers';

export default function EventCardContent({ event, media }) {
    // =========================================================
    // HOOKS
    // =========================================================
    const isMobile = useIsMobile(); 

    // hooks
    const navigate = useNavigate();

    // check for hovering
    const [hovering, setHovering] = useState(false);

    // Format date for display
    const formattedDate = formatDateReadable(event.date || '');

    return (
        <div
            className={"absolute inset-0 z-20 flex justify-end flex-col p-[20px] duration-300"}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {/* date and time */}
            <div className={`border-0 border-[white] ${isMobile? "" : "p-[10px]"}  w-full duration-300`}>
                <p 
                style={{color:COLORS_CONSTANTS.DREAMS_PINK, fontWeight:"bold"}}
                className={`flex  ${isMobile? "text-[14px] flex-col gap-[5px]" : "gap-[15px]"}`}>
                    <span>{formattedDate || event.date}</span> 
                    <span className={`${isMobile? "hidden" : ""}`} style={{fontWeight:"bold"}}>/</span>
                    <span>{event.time}</span>
                </p>
            </div>
            {/* name of event */}
            {isMobile ? (
                <Link
                    to='/events/item'
                    state={{ event, media }}
                    className={`w-full text-[white] text-2xl`}
                >
                    {event.name}
                </Link>
            ) : (
                <div className={`w-full p-[15px] text-[white] text-4xl`}>{event.name}</div>
            )}

            {/* learn more button */}
            <div 
            className={`${(hovering || isMobile) ? "opacity-100 translate-y-0 pointer-events-auto max-h-24" : "opacity-0 translate-y-2 pointer-events-none max-h-0"}
             overflow-hidden transition-all duration-300 ease-out w-full ${isMobile? "mt-[1vh]" : "p-[15px]"} flex items-center justify-start`}>

                <Link
                to='/events/item'
                state={{ event, media }}
                style={{color:"white", backgroundColor: COLORS_CONSTANTS.DREAMS_PINK}}
                className={`min-w-fit w-[40%] max-w-[120px] p-[10px] ${isMobile? "hidden": ""}`}>
                Learn more</Link>

            </div>
            
        </div>
    )
}
