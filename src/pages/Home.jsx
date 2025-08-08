import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import BrandFilter from "../components/BrandFilter";
import Features from "../components/Features";
import CarsGrid from "../components/CarsGrid";
import PromotedAds from "../components/PromotedAds";
import { getCarsWithImages, getCarBrands } from "../services/carService";

const Home = () => {
  const [selectedBrand, setSelectedBrand] = useState("جميع الماركات");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  // Sample promoted ads data
  const promotedAds = [
    {
      id: 1,
      title: "تويوتا كامري 2022 - حالة ممتازة",
      price: 85000,
      year: 2022,
      mileage: 45000,
      location: "الرياض",
      date: "منذ يومين",
      promotionLevel: "vip",
      image: null,
    },
    {
      id: 2,
      title: "هيونداي النترا 2021 - فحص كامل",
      price: 65000,
      year: 2021,
      mileage: 32000,
      location: "جدة",
      date: "منذ 3 أيام",
      promotionLevel: "premium",
      image: null,
    },
    {
      id: 3,
      title: "نيسان صني 2020 - اقتصادية",
      price: 45000,
      year: 2020,
      mileage: 28000,
      location: "الدمام",
      date: "منذ أسبوع",
      promotionLevel: "basic",
      image: null,
    },
  ];

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const carsData = await getCarsWithImages();
        const brandsData = getCarBrands();
        setCars(carsData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading cars:", error);
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

      {/* Promoted Ads Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PromotedAds ads={promotedAds} title="إعلانات مميزة" />
      </div>

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
