/**
 * @author Elias Lopes
 * @Date   10/2/2025
 * @description 
 *  This file will hold all error pop ups
 */
import React, { useState, useEffect }   from 'react'
import { IoWarningOutline }             from "react-icons/io5";

/**
 * this component expects a json object as props
 * popUpName:   "UserNotFound"
 * region:      "top or bottom or left or right or default"
 * blur:        true/false
 * @param {*} param0 
 * @returns pop up componet with over lay
 */

export default function ErrorPopUps({ popUpInfo }) {

    // ================================================================================================
    // AUTHENTICATION ERROR POP UPS
    // ================================================================================================
    const UserNotFound = () => {
        const [isVisible, setIsVisible] = useState(false);
        const [isClosing, setIsClosing] = useState(false);

        useEffect(() => {
            // Trigger animation after component mounts
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 50); // Small delay to ensure smooth animation

            return () => clearTimeout(timer);
        }, []);

        const handleClose = () => {
            setIsClosing(true);
            // Optional: Add a callback to handle what happens after animation completes
            setTimeout(() => {
                // You can add logic here to close the popup or navigate away
                console.log('Popup closed');
            }, 500); // Match the duration of the animation
        };

        return (
            <div 
            className={`flex flex-col items-center w-[80%] max-w-[300px] h-[60%] max-h-[300px] min-h-fit border-2 border-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out transform ${
                isClosing
                    ? 'opacity-0 translate-y-16'
                    : isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
            }`}>
                {/* banner with error icon  */}
                <div className=" flex justify-center items-center bg-red-400 w-full p-[10px] h-[20%] min-h-[100px]">
                    <IoWarningOutline 
                    className='size-[80%]'/>
                </div>
                {/* error info and cause of error   */}
                <div className=" bg-white flex flex-col gap-[10px] items-center w-[90%] flex-1 border-0 border-black p-[5px]">
                    <h1
                    className='text-gray-600 text-4xl font-bold'
                    >Error!</h1>

                    <p
                    className='text-gray-600'
                    >User Not Found! Try again with correct email and password.</p>

                    {/* button to exit pop up and try again  */}
                    <button
                    onClick={handleClose}
                    className='w-[80%] max-w-[150px] bg-red-400 p-[10px] rounded-2xl mt-auto mb-[2vh] hover:bg-red-300  '
                    >Try again.</button>
                </div>
            </div>
        );
    }


    return (
        <>
        <div className="w-screen h-screen bg-white flex justify-center items-center p-[15px]">
            <UserNotFound/> 
        </div>
        </>
    )
}
