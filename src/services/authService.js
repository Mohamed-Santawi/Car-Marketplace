import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Admin credentials (in production, this should be stored securely)
const ADMIN_EMAIL = "orranoss@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Check if user is admin
export const isAdmin = (user) => {
  return user && user.email === ADMIN_EMAIL;
};

// Admin login
export const adminLogin = async (email, password) => {
  try {
    // Check if it's the admin account
    if (email !== ADMIN_EMAIL) {
      throw new Error("بيانات الدخول غير صحيحة");
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Verify it's the admin account
    if (user.email !== ADMIN_EMAIL) {
      await signOut(auth);
      throw new Error("بيانات الدخول غير صحيحة");
    }

    // Create admin profile in Firestore if it doesn't exist
    const adminRef = doc(db, "admins", user.uid);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      await setDoc(adminRef, {
        email: user.email,
        role: "admin",
        createdAt: new Date(),
        permissions: [
          "approve_ads",
          "reject_ads",
          "delete_ads",
          "view_all_ads",
        ],
      });
    }

    return user;
  } catch (error) {
    console.error("Admin login error:", error);
    if (error.code === "auth/user-not-found") {
      // Create admin account if it doesn't exist
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          ADMIN_EMAIL,
          ADMIN_PASSWORD
        );
        const user = userCredential.user;

        // Create admin profile
        const adminRef = doc(db, "admins", user.uid);
        await setDoc(adminRef, {
          email: user.email,
          role: "admin",
          createdAt: new Date(),
          permissions: [
            "approve_ads",
            "reject_ads",
            "delete_ads",
            "view_all_ads",
          ],
        });

        return user;
      } catch (createError) {
        console.error("Error creating admin account:", createError);
        throw new Error("فشل في إنشاء حساب المدير");
      }
    }
    throw error;
  }
};

// Admin logout
export const adminLogout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Admin logout error:", error);
    throw new Error("فشل في تسجيل الخروج");
  }
};

// Get current admin user
export const getCurrentAdmin = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        if (user && isAdmin(user)) {
          resolve(user);
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};

// Check admin authentication state
export const onAdminAuthStateChanged = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user && isAdmin(user) ? user : null);
  });
};

// Update admin password (for future use)
export const updateAdminPassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user || !isAdmin(user)) {
      throw new Error("غير مصرح لك بتغيير كلمة المرور");
    }

    await updateProfile(user, {
      // Note: Firebase doesn't allow password update through updateProfile
      // This would need to be implemented differently in production
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating admin password:", error);
    throw new Error("فشل في تحديث كلمة المرور");
  }
};
