import { FiPlus } from "react-icons/fi"
import { NavLink } from "react-router-dom"
const Home = () =>{

    return(
        <>
        <div className="w-full p-4 border-b gap-2 flex border-gray-300 items-center text-xl text-gray-600 ">
                <h1 className="grow">Admin Panel</h1>
                <div className="flex gap-2 text-sm ">
                <h1 className="">Donations: </h1>
                <h1 className="">0</h1>
                <h1 className="text-gray-300">|</h1>
                <h1 className="">Subscriptions: </h1>
                <h1 className="">0</h1>
                <h1 className="text-gray-300">|</h1>
                <h1 className="">Reservations: </h1>
                <h1 className="">0</h1>
            
                </div>
        </div>
        <div className="w-full p-8 scrollbar_hide border-b gap-8 flex overflow-x-scroll border-gray-300 items-center text-sm text-gray-600" >
            <NavLink className=" transform-all duration-200 hover:shadow-gray-400 shadow-gray-300 min-w-48 h-32 shadow-md rounded-2xl items-center justify-center flex flex-col">
                <h1>Create Event</h1>
            </NavLink>
            <NavLink className=" transform-all duration-200 hover:shadow-gray-400 shadow-gray-300 min-w-48 h-32 shadow-md rounded-2xl items-center justify-center flex flex-col">
                <h1>Email Blast</h1>
            </NavLink>
            <NavLink className=" transform-all duration-200 hover:shadow-gray-400 shadow-gray-300 min-w-48 h-32 shadow-md rounded-2xl items-center justify-center flex flex-col">
                <h1>Donations Watch</h1>
            </NavLink>
            <NavLink className=" transform-all duration-200 hover:shadow-gray-400 shadow-gray-300 min-w-48 h-32 shadow-md rounded-2xl items-center justify-center flex flex-col">
                <h1>Usage</h1>
            </NavLink>
            <NavLink className=" transform-all duration-200 hover:shadow-gray-400 shadow-gray-300 min-w-48 h-32 shadow-md rounded-2xl items-center justify-center flex flex-col">
                <h1>Settings</h1>
            </NavLink>
        </div>
        </>
    )

}

export default Home