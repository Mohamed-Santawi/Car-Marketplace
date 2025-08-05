import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import BrandFilter from "../components/BrandFilter";
import Features from "../components/Features";
import CarsGrid from "../components/CarsGrid";
import { getCarsWithImages, getCarBrands } from "../services/carService";

const Home = () => {
  const [selectedBrand, setSelectedBrand] = useState("جميع الماركات");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const carsData = await getCarsWithImages();
        const brandsData = getCarBrands();
        setCars(carsData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading cars:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const filteredCars =
    selectedBrand === "جميع الماركات"
      ? cars
      : cars.filter((car) => car.brand === selectedBrand);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <BrandFilter
        selectedBrand={selectedBrand}
        onBrandSelect={setSelectedBrand}
        brands={brands}
      />
      <Features />
      {loading ? (
        <motion.div
          className="py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل السيارات...</p>
        </motion.div>
      ) : (
        <CarsGrid cars={filteredCars} />
      )}
    </motion.div>
  );
};

export default Home;
