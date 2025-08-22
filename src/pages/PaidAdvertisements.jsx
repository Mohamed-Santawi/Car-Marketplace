import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActivePackages, clearAndReinitializePackages } from "../services/packageService";

const PaidAdvertisements = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const packagesData = await getActivePackages();
      console.log("Loaded packages:", packagesData);
      console.log("Packages count:", packagesData.length);

      // Remove duplicates based on ID
      const uniquePackages = packagesData.filter((pkg, index, self) =>
        index === self.findIndex(p => p.id === pkg.id)
      );

      console.log("Unique packages:", uniquePackages);
      console.log("Unique packages count:", uniquePackages.length);

      // Limit to only 3 packages and sort by name to ensure consistent order
      const limitedPackages = uniquePackages
        .sort((a, b) => {
          // Sort: Basic, Premium, VIP
          const order = { "أساسي": 1, "مميز": 2, "VIP": 3 };
          const aOrder = order[a.name.includes("أساسي") ? "أساسي" : a.name.includes("مميز") ? "مميز" : "VIP"] || 4;
          const bOrder = order[b.name.includes("أساسي") ? "أساسي" : b.name.includes("مميز") ? "مميز" : "VIP"] || 4;
          return aOrder - bOrder;
        })
        .slice(0, 3);

      console.log("Final packages to display:", limitedPackages);
      console.log("Final packages count:", limitedPackages.length);

      setPackages(limitedPackages);
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (packageId) => {
    // Navigate to payment page with selected package
    navigate(`/payment/${packageId}`);
  };

  const handleClearAndReinitialize = async () => {
    try {
      await clearAndReinitializePackages();
      alert("تم إعادة تهيئة الباقات بنجاح");
      await loadPackages();
    } catch (error) {
      console.error("Error clearing packages:", error);
      alert("فشل في إعادة تهيئة الباقات: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الباقات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
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
          </div>
          <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r pb-2 inline-block from-blue-500 to-purple-600  bg-clip-text text-transparent mb-6">
            ترقية إعلانك
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            اجعل إعلانك يظهر بشكل مميز ووصل إلى أكبر عدد من المشترين المحتملين
            من خلال باقات الترويج المتنوعة والمدروسة بعناية
          </p>

          {/* Debug button - remove this after fixing the issue */}
          {/* <div className="mt-4">
            <button
              onClick={handleClearAndReinitialize}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              إعادة تهيئة الباقات (إصلاح التكرار)
            </button>
          </div> */}
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
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
            <h3 className="text-xl font-bold text-blue-600 mb-3">ظهور مميز</h3>
            <p className="text-gray-600 leading-relaxed">
              إعلانك سيظهر في أعلى النتائج وبشكل مميز مع تمييز بصري يجذب
              الانتباه
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
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
            <h3 className="text-xl font-bold text-green-600 mb-3">
              إحصائيات مفصلة
            </h3>
            <p className="text-gray-600 leading-relaxed">
              احصل على تقارير مفصلة عن أداء إعلانك مع تحليلات متقدمة للمشاهدات
              والتفاعل
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
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
            <h3 className="text-xl font-bold text-teal-600 mb-3">
              أسعار تنافسية
            </h3>
            <p className="text-gray-600 leading-relaxed">
              باقات متنوعة تناسب جميع الميزانيات مع ضمان عائد استثماري ممتاز
            </p>
          </div>
        </div>

        {/* Packages Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {packages.map((pkg) => {
            // Determine package style based on package name only
            let packageStyle = {
              icon: null,
              iconBg: "",
              borderColor: "",
              buttonBg: "",
              buttonHover: "",
              popularBadge: "",
            };

            if (pkg.name.includes("أساسي") || pkg.name.includes("Basic")) {
              // Basic Package Style
              packageStyle = {
                icon: (
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                iconBg: "bg-gradient-to-r from-gray-400 to-gray-600",
                borderColor: "border-transparent hover:border-yellow-200",
                buttonBg: "bg-gray-600",
                buttonHover: "hover:bg-gray-700",
                popularBadge: "",
              };
            } else if (
              pkg.name.includes("مميز") ||
              pkg.name.includes("Premium")
            ) {
              // Premium Package Style
              packageStyle = {
                icon: (
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ),
                iconBg: "bg-gradient-to-r from-yellow-400 to-orange-500",
                borderColor: "border-yellow-300",
                buttonBg: "bg-gradient-to-r from-yellow-400 to-orange-500",
                buttonHover: "hover:from-yellow-500 hover:to-orange-600",
                popularBadge: pkg.isPopular ? "الأكثر شعبية" : "",
              };
            } else if (
              pkg.name.includes("VIP") ||
              pkg.name.includes("فاي بي")
            ) {
              // VIP Package Style
              packageStyle = {
                icon: (
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
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                ),
                iconBg: "bg-gradient-to-r from-teal-500 to-cyan-600",
                borderColor: "border-transparent hover:border-teal-200",
                buttonBg: "bg-gradient-to-r from-teal-500 to-cyan-600",
                buttonHover: "hover:from-teal-600 hover:to-cyan-700",
                popularBadge: "",
              };
            } else {
              // Default style for any other packages
              packageStyle = {
                icon: (
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                iconBg: "bg-gradient-to-r from-blue-500 to-blue-600",
                borderColor: "border-transparent hover:border-blue-200",
                buttonBg: "bg-gradient-to-r from-blue-500 to-blue-600",
                buttonHover: "hover:from-blue-600 hover:to-blue-700",
                popularBadge: pkg.isPopular ? "الأكثر شعبية" : "",
              };
            }

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${packageStyle.borderColor} relative`}
              >
                {/* Popular Badge */}
                {packageStyle.popularBadge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {packageStyle.popularBadge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 ${packageStyle.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    {packageStyle.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {pkg.price} ريال
                  </div>
                  <p className="text-gray-600 text-sm">لمدة {pkg.duration}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-green-500 ml-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={`w-full ${packageStyle.buttonBg} cursor-pointer text-white py-3 px-6 rounded-xl font-semibold ${packageStyle.buttonHover} transition-all duration-300 text-center block`}
                >
                  اختيار الباقة
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              الأسئلة الشائعة
            </h3>
            <p className="text-gray-600 text-lg">
              إجابات على أكثر الأسئلة شيوعاً حول خدمات الترويج
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                كيف يتم تفعيل الترويج؟
              </h4>
              <p className="text-gray-600 leading-relaxed">
                يتم تفعيل الترويج خلال 24 ساعة من إتمام عملية الدفع بنجاح.
                ستتلقى إشعاراً بالتفعيل عبر البريد الإلكتروني.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                هل يمكن إلغاء الترويج؟
              </h4>
              <p className="text-gray-600 leading-relaxed">
                يمكن إلغاء الترويج خلال 48 ساعة من التفعيل مع استرداد المبلغ
                كاملاً. بعد ذلك يمكن الإلغاء مع خصم رسوم إدارية.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-teal-600"
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
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                كيف أحصل على الإحصائيات؟
              </h4>
              <p className="text-gray-600 leading-relaxed">
                ستجد الإحصائيات في لوحة التحكم الخاصة بك بعد تفعيل الترويج.
                يمكنك الوصول إليها من أي وقت ومن أي جهاز.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                هل الترويج متاح لجميع الإعلانات؟
              </h4>
              <p className="text-gray-600 leading-relaxed">
                نعم، يمكن ترقية أي إعلان نشط على الموقع. الإعلانات المرفوضة أو
                المحذوفة لا يمكن ترقيتها.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        {/* <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">هل تحتاج مساعدة؟</h3>
            <p className="text-xl mb-8 opacity-90">
              فريق الدعم الفني متاح على مدار الساعة لمساعدتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
                تواصل معنا
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-colors">
                الدردشة المباشرة
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PaidAdvertisements;
