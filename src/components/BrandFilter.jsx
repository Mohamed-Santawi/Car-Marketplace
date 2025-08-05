import React from 'react'
import { motion } from 'framer-motion'

const BrandFilter = ({ selectedBrand, onBrandSelect, brands = [] }) => {
  const carBrands = brands.length > 0 ? brands : [
    'جميع الماركات', 'هيونداي', 'تويوتا', 'كيا', 'نيسان', 'شانجان', 'مرسيدس',
    'بي ام دبليو', 'فورد', 'مازدا', 'لكزس', 'شفروليه', 'ام جي', 'رينو', 'سوزوكي'
  ]

  return (
    <motion.section
      className="py-8 bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h3
          className="text-xl font-semibold mb-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          تصفح السيارات حسب الماركة
        </motion.h3>

        <div className="flex flex-wrap justify-center gap-2">
          {carBrands.map((brand, index) => (
            <motion.button
              key={brand}
              onClick={() => onBrandSelect(brand)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedBrand === brand
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3
              }}
              viewport={{ once: true }}
            >
              {brand}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default BrandFilter