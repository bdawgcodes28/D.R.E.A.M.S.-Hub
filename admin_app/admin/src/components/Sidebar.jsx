import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";

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
    <nav className="w-full border-b border-gray-300 flex flex-col gap-4 p-6">
      <h1 className="uppercase text-sm font-light tracking-widest text-gray-600">
        {title}
      </h1>
      <ul className="flex flex-col gap-2">{children}</ul>
    </nav>
  );
};

const Sidebar = () => {
  const [user] = useState({ name: "Rocklyn Clarke" });

  return (
    <aside className="text-gray-600 w-72 h-full border-r border-gray-300 bg-white flex flex-col">
      <div className="py-2 px-6 gap-4 items-center w-full border-b  border-gray-300 flex">
        <h1 className="font-semibold grow">{user?.name}</h1>
        <button className="p-1 border rounded-full">

        <FiUser/>
        </button>
      </div>

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
    </aside>
  );
};

export default Sidebar;
