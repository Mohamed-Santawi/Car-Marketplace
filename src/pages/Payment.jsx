import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPaymentOrder } from "../services/paymentService";
import { getPackageById } from "../services/packageService";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const Payment = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    advertisementId: "",
    notes: "",
  });

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        console.log("Loading package with ID:", packageId);

        const packageData = await getPackageById(packageId);
        console.log("Package data:", packageData);

        if (packageData) {
          setSelectedPackage(packageData);
        } else {
          console.error("Package not found");
          navigate("/paid-advertisements");
        }
      } catch (error) {
        console.error("Error loading package:", error);
        navigate("/paid-advertisements");
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      loadPackage();
    }
  }, [packageId, navigate]);

  useEffect(() => {
    if (!loading && !selectedPackage) {
      navigate("/paid-advertisements");
    }
  }, [selectedPackage, loading, navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("الرجاء رفع صورة الإيصال");
      return;
    }

    if (
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.customerEmail
    ) {
      alert("الرجاء ملء جميع البيانات المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentData = {
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        amount: selectedPackage.price,
        duration: selectedPackage.duration,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        advertisementId: formData.advertisementId,
        notes: formData.notes,
        receiptImage: selectedFile,
        status: "pending",
        createdAt: new Date(),
      };

      await createPaymentOrder(paymentData);
      alert(
        "تم إرسال طلب الدفع بنجاح! سيتم مراجعته من قبل الإدارة خلال 24 ساعة."
      );
      navigate("/paid-advertisements");
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert(
        error.message || "حدث خطأ في إرسال طلب الدفع. الرجاء المحاولة مرة أخرى."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      console.log("Testing Firebase connection...");

      // Test Firestore write
      const testDoc = await addDoc(collection(db, "test"), {
        test: true,
        timestamp: new Date(),
        message: "Payment test connection",
      });
      console.log("✅ Firestore write test passed:", testDoc.id);

      // Test Firestore read
      const testSnapshot = await getDocs(collection(db, "test"));
      console.log(
        "✅ Firestore read test passed:",
        testSnapshot.size,
        "documents"
      );

      alert("✅ اختبار الاتصال بنجاح! Firebase يعمل بشكل صحيح.");
    } catch (error) {
      console.error("❌ Firebase connection test failed:", error);
      alert("❌ فشل في اختبار الاتصال: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              جاري تحميل بيانات الباقة...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              الباقة غير موجودة
            </h2>
            <p className="text-gray-600 mb-6">
              الباقة المطلوبة غير متوفرة أو تم حذفها
            </p>
            <button
              onClick={() => navigate("/paid-advertisements")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              العودة إلى الباقات
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            إتمام عملية الدفع
          </h1>
          <p className="text-xl text-gray-600">
            اخترت {selectedPackage.name} - {selectedPackage.price} ريال
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Payment Instructions */}
          <div className="bg-white rounded-3xl col-span-2 shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              تعليمات الدفع
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  بيانات الحساب البنكي
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">البنك:</span>
                    <span className="font-bold text-gray-900">
                      Al-Rajhi Bank | الراجحي بنك
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">رقم الحساب:</span>
                    <span className="font-bold text-gray-900 font-mono">
                      552608016059943
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">IBAN:</span>
                    <span className="font-bold text-gray-900 font-mono text-sm">
                      SA2980000552608016059943
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-4">
                  خطوات الدفع
                </h3>
                <ol className="space-y-3 text-yellow-800">
                  <li className="flex items-start">
                    <span className="bg-yellow-500 ml-2 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      1
                    </span>
                    <span>
                      قم بتحويل المبلغ {selectedPackage.price} ريال إلى الحساب
                      المذكور أعلاه
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-500 ml-2 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      2
                    </span>
                    <span>احتفظ بصورة واضحة من إيصال التحويل</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-500 ml-2 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      3
                    </span>
                    <span>املأ النموذج أدناه وارفع صورة الإيصال</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-500 ml-2 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      4
                    </span>
                    <span>سيتم تفعيل الترويج خلال 24 ساعة من التأكيد</span>
                  </li>
                </ol>
              </div>

              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  معلومات مهمة
                </h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 ml-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>جميع المدفوعات آمنة ومشفرة</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 ml-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>سيتم إرسال تأكيد عبر البريد الإلكتروني</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 ml-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>دعم فني متاح على مدار الساعة</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 ml-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      إذا لم تضع رقم إعلان، سيتم ترقية آخر إعلان معتمد لك
                      تلقائياً
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              نموذج الدفع
            </h2>

            {/* Test Button - Temporary */}
            <button
              type="button"
              onClick={testFirebaseConnection}
              className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              اختبار الاتصال بـ Firebase
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Package Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ملخص الطلب
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الباقة:</span>
                    <span className="font-bold">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المدة:</span>
                    <span className="font-bold">
                      {selectedPackage.duration}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">المبلغ:</span>
                    <span className="font-bold text-green-600">
                      {selectedPackage.price} ريال
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رقم الجوال *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="05xxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رقم الإعلان (اختياري)
                  </label>
                  <input
                    type="text"
                    name="advertisementId"
                    value={formData.advertisementId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اتركه فارغاً لترقية آخر إعلان معتمد لك"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    💡 إذا لم تضع رقم إعلان، سيتم ترقية آخر إعلان معتمد لك
                    تلقائياً
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أي ملاحظات إضافية..."
                  />
                </div>
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  صورة إيصال التحويل *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-upload"
                    required
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Receipt preview"
                          className="max-w-full h-48 object-contain mx-auto rounded-lg"
                        />
                        <p className="text-sm text-gray-600">
                          انقر لتغيير الصورة
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            ارفع صورة الإيصال
                          </p>
                          <p className="text-sm text-gray-600">
                            PNG, JPG حتى 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 cursor-pointer rounded-2xl font-bold text-lg transition-all duration-300 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  "إرسال طلب الدفع"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
