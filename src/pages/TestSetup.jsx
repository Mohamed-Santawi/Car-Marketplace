import React, { useState } from "react";
import { createTestAdvertisementForUser } from "../services/carService";
import { createTestPaymentOrder } from "../services/paymentService";

const TestSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const setupTestData = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log("Setting up test data for mosantawi@gmail.com");

      // Step 1: Create test advertisement
      const advertisement = await createTestAdvertisementForUser();
      console.log("Test advertisement created:", advertisement);

      // Step 2: Create test payment order
      const paymentOrder = await createTestPaymentOrder(advertisement.id);
      console.log("Test payment order created:", paymentOrder);

      setResult({
        success: true,
        message: "تم إنشاء البيانات التجريبية بنجاح!",
        advertisement: advertisement,
        paymentOrder: paymentOrder
      });

    } catch (error) {
      console.error("Error setting up test data:", error);
      setResult({
        success: false,
        message: "فشل في إنشاء البيانات التجريبية: " + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            إعداد البيانات التجريبية
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              للبريد الإلكتروني: mosantawi@gmail.com
            </h2>
            <p className="text-gray-600 mb-4">
              هذا الصفحة تنشئ:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>إعلان سيارة تجريبي (تويوتا كامري 2020)</li>
              <li>طلب دفع للباقة الأساسية (50 ريال)</li>
              <li>حالة الطلب: في الانتظار</li>
            </ul>
          </div>

          <button
            onClick={setupTestData}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                جاري الإنشاء...
              </div>
            ) : (
              "إنشاء البيانات التجريبية"
            )}
          </button>

          {result && (
            <div className={`mt-8 p-6 rounded-xl ${
              result.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}>
              <h3 className={`text-lg font-bold mb-2 ${
                result.success ? "text-green-800" : "text-red-800"
              }`}>
                {result.success ? "✅ نجح" : "❌ فشل"}
              </h3>
              <p className={`${
                result.success ? "text-green-700" : "text-red-700"
              }`}>
                {result.message}
              </p>

              {result.success && result.advertisement && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">تفاصيل الإعلان:</h4>
                  <p className="text-sm text-gray-600">ID: {result.advertisement.id}</p>
                  <p className="text-sm text-gray-600">السيارة: {result.advertisement.brand} {result.advertisement.model}</p>
                  <p className="text-sm text-gray-600">السعر: {result.advertisement.price} ريال</p>
                </div>
              )}

              {result.success && result.paymentOrder && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">تفاصيل طلب الدفع:</h4>
                  <p className="text-sm text-gray-600">ID: {result.paymentOrder.id}</p>
                  <p className="text-sm text-gray-600">الباقة: {result.paymentOrder.packageName}</p>
                  <p className="text-sm text-gray-600">المبلغ: {result.paymentOrder.amount} ريال</p>
                  <p className="text-sm text-gray-600">الحالة: {result.paymentOrder.status}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-lg font-bold text-blue-800 mb-4">الخطوات التالية:</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-2">
              <li>اذهب إلى <a href="/admin/payments" className="underline font-semibold">صفحة إدارة المدفوعات</a></li>
              <li>ابحث عن طلب الدفع الجديد</li>
              <li>اضغط على "موافقة" لتطبيق الباقة على الإعلان</li>
              <li>عد إلى <a href="/" className="underline font-semibold">الصفحة الرئيسية</a> لرؤية الإعلان في قسم "إعلانات مدفوعة مميزة"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSetup;