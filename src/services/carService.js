// Car service for fetching real Saudi Arabia car data and images
import {
  getCarImageWithFallback,
  getSaudiCarData,
  getSaudiCarBrands,
  getSaudiCarModels,
  getSaudiCities,
} from "./imageService.js";
import {
  getRealSaudiCars,
  searchRealSaudiCars,
  getFeaturedRealSaudiCars,
  getRealSaudiCarsByCity,
  getRealSaudiCarsWithDiscounts,
  getRealSaudiLowMileageCars,
} from "./saudiCarAPI.js";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";
import app from "./firebase";
import { auth } from "./firebase";

// Collection name for car advertisements
const COLLECTION_NAME = "carAdvertisements";

// Test Firestore connection
export const testFirestoreConnection = async () => {
  try {
    console.log("=== FIREBASE CONNECTION TEST ===");
    console.log("Firebase app:", app);
    console.log("Firestore instance:", db);
    console.log("Firestore app name:", app.name);
    console.log("Firestore project ID:", app.options.projectId);

    // Test 1: Basic collection access
    console.log("Testing basic collection access...");
    const testCollection = collection(db, "test");
    console.log("Test collection reference:", testCollection);

    // Test 2: Read operation
    console.log("Testing read operation...");
    const testQuery = query(testCollection, limit(1));
    const readResult = await getDocs(testQuery);
    console.log(
      "Read operation successful:",
      readResult.docs.length,
      "documents"
    );

    // Test 3: Write operation
    console.log("Testing write operation...");
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: serverTimestamp(),
      message: "Test document from client",
    });
    console.log("Write operation successful, doc ID:", testDoc.id);

    // Test 4: Delete operation
    console.log("Testing delete operation...");
    await deleteDoc(doc(db, "test", testDoc.id));
    console.log("Delete operation successful");

    // Test 5: carAdvertisements collection specifically
    console.log("Testing carAdvertisements collection...");
    const carAdsCollection = collection(db, "carAdvertisements");
    console.log("carAdvertisements collection reference:", carAdsCollection);

    console.log("=== ALL TESTS PASSED ===");
    return true;
  } catch (error) {
    console.error("=== FIREBASE CONNECTION TEST FAILED ===");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error object:", error);

    if (error.code === "permission-denied") {
      console.error(
        "❌ PERMISSIONS ISSUE: Check Firestore rules in Firebase Console"
      );
      console.error(
        "Go to: https://console.firebase.google.com/project/readura-app-112fa/firestore/rules"
      );
      console.error(
        "Make sure rules allow read/write for carAdvertisements collection"
      );
    } else if (error.code === "unavailable") {
      console.error("❌ NETWORK ISSUE: Check internet connection");
    } else if (error.code === "not-found") {
      console.error("❌ COLLECTION NOT FOUND: Collection doesn't exist");
    }

    return false;
  }
};

// Generate additional Saudi car data based on Syarah.com patterns
const generateSaudiCarData = () => {
  const baseCars = getSaudiCarData();
  const additionalCars = [];
  const saudiCities = getSaudiCities();

  // Generate 12 more cars with realistic Saudi data
  for (let i = 9; i <= 20; i++) {
    const brands = getSaudiCarBrands().filter(
      (brand) => brand !== "جميع الماركات"
    );
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const models = getSaudiCarModels(brand) || ["موديل أساسي"];
    const model = models[Math.floor(Math.random() * models.length)];
    const year = 2020 + Math.floor(Math.random() * 5);
    const mileage = Math.floor(Math.random() * 150000) + 1000;
    const basePrice = 30000 + Math.floor(Math.random() * 120000);
    const discount =
      Math.random() > 0.7 ? Math.floor(Math.random() * 15000) + 1000 : 0;
    const price = basePrice - discount;

    additionalCars.push({
      id: i,
      brand,
      model,
      year: year.toString(),
      price: price.toLocaleString(),
      originalPrice: basePrice.toLocaleString(),
      discount: discount.toLocaleString(),
      mileage: mileage.toLocaleString(),
      condition: "مستعملة",
      guaranteed: true,
      lowMileage: mileage < 50000,
      city: saudiCities[Math.floor(Math.random() * saudiCities.length)],
      fuelType: ["بنزين", "ديزل", "كهربائي", "هجين"][
        Math.floor(Math.random() * 4)
      ],
      transmission: ["أوتوماتيك", "يدوي", "نصف أوتوماتيك"][
        Math.floor(Math.random() * 3)
      ],
      color: ["أبيض", "أسود", "فضي", "أزرق", "أحمر", "رمادي"][
        Math.floor(Math.random() * 6)
      ],
    });
  }

  return [...baseCars, ...additionalCars];
};

