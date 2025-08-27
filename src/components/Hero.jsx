import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import HeroImage from "../assets/Hero1.png";

// Import the same brand data and helper functions from TopBrands
const imageUrlMap = import.meta.glob("../assets/img/*.{png,jpg,jpeg,svg}", {
  as: "url",
  eager: true,
});

const getImageUrl = (fileName) => {
  const key = `../assets/img/${fileName}`;
  return imageUrlMap[key] || null;
};

const POPULAR_BRANDS = [
  { slug: "toyota", nameAr: "تويوتا", file: "5.png" },
  { slug: "hyundai", nameAr: "هيونداي", file: "1.png" },
  { slug: "kia", nameAr: "كيا", file: "71.jpg" },
  { slug: "nissan", nameAr: "نيسان", file: "4.png" },
  { slug: "mercedes", nameAr: "مرسيدس بنز", file: "6.png" },
  { slug: "bmw", nameAr: "بي ام دبليو", file: "3.png" },
  { slug: "ford", nameAr: "فورد", file: "7.png" },
  { slug: "chevrolet", nameAr: "شفروليه", file: "9.png" },
  { slug: "honda", nameAr: "هوندا", file: "10.png" },
  { slug: "lexus", nameAr: "لكزس", file: "14.png" },
  { slug: "mazda", nameAr: "مازدا", file: "17.png" },
  { slug: "volkswagen", nameAr: "فولكس فاجن", file: "12.png" },
  { slug: "mg", nameAr: "ام جي", file: "59.png" },
  { slug: "renault", nameAr: "رينو", file: "26.png" },
  { slug: "skoda", nameAr: "سكودا", file: "16.png" },
  { slug: "audi", nameAr: "أودي", file: "20.png" },
  { slug: "volvo", nameAr: "فولفو", file: "25.png" },
  { slug: "tesla", nameAr: "تسلا", file: "31.png" },
  { slug: "mini", nameAr: "ميني كوبر", file: "36.png" },
  { slug: "porsche", nameAr: "بورشه", file: "23.png" },
  { slug: "cadillac", nameAr: "كاديلاك", file: "33.png" },
  { slug: "byd", nameAr: "بي واي دي", file: "60.png" },
  { slug: "haval", nameAr: "هافال", file: "73.jpg" },
  { slug: "jetour", nameAr: "جيتور", file: "62.jpg" },
  { slug: "baic", nameAr: "بايك", file: "63.jpg" },
  { slug: "bestune", nameAr: "بيستون", file: "64.jpg" },
  { slug: "dongfeng", nameAr: "دونغ فينغ", file: "65.jpg" },
  { slug: "forthing", nameAr: "فورثينج", file: "68.jpg" },
  { slug: "kaiyi", nameAr: "كايي", file: "69.jpg" },
];

