import React from "react";
import { motion } from "framer-motion";
import CarCard from "./CarCard";

const CarsGrid = ({ cars, title = "🔥 لحق قبل لا تفوتك 🔥" }) => {
  return (
    <motion.section
      className="py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title !== null && (
          <motion.h3
            className="text-2xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h3>
        )}

        {cars.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="text-gray-500 text-lg mb-4">
              لا توجد إعلانات معتمدة حالياً
            </div>
            <p className="text-gray-400">
              سيتم عرض الإعلانات هنا بعد اعتمادها من الإدارة
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8" // Changed from md:grid-cols-2 lg:grid-cols-3 to grid-cols-1 lg:grid-cols-2 for wider cards
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            {cars.map((car, index) => (
              <motion.div
                key={car.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full"
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default CarsGrid;
