import React from "react";
import { motion } from "framer-motion";

const CarCard = ({ car }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <motion.img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />

        {/* Discount Badge */}
        {car.discount !== "0" && (
          <motion.div
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            خصم {car.discount} ريال
          </motion.div>
        )}

        {/* Low Mileage Badge */}
        {car.lowMileage && (
          <motion.div
            className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            ممشى قليل
          </motion.div>
        )}
      </div>

      <div className="p-6">
        <motion.h4
          className="text-lg font-semibold mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          {car.brand} {car.model} {car.year}
        </motion.h4>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">{car.condition}</span>
          <span className="text-sm text-gray-600">{car.mileage} كم</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <motion.span
            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
            whileHover={{ scale: 1.05 }}
          >
            مفحوصة ومضمونة
          </motion.span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 line-through">
              {car.originalPrice} ريال
            </p>
            <p className="text-xl font-bold text-blue-600">{car.price} ريال</p>
            <p className="text-sm text-gray-600">شامل الضريبة</p>
          </div>
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            احجز الآن
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
