import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "خدماتنا",
      links: [
        { name: "سيارات ومركبات", path: "/vehicles" },
        { name: "عروض السيارات", path: "/offers" },
        { name: "تمويل سيارات", path: "/financing" },
        { name: "بيعنا سيارتك", path: "/sell-car" },
      ],
    },
    {
      title: "موقع سيارات",
      links: [
        { name: "اتصل بنا", path: "/contact" },
        { name: "من نحن", path: "/about" },
        { name: "خدماتنا", path: "/services" },
        { name: "وظائف", path: "/careers" },
      ],
    },
    {
      title: "تواصل معنا",
      content: (
        <div>
          <p className="text-gray-300 mb-2">نخدمك طيلة أيام الاسبوع</p>
          <p className="text-gray-300 mb-4">
            من السبت حتى الخميس من الساعة 9 صباحاً حتى 11 مساءً
          </p>
          <p className="text-emerald-400 font-semibold">920005379</p>
        </div>
      ),
    },
    {
      title: "تابعنا",
      content: (
        <div>
          <p className="text-gray-300 mb-4">لتصلك آخر عروض السيارات</p>
          <div className="flex space-x-3 space-x-reverse">
            <a
              href="#"
              className="px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 hover:border-emerald-500 hover:text-white transition-colors"
            >
              فيسبوك
            </a>
            <a
              href="#"
              className="px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 hover:border-emerald-500 hover:text-white transition-colors"
            >
              تويتر
            </a>
            <a
              href="#"
              className="px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 hover:border-emerald-500 hover:text-white transition-colors"
            >
              انستغرام
            </a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.footer
      className="relative overflow-hidden text-white py-14"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand area */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold tracking-tight">سيارات</h3>
          <p className="text-gray-400 mt-2 max-w-2xl">
            منصة موثوقة لبيع وشراء السيارات مع تجربة سلسة وخيارات متنوعة تناسب
            احتياجك.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h4>
              {section.links ? (
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-300 hover:text-emerald-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                section.content
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400">
            جميع الحقوق محفوظة لشركة موقع سيارات المحدودة ©2025
          </p>
          <div className="text-xs text-gray-500">مصمم بأناقة واحترافية</div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
