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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve', 'reject', 'delete', 'edit', 'preview'
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

      console.log("Analytics data loaded:", {
        products,
        orders,
        customers,
        revenue,
        statusCounts,
        views,
        favs,
        brands,
      });

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

    if (type === "preview") {
      setShowPreviewModal(true);
      return;
    }

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

      // Close modal first
      setShowModal(false);
      setSelectedAd(null);
      setAdminNotes("");
      setEditForm(null);

      // Show success message
      const actionText =
        actionType === "approve"
          ? "اعتماد"
          : actionType === "reject"
          ? "رفض"
          : actionType === "delete"
          ? "حذف"
          : "تحديث";
      alert(`تم ${actionText} الإعلان بنجاح`);

      // Reload data with longer delay to ensure Firestore updates are propagated
      console.log("Reloading advertisements and stats...");
      setTimeout(async () => {
        try {
          await Promise.all([loadAdvertisements(), loadStats()]);
          console.log("Data reloaded successfully");
        } catch (error) {
          console.error("Error reloading data:", error);
        }
      }, 2000);

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
    // Normalize status values to handle inconsistencies
    let normalizedStatus = status;
    if (status === "approve") normalizedStatus = "approved";
    if (status === "في الانتظار") normalizedStatus = "pending";

    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "في الانتظار" },
      approved: { color: "bg-green-100 text-green-800", text: "معتمد" },
      rejected: { color: "bg-red-100 text-red-800", text: "مرفوض" },
    };

    const config = statusConfig[normalizedStatus] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getFilteredAdvertisements = () => {
    console.log("=== FILTERING ADVERTISEMENTS DEBUG ===");
    console.log("Current filter:", filter);
    console.log("Total advertisements:", advertisements.length);

    // Debug: Show all advertisement statuses
    console.log("All advertisement statuses:");
    advertisements.forEach((ad, index) => {
      console.log(`Ad ${index + 1}:`, {
        id: ad.id,
        brand: ad.brand,
        model: ad.model,
        status: ad.status,
        statusType: typeof ad.status,
        statusLength: ad.status ? ad.status.length : 0,
        createdAt: ad.createdAt,
        // Show all fields to identify the issue
        allFields: ad,
      });
    });

    if (filter === "all") {
      console.log("Showing all advertisements");
      return advertisements;
    }

    // Check for different possible status values and normalize them
    const matchingAds = advertisements.filter((ad) => {
      let adStatus = ad.status;

      // Normalize status values
      if (adStatus === "approve") adStatus = "approved";
      if (adStatus === "في الانتظار") adStatus = "pending";

      const matches = adStatus === filter;
      console.log(
        `Ad ${ad.id}: original status="${ad.status}", normalized="${adStatus}", filter="${filter}", matches: ${matches}`
      );
      return matches;
    });

    console.log("Matching advertisements count:", matchingAds.length);
    console.log(
      "Matching advertisements:",
      matchingAds.map((ad) => ({ id: ad.id, status: ad.status }))
    );

    return matchingAds;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "غير محدد";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("ar-SA");
  };

  const filteredAds = getFilteredAdvertisements();

  // Function to move advertisement to paid section
  const moveToPaidSection = async (adId, packageType = "basic") => {
    try {
      console.log(
        "Moving advertisement to paid section:",
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
      console.log("Advertisement moved to paid section successfully!");

      // Reload data
      await loadAdvertisements();
      await loadStats();

      alert(
        `تم نقل الإعلان إلى قسم الإعلانات المدفوعة بنجاح! (${packageName})`
      );
    } catch (error) {
      console.error("Error moving advertisement to paid section:", error);
      alert("فشل في نقل الإعلان: " + error.message);
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
          ].map((card) => (
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
          ].map((card) => (
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
          <div className="flex flex-wrap gap-4 items-center">
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
                  {filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
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
                          {(ad.status === "approved" ||
                            ad.status === "approve") &&
                            !ad.isPaid && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() =>
                                    moveToPaidSection(ad.id, "basic")
                                  }
                                  className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-md transition-colors text-xs"
                                  title="نقل إلى الإعلانات المدفوعة - الباقة الأساسية"
                                >
                                  أساسية
                                </button>
                                <button
                                  onClick={() =>
                                    moveToPaidSection(ad.id, "premium")
                                  }
                                  className="text-orange-600 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded-md transition-colors text-xs"
                                  title="نقل إلى الإعلانات المدفوعة - الباقة المميزة"
                                >
                                  مميزة
                                </button>
                                <button
                                  onClick={() =>
                                    moveToPaidSection(ad.id, "vip")
                                  }
                                  className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded-md transition-colors text-xs"
                                  title="نقل إلى الإعلانات المدفوعة - الباقة VIP"
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
                          <button
                            onClick={() => handleAction(ad, "preview")}
                            className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md transition-colors"
                          >
                            عرض
                          </button>
                        </div>
                      </td>
                    </tr>
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

      {/* Preview Modal */}
      {showPreviewModal && selectedAd && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                تفاصيل الإعلان - {selectedAd.year} {selectedAd.brand}{" "}
                {selectedAd.model}
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-600 hover:text-gray-900 text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Images Section */}
              <div className="lg:col-span-1">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  صور السيارة
                </h4>
                <div className="space-y-3">
                  {selectedAd.images && selectedAd.images.length > 0 ? (
                    selectedAd.images.map((img, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden"
                      >
                        <img
                          src={img.url || img}
                          alt={`Car ${index + 1}`}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=صورة+غير+متوفرة";
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="border rounded-lg p-8 text-center">
                      <p className="text-sm text-gray-500">
                        لا توجد صور متوفرة
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Car Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      تفاصيل السيارة
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">السنة:</span>
                        <span className="font-medium">
                          {selectedAd.year || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الماركة:</span>
                        <span className="font-medium">
                          {selectedAd.brand || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الموديل:</span>
                        <span className="font-medium">
                          {selectedAd.model || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الفئة/الطراز:</span>
                        <span className="font-medium">
                          {selectedAd.trim || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الممشى:</span>
                        <span className="font-medium">
                          {selectedAd.mileage
                            ? `${selectedAd.mileage} كم`
                            : "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الحالة:</span>
                        <span className="font-medium">
                          {selectedAd.condition || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">نوع الهيكل:</span>
                        <span className="font-medium">
                          {selectedAd.bodyType || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">نوع الوقود:</span>
                        <span className="font-medium">
                          {selectedAd.fuelType || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ناقل الحركة:</span>
                        <span className="font-medium">
                          {selectedAd.transmission || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">اللون:</span>
                        <span className="font-medium">
                          {selectedAd.color || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المحرك:</span>
                        <span className="font-medium">
                          {selectedAd.engine || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">عدد الحوادث:</span>
                        <span className="font-medium">
                          {selectedAd.accidents || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">عدد المالكين:</span>
                        <span className="font-medium">
                          {selectedAd.owners || 1}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">نوع الاستخدام:</span>
                        <span className="font-medium">
                          {selectedAd.usage === "personal"
                            ? "شخصي"
                            : selectedAd.usage === "commercial"
                            ? "تجاري"
                            : selectedAd.usage === "rental"
                            ? "تأجير"
                            : "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">قابل للتفاوض:</span>
                        <span className="font-medium">
                          {selectedAd.negotiable ? "نعم" : "لا"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      السعر والحالة
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">السعر الحالي:</span>
                        <span className="font-bold text-lg text-green-600">
                          {selectedAd.price
                            ? `${selectedAd.price} ريال`
                            : "غير محدد"}
                        </span>
                      </div>
                      {selectedAd.originalPrice &&
                        selectedAd.originalPrice !== selectedAd.price && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">السعر الأصلي:</span>
                            <span className="font-medium line-through text-gray-500">
                              {selectedAd.originalPrice} ريال
                            </span>
                          </div>
                        )}
                      {selectedAd.discount && selectedAd.discount !== "0" && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">الخصم:</span>
                          <span className="font-medium text-red-600">
                            {selectedAd.discount} ريال
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">حالة الإعلان:</span>
                        <span>{getStatusBadge(selectedAd.status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">تاريخ الإنشاء:</span>
                        <span className="font-medium">
                          {formatDate(selectedAd.createdAt)}
                        </span>
                      </div>
                      {selectedAd.updatedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">آخر تحديث:</span>
                          <span className="font-medium">
                            {formatDate(selectedAd.updatedAt)}
                          </span>
                        </div>
                      )}
                      {selectedAd.isPaid && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              الباقة المدفوعة:
                            </span>
                            <span className="font-medium text-purple-600">
                              {selectedAd.paidPackageName || "مدفوع"}
                            </span>
                          </div>
                          {selectedAd.paidPackageExpiration && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                تاريخ انتهاء الباقة:
                              </span>
                              <span className="font-medium">
                                {formatDate(selectedAd.paidPackageExpiration)}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      بيانات المُعلن
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">الاسم:</span>
                        <span className="font-medium">
                          {selectedAd.contactName || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">رقم الجوال:</span>
                        <span className="font-medium">
                          {selectedAd.contactPhone || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          البريد الإلكتروني:
                        </span>
                        <span className="font-medium">
                          {selectedAd.contactEmail || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الموقع:</span>
                        <span className="font-medium">
                          {selectedAd.location || "غير محدد"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features & Description */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      المميزات والوصف
                    </h4>
                    <div className="space-y-3">
                      {selectedAd.features &&
                        selectedAd.features.length > 0 && (
                          <div>
                            <span className="text-gray-600 text-sm">
                              المميزات المتوفرة:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedAd.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {selectedAd.paidFeatures &&
                        selectedAd.paidFeatures.length > 0 && (
                          <div>
                            <span className="text-gray-600 text-sm">
                              مميزات الباقة المدفوعة:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedAd.paidFeatures.map((feature, index) => (
                                <span
                                  key={index}
                                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {selectedAd.description && (
                        <div>
                          <span className="text-gray-600 text-sm">الوصف:</span>
                          <p className="text-sm mt-1 bg-white p-2 rounded border">
                            {selectedAd.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
