import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import SellPreviewCard from "../components/SellPreviewCard";
import {
  createCarAdvertisement,
  getCarBrands,
  testFirestoreConnection,
} from "../services/carService";
import { motion } from "framer-motion";

// LocalStorage key for saving form data
const SELL_CAR_FORM_KEY = "sellCarFormData";

// Helper functions for localStorage
const saveFormDataToStorage = (formData, setShowSavedIndicator) => {
  try {
    // Create a copy of formData without images since File objects can't be serialized
    const dataToSave = { ...formData };
    dataToSave.images = []; // Don't save images to localStorage

    localStorage.setItem(SELL_CAR_FORM_KEY, JSON.stringify(dataToSave));
    if (setShowSavedIndicator) {
      setShowSavedIndicator(true);
      setTimeout(() => setShowSavedIndicator(false), 2000);
    }
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
  }
};

const loadFormDataFromStorage = () => {
  try {
    const savedData = localStorage.getItem(SELL_CAR_FORM_KEY);
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData);

    // Clear images from localStorage data since File objects can't be serialized
    if (parsedData.images) {
      parsedData.images = [];
    }

    return parsedData;
  } catch (error) {
    console.error("Error loading form data from localStorage:", error);
    return null;
  }
};

const clearFormDataFromStorage = () => {
  try {
    localStorage.removeItem(SELL_CAR_FORM_KEY);
  } catch (error) {
    console.error("Error clearing form data from localStorage:", error);
  }
};

