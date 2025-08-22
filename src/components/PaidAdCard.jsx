import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PaidAdCard = ({ ad }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [objectUrl, setObjectUrl] = useState(null);

  // Handle different image data structures
  const getImages = () => {
    if (Array.isArray(ad.images) && ad.images.length > 0) {
      return ad.images;
    }
    if (ad.image) {
      return [ad.image];
    }
    // Fallback to a default car image
    return [
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop",
    ];
  };

  const images = getImages();

  const resolveImageSrc = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img && typeof img === "object") {
      if (img.url && typeof img.url === "string") return img.url;
      if (img.path && typeof img.path === "string") return img.path;
    }
    return "";
  };

  useEffect(() => {
    const img = images[currentImageIndex];
    if (img instanceof Blob) {
      const url = URL.createObjectURL(img);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
  }, [currentImageIndex, images]);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToImage = (index) => setCurrentImageIndex(index);

  const current = images[currentImageIndex];
  const src = objectUrl || resolveImageSrc(current);

  const formatPrice = (price) => {
    if (!price) return "0";
    return Number(price).toLocaleString("ar-SA");
  };

  const getCarTitle = () => {
    const parts = [];
    if (ad.year) parts.push(ad.year);
    if (ad.brand) parts.push(ad.brand);
    if (ad.model) parts.push(ad.model);
    return parts.join(" ") || "سيارة للبيع";
  };

  const getTrimInfo = () => {
    if (ad.trim) return ad.trim;
    if (ad.bodyType) return ad.bodyType;
    return "";
  };

  const getMileageInfo = () => {
    if (ad.mileage) return `${ad.mileage} كم`;
    return "غير محدد";
  };

  const getAccidentInfo = () => {
    if (ad.accidents === 0) return "لا توجد حوادث";
    if (ad.accidents === 1) return "حادث واحد";
    return `${ad.accidents} حوادث`;
  };

  const getOwnerInfo = () => {
    if (ad.owners === 1) return "مالك واحد";
    return `${ad.owners} مالكين`;
  };

  const getUsageInfo = () => {
    switch (ad.usage) {
      case "personal":
        return "استخدام شخصي";
      case "commercial":
        return "استخدام تجاري";
      case "rental":
        return "استخدام تأجير";
      default:
        return "استخدام شخصي";
    }
  };

  const getFeatures = () => {
    if (Array.isArray(ad.features) && ad.features.length > 0) {
      return ad.features.slice(0, 5); // Show max 5 features
    }
    return [];
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-soft overflow-hidden border-2 border-yellow-200 hover:border-yellow-300 hover:shadow-xlsoft transition-all w-full group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      {/* Paid Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          إعلان مدفوع
        </span>
      </div>

      <div className="relative">
        <div className="relative overflow-hidden">
          <motion.img
            key={currentImageIndex}
            src={src}
            alt={getCarTitle()}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop";
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Favorite button */}
          <button className="absolute top-3 left-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full transition-all z-10">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all z-10"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all z-10"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image carousel indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 space-x-reverse z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Price comparison badge */}
          {ad.originalPrice && ad.originalPrice !== ad.price && (
            <motion.div
              className="absolute top-12 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              سعر عادل
            </motion.div>
          )}

          {ad.lowMileage && (
            <motion.div
              className="absolute top-20 left-3 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              ممشى قليل
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Car title and trim */}
        <motion.h4
          className="text-xl font-bold mb-1 text-gray-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          {getCarTitle()}
        </motion.h4>

        {getTrimInfo() && (
          <p className="text-sm text-gray-600 mb-3">{getTrimInfo()}</p>
        )}

        {/* Price section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {ad.originalPrice && ad.originalPrice !== ad.price && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(ad.originalPrice)} ريال
              </p>
            )}
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(ad.price)} ريال
            </p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <span>⚖️</span>
              <span>سعر عادل</span>
            </div>
          </div>
        </div>

        {/* Key specifications */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">📊</span>
            <span>{getMileageInfo()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">{ad.accidents === 0 ? "✅" : "⚠️"}</span>
            <span>
              {getAccidentInfo()}، {getOwnerInfo()}، {getUsageInfo()}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">⚙️</span>
            <span>{ad.engine || "غير محدد"}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">📍</span>
            <span>{ad.location || "الموقع غير محدد"}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">🚚</span>
            <span>التوصيل متاح</span>
          </div>
        </div>

        {/* Features */}
        {getFeatures().length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {getFeatures().map((feature, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Paid Features */}
        {ad.paidFeatures && ad.paidFeatures.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-bold text-yellow-700 mb-2">
              مميزات الباقة المدفوعة:
            </h5>
            <div className="flex flex-wrap gap-1">
              {ad.paidFeatures.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
              {ad.paidFeatures.length > 3 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{ad.paidFeatures.length - 3} أكثر
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between">
          <motion.button
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تواصل مع البائع
            <span className="mr-2">↗️</span>
          </motion.button>

          <button className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <span className="text-lg">ℹ️</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaidAdCard;
