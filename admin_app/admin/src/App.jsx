import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventEdit from "./pages/EventEdit";
import { UserProvider } from "./components/user_context/context_provider";
import ProtectedRoute from "./components/user_context/Protected_Routes";
import Programs from "./pages/Programs";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route path="/" element={ <ProtectedRoute> <Dashboard /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            <Route path="events/create" element={<EventEdit />} />
            <Route path="programs" element={<Programs />} />
            <Route path="events/edit/:id" element={<EventEdit />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
