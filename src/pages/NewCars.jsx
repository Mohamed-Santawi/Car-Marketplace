import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CarsGrid from '../components/CarsGrid'

const NewCars = () => {
  const [selectedBrand, setSelectedBrand] = useState('جميع الماركات')

  const newCars = [
    {
      id: 1,
      brand: 'تويوتا',
      model: 'كامري 2024',
      year: '2024',
      price: '120,000',
      originalPrice: '120,000',
      discount: '0',
      mileage: '0',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop',
      condition: 'جديدة',
      guaranteed: true,
      lowMileage: true
    },
    {
      id: 2,
      brand: 'هيونداي',
      model: 'سوناتا 2024',
      year: '2024',
      price: '95,000',
      originalPrice: '100,000',
      discount: '5,000',
      mileage: '0',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
      condition: 'جديدة',
      guaranteed: true,
      lowMileage: true
    },
    {
      id: 3,
      brand: 'نيسان',
      model: 'التيما 2024',
      year: '2024',
      price: '110,000',
      originalPrice: '110,000',
      discount: '0',
      mileage: '0',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop',
      condition: 'جديدة',
      guaranteed: true,
      lowMileage: true
    },
    {
      id: 4,
      brand: 'بي ام دبليو',
      model: 'الفئة الخامسة 2024',
      year: '2024',
      price: '250,000',
      originalPrice: '270,000',
      discount: '20,000',
      mileage: '0',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      condition: 'جديدة',
      guaranteed: true,
      lowMileage: true
    }
  ]

  const filteredCars = selectedBrand === 'جميع الماركات'
    ? newCars
    : newCars.filter(car => car.brand === selectedBrand)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          السيارات الجديدة
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          اكتشف أحدث موديلات السيارات من وكالات معتمدة
        </motion.p>

        {/* Brand Filter */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center">اختر الماركة</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {['جميع الماركات', 'تويوتا', 'هيونداي', 'نيسان', 'بي ام دبليو'].map((brand) => (
              <motion.button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedBrand === brand
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {brand}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Cars Grid */}
        <CarsGrid cars={filteredCars} />
      </div>
    </motion.div>
  )
}

export default NewCars