// Fetch car images using the Saudi image service
const fetchCarImages = async (brand, model) => {
  return await getCarImageWithFallback(brand, model);
};

// Upload image to Firebase Storage
export const uploadCarImage = async (file) => {
  try {
    const timestamp = Date.now();
    const fileName = `car-images/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: fileName,
      name: file.name,
    };
  } catch (error) {
    console.error("Error uploading image:", error);

    // If CORS error, provide a fallback solution
    if (
      error.code === "storage/unauthorized" ||
      error.message.includes("CORS")
    ) {
      console.warn("CORS issue detected. Using fallback image storage.");

      // Create a local blob URL as fallback
      const blobUrl = URL.createObjectURL(file);

      return {
        url: blobUrl,
        path: `local-images/${Date.now()}_${file.name}`,
        name: file.name,
        isLocal: true, // Flag to indicate this is a local blob
      };
    }

    throw new Error("فشل في رفع الصورة");
  }
};

// Upload multiple images
export const uploadCarImages = async (files) => {
  try {
    const uploadPromises = files.map((file) => uploadCarImage(file));
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.error("Error uploading images:", error);

    // If some images failed, try to upload them individually and collect successful ones
    console.log("Trying individual image uploads...");
    const successfulImages = [];

    for (const file of files) {
      try {
        const uploadedImage = await uploadCarImage(file);
        successfulImages.push(uploadedImage);
      } catch (individualError) {
        console.error("Failed to upload individual image:", individualError);
        // Continue with other images
      }
    }

    if (successfulImages.length === 0) {
      throw new Error("فشل في رفع جميع الصور");
    }

    console.log(
      `Successfully uploaded ${successfulImages.length} out of ${files.length} images`
    );
    return successfulImages;
  }
};

// Create new car advertisement
export const createCarAdvertisement = async (carData) => {
  try {
    console.log("Starting car advertisement creation...");
    console.log("Car data:", carData);

    // Get current user ID
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : "anonymous";

    // Upload images first (optional)
    let uploadedImages = [];
    if (carData.images && carData.images.length > 0) {
      console.log("Uploading images...");
      try {
        uploadedImages = await uploadCarImages(carData.images);
        console.log("Images uploaded:", uploadedImages);
      } catch (imageError) {
        console.warn(
          "Image upload failed, continuing without images:",
          imageError
        );
        uploadedImages = []; // Continue without images
      }
    }

    // Clean the car data - remove any undefined or null values
    const cleanCarData = {};
    Object.keys(carData).forEach((key) => {
      if (carData[key] !== undefined && carData[key] !== null) {
        cleanCarData[key] = carData[key];
      }
    });

    // Prepare car data for Firestore
    const carAdvertisement = {
      ...cleanCarData,
      userId: userId, // Add user ID for analytics
      userEmail: currentUser ? currentUser.email : "anonymous@example.com",
      images: uploadedImages,
      status: "pending", // pending, approved, rejected
      isApproved: false, // Add this field for compatibility
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      approvedAt: null,
      rejectedAt: null,
      adminNotes: "",
      views: 0,
      favorites: 0,
    };

    console.log("Prepared advertisement data:", carAdvertisement);

    // Images are already uploaded; save their URLs/paths with the ad
    console.log("Saving to Firestore...");
    const docRef = await addDoc(
      collection(db, COLLECTION_NAME),
      carAdvertisement
    );

    console.log("Advertisement created successfully with ID:", docRef.id);

    return {
      id: docRef.id,
      ...carAdvertisement,
    };
  } catch (error) {
    console.error("Error creating car advertisement:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // Provide more specific error messages
    if (error.code === "permission-denied") {
      throw new Error("فشل في إنشاء إعلان السيارة: مشكلة في الصلاحيات");
    } else if (error.code === "unavailable") {
      throw new Error("فشل في إنشاء إعلان السيارة: مشكلة في الاتصال");
    } else if (error.code === "invalid-argument") {
      throw new Error("فشل في إنشاء إعلان السيارة: بيانات غير صحيحة");
    } else {
      throw new Error(`فشل في إنشاء إعلان السيارة: ${error.message}`);
    }
  }
};

// Create test advertisement for mosantawi@gmail.com
export const createTestAdvertisementForUser = async () => {
  try {
    console.log("Creating test advertisement for mosantawi@gmail.com");

    const testAd = {
      brand: "تويوتا",
      model: "كامري",
      year: 2020,
      price: 85000,
      mileage: 45000,
      location: "الرياض",
      accidents: 0,
      features: ["مكيف", "نظام صوت", "فرامل ABS"],
      description:
        "سيارة تويوتا كامري 2020 بحالة ممتازة، مسافة 45,000 كم، لا توجد حوادث، مكيفة بالكامل مع نظام صوت متطور.",
      images: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      ],
      userEmail: "mosantawi@gmail.com",
      userId: "test-user-mosantawi",
      isApproved: true,
      isPaid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "carAdvertisements"), testAd);
    console.log("Test advertisement created with ID:", docRef.id);

    return {
      id: docRef.id,
      ...testAd,
    };
  } catch (error) {
    console.error("Error creating test advertisement:", error);
    throw new Error("فشل في إنشاء إعلان تجريبي: " + error.message);
  }
};

// Get all car advertisements (for admin)
export const getAllCarAdvertisements = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const advertisements = [];

    querySnapshot.forEach((doc) => {
      advertisements.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return advertisements;
  } catch (error) {
    console.error("Error getting car advertisements:", error);
    throw new Error("فشل في جلب إعلانات السيارات");
  }
};

// Get approved car advertisements (for public display)
export const getApprovedCarAdvertisements = async () => {
  try {
    console.log("Fetching approved car advertisements...");
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    console.log("Query snapshot size:", querySnapshot.size);

    const advertisements = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Advertisement data:", {
        id: doc.id,
        status: data.status,
        isApproved: data.isApproved,
      });
      advertisements.push({
        id: doc.id,
        ...data,
      });
    });

    console.log("Approved advertisements found:", advertisements.length);
    return advertisements;
  } catch (error) {
    console.error("Error getting approved car advertisements:", error);
    throw new Error("فشل في جلب الإعلانات المعتمدة");
  }
};

// Get car advertisement by ID
export const getCarAdvertisementById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("الإعلان غير موجود");
    }
  } catch (error) {
    console.error("Error getting car advertisement:", error);
    throw error;
  }
};

// Update car advertisement status (approve/reject)
export const updateCarAdvertisementStatus = async (
  id,
  status,
  adminNotes = ""
) => {
  try {
    console.log("Updating advertisement status:", { id, status, adminNotes });
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      status,
      updatedAt: serverTimestamp(),
      adminNotes,
    };

    if (status === "approved") {
      updateData.approvedAt = serverTimestamp();
      updateData.rejectedAt = null;
      updateData.isApproved = true; // Add this field for compatibility
    } else if (status === "rejected") {
      updateData.rejectedAt = serverTimestamp();
      updateData.approvedAt = null;
      updateData.isApproved = false; // Add this field for compatibility
    }

    console.log("Update data:", updateData);
    await updateDoc(docRef, updateData);
    console.log("Advertisement status updated successfully");

    return { success: true };
  } catch (error) {
    console.error("Error updating car advertisement status:", error);
    throw new Error("فشل في تحديث حالة الإعلان");
  }
};

// Update multiple fields on car advertisement (admin)
export const updateCarAdvertisementFields = async (id, fields) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...fields, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error("Error updating car advertisement fields:", error);
    throw new Error("فشل في تحديث بيانات الإعلان");
  }
};

// Delete car advertisement
export const deleteCarAdvertisement = async (id) => {
  try {
    // Get the advertisement first to delete images
    const advertisement = await getCarAdvertisementById(id);

    // Delete images from storage
    if (advertisement.images && advertisement.images.length > 0) {
      const deletePromises = advertisement.images.map((image) => {
        if (image.path) {
          const imageRef = ref(storage, image.path);
          return deleteObject(imageRef);
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);
    }

    // Delete document from Firestore
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting car advertisement:", error);
    throw new Error("فشل في حذف الإعلان");
  }
};

// Increment view count
export const incrementViewCount = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1,
      });
    }
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
};

// Toggle favorite status
export const toggleFavorite = async (id, userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentFavorites = docSnap.data().favorites || 0;
      // This is a simple implementation - in a real app you'd track individual user favorites
      await updateDoc(docRef, {
        favorites: currentFavorites + 1,
      });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};

// Main function to get cars with Saudi images
export const getCarsWithImages = async () => {
  // Use real Saudi car data
  const cars = await getRealSaudiCars();

  // Add images to cars
  const carsWithImages = await Promise.all(
    cars.map(async (car) => {
      const image = await fetchCarImages(car.brand, car.model);
      return {
        ...car,
        image,
      };
    })
  );

  return carsWithImages;
};

// Get cars by brand
export const getCarsByBrand = async (brand) => {
  const allCars = await getCarsWithImages();
  return brand === "جميع الماركات"
    ? allCars
    : allCars.filter((car) => car.brand === brand);
};

// Get new cars only
export const getNewCars = async () => {
  const allCars = await getCarsWithImages();
  return allCars.filter((car) => car.condition === "جديدة");
};

// Get used cars only
export const getUsedCars = async () => {
  const allCars = await getCarsWithImages();
  return allCars.filter((car) => car.condition === "مستعملة");
};

// Search cars with Saudi-specific filtering
export const searchCars = async (query, filters = {}) => {
  return await searchRealSaudiCars(query, filters);
};

// Get car brands for filtering
export const getCarBrands = () => {
  return getSaudiCarBrands();
};

// Get car models for a specific brand
export const getCarModels = (brand) => {
  return getSaudiCarModels(brand);
};

// Get Saudi cities for filtering
export const getCities = () => {
  return getSaudiCities();
};

// Get featured cars (based on Syarah.com patterns)
export const getFeaturedCars = async () => {
  return await getFeaturedRealSaudiCars();
};

// Get cars by city
export const getCarsByCity = async (city) => {
  return await getRealSaudiCarsByCity(city);
};

// Get cars with discounts
export const getCarsWithDiscounts = async () => {
  return await getRealSaudiCarsWithDiscounts();
};

// Get low mileage cars
export const getLowMileageCars = async () => {
  return await getRealSaudiLowMileageCars();
};

// Get paid advertisements
export const getPaidAdvertisements = async () => {
  try {
    console.log("Fetching paid advertisements...");

    // Simplified query to avoid index requirements
    const querySnapshot = await getDocs(
      query(
        collection(db, "carAdvertisements"),
        where("isPaid", "==", true),
        limit(6)
      )
    );

    console.log("Paid advertisements query result size:", querySnapshot.size);

    const paidAds = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Paid advertisement data:", {
        id: doc.id,
        isPaid: data.isPaid,
        isApproved: data.isApproved,
        status: data.status,
        paidPackageName: data.paidPackageName,
      });
      return {
        id: doc.id,
        ...data,
      };
    });

    // Filter to only show approved paid advertisements
    const approvedPaidAds = paidAds.filter(
      (ad) => ad.isApproved === true || ad.status === "approved"
    );

    console.log("Total paid ads found:", paidAds.length);
    console.log("Approved paid ads found:", approvedPaidAds.length);

    return approvedPaidAds;
  } catch (error) {
    console.error("Error getting paid advertisements:", error);
    return [];
  }
};
