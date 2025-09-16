import { BsCalendar2Event } from "react-icons/bs";


const Events = () => {

    return(
        <>
        <div className="w-full h-24 border-b border-gray-500 text-gray-700 items-center flex p-8 gap-8">
            <h1 className="text-4xl font-semibold"><BsCalendar2Event/></h1>
            <input type="search" className="w-full h-12 border rounded-full p-2">
            
            </input>
            <div className="w-64 h-12 border rounded-full overflow-clip">
                


            </div>

            
        </div>
        </>
    )

}


export default Events;
