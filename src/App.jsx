import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import UsedCars from "./pages/UsedCars";
import NewCars from "./pages/NewCars";
import SearchCars from "./pages/SearchCars";
import SellCar from "./pages/SellCar";
import AddAdvertisement from "./pages/AddAdvertisement";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPayments from "./pages/AdminPayments";
import AdminPackages from "./pages/AdminPackages";
import AdminSetup from "./pages/AdminSetup";
import FirestoreTest from "./pages/FirestoreTest";
import TestSetup from "./pages/TestSetup";
import PaidAdvertisements from "./pages/PaidAdvertisements";
import Payment from "./pages/Payment";
import Financing from "./pages/Financing";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="used-cars" element={<UsedCars />} />
          <Route path="new-cars" element={<NewCars />} />
          <Route path="search-cars" element={<SearchCars />} />
          <Route path="sell-car" element={<SellCar />} />
          <Route path="add-advertisement" element={<AddAdvertisement />} />
          <Route path="login" element={<Login />} />
          <Route path="paid-advertisements" element={<PaidAdvertisements />} />
          <Route path="payment/:packageId" element={<Payment />} />
          <Route path="financing" element={<Financing />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/setup" element={<AdminSetup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/packages" element={<AdminPackages />} />

        {/* Test Routes */}
        <Route path="/firestore-test" element={<FirestoreTest />} />
        <Route path="/test-setup" element={<TestSetup />} />
      </Routes>
    </Router>
  );
}

export default App;
