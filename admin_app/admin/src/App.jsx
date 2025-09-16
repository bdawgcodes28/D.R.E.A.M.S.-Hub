import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard wrapper */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Home />} />

          {/* Events + nested route */}
          <Route path="events" element={<Events />}>
            <Route path="create-event" element={<CreateEvent />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