const Hero = ({ onSelectBrand }) => {
  const [selectedBrand, setSelectedBrand] = useState("جميع الماركات");
  const [mobileQuery, setMobileQuery] = useState("");

  const brandsWithImages = useMemo(() => {
    return POPULAR_BRANDS.map((b) => ({
      ...b,
      image: getImageUrl(b.file),
    })).filter((b) => !!b.image);
  }, []);

  const filteredMobileBrands = useMemo(() => {
    if (!mobileQuery) return brandsWithImages;
    const q = mobileQuery.toLowerCase().trim();
    return brandsWithImages.filter(
      (b) => b.nameAr.includes(mobileQuery) || b.slug.includes(q)
    );
  }, [brandsWithImages, mobileQuery]);

  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
    if (onSelectBrand) {
      onSelectBrand(brandName);
    }
  };

  const handleAllBrands = () => {
    setSelectedBrand("جميع الماركات");
    if (onSelectBrand) {
      onSelectBrand("جميع الماركات");
    }
  };

  return (
    <>
      {/* Desktop Hero Section */}
      <motion.section
        className="relative overflow-hidden hidden md:block bg-gradient-to-r from-gray-900 to-gray-800 h-[78vh] mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      >
        <motion.div
          className="w-full h-[70vh] flex items-center justify-center relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeOut", delay: 0.6 }}
        >
          {/* Three-column layout for large screens */}
          <div className="w-full max-w-8xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-5 items-center h-full">
            {/* Left Column - Car Brands */}
            <motion.div
              className="hidden lg:flex flex-col"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="grid grid-cols-3 gap-2 mt-2">
                {brandsWithImages
                  .slice(0, Math.ceil(brandsWithImages.length / 2))
                  .map((brand, idx) => (
                    <motion.div
                      key={brand.slug}
                      className={`backdrop-blur-sm rounded-xl px-1 py-2 border transition-all cursor-pointer ${
                        selectedBrand === brand.nameAr
                          ? "bg-emerald-500/80 border-emerald-400"
                          : "bg-white/10 border-white/20 hover:bg-white/20"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.03 + idx * 0.01 }}
                      onClick={() => handleBrandSelect(brand.nameAr)}
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={brand.image}
                          alt={brand.nameAr}
                          className="w-10 h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-white text-center font-medium">
                          {brand.nameAr}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            {/* Center Column - Hero Image */}
            <motion.div
              className="flex justify-center items-center col-span-3 h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={HeroImage}
                  alt="Car Marketplace Hero"
                  className="w-full h-full object-cover"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
                {/* Black overlay (same size as image) */}
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </motion.div>

            {/* Right Column - Car Brands */}
            <motion.div
              className="hidden lg:flex flex-col"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="grid grid-cols-3 gap-2 mt-3">
                {/* All Brands Button */}
                <motion.div
                  className={`rounded-xl p-2 flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    selectedBrand === "جميع الماركات"
                      ? "bg-emerald-500/80 border-emerald-400"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 hover:from-emerald-600 hover:to-teal-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={handleAllBrands}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-center text-white">
                    جميع الماركات
                  </span>
                </motion.div>

                {brandsWithImages
                  .slice(Math.ceil(brandsWithImages.length / 2))
                  .map((brand, idx) => (
                    <motion.div
                      key={brand.slug}
                      className={`backdrop-blur-sm rounded-xl p-2 border transition-all cursor-pointer ${
                        selectedBrand === brand.nameAr
                          ? "bg-emerald-500/80 border-emerald-400"
                          : "bg-white/10 border-white/20 hover:bg-white/20"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.03 + (idx + 1) * 0.03 }}
                      onClick={() => handleBrandSelect(brand.nameAr)}
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={brand.image}
                          alt={brand.nameAr}
                          className="w-10 h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-white text-center font-medium">
                          {brand.nameAr}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Mobile Hero Section */}
      <motion.section
        className="relative overflow-hidden block md:hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile Hero Content */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4">منصة سيارتك</h1>
            <p className="text-gray-300 text-lg mb-6">
              ابحث عن سيارتك المثالية أو اعرض سيارتك للبيع
            </p>
          </motion.div>

          {/* Mobile Brand Search */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <input
              type="text"
              placeholder="ابحث عن الماركة..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-right text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
            />
          </motion.div>

          {/* Mobile Brand Grid */}
          <motion.div
            className="grid grid-cols-4 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* All Brands Button */}
            <motion.div
              className={`rounded-xl p-3 flex flex-col items-center justify-center border transition-all cursor-pointer ${
                selectedBrand === "جميع الماركات"
                  ? "bg-emerald-500/80 border-emerald-400"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAllBrands}
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-center text-white">
                الكل
              </span>
            </motion.div>

            {/* Brand Cards */}
            {filteredMobileBrands.map((brand, idx) => (
              <motion.div
                key={brand.slug}
                className={`backdrop-blur-sm rounded-xl p-2 border transition-all cursor-pointer ${
                  selectedBrand === brand.nameAr
                    ? "bg-emerald-500/80 border-emerald-400"
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.02 }}
                onClick={() => handleBrandSelect(brand.nameAr)}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={brand.image}
                    alt={brand.nameAr}
                    className="w-8 h-8 object-contain mb-1"
                  />
                  <span className="text-xs text-white text-center font-medium">
                    {brand.nameAr}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

export default Hero;
