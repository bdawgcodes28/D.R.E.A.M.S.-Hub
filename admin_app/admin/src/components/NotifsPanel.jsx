import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Reorder } from "motion/react";
import { FaDotCircle } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";

const NotificationPanel = ({ setOpen, isOpen }) => {
  const [notifications, setNotifications] = useState([
    "Notification A",
    "Notification B",
    "Notification C",
    "Notification D",
    "Notification E",
  ]);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        isOpen
      ) {
        setOpen();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpen]);

  const removeNotification = (idx) => {
    setNotifications((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div
      ref={panelRef}
      className={`w-80 p-4 border-l transition bg-neutral-500/10 border-gray-300 h-full backdrop-blur-xs absolute flex right-0 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <Reorder.Group
        values={notifications}
        onReorder={setNotifications}
        as="ol"
        className="w-full h-full text-gray-500 p-2 space-y-4 scrollbar_hide overflow-y-scroll"
      >
        {notifications.length > 0 ? (
          notifications.map((item, idx) => (
            <Reorder.Item key={item} value={item} className="w-full">
              <div className="bg-white shadow border-gray-300 w-full h-32 flex flex-col rounded-lg relative p-2 hover:cursor-pointer hover:scale-105 transform duration-200">
                <h1 className=" text-sm font-semibold tracking-widest truncate ">
                  {item}
                </h1>
                <h1 className="text-gray-400 tracking-widest text-xs line-clamp-2">
                  {" "}
                  Hi! My name is GiggaNigga, I wanted to know what you program
                  has to offer in terms of stem services.{" "}
                </h1>
                <button
                  onClick={() => removeNotification(idx)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
                >
                  <IoIosCloseCircleOutline size={24} />
                </button>
                <div className=" text-gray-400 bottom-2 right-2 absolute flex gap-2 items-center text-xs">
                  <h1 className="tracking-widest truncate"> 9/18/2025 </h1>
                  <FaDotCircle size={12} />
                </div>
                <MdOutlineMessage
                  className="absolute left-2 bottom-2 text-gray-300"
                  size={24}
                />
              </div>
            </Reorder.Item>
          ))
        ) : (
          <div className="w-full h-full items-center justify-center flex">
            <h1>No Notifications</h1>
          </div>
        )}
      </Reorder.Group>
    </div>
  );
};

export default NotificationPanel;
