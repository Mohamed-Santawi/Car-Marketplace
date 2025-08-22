import React, { useState } from "react";

const SearchCarCard = ({ car, viewMode }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const getPriceRatingColor = (rating) => {
    switch (rating) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriceRatingText = (rating) => {
    switch (rating) {
      case "excellent":
        return "سعر ممتاز";
      case "good":
        return "سعر جيد";
      case "fair":
        return "سعر عادل";
      default:
        return "سعر عادي";
    }
  };

  const getPriceRatingIcon = (rating) => {
    switch (rating) {
      case "excellent":
        return "⭐";
      case "good":
        return "👍";
      case "fair":
        return "⚖️";
      default:
        return "📊";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("ar-SA").format(mileage);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        viewMode === "list" ? "flex" : "flex flex-col"
      }`}
    >
      {/* Image Section */}
      <div
        className={`relative ${
          viewMode === "list" ? "w-80 flex-shrink-0" : "w-full"
        }`}
      >
        <img
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <svg
            className={`w-5 h-5 ${
              isFavorite ? "text-red-500 fill-current" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Image Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`p-4 flex-1 ${
          viewMode === "list" ? "flex flex-col justify-between" : ""
        }`}
      >
        {/* Header with title and price */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {car.year} {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-600">{car.trim}</p>
          </div>

          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatPrice(car.price)}
            </div>
            <div
              className={`text-sm font-medium ${getPriceRatingColor(
                car.priceRating
              )} mb-1`}
            >
              {getPriceRatingIcon(car.priceRating)}{" "}
              {getPriceRatingText(car.priceRating)}
            </div>
            <div className="text-xs text-gray-600">
              {formatPrice(car.priceBelowMarket)} أقل من السوق
            </div>
          </div>
        </div>

        {/* Key Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📊</span>
            <span>{formatMileage(car.mileage)} كم</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">{car.accidents === 0 ? "✅" : "⚠️"}</span>
            <span>
              {car.accidents === 0 ? "لا توجد حوادث" : `${car.accidents} حادث`},{" "}
              {car.owners} مالك,{" "}
              {car.usage === "personal" ? "استخدام شخصي" : "استخدام تجاري"}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⚙️</span>
            <span>{car.engine}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span>{car.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">🚚</span>
            <span>التوصيل متاح</span>
          </div>
        </div>

        {/* Features Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {car.features.slice(0, 5).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Buy Online Button */}
        <div className="mt-auto">
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            شراء عبر الإنترنت
            <span className="mr-2">↗️</span>
          </button>
        </div>

        {/* More Info Toggle */}
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowMoreInfo(!showMoreInfo)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
          >
            <span>ℹ️</span>
            <span>{showMoreInfo ? "إخفاء المعلومات" : "معلومات إضافية"}</span>
          </button>
        </div>

        {/* Expanded Information */}
        {showMoreInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <p className="text-sm text-gray-700">
              <strong>الموقع:</strong> {car.location} / {car.distance}
            </p>
            <p className="text-sm text-gray-700">
              <strong>استهلاك الوقود:</strong> {car.mpg}
            </p>
            <p className="text-sm text-gray-700">
              <strong>رقم الشاصي:</strong> {car.vin}
            </p>
            <p className="text-sm text-gray-700">
              <strong>المخزون:</strong> {car.stock}
            </p>
            <p className="text-sm text-gray-700">
              <strong>مضمون:</strong> {car.certified ? "نعم" : "لا"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCarCard;
