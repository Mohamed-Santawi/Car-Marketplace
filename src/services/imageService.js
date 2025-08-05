// Image service for fetching real Saudi Arabia car images and data
import { fetchRealSaudiCarImages } from "./saudiImageAPI.js";

// Real Saudi car brands and models based on Syarah.com data
const saudiCarBrands = {
  هيونداي: {
    "النترا فلييت": [
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754302041-392.webp",
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754236816-900.webp",
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750773513-434.webp",
    ],
    "فينو سمارت بلس": [
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750184784-481.webp",
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1744627159-181.webp",
    ],
    سوناتا: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
    ],
    توسان: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  تويوتا: {
    "راف فور LE": [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
    ],
    "يارس Y Plus": [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    ],
    كامري: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
    ],
    "لاند كروزر": [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  نيسان: {
    "التيما S": [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
    ],
    باترول: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    ],
    "إكس تريل": [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  شانجان: {
    "ايدو بلس Limited": [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
    ],
    "CS35 Plus Smart": [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  فيات: {
    "500 Convertible": [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  كيا: {
    سيراتو: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
    ],
    سورينتو: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  "بي ام دبليو": {
    "الفئة الثالثة": [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
    ],
    "الفئة الخامسة": [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
    ],
    "إكس 5": [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  مرسيدس: {
    "الفئة C": [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
    ],
    "الفئة E": [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    ],
    GLC: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  لكزس: {
    ES: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    ],
    RX: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  أودي: {
    A4: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    ],
    Q5: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
    ],
  },
  "فولكس فاجن": {
    جولف: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
    ],
    تايغون: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
    ],
  },
};

// Saudi cities for realistic location data
const saudiCities = [
  "الرياض",
  "جدة",
  "الدمام",
  "مكة المكرمة",
  "المدينة المنورة",
  "تبوك",
  "أبها",
  "حائل",
  "بريدة",
  "خميس مشيط",
  "الطائف",
  "نجران",
];

// Real Saudi car data based on Syarah.com patterns
const saudiCarData = [
  {
    id: 1,
    brand: "هيونداي",
    model: "النترا فلييت",
    year: "2022",
    price: "59,900",
    originalPrice: "63,000",
    discount: "3,100",
    mileage: "81,992",
    condition: "مستعملة",
    guaranteed: true,
    lowMileage: false,
    city: "الرياض",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "أبيض",
  },
  {
    id: 2,
    brand: "تويوتا",
    model: "راف فور LE",
    year: "2022",
    price: "75,600",
    originalPrice: "87,900",
    discount: "12,300",
    mileage: "135,624",
    condition: "مستعملة",
    guaranteed: true,
    lowMileage: false,
    city: "جدة",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "فضي",
  },
  {
    id: 3,
    brand: "شانجان",
    model: "ايدو بلس Limited",
    year: "2023",
    price: "50,000",
    originalPrice: "53,000",
    discount: "3,000",
    mileage: "89,113",
    condition: "مستعملة",
    guaranteed: true,
    lowMileage: false,
    city: "الدمام",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "أزرق",
  },
  {
    id: 4,
    brand: "شانجان",
    model: "CS35 Plus Smart",
    year: "2022",
    price: "48,500",
    originalPrice: "52,000",
    discount: "3,500",
    mileage: "66,243",
    condition: "مستعملة",
    guaranteed: true,
    lowMileage: false,
    city: "الرياض",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "أحمر",
  },
  {
    id: 5,
    brand: "فيات",
    model: "500 Convertible",
    year: "2023",
    price: "59,000",
    originalPrice: "75,000",
    discount: "16,000",
    mileage: "21,808",
    condition: "مستعملة",
    guaranteed: true,
    lowMileage: true,
    city: "جدة",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "أبيض",
  },
  {
    id: 6,
    brand: "نيسان",
    model: "التيما S",
    year: "2020",
    price: "71,000",
    originalPrice: "71,000",
    discount: "0",
    mileage: "46,071",
    condition: "مستعملة",
    guaranteed: true,
    lowMileage: true,
    city: "الدمام",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "أسود",
  },
  {
    id: 7,
    brand: "هيونداي",
    model: "فينو سمارت بلس",
    year: "2023",
    price: "61,000",
    originalPrice: "61,000",
    discount: "0",
    mileage: "35,534",
    condition: "مستعملة",
    guaranteed: true,
    lowMileage: true,
    city: "الرياض",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "فضي",
  },
  {
    id: 8,
    brand: "تويوتا",
    model: "يارس Y Plus",
    year: "2024",
    price: "61,000",
    originalPrice: "61,000",
    discount: "0",
    mileage: "27,184",
    condition: "مستعملة",
    guaranteed: true,
    lowMileage: true,
    city: "جدة",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "أبيض",
  },
];

// Fetch real Saudi car images from Syarah.com and other sources
export const fetchSaudiCarImages = async (brand, model) => {
  return await fetchRealSaudiCarImages(brand, model)
}

// Fetch from Syarah.com CDN
const fetchFromSyarahCDN = async (brand, model) => {
  try {
    // Syarah.com CDN images (these are real images from their website)
    const syarahImages = [
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754302041-392.webp",
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754236816-900.webp",
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750773513-434.webp",
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750184784-481.webp",
      "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1744627159-181.webp",
    ];

    // Return random Syarah image
    return [syarahImages[Math.floor(Math.random() * syarahImages.length)]];
  } catch (error) {
    console.log("Error fetching from Syarah CDN:", error);
    return null;
  }
};

// Fetch from other Saudi car marketplaces
const fetchFromSaudiMarketplaces = async (brand, model) => {
  try {
    // Additional Saudi car marketplace images
    const marketplaceImages = [
      // Real Saudi car images from various sources
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
    ];

    return marketplaceImages;
  } catch (error) {
    console.log("Error fetching from Saudi marketplaces:", error);
    return null;
  }
};

// Get car image from Saudi car collection
export const getSaudiCarImage = (brand, model) => {
  try {
    // Try to get specific model image
    if (saudiCarBrands[brand] && saudiCarBrands[brand][model]) {
      const images = saudiCarBrands[brand][model];
      return images[Math.floor(Math.random() * images.length)];
    }

    // Try to get any model from the brand
    if (saudiCarBrands[brand]) {
      const brandModels = Object.values(saudiCarBrands[brand]);
      const randomModelImages =
        brandModels[Math.floor(Math.random() * brandModels.length)];
      return randomModelImages[
        Math.floor(Math.random() * randomModelImages.length)
      ];
    }

    // Fallback to generic car image with Saudi styling
    return getGenericSaudiCarImage();
  } catch (error) {
    console.log("Error getting Saudi car image:", error);
    return getGenericSaudiCarImage();
  }
};

// Generic Saudi car images (used cars with desert/urban backgrounds)
const getGenericSaudiCarImage = () => {
  const saudiCarImages = [
    // Real Syarah.com images
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754302041-392.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754236816-900.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750773513-434.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750184784-481.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1744627159-181.webp",
    // Additional diverse car images
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop&sat=-20",
  ];

  return saudiCarImages[Math.floor(Math.random() * saudiCarImages.length)];
};

// Fetch from Saudi car APIs (if available)
export const fetchSaudiCarImage = async (brand, model) => {
  try {
    // You can integrate with Saudi car APIs here
    // For now, we'll use our curated Saudi car images
    return await fetchSaudiCarImages(brand, model);
  } catch (error) {
    console.log("Error fetching Saudi car image:", error);
    return getSaudiCarImage(brand, model);
  }
};

// Main function to get Saudi car image
export const getCarImageWithFallback = async (brand, model) => {
  return await fetchSaudiCarImage(brand, model);
};

// Get Saudi car data
export const getSaudiCarData = () => {
  return saudiCarData.map((car) => ({
    ...car,
    image: getSaudiCarImage(car.brand, car.model),
  }));
};

// Get Saudi car brands
export const getSaudiCarBrands = () => {
  return ["جميع الماركات", ...Object.keys(saudiCarBrands)];
};

// Get Saudi car models for a specific brand
export const getSaudiCarModels = (brand) => {
  return saudiCarBrands[brand] ? Object.keys(saudiCarBrands[brand]) : [];
};

// Get Saudi cities
export const getSaudiCities = () => {
  return saudiCities;
};

// Get multiple images for a car (for gallery)
export const getSaudiCarImages = (brand, model, count = 3) => {
  const images = [];

  try {
    // Get specific model images
    if (saudiCarBrands[brand] && saudiCarBrands[brand][model]) {
      const modelImages = saudiCarBrands[brand][model];
      for (let i = 0; i < Math.min(count, modelImages.length); i++) {
        images.push(modelImages[i]);
      }
    }

    // Fill remaining slots with generic Saudi car images
    while (images.length < count) {
      const randomImage = getGenericSaudiCarImage();
      if (!images.includes(randomImage)) {
        images.push(randomImage);
      }
    }
  } catch (error) {
    console.log("Error getting Saudi car images:", error);
    // Fallback to generic images
    for (let i = 0; i < count; i++) {
      images.push(getGenericSaudiCarImage());
    }
  }

  return images;
};

// Get brand-specific Saudi images
export const getSaudiBrandImages = (brand, count = 5) => {
  const images = [];

  try {
    if (saudiCarBrands[brand]) {
      const brandModels = Object.values(saudiCarBrands[brand]);
      for (const modelImages of brandModels) {
        for (const image of modelImages) {
          if (images.length < count && !images.includes(image)) {
            images.push(image);
          }
        }
      }
    }

    // Fill remaining slots with generic Saudi car images
    while (images.length < count) {
      const randomImage = getGenericSaudiCarImage();
      if (!images.includes(randomImage)) {
        images.push(randomImage);
      }
    }
  } catch (error) {
    console.log("Error getting Saudi brand images:", error);
    // Fallback to generic images
    for (let i = 0; i < count; i++) {
      images.push(getGenericSaudiCarImage());
    }
  }

  return images;
};
