import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CarCard = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [objectUrl, setObjectUrl] = useState(null);

  // Handle different image data structures
  const getImages = () => {
    if (Array.isArray(car.images) && car.images.length > 0) {
      return car.images;
    }
    if (car.image) {
      return [car.image];
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

  // Format price with commas
  const formatPrice = (price) => {
    if (!price) return "0";
    return Number(price).toLocaleString("ar-SA");
  };

  // Get car title
  const getCarTitle = () => {
    const parts = [];
    if (car.year) parts.push(car.year);
    if (car.brand) parts.push(car.brand);
    if (car.model) parts.push(car.model);
    return parts.join(" ") || "سيارة للبيع";
  };

  // Get trim info
  const getTrimInfo = () => {
    if (car.trim) return car.trim;
    if (car.bodyType) return car.bodyType;
    return "";
  };

  // Get mileage info
  const getMileageInfo = () => {
    if (car.mileage) return `${car.mileage} كم`;
    return "غير محدد";
  };

  // Get accident info
  const getAccidentInfo = () => {
    if (car.accidents === 0) return "لا توجد حوادث";
    if (car.accidents === 1) return "حادث واحد";
    return `${car.accidents} حوادث`;
  };

  // Get owner info
  const getOwnerInfo = () => {
    if (car.owners === 1) return "مالك واحد";
    return `${car.owners} مالكين`;
  };

  // Get usage info
  const getUsageInfo = () => {
    switch (car.usage) {
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

  // Get features
  const getFeatures = () => {
    if (Array.isArray(car.features) && car.features.length > 0) {
      return car.features.slice(0, 5); // Show max 5 features
    }
    return [];
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 hover:shadow-xlsoft transition-shadow w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <div className="relative overflow-hidden">
          <motion.img
            key={currentImageIndex}
            src={src}
            alt={getCarTitle()}
            className="w-full h-64 object-cover" // Increased height from h-48 to h-64
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop";
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Favorite button */}
          <button className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full transition-all">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all"
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
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 space-x-reverse">
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
          {car.originalPrice && car.originalPrice !== car.price && (
            <motion.div
              className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              سعر عادل
            </motion.div>
          )}

          {car.lowMileage && (
            <motion.div
              className="absolute top-12 left-3 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium"
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
            {car.originalPrice && car.originalPrice !== car.price && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(car.originalPrice)} ريال
              </p>
            )}
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(car.price)} ريال
            </p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <span>⚖️</span>
              <span>سعر عادل</span>
            </div>
          </div>
        </div>

        {/* Key specifications - using same icons as SearchCarCard */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">📊</span>
            <span>{getMileageInfo()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">{car.accidents === 0 ? "✅" : "⚠️"}</span>
            <span>
              {getAccidentInfo()}، {getOwnerInfo()}، {getUsageInfo()}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">⚙️</span>
            <span>{car.engine || "غير محدد"}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-1">📍</span>
            <span>{car.location || "الموقع غير محدد"}</span>
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

        {/* Action button */}
        <div className="flex items-center justify-between">
          <motion.button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex-1"
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

export default CarCard;
