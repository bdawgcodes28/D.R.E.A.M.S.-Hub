// Layout.jsx
import { Link, Outlet } from "react-router-dom";

const Content = () => {
  return (
      <main className="flex-1  bg-white overflow-y-scroll">
        <Outlet /> {/* This is where the current page will render */}
      </main>
  );
};

export default Content;
