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

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-white">
      <Hero />

      {/* Collections (Used + Sell only) */}
      {/* <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-10"
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

      <motion.section
        className="relative"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="relative">
          <TopBrands onSelectBrand={handleBrandSelect} />
        </div>
      </motion.section>

      {/* How to Use This Platform Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-700 mb-4">
            كيف تستخدم المنصة
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            دليل سريع لاستخدام منصة سيارتك لبيع وشراء السيارات المستعملة
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Step 1 */}
          <motion.div
            className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">إنشاء حساب</h3>
            <p className="text-gray-500">
              سجل دخولك أو أنشئ حساب جديد للوصول لجميع المميزات
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              إضافة إعلان
            </h3>
            <p className="text-gray-500">
              املأ نموذج بيع السيارة مع الصور والتفاصيل الكاملة
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              انتظار الموافقة
            </h3>
            <p className="text-gray-500">
              سيتم مراجعة إعلانك من قبل الإدارة والموافقة عليه خلال 24 ساعة
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* For Sellers */}
          <motion.div
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
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
              <h3 className="text-2xl mr-2 font-bold text-gray-700">
                للبائعين
              </h3>
            </div>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-start">
                <span className="text-emerald-500 ml-2">✓</span>
                أضف صور عالية الجودة لسيارتك
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 ml-2">✓</span>
                اكتب وصفاً مفصلاً وشاملاً
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 ml-2">✓</span>
                حدد سعراً مناسباً ومنافساً
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 ml-2">✓</span>
                كن متاحاً للرد على الاستفسارات
              </li>
            </ul>
          </motion.div>

          {/* For Buyers */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mr-2 text-gray-700">
                للمشترين
              </h3>
            </div>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-start">
                <span className="text-blue-500 ml-2">✓</span>
                استخدم فلاتر البحث المتقدمة
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 ml-2">✓</span>
                قارن الأسعار والمواصفات
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 ml-2">✓</span>
                تواصل مع البائع مباشرة
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 ml-2">✓</span>
                اطلب معاينة السيارة قبل الشراء
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <a
            href="/sell-car"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ابدأ الآن
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

      {/* Final CTA */}
      <motion.section
        className="py-12"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 flex flex-col md:flex-row items-center justify-between shadow-xlsoft"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">جاهز تبيع سيارتك؟</h3>
              <p className="text-emerald-100">
                أضف إعلانك الآن ووصل لآلاف المشترين خلال دقائق
              </p>
            </div>
            <a
              href="/sell-car"
              className="bg-white text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              أضف إعلانك الآن ↗
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