const SellCar = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = loadFormDataFromStorage();
    return (
      savedData || {
        brand: "",
        model: "",
        year: "",
        price: "",
        originalPrice: "",
        discount: "0",
        mileage: "",
        condition: "مستعملة",
        lowMileage: false,
        description: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        images: [],
        trim: "",
        bodyType: "",
        fuelType: "",
        transmission: "",
        color: "",
        features: [],
        accidents: 0,
        owners: 1,
        usage: "personal",
        engine: "",
        vin: "",
        certified: false,
        location: "",
      }
    );
  });

  const [brands, setBrands] = useState(["جميع الماركات"]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setBrands(getCarBrands());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      saveFormDataToStorage(newData, setShowSavedIndicator);
      return newData;
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => {
      const newData = { ...prev, images: [...prev.images, ...files] };
      saveFormDataToStorage(newData, setShowSavedIndicator);
      return newData;
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      };
      saveFormDataToStorage(newData, setShowSavedIndicator);
      return newData;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      };
      saveFormDataToStorage(newData, setShowSavedIndicator);
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Form submission started...");

      // Test Firestore connection first (temporarily disabled for debugging)
      // const connectionTest = await testFirestoreConnection();
      // if (!connectionTest) {
      //   throw new Error("مشكلة في الاتصال بقاعدة البيانات");
      // }

      console.log("Form data being submitted:", formData);
      await createCarAdvertisement(formData);
      setIsSubmitting(false);
      alert("تم إرسال إعلانك بنجاح! سيتم مراجعته من قبل الإدارة قريباً.");
      setFormData({
        brand: "",
        model: "",
        year: "",
        price: "",
        originalPrice: "",
        discount: "0",
        mileage: "",
        condition: "مستعملة",
        lowMileage: false,
        description: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        images: [],
        trim: "",
        bodyType: "",
        fuelType: "",
        transmission: "",
        color: "",
        features: [],
        accidents: 0,
        owners: 1,
        usage: "personal",
        engine: "",
        vin: "",
        certified: false,
        location: "",
      });
      clearFormDataFromStorage();
      setCurrentStep(1);
      navigate("/");
    } catch (error) {
      setIsSubmitting(false);
      console.error("Form submission error:", error);
      alert("فشل في إرسال الإعلان: " + error.message);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const availableFeatures = [
    "بلوتوث",
    "نظام ملاحة",
    "مقاعد جلدية",
    "كاميرا خلفية",
    "دفع رباعي",
    "سقف قابل للفتح",
    "مقاعد مدفأة",
    "مقاعد كهربائية",
    "مكيف هواء",
    "نظام صوت عالي الجودة",
    "مفاتيح ذكية",
    "نظام أمان متقدم",
    "إضاءة LED",
    "عجلات ألمنيوم",
    "نظام تعليق رياضي",
  ];

  const steps = [
    { number: 1, title: "معلومات السيارة" },
    { number: 2, title: "المواصفات والمميزات" },
    { number: 3, title: "الوصف والصور" },
    { number: 4, title: "معلومات التواصل" },
  ];

  // Smart preview image logic - memoized to prevent infinite re-renders
  const previewImage = useMemo(() => {
    // If user has uploaded images, use the first one
    if (formData.images.length > 0) {
      const firstImage = formData.images[0];

      // Check if it's a valid File or Blob object
      if (firstImage instanceof File || firstImage instanceof Blob) {
        return URL.createObjectURL(firstImage);
      }

      // If it's an object with URL (from localStorage), use the URL directly
      if (firstImage && typeof firstImage === "object" && firstImage.url) {
        return firstImage.url;
      }

      // If it's a string URL, use it directly
      if (typeof firstImage === "string") {
        return firstImage;
      }
    }

    // If user has selected a brand, try to get a relevant image
    if (formData.brand && formData.brand !== "جميع الماركات") {
      // You can add brand-specific placeholder images here
      return `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&brand=${encodeURIComponent(
        formData.brand
      )}`;
    }

    // Default placeholder
    return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop";
  }, [formData.images, formData.brand]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          بيعنا سيارتك
        </motion.h1>

        {/* Steps */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center items-center space-x-4 space-x-reverse">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step.number
                      ? "text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      currentStep > step.number
                        ? "bg-emerald-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Promotion Banner */}
        <motion.div
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                اجعل إعلانك يظهر بشكل مميز! 🚀
              </h3>
              <p className="text-gray-600">
                احصل على مزيد من المشاهدات والمبيعات من خلال ترقية إعلانك
              </p>
            </div>
            <Link
              to="/paid-advertisements"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
            >
              ترقية الإعلان
            </Link>
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-center mb-4">
            {formData.brand && formData.brand !== "جميع الماركات"
              ? `معاينة مباشرة لسيارة ${formData.brand}`
              : "معاينة مباشرة لإعلانك"}
          </h3>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <SellPreviewCard
                car={{
                  brand: formData.brand || "اختر الماركة",
                  model: formData.model || "أدخل النموذج",
                  year: formData.year || "اختر السنة",
                  price: formData.price
                    ? `${formData.price} ريال`
                    : "أدخل السعر",
                  originalPrice: formData.originalPrice
                    ? `${formData.originalPrice} ريال`
                    : formData.price
                    ? `${formData.price} ريال`
                    : "السعر الأصلي",
                  discount: formData.discount || "0",
                  mileage: formData.mileage
                    ? `${formData.mileage} كم`
                    : "أدخل المسافة",
                  condition: formData.condition || "مستعملة",
                  lowMileage: formData.lowMileage,
                  features: formData.features,
                  owners: formData.owners || 1,
                  usage: formData.usage || "personal",
                  engine: formData.engine || "أدخل مواصفات المحرك",
                  location: formData.location || "أدخل الموقع",
                  trim: formData.trim || "أدخل الفئة",
                  bodyType: formData.bodyType || "اختر نوع الهيكل",
                  accidents: formData.accidents || 0,
                  images: formData.images,
                  image: previewImage,
                }}
              />
            </div>
            {!formData.brand || formData.brand === "جميع الماركات" ? (
              <p className="text-center text-gray-500 mt-4 text-sm">
                💡 ابدأ بملء المعلومات أدناه لرؤية معاينة مباشرة لإعلانك
              </p>
            ) : (
              <p className="text-center text-emerald-600 mt-4 text-sm">
                ✨ المعاينة تتحدث تلقائياً مع كل تغيير في المعلومات
              </p>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Clear Form Button and Saved Indicator */}
          <div className="flex justify-between items-center mb-4">
            {showSavedIndicator && (
              <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                ✓ تم حفظ البيانات تلقائياً
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm("هل أنت متأكد من حذف جميع البيانات المحفوظة؟")
                ) {
                  setFormData({
                    brand: "",
                    model: "",
                    year: "",
                    price: "",
                    originalPrice: "",
                    discount: "0",
                    mileage: "",
                    condition: "مستعملة",
                    lowMileage: false,
                    description: "",
                    contactName: "",
                    contactPhone: "",
                    contactEmail: "",
                    images: [],
                    trim: "",
                    bodyType: "",
                    fuelType: "",
                    transmission: "",
                    color: "",
                    features: [],
                    accidents: 0,
                    owners: 1,
                    usage: "personal",
                    engine: "",
                    vin: "",
                    certified: false,
                    location: "",
                  });
                  clearFormDataFromStorage();
                  setCurrentStep(1);
                }
              }}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              مسح البيانات المحفوظة
            </button>
          </div>
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6">معلومات السيارة</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الماركة *
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الموديل *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="مثال: النترا فلييت"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    سنة الصنع *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">اختر السنة</option>
                    {Array.from({ length: 25 }, (_, i) => 2024 - i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    السعر المطلوب (ريال) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="مثال: 50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المسافة المقطوعة (كم) *
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="مثال: 50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    حالة السيارة *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="مستعملة">مستعملة</option>
                    <option value="جديدة">جديدة</option>
                    <option value="مستعملة بحالة ممتازة">
                      مستعملة بحالة ممتازة
                    </option>
                    <option value="مستعملة بحالة جيدة">
                      مستعملة بحالة جيدة
                    </option>
                    <option value="مستعملة بحالة مقبولة">
                      مستعملة بحالة مقبولة
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    السعر الأصلي (ريال)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="السعر قبل الخصم (اختياري)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الخصم (ريال)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="قيمة الخصم (اختياري)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.lowMileage}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const newData = {
                            ...prev,
                            lowMileage: e.target.checked,
                          };
                          saveFormDataToStorage(newData, setShowSavedIndicator);
                          return newData;
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">ممشى قليل</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6">
                المواصفات والمميزات
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الفئة/الطراز
                  </label>
                  <select
                    name="trim"
                    value={formData.trim}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">اختر الفئة/الطراز</option>
                    <option value="Base">Base - أساسي</option>
                    <option value="Limited">Limited - محدود</option>
                    <option value="Sport">Sport - رياضي</option>
                    <option value="Luxury">Luxury - فاخر</option>
                    <option value="Premium">Premium - مميز</option>
                    <option value="Executive">Executive - تنفيذي</option>
                    <option value="Comfort">Comfort - راحة</option>
                    <option value="Elegance">Elegance - أناقة</option>
                    <option value="Ambition">Ambition - طموح</option>
                    <option value="Exclusive">Exclusive - حصري</option>
                    <option value="Signature">Signature - توقيع</option>
                    <option value="Platinum">Platinum - بلاتيني</option>
                    <option value="Diamond">Diamond - ماسي</option>
                    <option value="Gold">Gold - ذهبي</option>
                    <option value="Silver">Silver - فضي</option>
                    <option value="Bronze">Bronze - برونزي</option>
                    <option value="Titanium">Titanium - تيتانيوم</option>
                    <option value="Carbon">Carbon - كربون</option>
                    <option value="Alpine">Alpine - جبلي</option>
                    <option value="Urban">Urban - حضري</option>
                    <option value="Rural">Rural - ريفي</option>
                    <option value="Adventure">Adventure - مغامرة</option>
                    <option value="Explorer">Explorer - مستكشف</option>
                    <option value="Navigator">Navigator - ملاح</option>
                    <option value="Pilot">Pilot - طيار</option>
                    <option value="Captain">Captain - قبطان</option>
                    <option value="Commander">Commander - قائد</option>
                    <option value="Leader">Leader - قائد</option>
                    <option value="Champion">Champion - بطل</option>
                    <option value="Winner">Winner - فائز</option>
                    <option value="Master">Master - سيد</option>
                    <option value="Professional">Professional - محترف</option>
                    <option value="Expert">Expert - خبير</option>
                    <option value="Specialist">Specialist - متخصص</option>
                    <option value="Advanced">Advanced - متقدم</option>
                    <option value="Ultimate">Ultimate - نهائي</option>
                    <option value="Supreme">Supreme - أعلى</option>
                    <option value="Elite">Elite - نخبة</option>
                    <option value="Royal">Royal - ملكي</option>
                    <option value="Imperial">Imperial - إمبراطوري</option>
                    <option value="Noble">Noble - نبيل</option>
                    <option value="Aristocrat">Aristocrat - أرستقراطي</option>
                    <option value="Classic">Classic - كلاسيكي</option>
                    <option value="Vintage">Vintage - عتيق</option>
                    <option value="Retro">Retro - رجعي</option>
                    <option value="Modern">Modern - حديث</option>
                    <option value="Contemporary">Contemporary - معاصر</option>
                    <option value="Futuristic">Futuristic - مستقبلي</option>
                    <option value="Innovative">Innovative - مبتكر</option>
                    <option value="Creative">Creative - إبداعي</option>
                    <option value="Dynamic">Dynamic - ديناميكي</option>
                    <option value="Energetic">Energetic - نشط</option>
                    <option value="Powerful">Powerful - قوي</option>
                    <option value="Robust">Robust - متين</option>
                    <option value="Sturdy">Sturdy - صلب</option>
                    <option value="Reliable">Reliable - موثوق</option>
                    <option value="Durable">Durable - دائم</option>
                    <option value="Efficient">Efficient - كفء</option>
                    <option value="Economic">Economic - اقتصادي</option>
                    <option value="Practical">Practical - عملي</option>
                    <option value="Functional">Functional - وظيفي</option>
                    <option value="Versatile">
                      Versatile - متعدد الاستخدامات
                    </option>
                    <option value="Flexible">Flexible - مرن</option>
                    <option value="Adaptable">Adaptable - قابل للتكيف</option>
                    <option value="Custom">Custom - مخصص</option>
                    <option value="Personal">Personal - شخصي</option>
                    <option value="Individual">Individual - فردي</option>
                    <option value="Unique">Unique - فريد</option>
                    <option value="Special">Special - خاص</option>
                    <option value="Rare">Rare - نادر</option>
                    <option value="Exotic">Exotic - غريب</option>
                    <option value="Luxurious">Luxurious - فاخر</option>
                    <option value="Elegant">Elegant - أنيق</option>
                    <option value="Sophisticated">Sophisticated - متطور</option>
                    <option value="Refined">Refined - مكرر</option>
                    <option value="Polished">Polished - مصقول</option>
                    <option value="Smooth">Smooth - ناعم</option>
                    <option value="Comfortable">Comfortable - مريح</option>
                    <option value="Cozy">Cozy - دافئ</option>
                    <option value="Spacious">Spacious - واسع</option>
                    <option value="Compact">Compact - مضغوط</option>
                    <option value="Mini">Mini - صغير</option>
                    <option value="Micro">Micro - دقيق</option>
                    <option value="Mega">Mega - ضخم</option>
                    <option value="Super">Super - خارق</option>
                    <option value="Hyper">Hyper - مفرط</option>
                    <option value="Ultra">Ultra - فائق</option>
                    <option value="Max">Max - أقصى</option>
                    <option value="Plus">Plus - زائد</option>
                    <option value="Pro">Pro - محترف</option>
                    <option value="S">S - إس</option>
                    <option value="SE">SE - إس إي</option>
                    <option value="SL">SL - إس إل</option>
                    <option value="SR">SR - إس آر</option>
                    <option value="ST">ST - إس تي</option>
                    <option value="GT">GT - جي تي</option>
                    <option value="GTS">GTS - جي تي إس</option>
                    <option value="GTR">GTR - جي تي آر</option>
                    <option value="RS">RS - آر إس</option>
                    <option value="R">R - آر</option>
                    <option value="S-Line">S-Line - إس لاين</option>
                    <option value="M-Sport">M-Sport - إم سبورت</option>
                    <option value="AMG">AMG - إيه إم جي</option>
                    <option value="M">M - إم</option>
                    <option value="Type-R">Type-R - تايب آر</option>
                    <option value="Type-S">Type-S - تايب إس</option>
                    <option value="Type-X">Type-X - تايب إكس</option>
                    <option value="Edition">Edition - إصدار</option>
                    <option value="Series">Series - سلسلة</option>
                    <option value="Generation">Generation - جيل</option>
                    <option value="Version">Version - إصدار</option>
                    <option value="Model">Model - نموذج</option>
                    <option value="Variant">Variant - متغير</option>
                    <option value="Configuration">Configuration - تكوين</option>
                    <option value="Package">Package - حزمة</option>
                    <option value="Bundle">Bundle - مجموعة</option>
                    <option value="Set">Set - مجموعة</option>
                    <option value="Collection">Collection - مجموعة</option>
                    <option value="Family">Family - عائلة</option>
                    <option value="Line">Line - خط</option>
                    <option value="Range">Range - نطاق</option>
                    <option value="Category">Category - فئة</option>
                    <option value="Class">Class - فئة</option>
                    <option value="Grade">Grade - درجة</option>
                    <option value="Level">Level - مستوى</option>
                    <option value="Tier">Tier - طبقة</option>
                    <option value="Rank">Rank - رتبة</option>
                    <option value="Status">Status - حالة</option>
                    <option value="Position">Position - موضع</option>
                    <option value="Place">Place - مكان</option>
                    <option value="Zone">Zone - منطقة</option>
                    <option value="Area">Area - منطقة</option>
                    <option value="Region">Region - منطقة</option>
                    <option value="Territory">Territory - إقليم</option>
                    <option value="Domain">Domain - مجال</option>
                    <option value="Field">Field - حقل</option>
                    <option value="Sector">Sector - قطاع</option>
                    <option value="Industry">Industry - صناعة</option>
                    <option value="Market">Market - سوق</option>
                    <option value="Segment">Segment - قطاع</option>
                    <option value="Division">Division - قسم</option>
                    <option value="Section">Section - قسم</option>
                    <option value="Part">Part - جزء</option>
                    <option value="Component">Component - مكون</option>
                    <option value="Element">Element - عنصر</option>
                    <option value="Unit">Unit - وحدة</option>
                    <option value="Module">Module - وحدة</option>
                    <option value="System">System - نظام</option>
                    <option value="Platform">Platform - منصة</option>
                    <option value="Framework">Framework - إطار</option>
                    <option value="Structure">Structure - هيكل</option>
                    <option value="Design">Design - تصميم</option>
                    <option value="Style">Style - أسلوب</option>
                    <option value="Theme">Theme - موضوع</option>
                    <option value="Pattern">Pattern - نمط</option>
                    <option value="Format">Format - تنسيق</option>
                    <option value="Layout">Layout - تخطيط</option>
                    <option value="Arrangement">Arrangement - ترتيب</option>
                    <option value="Organization">Organization - تنظيم</option>
                    <option value="Setup">Setup - إعداد</option>
                    <option value="Configuration">Configuration - تكوين</option>
                    <option value="Assembly">Assembly - تجميع</option>
                    <option value="Installation">Installation - تثبيت</option>
                    <option value="Implementation">
                      Implementation - تنفيذ
                    </option>
                    <option value="Deployment">Deployment - نشر</option>
                    <option value="Launch">Launch - إطلاق</option>
                    <option value="Release">Release - إصدار</option>
                    <option value="Version">Version - إصدار</option>
                    <option value="Build">Build - بناء</option>
                    <option value="Construction">Construction - بناء</option>
                    <option value="Development">Development - تطوير</option>
                    <option value="Production">Production - إنتاج</option>
                    <option value="Manufacturing">Manufacturing - تصنيع</option>
                    <option value="Fabrication">Fabrication - تصنيع</option>
                    <option value="Creation">Creation - إنشاء</option>
                    <option value="Formation">Formation - تكوين</option>
                    <option value="Generation">Generation - توليد</option>
                    <option value="Origin">Origin - أصل</option>
                    <option value="Source">Source - مصدر</option>
                    <option value="Root">Root - جذر</option>
                    <option value="Base">Base - أساس</option>
                    <option value="Foundation">Foundation - أساس</option>
                    <option value="Core">Core - جوهر</option>
                    <option value="Center">Center - مركز</option>
                    <option value="Middle">Middle - وسط</option>
                    <option value="Central">Central - مركزي</option>
                    <option value="Main">Main - رئيسي</option>
                    <option value="Primary">Primary - أساسي</option>
                    <option value="Secondary">Secondary - ثانوي</option>
                    <option value="Tertiary">Tertiary - ثالث</option>
                    <option value="Quaternary">Quaternary - رابع</option>
                    <option value="First">First - أول</option>
                    <option value="Second">Second - ثاني</option>
                    <option value="Third">Third - ثالث</option>
                    <option value="Fourth">Fourth - رابع</option>
                    <option value="Fifth">Fifth - خامس</option>
                    <option value="Sixth">Sixth - سادس</option>
                    <option value="Seventh">Seventh - سابع</option>
                    <option value="Eighth">Eighth - ثامن</option>
                    <option value="Ninth">Ninth - تاسع</option>
                    <option value="Tenth">Tenth - عاشر</option>
                    <option value="Alpha">Alpha - ألفا</option>
                    <option value="Beta">Beta - بيتا</option>
                    <option value="Gamma">Gamma - جاما</option>
                    <option value="Delta">Delta - دلتا</option>
                    <option value="Epsilon">Epsilon - إبسيلون</option>
                    <option value="Zeta">Zeta - زيتا</option>
                    <option value="Eta">Eta - إيتا</option>
                    <option value="Theta">Theta - ثيتا</option>
                    <option value="Iota">Iota - أيوتا</option>
                    <option value="Kappa">Kappa - كابا</option>
                    <option value="Lambda">Lambda - لامدا</option>
                    <option value="Mu">Mu - مو</option>
                    <option value="Nu">Nu - نو</option>
                    <option value="Xi">Xi - كسي</option>
                    <option value="Omicron">Omicron - أوميكرون</option>
                    <option value="Pi">Pi - باي</option>
                    <option value="Rho">Rho - رو</option>
                    <option value="Sigma">Sigma - سيجما</option>
                    <option value="Tau">Tau - تاو</option>
                    <option value="Upsilon">Upsilon - أبسيلون</option>
                    <option value="Phi">Phi - فاي</option>
                    <option value="Chi">Chi - تشي</option>
                    <option value="Psi">Psi - بسي</option>
                    <option value="Omega">Omega - أوميغا</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع الهيكل
                  </label>
                  <select
                    name="bodyType"
                    value={formData.bodyType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">اختر نوع الهيكل</option>
                    <option value="سيدان">سيدان</option>
                    <option value="سيارة رياضية متعددة الأغراض">
                      سيارة رياضية متعددة الأغراض
                    </option>
                    <option value="شاحنة">شاحنة</option>
                    <option value="كابريوليه">كابريوليه</option>
                    <option value="كوبيه">كوبيه</option>
                    <option value="ستيشن واجن">ستيشن واجن</option>
                    <option value="هاتشباك">هاتشباك</option>
                    <option value="فان">فان</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع الوقود
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">اختر نوع الوقود</option>
                    <option value="بنزين">بنزين</option>
                    <option value="ديزل">ديزل</option>
                    <option value="كهربائي">كهربائي</option>
                    <option value="هجين">هجين</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ناقل الحركة
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">اختر ناقل الحركة</option>
                    <option value="أوتوماتيك">أوتوماتيك</option>
                    <option value="يدوي">يدوي</option>
                    <option value="نصف أوتوماتيك">نصف أوتوماتيك</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    اللون الخارجي
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="مثال: أبيض، أسود، أحمر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    المحرك
                  </label>
                  <input
                    type="text"
                    name="engine"
                    value={formData.engine}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="مثال: 6 أسطوانات أوتوماتيك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    عدد الحوادث
                  </label>
                  <select
                    name="accidents"
                    value={formData.accidents}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={0}>لا توجد حوادث</option>
                    <option value={1}>حادث واحد</option>
                    <option value={2}>حادثان</option>
                    <option value={3}>3 حوادث</option>
                    <option value={4}>4 حوادث أو أكثر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    عدد المالكين
                  </label>
                  <select
                    name="owners"
                    value={formData.owners}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>مالك واحد</option>
                    <option value={2}>مالكان</option>
                    <option value={3}>3 ملاك</option>
                    <option value={4}>4 ملاك أو أكثر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع الاستخدام
                  </label>
                  <select
                    name="usage"
                    value={formData.usage}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="personal">استخدام شخصي</option>
                    <option value="commercial">استخدام تجاري</option>
                    <option value="rental">سيارة تأجير</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    رقم الشاصي
                  </label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="رقم الشاصي (اختياري)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    سيارة مضمونة
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.certified}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const newData = {
                            ...prev,
                            certified: e.target.checked,
                          };
                          saveFormDataToStorage(newData, setShowSavedIndicator);
                          return newData;
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      علامة على أن السيارة مضمونة
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الموقع
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="مثال: الرياض، جدة"
                  />
                </div>
              </div>

              {/* Features Selection */}
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-4">المميزات المتوفرة</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableFeatures.map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6">الوصف والصور</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    وصف السيارة *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="اكتب وصفاً مفصلاً للسيارة..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    صور السيارة
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium text-emerald-600 hover:text-emerald-500">
                          انقر لاختيار الصور
                        </span>{" "}
                        أو اسحب وأفلت الصور هنا
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF حتى 10MB
                      </p>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    يمكنك رفع عدة صور (اختياري) - الصور الأولى ستظهر في البطاقة
                    الرئيسية
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">الصور المرفوعة:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate text-center">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6">معلومات التواصل</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="الاسم الكامل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    رقم الجوال *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="05xxxxxxxx"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <motion.button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                السابق
              </motion.button>
            )}

            {currentStep < 4 ? (
              <motion.button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 cursor-pointer bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                التالي
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال الإعلان"}
              </motion.button>
            )}
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default SellCar;
