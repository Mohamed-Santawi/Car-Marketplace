// Car service for fetching real Saudi Arabia car data and images
import { getCarImageWithFallback, getSaudiCarData, getSaudiCarBrands, getSaudiCarModels, getSaudiCities } from './imageService.js'
import { getRealSaudiCars, searchRealSaudiCars, getFeaturedRealSaudiCars, getRealSaudiCarsByCity, getRealSaudiCarsWithDiscounts, getRealSaudiLowMileageCars } from './saudiCarAPI.js'

// Generate additional Saudi car data based on Syarah.com patterns
const generateSaudiCarData = () => {
  const baseCars = getSaudiCarData()
  const additionalCars = []
  const saudiCities = getSaudiCities()

  // Generate 12 more cars with realistic Saudi data
  for (let i = 9; i <= 20; i++) {
    const brands = getSaudiCarBrands().filter(brand => brand !== 'جميع الماركات')
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const models = getSaudiCarModels(brand) || ['موديل أساسي']
    const model = models[Math.floor(Math.random() * models.length)]
    const year = 2020 + Math.floor(Math.random() * 5)
    const mileage = Math.floor(Math.random() * 150000) + 1000
    const basePrice = 30000 + Math.floor(Math.random() * 120000)
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 15000) + 1000 : 0
    const price = basePrice - discount

    additionalCars.push({
      id: i,
      brand,
      model,
      year: year.toString(),
      price: price.toLocaleString(),
      originalPrice: basePrice.toLocaleString(),
      discount: discount.toLocaleString(),
      mileage: mileage.toLocaleString(),
      condition: 'مستعملة',
      guaranteed: true,
      lowMileage: mileage < 50000,
      city: saudiCities[Math.floor(Math.random() * saudiCities.length)],
      fuelType: ['بنزين', 'ديزل', 'كهربائي', 'هجين'][Math.floor(Math.random() * 4)],
      transmission: ['أوتوماتيك', 'يدوي', 'نصف أوتوماتيك'][Math.floor(Math.random() * 3)],
      color: ['أبيض', 'أسود', 'فضي', 'أزرق', 'أحمر', 'رمادي'][Math.floor(Math.random() * 6)]
    })
  }

  return [...baseCars, ...additionalCars]
}

// Fetch car images using the Saudi image service
const fetchCarImages = async (brand, model) => {
  return await getCarImageWithFallback(brand, model)
}

// Main function to get cars with Saudi images
export const getCarsWithImages = async () => {
  // Use real Saudi car data
  const cars = await getRealSaudiCars()

  // Add images to cars
  const carsWithImages = await Promise.all(
    cars.map(async (car) => {
      const image = await fetchCarImages(car.brand, car.model)
      return {
        ...car,
        image
      }
    })
  )

  return carsWithImages
}

// Get cars by brand
export const getCarsByBrand = async (brand) => {
  const allCars = await getCarsWithImages()
  return brand === 'جميع الماركات' ? allCars : allCars.filter(car => car.brand === brand)
}

// Get new cars only
export const getNewCars = async () => {
  const allCars = await getCarsWithImages()
  return allCars.filter(car => car.condition === 'جديدة')
}

// Get used cars only
export const getUsedCars = async () => {
  const allCars = await getCarsWithImages()
  return allCars.filter(car => car.condition === 'مستعملة')
}

// Search cars with Saudi-specific filtering
export const searchCars = async (query, filters = {}) => {
  return await searchRealSaudiCars(query, filters)
}

// Get car brands for filtering
export const getCarBrands = () => {
  return getSaudiCarBrands()
}

// Get car models for a specific brand
export const getCarModels = (brand) => {
  return getSaudiCarModels(brand)
}

// Get Saudi cities for filtering
export const getCities = () => {
  return getSaudiCities()
}

// Get featured cars (based on Syarah.com patterns)
export const getFeaturedCars = async () => {
  return await getFeaturedRealSaudiCars()
}

// Get cars by city
export const getCarsByCity = async (city) => {
  return await getRealSaudiCarsByCity(city)
}

// Get cars with discounts
export const getCarsWithDiscounts = async () => {
  return await getRealSaudiCarsWithDiscounts()
}

// Get low mileage cars
export const getLowMileageCars = async () => {
  return await getRealSaudiLowMileageCars()
}
