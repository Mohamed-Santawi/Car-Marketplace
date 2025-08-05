import React, { useState } from "react";
import { motion } from "framer-motion";

const Financing = () => {
  const [calculatorData, setCalculatorData] = useState({
    carPrice: "",
    downPayment: "",
    loanTerm: "60",
    interestRate: "5",
  });

  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCalculatorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculatePayment = () => {
    const price = parseFloat(calculatorData.carPrice) || 0;
    const down = parseFloat(calculatorData.downPayment) || 0;
    const term = parseInt(calculatorData.loanTerm) || 60;
    const rate = parseFloat(calculatorData.interestRate) || 5;

    const principal = price - down;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term;

    if (principal > 0 && monthlyRate > 0) {
      const payment =
        (principal *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      setMonthlyPayment(Math.round(payment));
    } else {
      setMonthlyPayment(0);
    }
  };

  const financingOptions = [
    {
      title: "تمويل البنوك المحلية",
      description: "أفضل أسعار الفائدة من البنوك السعودية",
      features: ["أسعار فائدة منافسة", "شروط مرنة", "موافقة سريعة"],
      icon: "🏦",
    },
    {
      title: "تمويل الشركات المالية",
      description: "حلول تمويل متخصصة للسيارات",
      features: [
        "دفعة أولى منخفضة",
        "فترة سداد طويلة",
        "لا حاجة لضمانات إضافية",
      ],
      icon: "💳",
    },
    {
      title: "تمويل الوكالات",
      description: "تمويل مباشر من وكالات السيارات",
      features: ["أسعار خاصة", "خدمة شاملة", "ضمان إضافي"],
      icon: "🚗",
    },
  ];

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
          تمويل السيارات
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          اختر أفضل خيارات التمويل المناسبة لك
        </motion.p>

        {/* Financing Options */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {financingOptions.map((option, index) => (
            <motion.div
              key={option.title}
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">{option.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{option.title}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>
              <ul className="space-y-2">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Calculator */}
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">حاسبة التمويل</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  سعر السيارة (ريال)
                </label>
                <input
                  type="number"
                  name="carPrice"
                  value={calculatorData.carPrice}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  الدفعة الأولى (ريال)
                </label>
                <input
                  type="number"
                  name="downPayment"
                  value={calculatorData.downPayment}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 20000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  مدة التمويل (شهر)
                </label>
                <select
                  name="loanTerm"
                  value={calculatorData.loanTerm}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="36">36 شهر</option>
                  <option value="48">48 شهر</option>
                  <option value="60">60 شهر</option>
                  <option value="72">72 شهر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  معدل الفائدة السنوي (%)
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={calculatorData.interestRate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 5"
                  step="0.1"
                />
              </div>

              <motion.button
                onClick={calculatePayment}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                احسب القسط الشهري
              </motion.button>
            </div>

            {/* Results */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">نتائج الحساب</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>سعر السيارة:</span>
                  <span className="font-semibold">
                    {calculatorData.carPrice
                      ? `${parseInt(
                          calculatorData.carPrice
                        ).toLocaleString()} ريال`
                      : "0 ريال"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>الدفعة الأولى:</span>
                  <span className="font-semibold">
                    {calculatorData.downPayment
                      ? `${parseInt(
                          calculatorData.downPayment
                        ).toLocaleString()} ريال`
                      : "0 ريال"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>مبلغ التمويل:</span>
                  <span className="font-semibold">
                    {calculatorData.carPrice && calculatorData.downPayment
                      ? `${(
                          parseInt(calculatorData.carPrice) -
                          parseInt(calculatorData.downPayment)
                        ).toLocaleString()} ريال`
                      : "0 ريال"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>مدة التمويل:</span>
                  <span className="font-semibold">
                    {calculatorData.loanTerm} شهر
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>معدل الفائدة:</span>
                  <span className="font-semibold">
                    {calculatorData.interestRate}%
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-blue-600">
                    <span>القسط الشهري:</span>
                    <span>{monthlyPayment.toLocaleString()} ريال</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold mb-4">
            تحتاج مساعدة في التمويل؟
          </h3>
          <p className="text-gray-600 mb-6">
            تواصل مع خبراء التمويل لدينا للحصول على أفضل العروض
          </p>
          <motion.button
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            تواصل معنا الآن
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Financing;
