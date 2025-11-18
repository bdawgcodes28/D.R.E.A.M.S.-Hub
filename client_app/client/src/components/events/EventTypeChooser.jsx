import React                    from 'react'
import { FaArrowLeft }          from "react-icons/fa";
import { FaArrowRight }         from "react-icons/fa";
import useIsMobile              from '../../hooks/useIsMobile';

export default function EventTypeChooser({ 
    eventTypes = [], 
    selectedType, 
    onSelect,
    displayedEventType,
    isAnimating,
    onScrollLeft,
    onScrollRight
}) {



    // =========================================================
    // HOOKS
    // =========================================================
    const isMobile = useIsMobile(); 

    return (
        <div className="w-full h-fit">
            {/* header for selected type for mobile*/}
            <div 
                className={` ${isMobile? "flex mt-[3vh]" : 'hidden'} flex-col p-[10px] transition-all duration-500 ease-out ${
                    isAnimating 
                        ? 'opacity-0 transform translate-y-4' 
                        : 'opacity-100 transform translate-y-0'
                }`}
            >
                <p 
                    className={` ${isMobile? "text-4xl" : "text-6xl"}`} 
                    style={{fontWeight:'bold'}}
                >
                    {displayedEventType} Events
                </p>
                <div className="border-[3px] border-[black] w-[40%] mt-[1vh]"></div>
            </div>
            {/* options */}
            <div className={` flex ${isMobile? "flex-col" : "flex-row"} gap-[10px] w-full h-fit justify-center items-center p-[5px]`}>
                {eventTypes.map((type) => {
                    const isSelected = selectedType === type
                    return (
                        <button
                            key={type}
                            onClick={() => onSelect && onSelect(type)}
                            className={`p-[5px] border-[1.5px] ${isMobile? "w-full p-[10px]" : "w-fit min-w-[120px]"}  duration-[.4s] ${isSelected ? 'bg-[black]' : ''}`}
                            style={{
                                borderColor: isSelected ? 'white' : '#F68BA9',
                                color:       isSelected ? 'white' : '#F68BA9'
                            }}
                        >
                            {type}
                        </button>
                    )
                })}
            </div>

            {/* header for selected type */}
            <div 
                className={`flex-col ${isMobile? "hidden" : "flex"} p-[10px] transition-all duration-500 ease-out ${
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
            <p className={`text-[gray] ${isMobile? "hidden" : "block"}`}>
                {(selectedType != "All") ? `Come view some of our ${selectedType} events.` : "Come view all of our events."}
            </p>

            {/* buttons to slide carousel */}
            <div 
                className={` ${isMobile? "hidden" : "flex"} gap-[40px] justify-center items-center 
                    border-0 border-[black] w-fit mt-[4vh]`}
            >
                <button 
                    onClick={onScrollLeft}
                    className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                    aria-label="Scroll left"
                >
                    <FaArrowLeft size={30}/>
                </button>
                <button 
                    onClick={onScrollRight}
                    className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                    aria-label="Scroll right"
                >
                    <FaArrowRight size={30}/>
                </button>
            </div>
        </div>
    )
}
