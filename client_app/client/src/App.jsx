import { BrowserRouter as Router } from "react-router-dom"
import { Route, Routes } from "react-router-dom"

import './App.css'
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import Events from "./pages/Events"

function App() {

  return (
    <Router>
      <Routes>
        {/* home page | initial route */}
        <Route path="/" element={<HomePage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/events" element={<Events/>}/>

        

      </Routes>
    </Router>
  )
}

export default App
