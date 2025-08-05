import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import UsedCars from "./pages/UsedCars";
import NewCars from "./pages/NewCars";
import SellCar from "./pages/SellCar";
import Financing from "./pages/Financing";
import AddAdvertisement from "./pages/AddAdvertisement";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/used-cars" element={<UsedCars />} />
          <Route path="/new-cars" element={<NewCars />} />
          <Route path="/sell-car" element={<SellCar />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/add-advertisement" element={<AddAdvertisement />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
