import { BsCalendar2Event } from "react-icons/bs";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { BsCalendar2DateFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import Tooltip from "../components/Tooltip";
import { LuExternalLink } from "react-icons/lu";
import { Link, NavLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaFileDownload } from "react-icons/fa";
import { Reorder } from "motion/react";
import { useEffect, useState } from "react";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() =>{
    const fetchEvents = async () =>{
      try{

        const response = await fetch(`${BASE_URL}/api/events/fetchEvents`);
        
        return response;

      }
      catch(error){
        console.error("Couldn't load Events:", error)
        return [];
      }

    };
    const data = fetchEvents();
    setEvents(data);

  }, [events])


  return (
    <div className="px-8 gap-2 flex flex-col py-8">
      <div className="w-full flex items-center text-gray-800">
        <h1 className="text-4xl font-semibold grow"> Events</h1>
        <button className="flex items-center text-white text-sm gap-2 p-2 border border-gray-500 bg-gray-400 rounded-lg">
          <FaFileDownload />
          Download CSV
        </button>
      </div>
      <div className="w-full h-18  border-gray-500 text-gray-700 items-center flex gap-4">
        <div className=" flex grow h-8 border rounded-lg p-1 px-2 gap-2 items-center justify-center">
          <CiSearch className="" />
          <input
            type="search"
            placeholder="Search events..."
            className="w-full outline-0 text-xs"
          />
        </div>
        <Tooltip position="bottom" element={<h1>Add Event</h1>}>
          <NavLink
            to={"create"}
            className="h-8 w-10 flex items-center justify-center text-center border rounded-lg border-gray-500"
          >
            +
          </NavLink>
        </Tooltip>
        <div className=" text-xs w-48 h-8 border rounded-lg overflow-clip flex items-center justify-center text-gray-500">
          Filter
        </div>
      </div>
      <div className=" w-full h-96 border rounded-xl border-gray-500 overflow-hidden">
        <div className=" text-sm grid font-semibold grid-cols-4 px-4 py-2 shadow-md hover:shadow-lg transition text-gray-100 bg-gray-600">
          <h1>Name</h1>
          <h1>Location</h1>
          <h1>Date</h1>
        </div>
        <Reorder.Group values={events} onReorder={setEvents} className="w-full h-full flex flex-col overflow-y-scroll  ">
          {events.map((event) => (
            <Reorder.Item
              key={event.id}
              value={event}
              className="group grid grid-cols-4 border-b items-center px-4 p-2 shadow-md hover:shadow-lg  text-gray-500 bg-white"
            >
              <p className="text-xs w-fit">{event.title}</p>
              <p className="text-xs text-gray-600">{event.date}</p>
              <p className="text-xs text-gray-500">{event.location}</p>
              <div className="flex">
                <h1 className="grow flex"></h1>
                <div className="rounded-full flex text-lg items-center justify-center gap-4 w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Tooltip
                    position="bottom"
                    element={
                      <h1 className="flex gap-2 justify-center items-center">
                        View <LuExternalLink />{" "}
                      </h1>
                    }
                  >
                    <button>
                      {" "}
                      <FaEye />
                    </button>{" "}
                  </Tooltip>
                  <Tooltip
                    position="bottom"
                    element={
                      <h1 className="flex gap-2 justify-center items-center">
                        Edit{" "}
                      </h1>
                    }
                  >
                    <button>
                      {" "}
                      <CiEdit />
                    </button>{" "}
                  </Tooltip>
                  <Tooltip
                    position="bottom"
                    element={
                      <h1 className="flex gap-2 justify-center items-center">
                        Remove <LuExternalLink />{" "}
                      </h1>
                    }
                  >
                    <button className="hover:text-red-600 hover:rotate-12 transition">
                      <FaRegTrashCan />
                    </button>{" "}
                  </Tooltip>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default Events;
