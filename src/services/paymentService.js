import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// Create a new payment order
export const createPaymentOrder = async (paymentData) => {
  try {
    console.log("Creating payment order:", paymentData);

    // Upload receipt image to Firebase Storage
    let receiptUrl = null;
    if (paymentData.receiptImage) {
      try {
        const storageRef = ref(
          storage,
          `payment-receipts/${Date.now()}_${paymentData.receiptImage.name}`
        );
        const snapshot = await uploadBytes(
          storageRef,
          paymentData.receiptImage
        );
        receiptUrl = await getDownloadURL(snapshot.ref);
        console.log("Receipt uploaded:", receiptUrl);
      } catch (storageError) {
        console.error("Error uploading receipt image:", storageError);

        // Handle CORS or permission errors
        if (
          storageError.code === "storage/unauthorized" ||
          storageError.message.includes("CORS") ||
          storageError.code === "storage/object-not-found"
        ) {
          console.warn(
            "Firebase Storage issue detected. Using local blob URL as fallback."
          );
          // Create a local blob URL as fallback
          receiptUrl = URL.createObjectURL(paymentData.receiptImage);
        } else {
          throw new Error("فشل في رفع صورة الإيصال: " + storageError.message);
        }
      }
    }

    // Create payment order document
    const paymentOrder = {
      packageId: paymentData.packageId,
      packageName: paymentData.packageName,
      amount: paymentData.amount,
      duration: paymentData.duration,
      customerName: paymentData.customerName,
      customerPhone: paymentData.customerPhone,
      customerEmail: paymentData.customerEmail,
      advertisementId: paymentData.advertisementId || "",
      notes: paymentData.notes || "",
      receiptUrl: receiptUrl,
      status: "pending", // pending, approved, rejected
      adminNotes: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("Attempting to save payment order to Firestore:", paymentOrder);

    const docRef = await addDoc(collection(db, "paymentOrders"), paymentOrder);
    console.log("Payment order created with ID:", docRef.id);

    return {
      id: docRef.id,
      ...paymentOrder,
    };
  } catch (error) {
    console.error("Error creating payment order:", error);

    // Provide more specific error messages
    if (error.code === "permission-denied") {
      throw new Error(
        "خطأ في الصلاحيات: تأكد من إعداد قواعد Firestore بشكل صحيح"
      );
    } else if (error.code === "unavailable") {
      throw new Error("خطأ في الاتصال: تأكد من اتصال الإنترنت");
    } else if (error.message.includes("CORS")) {
      throw new Error("خطأ في رفع الصورة: مشكلة في إعدادات Firebase Storage");
    } else {
      throw new Error("فشل في إنشاء طلب الدفع: " + error.message);
    }
  }
};

// Create test payment order for basic package (for testing)
export const createTestPaymentOrder = async (advertisementId) => {
  try {
    console.log("Creating test payment order for basic package");

    const testPaymentOrder = {
      packageId: "basic",
      packageName: "الباقة الأساسية",
      amount: 50,
      duration: "7 أيام",
      customerName: "محمد سانتاوي",
      customerPhone: "0501234567",
      customerEmail: "mosantawi@gmail.com",
      advertisementId: advertisementId,
      notes: "طلب تجريبي للباقة الأساسية",
      receiptUrl: "https://example.com/test-receipt.jpg",
      status: "pending",
      adminNotes: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "paymentOrders"), testPaymentOrder);
    console.log("Test payment order created with ID:", docRef.id);

    return {
      id: docRef.id,
      ...testPaymentOrder
    };
  } catch (error) {
    console.error("Error creating test payment order:", error);
    throw new Error("فشل في إنشاء طلب دفع تجريبي: " + error.message);
  }
};

