/**
 * @author Elias Lopes
 * @Date   10/2/2025
 * @description 
 *  This file will hold all error pop ups
 */
import React from 'react'

export default function ErrorPopUps(popUp) {


    const UserNotFound = () => {
        return (
            <div 
            className="w-[80%] max-w-[300px] h-[20%] max-h-[80px] border-2 border-black bg-red-400"></div>
        );
    }


    return (
        <>
        <div className="w-screen h-screen bg-white flex justify-center items-baseline p-[15px]">
            <UserNotFound/> 
        </div>
        </>
    )
}
