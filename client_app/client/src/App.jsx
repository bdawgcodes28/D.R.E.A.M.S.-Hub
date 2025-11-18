import { BrowserRouter as Router }  from "react-router-dom"
import { Route, Routes }            from "react-router-dom"

import './App.css'
import HomePage                     from "./pages/HomePage"
import AboutPage                    from "./pages/AboutPage"
import EventsPage                   from "./pages/EventsPage"
import EventItemPage                from "./pages/EventItemPage"
import CalendarApp from "./components/events/CalendarApp"


function App() {

  return (
    <Router>
      <Routes>
        {/* home page | initial route */}
        <Route path="/" element={<HomePage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/events" element={<EventsPage/>}/>
        <Route path="/events/item" element={<EventItemPage/>}/>
        <Route path="/calendar" element={<CalendarApp/>}/>

      </Routes>
    </Router>
  )
}

export default App
