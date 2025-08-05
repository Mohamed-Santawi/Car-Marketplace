import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout