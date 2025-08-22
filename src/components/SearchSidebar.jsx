import React, { useState } from "react";
import { saudiCarBrands } from "../services/imageService";

const SearchSidebar = ({ filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    buyingExperience: true,
    zipCode: true,
    makeModel: true,
    year: false,
    pricePayments: false,
    priceRating: false,
    bodyType: false,
    mileage: false,
    accidentsHistory: false,
    engineDrivetrain: false,
    exteriorColor: false,
    interiorColor: false,
    totalSeating: false,
    edmundsReview: false,
    features: false,
    mpg: false,
    listingDetails: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  // Get all car brands from saudiCarBrands
  const makes = Object.keys(saudiCarBrands).sort();

  const years = Array.from({ length: 25 }, (_, i) => 2024 - i);

  const bodyTypes = [
    "سيدان",
    "سيارة رياضية متعددة الأغراض",
    "شاحنة",
    "كابريوليه",
    "كوبيه",
    "ستيشن واجن",
    "هاتشباك",
    "فان",
  ];

  // Improved price ranges from 1,000 to 500,000 SAR
  const priceRanges = [
    { value: "under10k", label: "أقل من 10,000 ريال" },
    { value: "10k-25k", label: "10,000 - 25,000 ريال" },
    { value: "25k-50k", label: "25,000 - 50,000 ريال" },
    { value: "50k-75k", label: "50,000 - 75,000 ريال" },
    { value: "75k-100k", label: "75,000 - 100,000 ريال" },
    { value: "100k-150k", label: "100,000 - 150,000 ريال" },
    { value: "150k-200k", label: "150,000 - 200,000 ريال" },
    { value: "200k-300k", label: "200,000 - 300,000 ريال" },
    { value: "300k-400k", label: "300,000 - 400,000 ريال" },
    { value: "400k-500k", label: "400,000 - 500,000 ريال" },
    { value: "over500k", label: "أكثر من 500,000 ريال" },
  ];

  // Common features for cars
  const commonFeatures = [
    "بلوتوث",
    "نظام ملاحة",
    "مقاعد جلدية",
    "كاميرا خلفية",
    "دفع رباعي",
    "سقف قابل للفتح",
    "مكيف هواء",
    "نظام صوت عالي الجودة",
    "مقاعد كهربائية",
    "نظام أمان متقدم",
    "إضاءة LED",
    "عجلات ألمنيوم",
    "نظام تثبيت السرعة",
    "مقاعد رياضية",
    "نظام تحكم في المناخ",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Applied Filters */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-800">الفلاتر المطبقة</h3>
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {
              Object.values(filters).filter(
                (v) => v && (Array.isArray(v) ? v.length > 0 : true)
              ).length
            }
          </span>
        </div>
        <button
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() =>
            onFilterChange({
              make: "",
              model: "",
              year: "",
              priceRange: "",
              bodyType: "",
              mileage: "",
              accidents: "",
              features: [],
            })
          }
        >
          مسح الكل
        </button>
      </div>

      {/* Make & Model */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("makeModel")}
        >
          <h3 className="text-sm font-bold text-gray-800">الماركة</h3>
          <span
            className={`transform transition-transform ${
              expandedSections.makeModel ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
        {expandedSections.makeModel && (
          <div className="mt-3 space-y-3">
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filters.make}
                onChange={(e) => handleFilterChange("make", e.target.value)}
              >
                <option value="">اختر الماركة</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Year */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("year")}
        >
          <h3 className="text-sm font-bold text-gray-800">السنة</h3>
          <span
            className={`transform transition-transform ${
              expandedSections.year ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
        {expandedSections.year && (
          <div className="mt-3">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
            >
              <option value="">اختر السنة</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Price & Payments */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("pricePayments")}
        >
          <h3 className="text-sm font-bold text-gray-800">السعر والمدفوعات</h3>
          <span
            className={`transform transition-transform ${
              expandedSections.pricePayments ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
        {expandedSections.pricePayments && (
          <div className="mt-3">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange("priceRange", e.target.value)}
            >
              <option value="">اختر نطاق السعر</option>
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Body Type */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("bodyType")}
        >
          <h3 className="text-sm font-bold text-gray-800">نوع الهيكل</h3>
          <span
            className={`transform transition-transform ${
              expandedSections.bodyType ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
        {expandedSections.bodyType && (
          <div className="mt-3 space-y-2">
            {bodyTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.bodyType === type}
                  onChange={(e) =>
                    handleFilterChange("bodyType", e.target.checked ? type : "")
                  }
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Mileage */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("mileage")}
        >
          <h3 className="text-sm font-bold text-gray-800">المسافة المقطوعة</h3>
          <span
            className={`transform transition-transform ${
              expandedSections.mileage ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
        {expandedSections.mileage && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>الحد الأقصى: {filters.mileage || 0} كم</span>
            </div>
            <input
              type="range"
              min="0"
              max="300000"
              step="5000"
              className="w-full"
              value={filters.mileage || 0}
              onChange={(e) => handleFilterChange("mileage", e.target.value)}
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>0 كم</span>
              <span>300,000 كم</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                onClick={() => handleFilterChange("mileage", "50000")}
              >
                50,000 كم
              </button>
              <button
                className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                onClick={() => handleFilterChange("mileage", "100000")}
              >
                100,000 كم
              </button>
              <button
                className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                onClick={() => handleFilterChange("mileage", "200000")}
              >
                200,000 كم
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Accidents & History */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("accidentsHistory")}
        >
          <h3 className="text-sm font-bold text-gray-800">الحوادث والتاريخ</h3>
          <span
            className={`transform transition-transform ${
              expandedSections.accidentsHistory ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
        {expandedSections.accidentsHistory && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="accidents"
                className="mr-2"
                checked={filters.accidents === "none"}
                onChange={() => handleFilterChange("accidents", "none")}
              />
              <span className="text-sm text-gray-700">لا توجد حوادث</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="accidents"
                className="mr-2"
                checked={filters.accidents === "one"}
                onChange={() => handleFilterChange("accidents", "one")}
              />
              <span className="text-sm text-gray-700">حادث واحد</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="accidents"
                className="mr-2"
                checked={filters.accidents === "multiple"}
                onChange={() => handleFilterChange("accidents", "multiple")}
              />
              <span className="text-sm text-gray-700">حادثان أو أكثر</span>
            </label>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("features")}
        >
          <h3 className="text-sm font-bold text-gray-800">المميزات</h3>
          <span
            className={`transform transition-transform ${
              expandedSections.features ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
        {expandedSections.features && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {commonFeatures.map((feature) => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={
                    filters.features && filters.features.includes(feature)
                  }
                  onChange={(e) => {
                    const currentFeatures = filters.features || [];
                    if (e.target.checked) {
                      handleFilterChange("features", [
                        ...currentFeatures,
                        feature,
                      ]);
                    } else {
                      handleFilterChange(
                        "features",
                        currentFeatures.filter((f) => f !== feature)
                      );
                    }
                  }}
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSidebar;
