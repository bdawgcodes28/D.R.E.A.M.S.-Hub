import { useState } from "react";
import { FiX, FiMenu } from "react-icons/fi";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({name: "Rocklyn Clarke"})

  return (
    <nav className=" bg-white w-full h-12 border-b text-gray-500 border-gray-300 flex items-center justify-between px-6 py-3">
      <div className="flex items-center h-full grow">
        <img src="./logo.png" alt="Logo" className="h-full object-contain"/>
      </div>
      <div className="flex gap-4">
        <button className="transition-all duration-200 bg-white active:bg-gray-200 hover:bg-gray-100 p-1 w-12 items-center justify-center flex border rounded-full">
            <FiBell/>
        </button>
        <button className=" transition-all duration-200 bg-white active:bg-gray-200 hover:bg-gray-100 p-1 w-12 border rounded-full">
           {user?.name[0]}
        </button>

      </div>

    </nav>
  );
};

export default Navbar;
