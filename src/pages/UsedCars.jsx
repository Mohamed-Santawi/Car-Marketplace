import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CarsGrid from "../components/CarsGrid";
import PaidAdCard from "../components/PaidAdCard";
import { getApprovedCarAdvertisements, getCarBrands, getPaidAdvertisements } from "../services/carService";
import TopBrands from "../components/TopBrands";

const UsedCars = () => {
  const [filters, setFilters] = useState({
    brand: "جميع الماركات",
    priceRange: "all",
    year: "all",
    mileage: "all",
  });
  const [cars, setCars] = useState([]);
  const [paidAds, setPaidAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filteredPaidAds, setFilteredPaidAds] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        console.log("=== LOADING USED CARS ===");

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
        setBrands(getCarBrands());
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const handleFilterChange = async (filterType, value) => {
    console.log("=== FILTERING USED CARS ===");
    console.log("Filter type:", filterType, "Value:", value);

    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);

    try {
      // Filter the cars based on the new filters
      let filtered = [...cars];
      let filteredPaid = [...paidAds];

      // Brand filter
      if (newFilters.brand !== "جميع الماركات") {
        filtered = filtered.filter(car => car.brand === newFilters.brand);
        filteredPaid = filteredPaid.filter(ad => ad.brand === newFilters.brand);
        console.log("After brand filter - Regular cars:", filtered.length);
        console.log("After brand filter - Paid ads:", filteredPaid.length);
      }

      // Price range filter
      if (newFilters.priceRange !== "all") {
        filtered = filtered.filter(car => {
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

        filteredPaid = filteredPaid.filter(ad => {
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

      // Year filter
      if (newFilters.year !== "all") {
        filtered = filtered.filter(car => car.year === newFilters.year);
        filteredPaid = filteredPaid.filter(ad => ad.year === newFilters.year);
        console.log("After year filter - Regular cars:", filtered.length);
        console.log("After year filter - Paid ads:", filteredPaid.length);
      }

      // Mileage filter
      if (newFilters.mileage !== "all") {
        filtered = filtered.filter(car => {
          const carMileage = Number(car.mileage) || 0;
          switch (newFilters.mileage) {
            case "under50k":
              return carMileage < 50000;
            case "50k-100k":
              return carMileage >= 50000 && carMileage <= 100000;
            case "over100k":
              return carMileage > 100000;
            default:
              return true;
          }
        });

        filteredPaid = filteredPaid.filter(ad => {
          const adMileage = Number(ad.mileage) || 0;
          switch (newFilters.mileage) {
            case "under50k":
              return adMileage < 50000;
            case "50k-100k":
              return adMileage >= 50000 && adMileage <= 100000;
            case "over100k":
              return adMileage > 100000;
            default:
              return true;
          }
        });

        console.log("After mileage filter - Regular cars:", filtered.length);
        console.log("After mileage filter - Paid ads:", filteredPaid.length);
      }

      console.log("Final filtered results - Regular cars:", filtered.length);
      console.log("Final filtered results - Paid ads:", filteredPaid.length);
      setFilteredCars(filtered);
      setFilteredPaidAds(filteredPaid);
    } catch (error) {
      console.error("Error filtering cars:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          السيارات المستعملة
        </motion.h1>

        {/* Top Brands quick filter */}
        <TopBrands
          onSelectBrand={(brandAr) => handleFilterChange("brand", brandAr)}
        />

        {/* Filters */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4">فلاتر البحث</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">الماركة</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="جميع الماركات">جميع الماركات</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                نطاق السعر
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الأسعار</option>
                <option value="under10k">أقل من 10,000 ريال</option>
                <option value="10k-25k">10,000 - 25,000 ريال</option>
                <option value="25k-50k">25,000 - 50,000 ريال</option>
                <option value="50k-75k">50,000 - 75,000 ريال</option>
                <option value="75k-100k">75,000 - 100,000 ريال</option>
                <option value="100k-150k">100,000 - 150,000 ريال</option>
                <option value="150k-200k">150,000 - 200,000 ريال</option>
                <option value="200k-300k">200,000 - 300,000 ريال</option>
                <option value="300k-400k">300,000 - 400,000 ريال</option>
                <option value="400k-500k">400,000 - 500,000 ريال</option>
                <option value="over500k">أكثر من 500,000 ريال</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                سنة الصنع
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع السنوات</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
              </select>
            </div>

            {/* Mileage Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                المسافة المقطوعة
              </label>
              <select
                value={filters.mileage}
                onChange={(e) => handleFilterChange("mileage", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع المسافات</option>
                <option value="under50k">أقل من 50,000 كم</option>
                <option value="50k-100k">50,000 - 100,000 كم</option>
                <option value="over100k">أكثر من 100,000 كم</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Paid Advertisements Section */}
        {filteredPaidAds.length > 0 && (
          <motion.section
            className="mb-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-white"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                إعلانات مدفوعة مميزة
                {filters.brand !== "جميع الماركات" && ` - ${filters.brand}`}
              </h2>
              <p className="text-lg text-gray-600">
                إعلانات متميزة مع مميزات خاصة
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-600">
            تم العثور على {filteredCars.length} سيارة عادية و {filteredPaidAds.length} إعلان مدفوع
          </p>
        </motion.div>

        {/* Regular Cars Grid */}
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
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <CarsGrid
              title={`السيارات المستعملة المعتمدة${
                filters.brand !== "جميع الماركات" ? ` - ${filters.brand}` : ""
              }`}
              cars={filteredCars}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UsedCars;
