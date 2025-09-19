import Sidebar from "./SideBar";
import Content from "./Content";
import Navbar from "./Navbar";
import { useState } from "react";
import NotificationPanel from "./NotifsPanel";

const Dashboard = () => {

  const [notifPanelOpen, setNotifPanelOpen] = useState(false)

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar toggleNotifications={() => setNotifPanelOpen((prev) => !prev)} />
      <div className="flex overflow-hidden relative">
        <Sidebar />
        <Content />
        <NotificationPanel setOpen = {() => setNotifPanelOpen((prev) => !prev)} isOpen ={notifPanelOpen} />
      </div>
    </div>
  );
};

export default Dashboard;
