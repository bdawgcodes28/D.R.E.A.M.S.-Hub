import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login                            from "./pages/Login";
import Dashboard                        from "./components/Dashboard";
import Home                             from "./pages/Home";
import Events                           from "./pages/Events";
import EventEdit                        from "./pages/EventEdit";
import ProtectedRoute                   from "./components/user_context/Protected_Routes";
import RegisterCredentials              from "./pages/RegisterCredentials";
import Programs                         from "./pages/Programs";
import ErrorPopUps from "./components/ErrorPopUps";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          
          {/* Public Routes */}
          <Route path="/test/popup" element={<ErrorPopUps/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register/request" element={<RegisterCredentials />} />

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
