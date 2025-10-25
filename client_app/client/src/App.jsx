import { BrowserRouter as Router } from "react-router-dom"
import { Route, Routes } from "react-router-dom"

import './App.css'
import HomePage from "./pages/HomePage"

function App() {

  return (
    <Router>
      <Routes>
        {/* home page | initial route */}
        <Route path="/" element={<HomePage/>}/>

        

      </Routes>
    </Router>
  )
}

export default App
