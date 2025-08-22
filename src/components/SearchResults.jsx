import React, { useState } from "react";
import CarCard from "./CarCard";

const SearchResults = ({ cars }) => {
  const [sortBy, setSortBy] = useState("bestDeal:desc");
  const [viewMode, setViewMode] = useState("grid");

  const sortOptions = [
    { value: "bestDeal:desc", label: "أفضل العروض" },
    { value: "distance:asc", label: "المسافة" },
    { value: "price:asc", label: "السعر: من الأقل إلى الأعلى" },
    { value: "price:desc", label: "السعر: من الأعلى إلى الأقل" },
    { value: "mileage:asc", label: "المسافة المقطوعة: من الأقل إلى الأعلى" },
    { value: "mileage:desc", label: "المسافة المقطوعة: من الأعلى إلى الأقل" },
    { value: "publishDate:desc", label: "تاريخ الإعلان: الأحدث أولاً" },
    { value: "publishDate:asc", label: "تاريخ الإعلان: الأقدم أولاً" },
    { value: "modelYear:desc", label: "السنة: الأحدث أولاً" },
    { value: "modelYear:asc", label: "السنة: الأقدم أولاً" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header with results count, sort, and save search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{cars.length} إعلان</span>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Save Search Button */}
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="underline">حفظ البحث</span>
        </button>
      </div>

      {/* Nationwide Shopping Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2 text-blue-800">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium">
            التسوق <strong>على مستوى البلاد</strong> النتائج متاحة للشراء عبر
            الإنترنت والتوصيل المحلي.
          </span>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "grid"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Car Cards Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* Load More Button */}
      {cars.length > 0 && (
        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            تحميل المزيد من النتائج
          </button>
        </div>
      )}

      {/* No Results Message */}
      {cars.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لم يتم العثور على سيارات
          </h3>
          <p className="text-gray-600">
            حاول تعديل معايير البحث أو تصفح سياراتنا المميزة.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
