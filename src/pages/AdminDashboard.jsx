import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCarAdvertisements,
  updateCarAdvertisementStatus,
  deleteCarAdvertisement,
  updateCarAdvertisementFields,
} from "../services/carService";
import {
  getApprovedProductsCount,
  getOrdersCount,
  getCustomersCount,
  getTotalRevenue,
  getAdCountsByStatus,
  getTotalViews,
  getTotalFavorites,
  getBrandsDistribution,
  debugCarAdvertisements,
} from "../services/analyticsService";
import { adminLogout, onAdminAuthStateChanged } from "../services/authService";
import { db } from "../services/firebase";

const AdminDashboard = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve', 'reject', 'delete', 'edit'
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
    views: 0,
    favorites: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    brands: [],
  });
  const [editForm, setEditForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAdminAuthStateChanged((user) => {
      if (!user) {
        navigate("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    loadAdvertisements();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Debug first to see what's in the database
      await debugCarAdvertisements();

      const [
        products,
        orders,
        customers,
        revenue,
        statusCounts,
        views,
        favs,
        brands,
      ] = await Promise.all([
        getApprovedProductsCount(),
        getOrdersCount(),
        getCustomersCount(),
        getTotalRevenue(),
        getAdCountsByStatus(),
        getTotalViews(),
        getTotalFavorites(),
        getBrandsDistribution(),
      ]);
      setStats({
        products,
        orders,
        customers,
        revenue,
        views,
        favorites: favs,
        pending: statusCounts.pending,
        approved: statusCounts.approved,
        rejected: statusCounts.rejected,
        brands,
      });
    } catch (e) {
      console.error("Error loading analytics:", e);
    }
  };

  const loadAdvertisements = async () => {
    try {
      setIsLoading(true);
      console.log("Loading advertisements...");
      const ads = await getAllCarAdvertisements();
      console.log("Loaded advertisements:", ads);
      console.log(
        "Advertisement statuses:",
        ads.map((ad) => ({ id: ad.id, status: ad.status }))
      );
      setAdvertisements(ads);
    } catch (error) {
      console.error("Error loading advertisements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (ad, type) => {
    setSelectedAd(ad);
    setActionType(type);
    setAdminNotes("");
    if (type === "edit") {
      setEditForm({
        price: ad.price || "",
        originalPrice: ad.originalPrice || "",
        mileage: ad.mileage || "",
        condition: ad.condition || "",
        contactName: ad.contactName || "",
        contactPhone: ad.contactPhone || "",
        contactEmail: ad.contactEmail || "",
      });
    }
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedAd) return;

    setIsProcessing(true);
    try {
      console.log(
        "Performing action:",
        actionType,
        "on advertisement:",
        selectedAd.id
      );
      console.log("Current advertisement status:", selectedAd.status);

      if (actionType === "delete") {
        await deleteCarAdvertisement(selectedAd.id);
        console.log("Advertisement deleted successfully");
      } else if (actionType === "edit") {
        await updateCarAdvertisementFields(selectedAd.id, editForm);
        console.log("Advertisement updated successfully");
      } else {
        // For approve/reject actions
        console.log("Updating advertisement status to:", actionType);
        await updateCarAdvertisementStatus(
          selectedAd.id,
          actionType,
          adminNotes
        );
        console.log("Advertisement status updated successfully");
      }

      // Reload data
      console.log("Reloading advertisements and stats...");
      await Promise.all([loadAdvertisements(), loadStats()]);

      setShowModal(false);
      setSelectedAd(null);
      setAdminNotes("");
      setEditForm(null);

      console.log("Action completed successfully");
    } catch (error) {
      console.error("Error performing action:", error);
      alert("فشل في تنفيذ العملية: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "في الانتظار" },
      approved: { color: "bg-green-100 text-green-800", text: "معتمد" },
      rejected: { color: "bg-red-100 text-red-800", text: "مرفوض" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getFilteredAdvertisements = () => {
    if (filter === "all") return advertisements;
    return advertisements.filter((ad) => ad.status === filter);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "غير محدد";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("ar-SA");
  };

  const filteredAds = getFilteredAdvertisements();

  // Debug function to manually approve the first advertisement
  const debugApproveFirstAd = async () => {
    try {
      if (advertisements.length > 0) {
        const firstAd = advertisements[0];
        console.log("Attempting to approve advertisement:", firstAd.id);
        await updateCarAdvertisementStatus(
          firstAd.id,
          "approved",
          "Debug approval"
        );
        console.log("Advertisement approved successfully!");
        await loadAdvertisements();
        await loadStats();
      } else {
        console.log("No advertisements to approve");
      }
    } catch (error) {
      console.error("Error approving advertisement:", error);
    }
  };

  // Function to manually apply paid package to an advertisement
  const applyPaidPackageToAd = async (adId, packageType = "basic") => {
    try {
      console.log(
        "Applying paid package to advertisement:",
        adId,
        "Package:",
        packageType
      );

      const { doc, updateDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const adRef = doc(db, "carAdvertisements", adId);

      // Calculate expiration date
      const now = new Date();
      let expirationDate;
      let packageName;
      let paidFeatures;

      switch (packageType) {
        case "basic":
          expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          packageName = "الباقة الأساسية";
          paidFeatures = [
            "ظهور مميز في أعلى النتائج",
            "إحصائيات مفصلة للمشاهدات",
            "شارة إعلان مميز",
          ];
          break;
        case "premium":
          expirationDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
          packageName = "الباقة المميزة";
          paidFeatures = [
            "ظهور مميز في أعلى النتائج",
            "إحصائيات مفصلة للمشاهدات",
            "شارة إعلان مميز",
            "ظهور في الصفحة الرئيسية",
            "إشعارات فورية للمشترين",
            "دعم فني مخصص",
          ];
          break;
        case "vip":
          expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          packageName = "الباقة VIP";
          paidFeatures = [
            "ظهور مميز في أعلى النتائج",
            "إحصائيات مفصلة للمشاهدات",
            "شارة إعلان مميز",
            "ظهور في الصفحة الرئيسية",
            "إشعارات فورية للمشترين",
            "دعم فني مخصص",
            "ظهور في جميع الصفحات",
            "إعلان فيديو قصير",
            "مدير حساب شخصي",
          ];
          break;
      }

      const updateData = {
        isPaid: true,
        paidPackageId: packageType,
        paidPackageName: packageName,
        paidPackageExpiration: expirationDate,
        paidFeatures: paidFeatures,
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(adRef, updateData);
      console.log("Paid package applied successfully!");

      // Reload data
      await loadAdvertisements();
      await loadStats();

      alert(`تم تطبيق ${packageName} على الإعلان بنجاح!`);
    } catch (error) {
      console.error("Error applying paid package:", error);
      alert("فشل في تطبيق الباقة: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              لوحة تحكم المدير
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/admin/packages")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                إدارة الباقات
              </button>
              <button
                onClick={() => navigate("/admin/payments")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                التحويلات و المدفوعات
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                العودة للصفحة الرئيسية
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: "📦", label: "إجمالي المنتجات", value: stats.products },
            { icon: "🧾", label: "إجمالي الطلبات", value: stats.orders },
            { icon: "👤", label: "العملاء", value: stats.customers },
            {
              icon: "💰",
              label: "إجمالي الإيرادات",
              value: `${stats.revenue.toLocaleString("ar-SA")} ريال`,
            },
          ].map((card, idx) => (
            <div
              key={card.label}
              className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
            >
              <span className="text-3xl">{card.icon}</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
                <div className="text-sm text-gray-600">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: "👁️", label: "إجمالي المشاهدات", value: stats.views },
            { icon: "❤️", label: "الإعجابات", value: stats.favorites },
            { icon: "⏳", label: "قيد الانتظار", value: stats.pending },
            { icon: "✅", label: "المعتمدة", value: stats.approved },
          ].map((card, idx) => (
            <div
              key={card.label}
              className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
            >
              <span className="text-3xl">{card.icon}</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
                <div className="text-sm text-gray-600">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand distribution */}
        {stats.brands && stats.brands.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">
              توزيع الإعلانات حسب الماركة
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.brands.slice(0, 12).map((b) => (
                <div
                  key={b.brand}
                  className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2"
                >
                  <span className="text-sm text-gray-700">{b.brand}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {b.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              في الانتظار
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              معتمد
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              مرفوض
            </button>
          </div>
        </div>

        {/* Advertisements List */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد إعلانات {filter !== "all" && `بالحالة: ${filter}`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السيارة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      بيانات المُعلن
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAds.map((ad, index) => (
                    <div key={ad.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={
                                ad.images && ad.images.length > 0
                                  ? ad.images[0].url
                                  : "/placeholder-car.jpg"
                              }
                              alt="Car"
                            />
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">
                              {ad.year} {ad.brand} {ad.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ad.mileage} كم • {ad.condition}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {ad.price} ريال
                        </div>
                        {ad.originalPrice && ad.originalPrice !== ad.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {ad.originalPrice} ريال
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ad.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(ad.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="space-y-1">
                          <div>
                            <span className="text-gray-500">الاسم:</span>{" "}
                            {ad.contactName || "-"}
                          </div>
                          <div>
                            <span className="text-gray-500">الجوال:</span>{" "}
                            {ad.contactPhone || "-"}
                          </div>
                          <div>
                            <span className="text-gray-500">البريد:</span>{" "}
                            {ad.contactEmail || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {ad.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(ad, "approve")}
                                className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                              >
                                اعتماد
                              </button>
                              <button
                                onClick={() => handleAction(ad, "reject")}
                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                              >
                                رفض
                              </button>
                            </>
                          )}
                          {ad.status === "approved" && !ad.isPaid && (
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  applyPaidPackageToAd(ad.id, "basic")
                                }
                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-md transition-colors text-xs"
                                title="تطبيق الباقة الأساسية"
                              >
                                أساسية
                              </button>
                              <button
                                onClick={() =>
                                  applyPaidPackageToAd(ad.id, "premium")
                                }
                                className="text-orange-600 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded-md transition-colors text-xs"
                                title="تطبيق الباقة المميزة"
                              >
                                مميزة
                              </button>
                              <button
                                onClick={() =>
                                  applyPaidPackageToAd(ad.id, "vip")
                                }
                                className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded-md transition-colors text-xs"
                                title="تطبيق الباقة VIP"
                              >
                                VIP
                              </button>
                            </div>
                          )}
                          {ad.isPaid && (
                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md text-xs">
                              {ad.paidPackageName || "مدفوع"}
                            </span>
                          )}
                          <button
                            onClick={() => handleAction(ad, "edit")}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleAction(ad, "delete")}
                            className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </div>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {actionType === "approve" && "اعتماد الإعلان"}
                {actionType === "reject" && "رفض الإعلان"}
                {actionType === "delete" && "حذف الإعلان"}
                {actionType === "edit" && "تعديل بيانات الإعلان"}
              </h3>

              {(actionType === "approve" || actionType === "reject") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات المدير (اختياري)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أضف ملاحظاتك هنا..."
                  />
                </div>
              )}

              {actionType === "edit" && editForm && (
                <div className="space-y-3">
                  {[
                    { key: "price", label: "السعر" },
                    { key: "originalPrice", label: "السعر قبل الخصم" },
                    { key: "mileage", label: "الممشى" },
                    { key: "condition", label: "الحالة" },
                    { key: "contactName", label: "اسم المُعلن" },
                    { key: "contactPhone", label: "جوال المُعلن" },
                    { key: "contactEmail", label: "بريد المُعلن" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm text-gray-700 mb-1">
                        {f.label}
                      </label>
                      <input
                        value={editForm[f.key]}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [f.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditForm(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmAction}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : actionType === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : actionType === "edit"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                  } disabled:opacity-50`}
                >
                  {isProcessing ? "جاري التنفيذ..." : "تأكيد"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
