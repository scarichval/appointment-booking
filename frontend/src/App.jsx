import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientBooking from "./components/ClientBooking";
import BarberView from "./components/BarberView";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route> path="/" element={ <ClientBooking /> } </Route>
        <Route> path="/barber" element={  <BarberView /> } </Route>
      </Routes>
    </Router>
  )
 
}

export default App;
