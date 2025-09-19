import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useUser } from "./user_context/context_provider";

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
  const {user} = useUser()
  //const [user] = useState({ name: "Rocklyn Clarke", email : "rocklyn.clarke1@gmail.com" });
  useEffect(() =>
  {
    console.log(user)

  }, [user])
  return (
    <aside className="text-gray-600 w-72 h-full border-r border-gray-300 bg-white flex flex-col">
      

      <div className="w-full h-full overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Section title="Management">
            <Link to="/events">Events</Link>
            <Link to="/schemas">Schemas</Link>
            <Link to="/function">Fuctions</Link>
            <Link to="/types">Enumerated Types</Link>
            <Link to="/extensions">Extensions</Link>
            <Link to="/indexes">Indexes</Link>
            <Link to="/publications">Publications</Link>
        </Section>
        <Section title="Configuration">
            <Link to="/roles">Roles</Link>
            <Link to="/policies">Policies</Link>
            <Link to="/settins">Settings</Link>
        </Section>
        <Section title="Platform">
            <Link to="/backups">Backups</Link>
            <Link to="/migrations">Migrations</Link>
            <Link to="/wrappers">Wrappers</Link>
            <Link to="/webhooks">Webhooks</Link>
        </Section>
      </div>
      <div className=" transform hover:bg-gray-200 duration-300 hover:cursor-pointer h-18 py-2 px-4 gap-4 items-center w-full border-t  border-gray-300 flex">
        <button className="p-1 border rounded-full">

        <FiUser size={24}/>
        </button>
        <div className=" truncate grow">
          <div className="capitalize flex gap-1">
          <h1 className="text-sm font-semibold truncate">{user?.first_name} </h1>
          <h1 className="text-sm font-semibold truncate">{user?.last_name}</h1>
          </div>
          <h1 className="text-xs truncate">{user?.email}</h1>
        </div>
        
      </div>
    </aside>
  );
};

export default Sidebar;
