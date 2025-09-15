import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Content from "./Content";
import Navbar from "./Navbar";
const Dashboard = () => {
  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
};

export default Dashboard;
