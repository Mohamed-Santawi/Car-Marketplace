import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchSidebar from "../components/SearchSidebar";
import SearchResults from "../components/SearchResults";
import TopBrands from "../components/TopBrands";
import PaidAdCard from "../components/PaidAdCard";
import {
  getApprovedCarAdvertisements,
  getPaidAdvertisements,
} from "../services/carService";

const SearchCars = () => {
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    priceRange: "",
    bodyType: "",
    mileage: "",
    accidents: "",
    features: [],
  });

  const [cars, setCars] = useState([]);
  const [paidAds, setPaidAds] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filteredPaidAds, setFilteredPaidAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        console.log("=== LOADING SEARCH CARS ===");

        // Get approved car advertisements and paid advertisements
        const [carsData, paidAdsData] = await Promise.all([
          getApprovedCarAdvertisements(),
          getPaidAdvertisements(),
        ]);

        console.log("Approved cars data:", carsData);
        console.log("Paid ads data:", paidAdsData);

        // Filter out paid advertisements from regular cars
        const regularCars = carsData.filter((car) => !car.isPaid);
        console.log("Regular cars (excluding paid):", regularCars.length);

        setCars(regularCars);
        setFilteredCars(regularCars);
        setPaidAds(paidAdsData);
        setFilteredPaidAds(paidAdsData);
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const handleFilterChange = (newFilters) => {
    console.log("=== FILTERING CARS ===");
    console.log("New filters:", newFilters);

    setFilters(newFilters);

    // Filter cars based on new filters
    let filtered = [...cars];
    let filteredPaid = [...paidAds];

    // Brand/Make filter
    if (newFilters.make) {
      filtered = filtered.filter(
        (car) =>
          car.brand &&
          car.brand.toLowerCase().includes(newFilters.make.toLowerCase())
      );
      filteredPaid = filteredPaid.filter(
        (ad) =>
          ad.brand &&
          ad.brand.toLowerCase().includes(newFilters.make.toLowerCase())
      );
      console.log("After brand filter - Regular cars:", filtered.length);
      console.log("After brand filter - Paid ads:", filteredPaid.length);
    }

    // Model filter
    if (newFilters.model) {
      filtered = filtered.filter(
        (car) =>
          car.model &&
          car.model.toLowerCase().includes(newFilters.model.toLowerCase())
      );
      filteredPaid = filteredPaid.filter(
        (ad) =>
          ad.model &&
          ad.model.toLowerCase().includes(newFilters.model.toLowerCase())
      );
      console.log("After model filter - Regular cars:", filtered.length);
      console.log("After model filter - Paid ads:", filteredPaid.length);
    }

    // Year filter
    if (newFilters.year) {
      filtered = filtered.filter((car) => car.year === newFilters.year);
      filteredPaid = filteredPaid.filter((ad) => ad.year === newFilters.year);
      console.log("After year filter - Regular cars:", filtered.length);
      console.log("After year filter - Paid ads:", filteredPaid.length);
    }

    // Price range filter
    if (newFilters.priceRange) {
      filtered = filtered.filter((car) => {
        const carPrice = Number(car.price);
        switch (newFilters.priceRange) {
          case "under10k":
            return carPrice < 10000;
          case "10k-25k":
            return carPrice >= 10000 && carPrice <= 25000;
          case "25k-50k":
            return carPrice >= 25000 && carPrice <= 50000;
          case "50k-75k":
            return carPrice >= 50000 && carPrice <= 75000;
          case "75k-100k":
            return carPrice >= 75000 && carPrice <= 100000;
          case "100k-150k":
            return carPrice >= 100000 && carPrice <= 150000;
          case "150k-200k":
            return carPrice >= 150000 && carPrice <= 200000;
          case "200k-300k":
            return carPrice >= 200000 && carPrice <= 300000;
          case "300k-400k":
            return carPrice >= 300000 && carPrice <= 400000;
          case "400k-500k":
            return carPrice >= 400000 && carPrice <= 500000;
          case "over500k":
            return carPrice > 500000;
          default:
            return true;
        }
      });

      filteredPaid = filteredPaid.filter((ad) => {
        const adPrice = Number(ad.price);
        switch (newFilters.priceRange) {
          case "under10k":
            return adPrice < 10000;
          case "10k-25k":
            return adPrice >= 10000 && adPrice <= 25000;
          case "25k-50k":
            return adPrice >= 25000 && adPrice <= 50000;
          case "50k-75k":
            return adPrice >= 50000 && adPrice <= 75000;
          case "75k-100k":
            return adPrice >= 75000 && adPrice <= 100000;
          case "100k-150k":
            return adPrice >= 100000 && adPrice <= 150000;
          case "150k-200k":
            return adPrice >= 150000 && adPrice <= 200000;
          case "200k-300k":
            return adPrice >= 200000 && adPrice <= 300000;
          case "300k-400k":
            return adPrice >= 300000 && adPrice <= 400000;
          case "400k-500k":
            return adPrice >= 400000 && adPrice <= 500000;
          case "over500k":
            return adPrice > 500000;
          default:
            return true;
        }
      });

      console.log("After price filter - Regular cars:", filtered.length);
      console.log("After price filter - Paid ads:", filteredPaid.length);
    }

    // Body type filter
    if (newFilters.bodyType) {
      filtered = filtered.filter(
        (car) =>
          car.bodyType &&
          car.bodyType.toLowerCase().includes(newFilters.bodyType.toLowerCase())
      );
      filteredPaid = filteredPaid.filter(
        (ad) =>
          ad.bodyType &&
          ad.bodyType.toLowerCase().includes(newFilters.bodyType.toLowerCase())
      );
      console.log("After body type filter - Regular cars:", filtered.length);
      console.log("After body type filter - Paid ads:", filteredPaid.length);
    }

    // Mileage filter
    if (newFilters.mileage && newFilters.mileage !== "0") {
      const maxMileage = Number(newFilters.mileage);
      filtered = filtered.filter((car) => {
        const carMileage = Number(car.mileage) || 0;
        return carMileage <= maxMileage;
      });
      filteredPaid = filteredPaid.filter((ad) => {
        const adMileage = Number(ad.mileage) || 0;
        return adMileage <= maxMileage;
      });
      console.log("After mileage filter - Regular cars:", filtered.length);
      console.log("After mileage filter - Paid ads:", filteredPaid.length);
    }

    // Accidents filter
    if (newFilters.accidents) {
      filtered = filtered.filter((car) => {
        const carAccidents = Number(car.accidents) || 0;
        switch (newFilters.accidents) {
          case "none":
            return carAccidents === 0;
          case "one":
            return carAccidents === 1;
          case "multiple":
            return carAccidents > 1;
          default:
            return true;
        }
      });
      filteredPaid = filteredPaid.filter((ad) => {
        const adAccidents = Number(ad.accidents) || 0;
        switch (newFilters.accidents) {
          case "none":
            return adAccidents === 0;
          case "one":
            return adAccidents === 1;
          case "multiple":
            return adAccidents > 1;
          default:
            return true;
        }
      });
      console.log("After accidents filter - Regular cars:", filtered.length);
      console.log("After accidents filter - Paid ads:", filteredPaid.length);
    }

    // Features filter
    if (newFilters.features && newFilters.features.length > 0) {
      filtered = filtered.filter((car) => {
        if (!car.features || !Array.isArray(car.features)) return false;
        return newFilters.features.every((feature) =>
          car.features.some((carFeature) =>
            carFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
      });
      filteredPaid = filteredPaid.filter((ad) => {
        if (!ad.features || !Array.isArray(ad.features)) return false;
        return newFilters.features.every((feature) =>
          ad.features.some((adFeature) =>
            adFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
      });
      console.log("After features filter - Regular cars:", filtered.length);
      console.log("After features filter - Paid ads:", filteredPaid.length);
    }

    console.log("Final filtered results - Regular cars:", filtered.length);
    console.log("Final filtered results - Paid ads:", filteredPaid.length);
    setFilteredCars(filtered);
    setFilteredPaidAds(filteredPaid);
  };

  const handleBrandSelect = (brandNameAr) => {
    const newFilters = { ...filters, make: brandNameAr };
    setFilters(newFilters);
    handleFilterChange(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Popular Brands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TopBrands onSelectBrand={handleBrandSelect} />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.div
            className="lg:w-1/4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SearchSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </motion.div>

          {/* Results */}
          <div className="lg:w-3/4">
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
              <>
                {/* Results Summary */}
                <motion.div
                  className="mb-6 p-4 bg-white rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-gray-600">
                    تم العثور على {filteredCars.length} سيارة عادية و{" "}
                    {filteredPaidAds.length} إعلان مدفوع
                  </p>
                </motion.div>

                {/* Paid Advertisements Section */}
                {filteredPaidAds.length > 0 && (
                  <motion.section
                    className="mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="text-center mb-6"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-3">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        إعلانات مدفوعة مميزة
                      </h2>
                      <p className="text-gray-600">
                        إعلانات متميزة مع مميزات خاصة
                      </p>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      {filteredPaidAds.map((ad) => (
                        <PaidAdCard key={ad.id} ad={ad} />
                      ))}
                    </motion.div>
                  </motion.section>
                )}

                {/* Regular Cars Results */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <SearchResults cars={filteredCars} />
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCars;
