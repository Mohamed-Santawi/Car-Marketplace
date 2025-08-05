import React, { useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <motion.section
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          سيارات للبيع في السعودية
        </motion.h2>

        <motion.p
          className="text-xl mb-8 text-blue-100"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          اكتشف أفضل العروض على السيارات المستعملة المضمونة
        </motion.p>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <form
            onSubmit={handleSearch}
            className="flex bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="ابحث عن سيارة..."
              className="flex-1 px-6 py-4 text-gray-900 text-right focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <motion.button
              type="submit"
              className="bg-blue-600 px-8 py-4 hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              بحث
            </motion.button>
          </form>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="text-center">
            <motion.div
              className="text-3xl font-bold mb-2"
              whileInView={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              10,000+
            </motion.div>
            <p className="text-blue-100">سيارة متاحة</p>
          </div>
          <div className="text-center">
            <motion.div
              className="text-3xl font-bold mb-2"
              whileInView={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              50,000+
            </motion.div>
            <p className="text-blue-100">عميل راضي</p>
          </div>
          <div className="text-center">
            <motion.div
              className="text-3xl font-bold mb-2"
              whileInView={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              100%
            </motion.div>
            <p className="text-blue-100">ضمان الجودة</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
