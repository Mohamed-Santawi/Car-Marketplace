import React, { useState } from "react";
import { motion } from "framer-motion";

const PaidAdvertisements = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const promotionPackages = [
    {
      id: "basic",
      name: "الباقة الأساسية",
      price: 99,
      duration: "7 أيام",
      features: [
        "ظهور الإعلان في أعلى القائمة",
        "تمييز الإعلان بلون مميز",
        "عرض الإعلان 3 مرات يومياً",
        "إحصائيات المشاهدات",
      ],
      color: "blue",
    },
    {
      id: "premium",
      name: "الباقة المميزة",
      price: 199,
      duration: "14 يوم",
      features: [
        "جميع مميزات الباقة الأساسية",
        "ظهور الإعلان في الصفحة الرئيسية",
        "عرض الإعلان 5 مرات يومياً",
        "إحصائيات مفصلة",
        "دعم فني مخصص",
      ],
      color: "green",
    },
    {
      id: "vip",
      name: "الباقة VIP",
      price: 399,
      duration: "30 يوم",
      features: [
        "جميع مميزات الباقة المميزة",
        "ظهور الإعلان في جميع الصفحات",
        "عرض الإعلان 10 مرات يومياً",
        "إحصائيات شاملة",
        "دعم فني على مدار الساعة",
        "تخصيص تصميم الإعلان",
      ],
      color: "purple",
    },
  ];

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
  };

  const handlePayment = async () => {
    if (!selectedPackage) {
      alert("الرجاء اختيار باقة الترويج");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    alert("تم الدفع بنجاح! سيتم تفعيل الترويج خلال 24 ساعة.");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ترقية إعلانك
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اجعل إعلانك يظهر بشكل مميز ووصل إلى أكبر عدد من المشترين المحتملين
            من خلال باقات الترويج المتنوعة
          </p>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
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
            </div>
            <h3 className="text-lg font-semibold mb-2">ظهور مميز</h3>
            <p className="text-gray-600">
              إعلانك سيظهر في أعلى النتائج وبشكل مميز
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">إحصائيات مفصلة</h3>
            <p className="text-gray-600">
              احصل على تقارير مفصلة عن أداء إعلانك
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">أسعار تنافسية</h3>
            <p className="text-gray-600">باقات متنوعة تناسب جميع الميزانيات</p>
          </div>
        </motion.div>

        {/* Packages Section */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {promotionPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-300 ${
                selectedPackage === pkg.id
                  ? `border-${pkg.color}-500 shadow-xl scale-105`
                  : "border-gray-200 hover:border-gray-300"
              }`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {pkg.id === "premium" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر طلباً
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {pkg.price} ريال
                  </div>
                  <div className="text-gray-600">لمدة {pkg.duration}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className={`w-5 h-5 text-${pkg.color}-500 mt-0.5 ml-2 flex-shrink-0`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedPackage === pkg.id
                      ? `bg-${pkg.color}-600 text-white`
                      : `bg-${pkg.color}-100 text-${pkg.color}-700 hover:bg-${pkg.color}-200`
                  }`}
                >
                  {selectedPackage === pkg.id ? "تم الاختيار" : "اختيار الباقة"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Section */}
        {selectedPackage && (
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-center mb-6">
              إتمام عملية الدفع
            </h3>

            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">الباقة المختارة:</span>
                  <span className="font-semibold">
                    {
                      promotionPackages.find((p) => p.id === selectedPackage)
                        ?.name
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">السعر:</span>
                  <span className="font-semibold">
                    {
                      promotionPackages.find((p) => p.id === selectedPackage)
                        ?.price
                    }{" "}
                    ريال
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-semibold">
                    {
                      promotionPackages.find((p) => p.id === selectedPackage)
                        ?.duration
                    }
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    رقم البطاقة
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      تاريخ الانتهاء
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      رمز الأمان
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    اسم حامل البطاقة
                  </label>
                  <input
                    type="text"
                    placeholder="الاسم كما يظهر على البطاقة"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <motion.button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? "جاري معالجة الدفع..." : "إتمام الدفع"}
              </motion.button>

              <p className="text-sm text-gray-500 text-center mt-4">
                جميع المدفوعات آمنة ومشفرة
              </p>
            </div>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          className="mt-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            الأسئلة الشائعة
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold mb-2">كيف يتم تفعيل الترويج؟</h4>
              <p className="text-gray-600">
                يتم تفعيل الترويج خلال 24 ساعة من إتمام عملية الدفع بنجاح.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold mb-2">هل يمكن إلغاء الترويج؟</h4>
              <p className="text-gray-600">
                يمكن إلغاء الترويج خلال 48 ساعة من التفعيل مع استرداد المبلغ.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold mb-2">كيف أحصل على الإحصائيات؟</h4>
              <p className="text-gray-600">
                ستجد الإحصائيات في لوحة التحكم الخاصة بك بعد تفعيل الترويج.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold mb-2">
                هل الترويج متاح لجميع الإعلانات؟
              </h4>
              <p className="text-gray-600">
                نعم، يمكن ترقية أي إعلان نشط على الموقع.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaidAdvertisements;
