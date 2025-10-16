import { useContext, useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { UserContext, useUser } from "./user_context/context_provider";
import { MdAccountCircle } from "react-icons/md";

const Link = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        ` capitalize px-2 text-sm block py-1 rounded hover:bg-gray-100 transition ${
          isActive ? "font-medium text-gray-800 bg-gray-50" : "text-gray-500"
        }`
      }
    >
      {children}
    </NavLink>
  );
};

const Section = ({ title, children }) => {
  return (
    <nav className="w-full border-t border-gray-300 flex flex-col gap-4 p-6">
      <h1 className="uppercase text-sm font-light tracking-widest text-gray-600">
        {title}
      </h1>
      <ul className="flex flex-col gap-2">{children}</ul>
    </nav>
  );
};

const Sidebar = () => {
    const {user}   = useContext(UserContext);
  
  useEffect(() =>
  {
    console.log(user)

  }, [user])
  return (
    <aside className="text-gray-600 w-72 h-full border-r border-gray-300 bg-white flex flex-col">
      

      <div className="w-full h-full overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Section title="Management">
            <Link to="/events">Events</Link>
            <Link to="/programs">Programs</Link>
        </Section>
        <Section title="Financials">
            <Link to="/grants">Grants</Link>
            <Link to="/donations">Donations</Link>
        </Section>
        <Section title="Alerts">
            <Link to="/inbox">Inbox</Link>
            <Link to="/backlogs">Backlogs</Link>
        </Section>
      </div>
      <div className=" transform hover:bg-gray-200 duration-300 hover:cursor-pointer h-18 py-2 px-4 gap-4 items-center w-full border-t  border-gray-300 flex">
        <button className="p-1 border rounded-full">
          {user.token.picture ?
            // checks if user image is available
            <img
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              console.log("Image failed to load");
              }}
              src={user.token.picture}
              crossOrigin="anonymous"
              referrerpolicy="no-referrer"
            />
            :
            // if not user image render generic account icon
            <MdAccountCircle className="size-full"/>
        }
        </button>
        <div className=" truncate grow">
          <div className="capitalize flex gap-1">
          <h1 className="text-sm font-semibold truncate">{user?.token?.first_name} </h1>
          <h1 className="text-sm font-semibold truncate">{user?.token?.lastName}</h1>
          </div>
          <h1 className="text-xs truncate">{user?.token?.email}</h1>
        </div>
        
      </div>
    </aside>
  );
};

export default Sidebar;
