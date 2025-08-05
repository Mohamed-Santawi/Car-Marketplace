import React from 'react'
import { motion } from 'framer-motion'

const Features = () => {
  const features = [
    {
      icon: '✓',
      title: 'تقدر تجربها 10 أيام',
      description: 'جرب السيارة لمدة 10 أيام قبل الشراء النهائي'
    },
    {
      icon: '🛡️',
      title: 'ضمان لمدة سنة مجاناً',
      description: 'ضمان شامل لمدة سنة على جميع السيارات'
    },
    {
      icon: '🔍',
      title: 'مفحوصة لأكثر من 200 نقطة',
      description: 'فحص شامل لأكثر من 200 نقطة فحص'
    },
    {
      icon: '🚚',
      title: 'نوصلها لين عندك',
      description: 'خدمة التوصيل المجانية لجميع المناطق'
    }
  ]

  return (
    <motion.section
      className="py-12 bg-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h3
          className="text-2xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          ليه تشتري سيارتك المستعملة من سيارات؟
        </motion.h3>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white text-2xl">{feature.icon}</span>
              </motion.div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Features