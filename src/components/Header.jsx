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

  const navItems = [
    { name: "السيارات المستعملة", path: "/used-cars" },
    { name: "البحث عن السيارات", path: "/search-cars" },
    { name: "بيعنا سيارتك", path: "/sell-car" },
  ];

  return (
    <motion.header
      className="bg-white shadow-sm border-b sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="w-20 h-20 object-cover" />
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
                سيارات
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            {isAdminUser && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
              >
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-semibold"
                >
                  لوحة التحكم
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
            {/* Upgrade Ads Button */}
            <motion.button
              onClick={() => navigate("/paid-advertisements")}
              className="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ترقية الإعلانات
            </motion.button>

            {/* Add Advertisement Button */}
            <motion.button
              onClick={() => navigate("/sell-car")}
              className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              أضف إعلانك
            </motion.button>

            {/* Auth Button */}
            {!isLoggedIn ? (
              <motion.button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white cursor-pointer px-4 mr-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تسجيل الدخول
              </motion.button>
            ) : (
              <motion.button
                onClick={() => auth.signOut()}
                className="bg-gray-700 text-white cursor-pointer px-4 mr-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تسجيل الخروج
              </motion.button>
            )}
          </div>

          {/* Tablet Action Buttons (Medium screens) */}
          <div className="hidden md:flex lg:hidden items-center space-x-2 space-x-reverse">
            {/* Upgrade Ads Button */}
            <motion.button
              onClick={() => navigate("/paid-advertisements")}
              className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ترقية
            </motion.button>

            {/* Add Advertisement Button */}
            <motion.button
              onClick={() => navigate("/add-advertisement")}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إضافة
            </motion.button>

            {/* Login Button */}
            <motion.button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              دخول
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle Menu"
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
            </button>
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
              {/* Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {isAdminUser && (
                <Link
                  to="/admin/dashboard"
                  className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-3"></div>

              {/* Action Buttons for Mobile */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigate("/paid-advertisements");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-base font-medium shadow-sm"
                >
                  ترقية الإعلانات
                </button>

                <button
                  onClick={() => {
                    navigate("/add-advertisement");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-base font-medium shadow-sm"
                >
                  أضف إعلانك
                </button>

                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-base font-medium shadow-sm"
                >
                  تسجيل الدخول
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
