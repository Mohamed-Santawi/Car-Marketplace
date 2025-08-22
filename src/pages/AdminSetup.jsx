import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AdminSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateAdmin = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Create the admin user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'orranoss@gmail.com',
        'admin123'
      );

      const user = userCredential.user;

      // Create admin profile in Firestore
      const adminRef = doc(db, 'admins', user.uid);
      await setDoc(adminRef, {
        email: user.email,
        role: 'admin',
        createdAt: new Date(),
        permissions: [
          'approve_ads',
          'reject_ads',
          'delete_ads',
          'view_all_ads',
        ],
      });

      setMessage('تم إنشاء حساب المدير بنجاح! يمكنك الآن تسجيل الدخول.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error creating admin account:', error);
      if (error.code === 'auth/email-already-in-use') {
        setMessage('حساب المدير موجود بالفعل! يمكنك تسجيل الدخول مباشرة.');
      } else {
        setMessage('خطأ: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <Link to="/">
              <h1 className="text-3xl font-bold text-blue-600">سيارات</h1>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              إعداد حساب المدير
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              إنشاء حساب المدير للوصول إلى لوحة التحكم
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">معلومات حساب المدير:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>البريد الإلكتروني:</strong> orranoss@gmail.com</p>
                  <p><strong>كلمة المرور:</strong> admin123</p>
                </div>
              </div>

              <motion.button
                onClick={handleCreateAdmin}
                disabled={isLoading}
                className="w-full flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري إنشاء حساب المدير...
                  </div>
                ) : (
                  "إنشاء حساب المدير"
                )}
              </motion.button>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('تم') || message.includes('موجود')
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  العودة إلى صفحة تسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminSetup;
