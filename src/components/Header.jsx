import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { isAdmin } from "../services/authService";
import logo from "../assets/img/LogoFinal2.png";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsAdminUser(!!user && isAdmin(user));
    });
    return () => unsubscribe();
  }, []);

  return (
    <motion.header
      className="bg-white shadow-lg border-b sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="w-16 h-16 object-cover" />
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mr-2">
                سيارات
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Action Buttons - All buttons grouped together */}
          <div className="hidden lg:flex items-center space-x-3 space-x-reverse">
            {/* Search Cars Button */}
            <motion.button
              onClick={() => navigate("/search-cars")}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl cursor-pointer hover:bg-gray-200 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              البحث عن السيارات
            </motion.button>

            {/* Admin Dashboard Button */}
            {isAdminUser && (
              <motion.button
                onClick={() => navigate("/admin/dashboard")}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                لوحة التحكم
              </motion.button>
            )}
            {/* Add Advertisement Button */}
            <motion.button
              onClick={() =>
                isLoggedIn
                  ? navigate("/sell-car")
                  : navigate("/login", {
                      state: {
                        message: "يجب تسجيل الدخول لإضافة إعلان",
                        redirectTo: "/sell-car",
                      },
                    })
              }
              className="bg-gradient-to-r from-green-500 cursor-pointer to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              أضف إعلانك
            </motion.button>
            {/* Upgrade Ads Button */}
            <motion.button
              onClick={() =>
                isLoggedIn
                  ? navigate("/paid-advertisements")
                  : navigate("/login", {
                      state: {
                        message: "يجب تسجيل الدخول لترقية إعلانك",
                        redirectTo: "/paid-advertisements",
                      },
                    })
              }
              className="bg-gradient-to-r from-yellow-400 to-orange-500 cursor-pointer text-white px-6 py-3 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ترقية الإعلانات
            </motion.button>
            {/* Auth Button */}
            {!isLoggedIn ? (
              <motion.button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-6 mr-2 py-3 rounded-xl cursor-pointer hover:bg-blue-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تسجيل الدخول
              </motion.button>
            ) : (
              <motion.button
                onClick={() => auth.signOut()}
                className="bg-gray-700 text-white mr-2 px-6 py-3 rounded-xl cursor-pointer hover:bg-gray-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تسجيل الخروج
              </motion.button>
            )}
          </div>

          {/* Tablet Action Buttons (Medium screens) */}
          <div className="hidden md:flex lg:hidden items-center space-x-2 space-x-reverse">
            {/* Search Cars Button */}
            <motion.button
              onClick={() => navigate("/search-cars")}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              بحث
            </motion.button>

            {/* Auth Button */}
            <motion.button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-xs font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              دخول
            </motion.button>

            {/* Add Advertisement Button */}
            <motion.button
              onClick={() =>
                isLoggedIn
                  ? navigate("/sell-car")
                  : navigate("/login", {
                      state: {
                        message: "يجب تسجيل الدخول لإضافة إعلان",
                        redirectTo: "/sell-car",
                      },
                    })
              }
              className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors text-xs font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إضافة
            </motion.button>

            {/* Upgrade Ads Button */}
            <motion.button
              onClick={() =>
                isLoggedIn
                  ? navigate("/paid-advertisements")
                  : navigate("/login", {
                      state: {
                        message: "يجب تسجيل الدخول لترقية إعلانك",
                        redirectTo: "/paid-advertisements",
                      },
                    })
              }
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-600 transition-colors text-xs font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ترقية
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 cursor-pointer focus:outline-none p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle Menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? (
                // X icon when menu is open
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon when menu is closed
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {/* Action Buttons for Mobile */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    navigate("/search-cars");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-base font-medium shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  البحث عن السيارات
                </motion.button>

                {isAdminUser && (
                  <motion.button
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-base font-medium shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    لوحة التحكم
                  </motion.button>
                )}

                <motion.button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  تسجيل الدخول
                </motion.button>

                <motion.button
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate("/sell-car");
                    } else {
                      navigate("/login", {
                        state: {
                          message: "يجب تسجيل الدخول لإضافة إعلان",
                          redirectTo: "/sell-car",
                        },
                      });
                    }
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base font-medium shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  أضف إعلانك
                </motion.button>

                <motion.button
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate("/paid-advertisements");
                    } else {
                      navigate("/login", {
                        state: {
                          message: "يجب تسجيل الدخول لترقية إعلانك",
                          redirectTo: "/paid-advertisements",
                        },
                      });
                    }
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-base font-medium shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ترقية الإعلانات
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
