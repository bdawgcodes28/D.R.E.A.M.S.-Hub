import Sidebar from "./SideBar";
import Content from "./Content";
import Navbar from "./Navbar";
import { useContext } from "react";
import {UserContext } from "./user_context/context_provider";

const Dashboard = () => {

  const {user, setUser} = useContext(UserContext);

  console.log("made it to dashboard", user);

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex overflow-hidden">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
};

export default Dashboard;
