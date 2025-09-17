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

const Events = () => {
  const events = [
    { id: 1, title: "Hackathon", date: "2025-09-20", location: "Tech Center" },
    { id: 2, title: "AI Workshop", date: "2025-09-25", location: "Room 204" },
    { id: 3, title: "Startup Pitch", date: "2025-10-01", location: "Auditorium" },
    { id: 4, title: "Networking Night", date: "2025-10-05", location: "Cafe Hub" },
    { id: 1, title: "Hackathon", date: "2025-09-20", location: "Tech Center" },
    { id: 2, title: "AI Workshop", date: "2025-09-25", location: "Room 204" },
    { id: 3, title: "Startup Pitch", date: "2025-10-01", location: "Auditorium" },
    { id: 4, title: "Networking Night", date: "2025-10-05", location: "Cafe Hub" },
    { id: 1, title: "Hackathon", date: "2025-09-20", location: "Tech Center" },
    { id: 2, title: "AI Workshop", date: "2025-09-25", location: "Room 204" },
    { id: 3, title: "Startup Pitch", date: "2025-10-01", location: "Auditorium" },
    { id: 4, title: "Networking Night", date: "2025-10-05", location: "Cafe Hub" },
    { id: 1, title: "Hackathon", date: "2025-09-20", location: "Tech Center" },
    { id: 2, title: "AI Workshop", date: "2025-09-25", location: "Room 204" },
    { id: 3, title: "Startup Pitch", date: "2025-10-01", location: "Auditorium" },
    { id: 4, title: "Networking Night", date: "2025-10-05", location: "Cafe Hub" },
    { id: 1, title: "Hackathon", date: "2025-09-20", location: "Tech Center" },
    { id: 2, title: "AI Workshop", date: "2025-09-25", location: "Room 204" },
    { id: 3, title: "Startup Pitch", date: "2025-10-01", location: "Auditorium" },
    { id: 4, title: "Networking Night", date: "2025-10-05", location: "Cafe Hub" },
  ];

  return (
    <>
      <div className="w-full h-18 border-b border-gray-500 text-gray-700 items-center flex p-4 gap-4">
        <h1 className="text-3xl font-semibold">
          <BsCalendar2Event />
        </h1>
        <input
          type="search"
          placeholder="Search events..."
          className="grow h-10 border rounded-full p-2 px-4"
        />
        <Tooltip position="bottom" element={<h1>Add Event</h1>}>
        <NavLink to={"create"} className="h-10 w-12 flex items-center justify-center text-center border rounded-full border-gray-500">
            +
        </NavLink>
        </Tooltip>
        <div className="w-48 h-10 border rounded-full overflow-clip flex items-center justify-center text-gray-500">
          Filter
        </div>
      </div>

        <div className="border grid font-bold grid-cols-4 p-2 shadow-md hover:shadow-lg transition text-gray-500 bg-gray-100">
            <h1>Name</h1>
            <h1>Location</h1>
            <h1>Date</h1>
        </div>
      <ul className="w-full flex flex-col">
        {events.map((event) => (
            
          <li
            key={event.id}
            className="border grid grid-cols-4 items-center p-3 shadow-md hover:shadow-lg transition text-gray-500 bg-white"
          >
            <p className="text-sm  w-fit ">{event.title}</p>
            <p className="text-sm text-gray-600">{event.date}</p>
            <p className="text-sm text-gray-500">{event.location}</p>
            <div className="flex">
            <h1 className="grow flex"></h1>
            <div className="flex border rounded-full justify-end px-4 py-2 gap-4 text-xl w-fit">
                <Tooltip element={<h1 className="flex gap-2 justify-center items-center">View <LuExternalLink/> </h1>}><button> <FaEye/></button> </Tooltip>
                <Tooltip element={<h1 className="flex gap-2 justify-center items-center">Edit </h1>}><button> <CiEdit/></button> </Tooltip>
                <Tooltip element={<h1 className="flex gap-2 justify-center items-center">Remove <LuExternalLink/> </h1>}><button className="hover:text-red-600 hover:rotate-12 transition"><FaRegTrashCan/></button> </Tooltip>
            </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Events;
