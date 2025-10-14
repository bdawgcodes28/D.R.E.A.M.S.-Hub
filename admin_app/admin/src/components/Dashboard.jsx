import Sidebar from "./Sidebar";
import Content from "./Content";
import Navbar from "./Navbar";
import { useContext, useState } from "react";
import {UserContext } from "./user_context/context_provider";
import NotificationPanel from "./NotifsPanel";

const Dashboard = () => {

  const {user, setUser} = useContext(UserContext);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col bg-amber-400">
      <Navbar toggleNotifications={() => setNotifPanelOpen((prev) => !prev)} />
      <div className="flex overflow-hidden relative h-full">
      <div className="flex overflow-hidden h-full relative">
        <Sidebar />
        <Content />
        <NotificationPanel setOpen = {() => setNotifPanelOpen((prev) => !prev)} isOpen ={notifPanelOpen} />
      </div>
    </div>
  );
};

export default Dashboard;
