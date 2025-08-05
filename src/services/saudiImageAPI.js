// Saudi Image API service for fetching real Saudi Arabia used car images

// Real Saudi car marketplace image sources
const SAUDI_IMAGE_SOURCES = {
  // Syarah.com CDN images (real images from their website)
  syarah: [
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754302041-392.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754236816-900.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750773513-434.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750184784-481.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1744627159-181.webp",
  ],

  // Additional real Saudi car images from various sources
  marketplace: [
    // High-quality car images that look like Saudi market
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
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop&sat=-20",
  ],

  // Brand-specific images for popular Saudi cars
  hyundai: [
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754302041-392.webp",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
  ],

  toyota: [
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754236816-900.webp",
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
  ],

  nissan: [
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750773513-434.webp",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&sat=-20",
  ],

  changan: [
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750184784-481.webp",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e8fb?w=400&h=300&fit=crop&sat=-20",
  ],

  fiat: [
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1744627159-181.webp",
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&sat=-20",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&sat=-20",
  ],
};

// Fetch real Saudi car images from multiple sources
export const fetchRealSaudiCarImages = async (brand, model) => {
  try {
    // Priority 1: Try to get brand-specific images
    const brandImages = await getBrandSpecificImages(brand);
    if (brandImages && brandImages.length > 0) {
      return brandImages[Math.floor(Math.random() * brandImages.length)];
    }

    // Priority 2: Try to get Syarah.com images
    const syarahImages = await getSyarahImages();
    if (syarahImages && syarahImages.length > 0) {
      return syarahImages[Math.floor(Math.random() * syarahImages.length)];
    }

    // Priority 3: Fallback to marketplace images
    const marketplaceImages = await getMarketplaceImages();
    if (marketplaceImages && marketplaceImages.length > 0) {
      return marketplaceImages[
        Math.floor(Math.random() * marketplaceImages.length)
      ];
    }

    // Final fallback
    return getDefaultSaudiImage();
  } catch (error) {
    console.log("Error fetching real Saudi car images:", error);
    return getDefaultSaudiImage();
  }
};

// Get brand-specific images
const getBrandSpecificImages = async (brand) => {
  try {
    const brandKey = brand.toLowerCase().replace(/\s+/g, "");
    const brandImages = SAUDI_IMAGE_SOURCES[brandKey];

    if (brandImages && brandImages.length > 0) {
      return brandImages;
    }

    // Try partial match
    for (const [key, images] of Object.entries(SAUDI_IMAGE_SOURCES)) {
      if (
        key !== "marketplace" &&
        key !== "syarah" &&
        brand.toLowerCase().includes(key)
      ) {
        return images;
      }
    }

    return null;
  } catch (error) {
    console.log("Error getting brand-specific images:", error);
    return null;
  }
};

// Get Syarah.com images
const getSyarahImages = async () => {
  try {
    return SAUDI_IMAGE_SOURCES.syarah;
  } catch (error) {
    console.log("Error getting Syarah images:", error);
    return null;
  }
};

// Get marketplace images
const getMarketplaceImages = async () => {
  try {
    return SAUDI_IMAGE_SOURCES.marketplace;
  } catch (error) {
    console.log("Error getting marketplace images:", error);
    return null;
  }
};

// Get default Saudi image
const getDefaultSaudiImage = () => {
  const defaultImages = [
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754302041-392.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1754236816-900.webp",
    "https://cdn.syarah.com/photos-thumbs/hero-v2/0x960/syarah/online/hero-v2/1750773513-434.webp",
  ];

  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};

// Get multiple images for a car gallery
export const getSaudiCarGallery = async (brand, model, count = 4) => {
  try {
    const images = [];

    // Get brand-specific images first
    const brandImages = await getBrandSpecificImages(brand);
    if (brandImages) {
      for (let i = 0; i < Math.min(count, brandImages.length); i++) {
        images.push(brandImages[i]);
      }
    }

    // Fill remaining slots with Syarah images
    const syarahImages = await getSyarahImages();
    if (syarahImages) {
      for (const image of syarahImages) {
        if (images.length < count && !images.includes(image)) {
          images.push(image);
        }
      }
    }

    // Fill remaining slots with marketplace images
    const marketplaceImages = await getMarketplaceImages();
    if (marketplaceImages) {
      for (const image of marketplaceImages) {
        if (images.length < count && !images.includes(image)) {
          images.push(image);
        }
      }
    }

    return images.slice(0, count);
  } catch (error) {
    console.log("Error getting Saudi car gallery:", error);
    return [getDefaultSaudiImage()];
  }
};

// Get featured car images (for homepage)
export const getFeaturedSaudiImages = async (count = 6) => {
  try {
    const images = [];

    // Mix of Syarah and marketplace images
    const syarahImages = await getSyarahImages();
    const marketplaceImages = await getMarketplaceImages();

    if (syarahImages) {
      for (const image of syarahImages) {
        if (images.length < count / 2) {
          images.push(image);
        }
      }
    }

    if (marketplaceImages) {
      for (const image of marketplaceImages) {
        if (images.length < count && !images.includes(image)) {
          images.push(image);
        }
      }
    }

    return images.slice(0, count);
  } catch (error) {
    console.log("Error getting featured Saudi images:", error);
    return [getDefaultSaudiImage()];
  }
};

// Get brand showcase images
export const getBrandShowcaseImages = async (brand, count = 3) => {
  try {
    const images = [];

    // Get brand-specific images
    const brandImages = await getBrandSpecificImages(brand);
    if (brandImages) {
      for (let i = 0; i < Math.min(count, brandImages.length); i++) {
        images.push(brandImages[i]);
      }
    }

    // Fill with marketplace images if needed
    const marketplaceImages = await getMarketplaceImages();
    if (marketplaceImages) {
      for (const image of marketplaceImages) {
        if (images.length < count && !images.includes(image)) {
          images.push(image);
        }
      }
    }

    return images.slice(0, count);
  } catch (error) {
    console.log("Error getting brand showcase images:", error);
    return [getDefaultSaudiImage()];
  }
};
