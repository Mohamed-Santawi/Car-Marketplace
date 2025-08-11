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
        console.error("Error loading cars:", error);
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
      const filtered = await searchCars("", newFilters);
      setFilteredCars(filtered);
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
                <option value="هيونداي">هيونداي</option>
                <option value="تويوتا">تويوتا</option>
                <option value="نيسان">نيسان</option>
                <option value="فيات">فيات</option>
                <option value="بي ام دبليو">بي ام دبليو</option>
                <option value="مرسيدس">مرسيدس</option>
                <option value="فورد">فورد</option>
                <option value="مازدا">مازدا</option>
                <option value="لكزس">لكزس</option>
                <option value="شفروليه">شفروليه</option>
                <option value="ام جي">ام جي</option>
                <option value="رينو">رينو</option>
                <option value="سوزوكي">سوزوكي</option>
                <option value="شانجان">شانجان</option>
                <option value="كيا">كيا</option>
                <option value="أودي">أودي</option>
                <option value="فولكس فاجن">فولكس فاجن</option>
                <option value="سكودا">سكودا</option>
                <option value="سيات">سيات</option>
                <option value="بيجو">بيجو</option>
                <option value="سيتروين">سيتروين</option>
                <option value="أوبل">أوبل</option>
                <option value="فولفو">فولفو</option>
                <option value="ساب">ساب</option>
                <option value="جاكوار">جاكوار</option>
                <option value="لاند روفر">لاند روفر</option>
                <option value="ميني">ميني</option>
                <option value="رولز رويس">رولز رويس</option>
                <option value="بنتلي">بنتلي</option>
                <option value="أستون مارتن">أستون مارتن</option>
                <option value="مكلارين">مكلارين</option>
                <option value="لوتس">لوتس</option>
                <option value="ألفا روميو">ألفا روميو</option>
                <option value="مازيراتي">مازيراتي</option>
                <option value="لامبورغيني">لامبورغيني</option>
                <option value="فيراري">فيراري</option>
                <option value="بورش">بورش</option>
                <option value="كاديلاك">كاديلاك</option>
                <option value="لينكولن">لينكولن</option>
                <option value="بونتياك">بونتياك</option>
                <option value="ساترن">ساترن</option>
                <option value="هوندا">هوندا</option>
                <option value="ميتسوبيشي">ميتسوبيشي</option>
                <option value="سوبارو">سوبارو</option>
                <option value="إيسوزو">إيسوزو</option>
                <option value="دايهاتسو">دايهاتسو</option>
                <option value="تاتا">تاتا</option>
                <option value="ماهيندرا">ماهيندرا</option>
                <option value="ماروتي">ماروتي</option>
                <option value="بروتون">بروتون</option>
                <option value="بيرودوا">بيرودوا</option>
                <option value="جيلي">جيلي</option>
                <option value="بي واي دي">بي واي دي</option>
                <option value="نيسو">نيسو</option>
                <option value="أخرى">أخرى</option>
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
                <option value="under50k">أقل من 50,000 ريال</option>
                <option value="50k-100k">50,000 - 100,000 ريال</option>
                <option value="over100k">أكثر من 100,000 ريال</option>
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
