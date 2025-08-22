import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Default packages structure
const defaultPackages = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    price: 50,
    duration: "7 أيام",
    features: [
      "ظهور مميز في أعلى النتائج",
      "إحصائيات مفصلة للمشاهدات",
      "شارة إعلان مميز",
    ],
    color: "gray",
    gradient: "from-gray-400 to-gray-600",
    bgGradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-200",
    hoverBorder: "hover:border-gray-300",
    selectedBorder: "border-gray-500",
    isPopular: false,
    isActive: true,
  },
  {
    id: "premium",
    name: "الباقة المميزة",
    price: 100,
    duration: "14 يوم",
    features: [
      "كل مميزات الباقة الأساسية",
      "ظهور في الصفحة الرئيسية",
      "إشعارات فورية للمشترين",
      "دعم فني مخصص",
    ],
    color: "orange",
    gradient: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-50 to-orange-100",
    borderColor: "border-yellow-200",
    hoverBorder: "hover:border-yellow-300",
    selectedBorder: "border-yellow-500",
    isPopular: true,
    isActive: true,
  },
  {
    id: "vip",
    name: "الباقة VIP",
    price: 200,
    duration: "30 يوم",
    features: [
      "كل مميزات الباقة المميزة",
      "ظهور في جميع الصفحات",
      "إعلان فيديو قصير",
      "مدير حساب شخصي",
    ],
    color: "teal",
    gradient: "from-teal-500 to-cyan-600",
    bgGradient: "from-teal-50 to-cyan-100",
    borderColor: "border-teal-200",
    hoverBorder: "hover:border-teal-300",
    selectedBorder: "border-teal-500",
    isPopular: false,
    isActive: true,
  },
];

// Get all packages
export const getAllPackages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "promotionPackages"));
    console.log("Firestore query result - empty:", querySnapshot.empty);
    console.log("Firestore query result - size:", querySnapshot.size);

    if (querySnapshot.empty) {
      // If no packages exist, create default packages
      console.log("No packages found in database, initializing defaults...");
      await initializeDefaultPackages();
      console.log("Returning default packages:", defaultPackages);
      return defaultPackages;
    }

    const packagesFromDB = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Packages from database:", packagesFromDB);
    console.log("Database packages count:", packagesFromDB.length);

    return packagesFromDB;
  } catch (error) {
    console.error("Error getting packages:", error);
    // Return default packages if there's an error
    console.log("Error occurred, returning default packages:", defaultPackages);
    return defaultPackages;
  }
};

// Get a single package by ID
export const getPackageById = async (packageId) => {
  try {
    const docRef = doc(db, "promotionPackages", packageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Return default package if not found
      return defaultPackages.find((pkg) => pkg.id === packageId);
    }
  } catch (error) {
    console.error("Error getting package:", error);
    return defaultPackages.find((pkg) => pkg.id === packageId);
  }
};

// Create a new package
export const createPackage = async (packageData) => {
  try {
    const docRef = await addDoc(collection(db, "promotionPackages"), {
      ...packageData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...packageData };
  } catch (error) {
    console.error("Error creating package:", error);
    throw new Error("فشل في إنشاء الباقة: " + error.message);
  }
};

// Update a package
export const updatePackage = async (packageId, packageData) => {
  try {
    const docRef = doc(db, "promotionPackages", packageId);
    await updateDoc(docRef, {
      ...packageData,
      updatedAt: new Date(),
    });
    return { id: packageId, ...packageData };
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("فشل في تحديث الباقة: " + error.message);
  }
};

// Delete a package
export const deletePackage = async (packageId) => {
  try {
    const docRef = doc(db, "promotionPackages", packageId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting package:", error);
    throw new Error("فشل في حذف الباقة: " + error.message);
  }
};

// Initialize default packages in Firestore
const initializeDefaultPackages = async () => {
  try {
    for (const pkg of defaultPackages) {
      await addDoc(collection(db, "promotionPackages"), {
        ...pkg,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    console.log("Default packages initialized successfully");
  } catch (error) {
    console.error("Error initializing default packages:", error);
  }
};

// Clear all packages and reinitialize (for fixing duplication issues)
export const clearAndReinitializePackages = async () => {
  try {
    console.log("Clearing all packages...");
    const querySnapshot = await getDocs(collection(db, "promotionPackages"));

    // Delete all existing packages
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log("All packages deleted, reinitializing...");

    // Reinitialize with default packages
    await initializeDefaultPackages();

    console.log("Packages reinitialized successfully");
    return true;
  } catch (error) {
    console.error("Error clearing and reinitializing packages:", error);
    throw new Error("فشل في إعادة تهيئة الباقات: " + error.message);
  }
};

// Get active packages only
export const getActivePackages = async () => {
  try {
    const packages = await getAllPackages();
    console.log("All packages from database:", packages);

    const activePackages = packages.filter((pkg) => pkg.isActive !== false);
    console.log("Active packages:", activePackages);

    // Remove duplicates based on ID
    const uniqueActivePackages = activePackages.filter((pkg, index, self) =>
      index === self.findIndex(p => p.id === pkg.id)
    );

    console.log("Unique active packages:", uniqueActivePackages);
    return uniqueActivePackages;
  } catch (error) {
    console.error("Error getting active packages:", error);
    const defaultActivePackages = defaultPackages.filter((pkg) => pkg.isActive !== false);
    console.log("Returning default active packages:", defaultActivePackages);
    return defaultActivePackages;
  }
};
