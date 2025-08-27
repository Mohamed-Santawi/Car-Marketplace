import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
// import BrandFilter from "../components/BrandFilter";
import CarsGrid from "../components/CarsGrid";
import TopBrands from "../components/TopBrands";
import PaidAdCard from "../components/PaidAdCard";
import {
  getCarBrands,
  getApprovedCarAdvertisements,
  getPaidAdvertisements,
  getAllCarAdvertisements,
} from "../services/carService";

const Home = () => {
  const [selectedBrand, setSelectedBrand] = useState("جميع الماركات");
  const [loading, setLoading] = useState(true);
  const [approvedAds, setApprovedAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [paidAds, setPaidAds] = useState([]);
  const [filteredPaidAds, setFilteredPaidAds] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        console.log("=== LOADING HOME DATA ===");

        const [brandsData, ads, paidAdsData] = await Promise.all([
          Promise.resolve(getCarBrands()),
          getApprovedCarAdvertisements(),
          getPaidAdvertisements(),
        ]);

        console.log("Brands data:", brandsData);
        console.log("Approved ads:", ads);
        console.log("Approved ads count:", ads.length);
        console.log("Paid ads:", paidAdsData);
        console.log("Paid ads count:", paidAdsData.length);

        // Debug: Check if any ads have isPaid field
        const allAds = await getAllCarAdvertisements();
        const paidAdsInAll = allAds.filter((ad) => ad.isPaid === true);
        console.log("All advertisements with isPaid=true:", paidAdsInAll);
        console.log(
          "All advertisements with isPaid=true count:",
          paidAdsInAll.length
        );

        // Filter out paid advertisements from regular approved ads
        const regularApprovedAds = ads.filter((ad) => !ad.isPaid);
        console.log(
          "Regular approved ads (excluding paid):",
          regularApprovedAds.length
        );

        // Debug paid ads content
        console.log(
          "Paid ads detailed content:",
          JSON.stringify(paidAdsData, null, 2)
        );
        console.log("Paid ads length check:", paidAdsData.length);
        console.log("Paid ads truthy check:", !!paidAdsData.length);

        setApprovedAds(regularApprovedAds);
        setFilteredAds(regularApprovedAds);
        setPaidAds(paidAdsData);
        setFilteredPaidAds(paidAdsData);
      } catch (e) {
        console.error("Error loading home data:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter ads based on selected brand
  useEffect(() => {
    if (selectedBrand === "جميع الماركات") {
      setFilteredAds(approvedAds);
      setFilteredPaidAds(paidAds);
    } else {
      const filtered = approvedAds.filter((ad) => ad.brand === selectedBrand);
      const filteredPaid = paidAds.filter((ad) => ad.brand === selectedBrand);
      setFilteredAds(filtered);
      setFilteredPaidAds(filteredPaid);
    }
  }, [selectedBrand, approvedAds, paidAds]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  return (
    <div className="bg-white">
      <Hero onSelectBrand={handleBrandSelect} />

      {/* Mobile Collections (Used + Sell only) - Hidden on tablet and desktop */}
      {/* <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-10 block sm:hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.a
            href="/used-cars"
            className="relative rounded-2xl p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xlsoft overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -bottom-10 -left-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-2xl font-bold mb-1">سيارات مستعملة</h3>
            <p className="text-emerald-100">عروض قوية وأسعار منافسة</p>
          </motion.a>
          <motion.a
            href="/sell-car"
            className="relative rounded-2xl p-6 bg-gradient-to-br from-rose-600 to-pink-700 text-white shadow-xlsoft overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -bottom-10 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-2xl font-bold mb-1">بيع سيارتك</h3>
            <p className="text-rose-100">اعرض سيارتك خلال دقائق</p>
          </motion.a>
        </div>
      </motion.section> */}

      {/* Quick Guide Section */}
      <motion.section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mr-2">
              دليل سريع لاستخدام المنصة
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                1
              </span>
              <span className="text-gray-600 mr-2">
                إنشاء حساب أو تسجيل دخول
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                2
              </span>
              <span className="text-gray-600 mr-2">
                إضافة إعلان مع الصور والتفاصيل
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                3
              </span>
              <span className="text-gray-600 mr-2">
                انتظار الموافقة خلال 24 ساعة
              </span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Paid Advertisements Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-yellow-50 to-orange-50"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            إعلانات مدفوعة مميزة
            {selectedBrand !== "جميع الماركات" && ` - ${selectedBrand}`}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ارفع إعلانك للمستوى التالي ووصل لآلاف المشترين المحتملين
          </p>
        </motion.div>

        {/* Paid Advertisements Grid */}
        {filteredPaidAds.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {filteredPaidAds.map((ad) => (
              <PaidAdCard key={ad.id} ad={ad} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                لا توجد إعلانات مدفوعة حالياً
                {selectedBrand !== "جميع الماركات" && ` لـ ${selectedBrand}`}
              </h3>
              <p className="text-gray-500 mb-4">
                كن أول من يرفع إعلانه للمستوى التالي
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4">
            💡 <strong>نصيحة:</strong> الإعلانات المدفوعة تظهر في أعلى النتائج
            وتجذب 3x أكثر من المشاهدات
          </p>
          <a
            href="/paid-advertisements"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ترقية إعلانك الآن
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </motion.div>
      </motion.section>

      {/* Approved Ads from Admin */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {loading ? (
          <motion.div
            className="py-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto" />
          </motion.div>
        ) : (
          <CarsGrid
            title={`إعلانات معتمدة من الإدارة${
              selectedBrand !== "جميع الماركات" ? ` - ${selectedBrand}` : ""
            }`}
            cars={filteredAds}
          />
        )}
      </motion.section>
    </div>
  );
};

export default Home;
