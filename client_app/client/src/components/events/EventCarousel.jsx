import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import useIsMobile from '../../hooks/useIsMobile';

const EventCarousel = forwardRef(function EventCarousel(props, ref) {
    const { children, isLoaded }    = props
    const containerRef              = useRef(null)

    // =========================================================
    // HOOKS
    // =========================================================
    const isMobile = useIsMobile(); 

    useImperativeHandle(ref, () => ({
        scrollLeft: (px = 400) => {
            if (containerRef.current) {
                containerRef.current.scrollBy({ left: -px, behavior: 'smooth' })
            }
        },
        scrollRight: (px = 400) => {
            if (containerRef.current) {
                containerRef.current.scrollBy({ left: px, behavior: 'smooth' })
            }
        }
    }), [])

    return (
        <div
            ref={containerRef}
            className={`${isMobile? "mb-[3vh] m-0" : "m-[1vh]"} flex-1 border-0 border-[black] overflow-x-scroll flex ${isMobile ? "gap-[8px] snap-x snap-mandatory" : "gap-[20px] p-[50px]"} relative scrollbar-hide transition-all duration-1000 ease-out ${
                isLoaded ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
            }`}
            style={
                isMobile
                    ? undefined
                    : {
                        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 90%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 90%, transparent 100%)'
                    }
            }
        >
            {children}
        </div>
    )
})

export default EventCarousel
