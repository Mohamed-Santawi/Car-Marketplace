import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { getCarAdvertisementById } from "../services/carService";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AdvertisementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not authenticated
        navigate("/login", {
          state: {
            message: "يجب تسجيل الدخول لعرض تفاصيل الإعلان",
            redirectTo: `/advertisement/${id}`,
          },
        });
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, id]);

  useEffect(() => {
    const loadAdvertisement = async () => {
      try {
        setLoading(true);
        const ad = await getCarAdvertisementById(id);
        if (ad) {
          setAdvertisement(ad);
        } else {
          setError("الإعلان غير موجود");
        }
      } catch (err) {
        console.error("Error loading advertisement:", err);
        setError("حدث خطأ في تحميل الإعلان");
      } finally {
        setLoading(false);
      }
    };

    if (id && isAuthenticated) {
      loadAdvertisement();
    }
  }, [id, isAuthenticated]);

  // Handle different image data structures
  const getImages = () => {
    if (!advertisement) return [];
    if (
      Array.isArray(advertisement.images) &&
      advertisement.images.length > 0
    ) {
      return advertisement.images;
    }
    if (advertisement.image) {
      return [advertisement.image];
    }
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

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToImage = (index) => setCurrentImageIndex(index);

  // Format price with commas
  const formatPrice = (price) => {
    if (!price) return "0";
    return Number(price).toLocaleString("ar-SA");
  };

  // Get car title
  const getCarTitle = () => {
    if (!advertisement) return "";
    const parts = [];
    if (advertisement.year) parts.push(advertisement.year);
    if (advertisement.brand) parts.push(advertisement.brand);
    if (advertisement.model) parts.push(advertisement.model);
    return parts.join(" ") || "سيارة للبيع";
  };

  // Get trim info
  const getTrimInfo = () => {
    if (!advertisement) return "";
    if (advertisement.trim) return advertisement.trim;
    if (advertisement.bodyType) return advertisement.bodyType;
    return "";
  };

  // Get mileage info
  const getMileageInfo = () => {
    if (!advertisement) return "غير محدد";
    if (advertisement.mileage) return `${advertisement.mileage} كم`;
    return "غير محدد";
  };

  // Get accident info
  const getAccidentInfo = () => {
    if (!advertisement) return "";
    if (advertisement.accidents === 0) return "لا توجد حوادث";
    if (advertisement.accidents === 1) return "حادث واحد";
    return `${advertisement.accidents} حوادث`;
  };

  // Get owner info
  const getOwnerInfo = () => {
    if (!advertisement) return "";
    if (advertisement.owners === 1) return "مالك واحد";
    return `${advertisement.owners} مالكين`;
  };

  // Get usage info
  const getUsageInfo = () => {
    if (!advertisement) return "";
    switch (advertisement.usage) {
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
    if (!advertisement) return [];
    if (
      Array.isArray(advertisement.features) &&
      advertisement.features.length > 0
    ) {
      return advertisement.features;
    }
    return [];
  };

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  // Don't render the content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (error || !advertisement) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            {error || "الإعلان غير موجود"}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <nav className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 ml-2"
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
              العودة
            </button>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="relative">
                  <img
                    src={resolveImageSrc(images[currentImageIndex])}
                    alt={getCarTitle()}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop";
                    }}
                  />

                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                      >
                        <svg
                          className="w-6 h-6"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                      >
                        <svg
                          className="w-6 h-6"
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

                  {/* Image indicators */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 space-x-reverse">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/60 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail images */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={resolveImageSrc(image)}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {getCarTitle()}
                </h1>
                {getTrimInfo() && (
                  <p className="text-lg text-gray-600 mb-4">{getTrimInfo()}</p>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    {advertisement.originalPrice &&
                      advertisement.originalPrice !== advertisement.price && (
                        <p className="text-lg text-gray-500 line-through">
                          {formatPrice(advertisement.originalPrice)} ريال
                        </p>
                      )}
                    <p className="text-3xl font-bold text-green-600">
                      {formatPrice(advertisement.price)} ريال
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        advertisement.negotiable
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {advertisement.negotiable
                        ? "قابل للتفاوض"
                        : "غير قابل للتفاوض"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  معلومات التواصل
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">رقم الهاتف:</span>
                    <span className="font-semibold text-gray-900">
                      {advertisement.contactPhone ||
                        advertisement.phoneNumber ||
                        "غير متوفر"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">الموقع:</span>
                    <span className="font-semibold text-gray-900">
                      {advertisement.location || "غير محدد"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">تاريخ الإعلان:</span>
                    <span className="font-semibold text-gray-900">
                      {advertisement.createdAt
                        ? new Date(
                            advertisement.createdAt.toDate()
                          ).toLocaleDateString("ar-SA")
                        : "غير محدد"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Car Specifications */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  مواصفات السيارة
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">الممشى:</span>
                    <span className="font-semibold text-gray-900">
                      {getMileageInfo()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">المحرك:</span>
                    <span className="font-semibold text-gray-900">
                      {advertisement.engine || "غير محدد"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">الحوادث:</span>
                    <span className="font-semibold text-gray-900">
                      {getAccidentInfo()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">عدد المالكين:</span>
                    <span className="font-semibold text-gray-900">
                      {getOwnerInfo()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">نوع الاستخدام:</span>
                    <span className="font-semibold text-gray-900">
                      {getUsageInfo()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">اللون:</span>
                    <span className="font-semibold text-gray-900">
                      {advertisement.color || "غير محدد"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              {getFeatures().length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    المميزات
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {getFeatures().map((feature, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {advertisement.description && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    الوصف
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {advertisement.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    className="flex-1 bg-green-600 cursor-pointer text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const phoneNumber =
                        advertisement.contactPhone || advertisement.phoneNumber;
                      if (phoneNumber) {
                        setShowPhoneDialog(true);
                      }
                    }}
                  >
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    اتصل الآن
                  </motion.button>

                  <motion.button
                    className="flex-1 cursor-pointer bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const phoneNumber =
                        advertisement.contactPhone || advertisement.phoneNumber;
                      if (phoneNumber) {
                        // Format phone number for WhatsApp (remove + and add country code if needed)
                        let formattedNumber = phoneNumber.replace(/[^\d]/g, "");
                        if (formattedNumber.startsWith("0")) {
                          formattedNumber =
                            "966" + formattedNumber.substring(1);
                        } else if (!formattedNumber.startsWith("966")) {
                          formattedNumber = "966" + formattedNumber;
                        }
                        window.open(
                          `https://wa.me/${formattedNumber}`,
                          "_blank"
                        );
                      }
                    }}
                  >
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    واتساب
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Phone Number Dialog */}
      {showPhoneDialog && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPhoneDialog(false)}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                رقم هاتف البائع
              </h3>

              <p className="text-2xl font-bold text-green-600 mb-6">
                {advertisement.contactPhone || advertisement.phoneNumber}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const phoneNumber =
                      advertisement.contactPhone || advertisement.phoneNumber;
                    if (phoneNumber) {
                      let formattedNumber = phoneNumber.replace(/[^\d]/g, "");
                      if (formattedNumber.startsWith("0")) {
                        formattedNumber = "+966" + formattedNumber.substring(1);
                      } else if (!formattedNumber.startsWith("966")) {
                        formattedNumber = "+966" + formattedNumber;
                      } else {
                        formattedNumber = "+" + formattedNumber;
                      }
                      window.open(`tel:${formattedNumber}`, "_self");
                    }
                    setShowPhoneDialog(false);
                  }}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  اتصل
                </button>

                <button
                  onClick={() => setShowPhoneDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvertisementDetails;
