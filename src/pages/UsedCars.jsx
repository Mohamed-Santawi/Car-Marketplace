import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CarsGrid from "../components/CarsGrid";
import { getUsedCars, searchCars } from "../services/carService";

const UsedCars = () => {
  const [filters, setFilters] = useState({
    brand: "جميع الماركات",
    priceRange: "all",
    year: "all",
    mileage: "all",
  });
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const carsData = await getUsedCars();
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (error) {
        console.error('Error loading cars:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const handleFilterChange = async (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);

    try {
      const filtered = await searchCars('', newFilters);
      setFilteredCars(filtered);
    } catch (error) {
      console.error('Error filtering cars:', error);
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
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="جميع الماركات">جميع الماركات</option>
                <option value="هيونداي">هيونداي</option>
                <option value="تويوتا">تويوتا</option>
                <option value="نيسان">نيسان</option>
                <option value="فيات">فيات</option>
                <option value="بي ام دبليو">بي ام دبليو</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">نطاق السعر</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الأسعار</option>
                <option value="under50k">أقل من 50,000 ريال</option>
                <option value="50k-100k">50,000 - 100,000 ريال</option>
                <option value="over100k">أكثر من 100,000 ريال</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">سنة الصنع</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع السنوات</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>

            {/* Mileage Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">المسافة المقطوعة</label>
              <select
                value={filters.mileage}
                onChange={(e) => handleFilterChange('mileage', e.target.value)}
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

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-600">
            تم العثور على {filteredCars.length} سيارة
          </p>
        </motion.div>

        {/* Cars Grid */}
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
      </div>
    </motion.div>
  );
};

export default UsedCars;
