import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "./firebase";

// Debug function to check what's in the database
export const debugCarAdvertisements = async () => {
  try {
    console.log("=== DEBUGGING CAR ADVERTISEMENTS ===");
    const snap = await getDocs(collection(db, "carAdvertisements"));
    console.log("Total documents found:", snap.size);

    snap.forEach((doc, index) => {
      const data = doc.data();
      console.log(`Document ${index + 1}:`, {
        id: doc.id,
        brand: data.brand,
        model: data.model,
        status: data.status,
        price: data.price,
        userId: data.userId,
        userEmail: data.userEmail,
        createdAt: data.createdAt,
        // Show all fields for debugging
        allFields: data
      });
    });

    return snap.size;
  } catch (error) {
    console.error("Debug error:", error);
    return 0;
  }
};

// Count approved car advertisements (products)
export const getApprovedProductsCount = async () => {
  try {
    console.log("=== COUNTING APPROVED PRODUCTS ===");
    const q = query(
      collection(db, "carAdvertisements"),
      where("status", "==", "approved")
    );
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count || 0;
    console.log("Approved products count:", count);
    return count;
  } catch (error) {
    console.error("Error counting approved products:", error);
    return 0;
  }
};

// Count total users (from car advertisements - unique users who posted ads)
export const getCustomersCount = async () => {
  try {
    console.log("=== COUNTING UNIQUE USERS ===");
    const snap = await getDocs(collection(db, "carAdvertisements"));
    const uniqueUsers = new Set();
    snap.forEach((doc) => {
      const userId = doc.data()?.userId || doc.data()?.user?.uid || "unknown";
      uniqueUsers.add(userId);
      console.log("Found user ID:", userId);
    });
    console.log("Unique users count:", uniqueUsers.size);
    return uniqueUsers.size;
  } catch (error) {
    console.warn("Error counting unique users:", error);
    return 0;
  }
};

// Count total advertisements (all car ads)
export const getOrdersCount = async () => {
  try {
    console.log("=== COUNTING TOTAL ADVERTISEMENTS ===");
    const q = query(collection(db, "carAdvertisements"));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count || 0;
    console.log("Total advertisements count:", count);
    return count;
  } catch (error) {
    console.warn("Error counting total advertisements:", error);
    return 0;
  }
};

// Calculate total value of approved advertisements
export const getTotalRevenue = async () => {
  try {
    console.log("=== CALCULATING TOTAL REVENUE ===");
    const q = query(
      collection(db, "carAdvertisements"),
      where("status", "==", "approved")
    );
    const snap = await getDocs(q);
    let total = 0;
    snap.forEach((doc) => {
      const price = Number(doc.data()?.price || 0);
      console.log("Found approved ad with price:", price);
      if (!Number.isNaN(price)) total += price;
    });
    console.log("Total revenue:", total);
    return total;
  } catch (error) {
    console.warn("Error calculating total revenue:", error);
    return 0;
  }
};

// Get counts of ads by status
export const getAdCountsByStatus = async () => {
  try {
    console.log("=== COUNTING ADS BY STATUS ===");
    const statuses = ["pending", "approved", "rejected"];
    const result = { pending: 0, approved: 0, rejected: 0 };
    await Promise.all(
      statuses.map(async (s) => {
        const q = query(
          collection(db, "carAdvertisements"),
          where("status", "==", s)
        );
        const snapshot = await getCountFromServer(q);
        result[s] = snapshot.data().count || 0;
        console.log(`Status ${s}:`, result[s]);
      })
    );
    console.log("Status counts result:", result);
    return result;
  } catch (e) {
    console.error("Error getting ad counts by status:", e);
    return { pending: 0, approved: 0, rejected: 0 };
  }
};

// Total views across all ads
export const getTotalViews = async () => {
  try {
    const snap = await getDocs(collection(db, "carAdvertisements"));
    let total = 0;
    snap.forEach((doc) => {
      const views = Number(doc.data()?.views || 0);
      if (!Number.isNaN(views)) total += views;
    });
    return total;
  } catch (e) {
    console.error("Error getting total views:", e);
    return 0;
  }
};

// Total favorites across all ads
export const getTotalFavorites = async () => {
  try {
    const snap = await getDocs(collection(db, "carAdvertisements"));
    let total = 0;
    snap.forEach((doc) => {
      const favs = Number(doc.data()?.favorites || 0);
      if (!Number.isNaN(favs)) total += favs;
    });
    return total;
  } catch (e) {
    console.error("Error getting total favorites:", e);
    return 0;
  }
};

// Brand distribution (counts per brand)
export const getBrandsDistribution = async () => {
  try {
    const snap = await getDocs(collection(db, "carAdvertisements"));
    const dist = {};
    snap.forEach((doc) => {
      const brand = doc.data()?.brand || "غير محدد";
      dist[brand] = (dist[brand] || 0) + 1;
    });
    // Convert to sorted array
    return Object.entries(dist)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error("Error getting brand distribution:", e);
    return [];
  }
};
