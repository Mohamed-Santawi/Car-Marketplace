import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getAllPaymentOrders,
  updatePaymentOrderStatus,
  getPaymentStatistics,
  approvePaymentAndApplyPackage,
} from "../services/paymentService";
import { adminLogout, onAdminAuthStateChanged } from "../services/authService";

const AdminPayments = () => {
  const [paymentOrders, setPaymentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve', 'reject'
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    totalRevenue: 0,
  });
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
    loadPaymentOrders();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statistics = await getPaymentStatistics();
      setStats(statistics);
    } catch (error) {
      console.error("Error loading payment statistics:", error);
    }
  };

  const loadPaymentOrders = async () => {
    try {
      setIsLoading(true);
      const orders = await getAllPaymentOrders();
      setPaymentOrders(orders);
    } catch (error) {
      console.error("Error loading payment orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setAdminNotes("");
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedOrder) return;

    setIsProcessing(true);
    try {
      if (actionType === "approved") {
        // Use the new function that applies package features
        const result = await approvePaymentAndApplyPackage(selectedOrder.id, adminNotes);
        console.log("Payment approved and package applied:", result);

        if (result.success) {
          alert(`تمت الموافقة على الدفع بنجاح!\n${result.message}`);
        } else {
          alert(`تمت الموافقة على الدفع ولكن: ${result.message}`);
        }
      } else {
        // For rejections, use the old function
        await updatePaymentOrderStatus(selectedOrder.id, actionType, adminNotes);
      }

      await Promise.all([loadPaymentOrders(), loadStats()]);
      setShowModal(false);
      setSelectedOrder(null);
      setAdminNotes("");
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

  const getFilteredOrders = () => {
    if (filter === "all") return paymentOrders;
    return paymentOrders.filter((order) => order.status === filter);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "غير محدد";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("ar-SA");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(price);
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              التحويلات و المدفوعات
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                العودة للوحة التحكم
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
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: "💰", label: "إجمالي الطلبات", value: stats.totalOrders },
            { icon: "⏳", label: "في الانتظار", value: stats.pendingOrders },
            { icon: "✅", label: "معتمد", value: stats.approvedOrders },
            {
              icon: "💵",
              label: "إجمالي الإيرادات",
              value: formatPrice(stats.totalRevenue),
            },
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
            >
              <span className="text-3xl">{card.icon}</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
                <div className="text-sm text-gray-600">{card.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

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

        {/* Payment Orders List */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد طلبات دفع {filter !== "all" && `بالحالة: ${filter}`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      بيانات العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الباقة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإيصال
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-gray-500">
                            {order.customerPhone}
                          </div>
                          <div className="text-gray-500">
                            {order.customerEmail}
                          </div>
                          {order.advertisementId && (
                            <div className="text-gray-500">
                              رقم الإعلان: {order.advertisementId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.packageName}
                          </div>
                          <div className="text-gray-500">{order.duration}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(order.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.receiptUrl ? (
                          <button
                            onClick={() =>
                              window.open(order.receiptUrl, "_blank")
                            }
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                          >
                            عرض الإيصال
                          </button>
                        ) : (
                          <span className="text-gray-400">غير متوفر</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(order, "approved")}
                                className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                              >
                                اعتماد
                              </button>
                              <button
                                onClick={() => handleAction(order, "rejected")}
                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                              >
                                رفض
                              </button>
                            </>
                          )}
                          {order.adminNotes && (
                            <div className="text-xs text-gray-500 mt-1">
                              ملاحظات: {order.adminNotes}
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
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
                {actionType === "approved" && "اعتماد طلب الدفع"}
                {actionType === "rejected" && "رفض طلب الدفع"}
              </h3>

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

              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmAction}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    actionType === "approved"
                      ? "bg-green-600 hover:bg-green-700"
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

export default AdminPayments;
