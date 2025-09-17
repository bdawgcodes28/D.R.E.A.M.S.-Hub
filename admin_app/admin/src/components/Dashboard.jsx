import Sidebar from "./SideBar";
import Content from "./Content";
import Navbar from "./Navbar";

const Dashboard = () => {
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