// Get all payment orders (for admin)
export const getAllPaymentOrders = async () => {
  try {
    const { collection, getDocs, query, orderBy } = await import(
      "firebase/firestore"
    );
    const q = query(
      collection(db, "paymentOrders"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting payment orders:", error);
    throw new Error("فشل في جلب طلبات الدفع: " + error.message);
  }
};

// Update payment order status (for admin)
export const updatePaymentOrderStatus = async (
  orderId,
  status,
  adminNotes = ""
) => {
  try {
    const { doc, updateDoc } = await import("firebase/firestore");
    const orderRef = doc(db, "paymentOrders", orderId);

    await updateDoc(orderRef, {
      status: status,
      adminNotes: adminNotes,
      updatedAt: serverTimestamp(),
    });

    console.log("Payment order status updated:", orderId, status);
  } catch (error) {
    console.error("Error updating payment order status:", error);
    throw new Error("فشل في تحديث حالة طلب الدفع: " + error.message);
  }
};

// Get payment orders by customer email
export const getPaymentOrdersByCustomer = async (customerEmail) => {
  try {
    const { collection, getDocs, query, where, orderBy } = await import(
      "firebase/firestore"
    );
    const q = query(
      collection(db, "paymentOrders"),
      where("customerEmail", "==", customerEmail),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting customer payment orders:", error);
    throw new Error("فشل في جلب طلبات الدفع: " + error.message);
  }
};

// Get payment statistics (for admin dashboard)
export const getPaymentStatistics = async () => {
  try {
    const { collection, getDocs, query, where } = await import(
      "firebase/firestore"
    );

    // Get all orders
    const allOrdersQuery = query(collection(db, "paymentOrders"));
    const allOrdersSnapshot = await getDocs(allOrdersQuery);

    // Get pending orders
    const pendingOrdersQuery = query(
      collection(db, "paymentOrders"),
      where("status", "==", "pending")
    );
    const pendingOrdersSnapshot = await getDocs(pendingOrdersQuery);

    // Get approved orders
    const approvedOrdersQuery = query(
      collection(db, "paymentOrders"),
      where("status", "==", "approved")
    );
    const approvedOrdersSnapshot = await getDocs(approvedOrdersQuery);

    // Calculate statistics
    const totalOrders = allOrdersSnapshot.size;
    const pendingOrders = pendingOrdersSnapshot.size;
    const approvedOrders = approvedOrdersSnapshot.size;

    // Calculate total revenue
    let totalRevenue = 0;
    approvedOrdersSnapshot.forEach((doc) => {
      const data = doc.data();
      totalRevenue += data.amount || 0;
    });

    return {
      totalOrders,
      pendingOrders,
      approvedOrders,
      totalRevenue,
    };
  } catch (error) {
    console.error("Error getting payment statistics:", error);
    throw new Error("فشل في جلب إحصائيات المدفوعات: " + error.message);
  }
};

// Apply package features to advertisement when payment is approved
export const applyPackageToAdvertisement = async (paymentOrder) => {
  try {
    const { doc, updateDoc, getDoc, collection, query, where, orderBy, limit, getDocs } = await import("firebase/firestore");

    console.log("Applying package to advertisement:", paymentOrder);

    let advertisementId = paymentOrder.advertisementId;
    let advertisement = null;

    // If no specific advertisement ID provided, find the user's most recent approved advertisement
    if (!advertisementId) {
      console.log("No advertisement ID provided, searching for user's most recent approved advertisement");

      const userAdsQuery = query(
        collection(db, "carAdvertisements"),
        where("userEmail", "==", paymentOrder.customerEmail),
        where("isApproved", "==", true),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const userAdsSnapshot = await getDocs(userAdsQuery);

      if (!userAdsSnapshot.empty) {
        const userAdDoc = userAdsSnapshot.docs[0];
        advertisementId = userAdDoc.id;
        advertisement = userAdDoc.data();
        console.log("Found user's most recent approved advertisement:", advertisementId);
      } else {
        console.log("No approved advertisements found for user:", paymentOrder.customerEmail);
        return { success: false, message: "لم يتم العثور على إعلانات معتمدة للمستخدم" };
      }
    } else {
      // Get the specific advertisement
      const adRef = doc(db, "carAdvertisements", advertisementId);
      const adSnap = await getDoc(adRef);

      if (!adSnap.exists()) {
        console.log("Advertisement not found:", advertisementId);
        return { success: false, message: "الإعلان غير موجود" };
      }

      advertisement = adSnap.data();
    }

    // Calculate expiration date based on package duration
    const now = new Date();
    let expirationDate;

    switch (paymentOrder.duration) {
      case "7 أيام":
        expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "14 يوم":
        expirationDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        break;
      case "30 يوم":
        expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days
    }

    // Update advertisement with package features
    const updateData = {
      isPaid: true,
      paidPackageId: paymentOrder.packageId,
      paidPackageName: paymentOrder.packageName,
      paidPackageExpiration: expirationDate,
      paidAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add package-specific features based on package type
    switch (paymentOrder.packageId) {
      case "basic":
        updateData.paidFeatures = [
          "ظهور مميز في أعلى النتائج",
          "إحصائيات مفصلة للمشاهدات",
          "شارة إعلان مميز",
        ];
        break;
      case "premium":
        updateData.paidFeatures = [
          "ظهور مميز في أعلى النتائج",
          "إحصائيات مفصلة للمشاهدات",
          "شارة إعلان مميز",
          "ظهور في الصفحة الرئيسية",
          "إشعارات فورية للمشترين",
          "دعم فني مخصص",
        ];
        break;
      case "vip":
        updateData.paidFeatures = [
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

    const adRef = doc(db, "carAdvertisements", advertisementId);
    await updateDoc(adRef, updateData);

    console.log("Package applied successfully to advertisement:", advertisementId);

    return {
      success: true,
      message: "تم تطبيق الباقة على الإعلان بنجاح",
      advertisementId: advertisementId,
      expirationDate: expirationDate
    };
  } catch (error) {
    console.error("Error applying package to advertisement:", error);
    throw new Error("فشل في تطبيق الباقة على الإعلان: " + error.message);
  }
};

// Update payment order status and apply package (for admin)
export const approvePaymentAndApplyPackage = async (
  orderId,
  adminNotes = ""
) => {
  try {
    console.log("Approving payment and applying package:", orderId);

    // First, get the payment order
    const { doc, getDoc } = await import("firebase/firestore");
    const orderRef = doc(db, "paymentOrders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      throw new Error("طلب الدفع غير موجود");
    }

    const paymentOrder = { id: orderSnap.id, ...orderSnap.data() };

    // Update payment status to approved
    await updatePaymentOrderStatus(orderId, "approved", adminNotes);

    // Apply package features to advertisement
    const result = await applyPackageToAdvertisement(paymentOrder);

    console.log("Payment approved and package applied:", result);

    return result;
  } catch (error) {
    console.error("Error approving payment and applying package:", error);
    throw new Error(
      "فشل في الموافقة على الدفع وتطبيق الباقة: " + error.message
    );
  }
};
