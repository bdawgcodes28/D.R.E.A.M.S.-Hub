import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventEdit from "./pages/EventEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/create" element={<EventEdit />} />
          <Route path="events/edit" element={<EventEdit />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
