import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PromotedAds = ({ ads = [], title = "إعلانات مميزة" }) => {
  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium ml-3">
            مميز
          </span>
          {title}
        </h2>
        <Link
          to="/paid-advertisements"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          ترقية إعلانك →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            {/* Promoted Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                إعلان مميز
              </span>
            </div>

            {/* Car Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-yellow-200 hover:border-yellow-300 transition-all duration-300 group-hover:shadow-xl">
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {ad.image ? (
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Promotion Level Badge */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                      ad.promotionLevel === "vip"
                        ? "bg-purple-500"
                        : ad.promotionLevel === "premium"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {ad.promotionLevel === "vip"
                      ? "VIP"
                      : ad.promotionLevel === "premium"
                      ? "مميز"
                      : "أساسي"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {ad.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    {ad.price.toLocaleString()} ريال
                  </span>
                  <span className="text-sm text-gray-500">{ad.year}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {ad.mileage.toLocaleString()} كم
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {ad.location}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{ad.date}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          اجعل إعلانك يظهر هنا!
        </h3>
        <p className="text-gray-600 mb-4">
          احصل على مزيد من المشاهدات والمبيعات من خلال ترقية إعلانك
        </p>
        <Link
          to="/paid-advertisements"
          className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
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
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default PromotedAds;
