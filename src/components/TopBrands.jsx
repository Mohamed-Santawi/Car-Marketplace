import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Build a map of image files available under assets/img at build time
// This uses Vite's import.meta.glob to resolve URLs for images
const imageUrlMap = import.meta.glob("../assets/img/*.{png,jpg,jpeg,svg}", {
  as: "url",
  eager: true,
});

// Helper to get image URL by filename (e.g., '5.png', '71.jpg')
const getImageUrl = (fileName) => {
  const key = `../assets/img/${fileName}`;
  return imageUrlMap[key] || null;
};

// Curated list of popular/most-traded brands with Arabic names and matching image filenames
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

const TopBrands = ({ onSelectBrand }) => {
  const [query, setQuery] = useState("");

  const brandsWithImages = useMemo(() => {
    return (
      POPULAR_BRANDS.map((b) => ({
        ...b,
        image: getImageUrl(b.file),
      }))
        // Keep only brands that have a resolvable image in the current repo
        .filter((b) => !!b.image)
    );
  }, []);

  const filteredBrands = useMemo(() => {
    if (!query) return brandsWithImages;
    const q = query.toLowerCase().trim();
    return brandsWithImages.filter(
      (b) => b.nameAr.includes(query) || b.slug.includes(q)
    );
  }, [brandsWithImages, query]);

  return (
    <motion.section
      className="py-10 bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h3 className="text-2xl font-semibold text-gray-900 text-center md:text-right">
            أشهر ماركات السيارات
          </h3>
          <input
            type="text"
            placeholder="ابحث عن الماركة..."
            className="w-full md:w-80 bg-white border border-gray-200 rounded-lg px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
          {/* All Brands Button */}
          <motion.button
            onClick={() => onSelectBrand && onSelectBrand("جميع الماركات")}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-4 flex flex-col items-center justify-center border border-emerald-400 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">جميع الماركات</span>
          </motion.button>

          {filteredBrands.map((brand, idx) => (
            <motion.button
              key={brand.slug}
              onClick={() => onSelectBrand && onSelectBrand(brand.nameAr)}
              className="bg-white rounded-xl p-4 flex flex-col items-center justify-center border border-gray-200 hover:border-emerald-400 hover:shadow-soft transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: (idx + 1) * 0.02 }}
              viewport={{ once: true }}
            >
              <img
                src={brand.image}
                alt={brand.nameAr}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="text-sm text-gray-800">{brand.nameAr}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TopBrands;
