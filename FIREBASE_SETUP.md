# Firebase Setup Guide - Car Marketplace

## 🔥 Firebase Configuration

This project is configured to use Firebase for:

- **Firestore Database** - Store car advertisements
- **Firebase Storage** - Store car images
- **Firebase Authentication** - Admin login system

## 📋 Prerequisites

1. **Firebase Project**: Already created at `readura-app-112fa`
2. **Dependencies**: Firebase SDK installed via `npm install firebase`

## 🗄️ Firestore Database Structure

### Collection: `carAdvertisements`

Each car advertisement document contains:

```javascript
{
  // Basic Info
  brand: "string",           // Car brand (e.g., "BMW")
  model: "string",           // Car model (e.g., "X5")
  year: "number",            // Manufacturing year
  price: "number",           // Current price in SAR
  originalPrice: "string",   // Original price (optional)
  discount: "string",        // Discount amount

  // Specifications
  mileage: "string",         // Distance traveled
  condition: "string",       // Car condition
  lowMileage: "boolean",     // Low mileage flag
  trim: "string",            // Car trim level
  bodyType: "string",        // Body type (sedan, SUV, etc.)
  fuelType: "string",        // Fuel type
  transmission: "string",    // Transmission type
  color: "string",           // Exterior color
  interiorColor: "string",   // Interior color
  engine: "string",          // Engine description
  mpg: "string",             // Fuel consumption

  // History & Details
  accidents: "number",       // Number of accidents
  owners: "number",          // Number of previous owners
  usage: "string",           // Usage type (personal, commercial)
  vin: "string",             // Vehicle identification number
  stock: "string",           // Stock number

  // Features & Status
  features: ["array"],       // Array of car features
  certified: "boolean",      // Certified status
  location: "string",        // Car location
  distance: "string",        // Distance from user

  // Contact Info
  contactName: "string",     // Contact person name
  contactPhone: "string",    // Contact phone number
  contactEmail: "string",    // Contact email

  // Images
  images: ["array"],         // Array of image objects with URLs

  // System Fields
  status: "string",          // "pending", "approved", "rejected"
  createdAt: "timestamp",    // Creation timestamp
  updatedAt: "timestamp",    // Last update timestamp
  approvedAt: "timestamp",   // Approval timestamp
  rejectedAt: "timestamp",   // Rejection timestamp
  adminNotes: "string",      // Admin notes
  views: "number",           // View count
  favorites: "number"        // Favorite count
}
```

### Collection: `admins`

Admin user profiles:

```javascript
{
  email: "string",           // Admin email
  role: "string",            // User role ("admin")
  createdAt: "timestamp",    // Account creation date
  permissions: ["array"]     // Array of permissions
}
```

## 🔐 Admin Authentication

### Default Admin Credentials:

- **Email**: `Orranoss@gmail.com`
- **Password**: `admin123`

### Admin Permissions:

- `approve_ads` - Approve car advertisements
- `reject_ads` - Reject car advertisements
- `delete_ads` - Delete advertisements
- `view_all_ads` - View all advertisements

## 🚀 Getting Started

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `readura-app-112fa`
3. Enable required services:
   - **Firestore Database** - Create database in test mode
   - **Storage** - Enable with default rules
   - **Authentication** - Enable Email/Password sign-in

### 2. Firestore Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to approved advertisements
    match /carAdvertisements/{document} {
      allow read: if resource.data.status == 'approved';
      allow write: if request.auth != null;
    }

    // Admin access to all advertisements
    match /carAdvertisements/{document} {
      allow read, write: if request.auth != null &&
        request.auth.token.email == 'Orranoss@gmail.com';
     }

     // Admin profiles
    match /admins/{document} {
      allow read, write: if request.auth != null &&
        request.auth.token.email == 'Orranoss@gmail.com';
     }
   }
 }
 ```

### 3. Storage Rules

Set up Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to car images
    match /car-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Admin Panel Access

### Routes:

- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`

### Features:

- **View all advertisements** with status filtering
- **Approve/Reject** pending advertisements
- **Delete** advertisements
- **Add admin notes** for rejections
- **Statistics dashboard** showing counts by status

## 🔄 Workflow

1. **User creates advertisement** via `/sell-car`
2. **Advertisement saved** with status "pending"
3. **Admin reviews** advertisement in dashboard
4. **Admin approves/rejects** with optional notes
5. **Approved advertisements** appear in public listings
6. **Rejected advertisements** remain hidden with admin notes

## 🛠️ Troubleshooting

### Common Issues:

1. **Authentication errors**: Check Firebase Auth is enabled
2. **Database errors**: Verify Firestore rules and collection names
3. **Storage errors**: Check Storage rules and bucket configuration
4. **CORS issues**: Ensure Firebase domain is whitelisted

### Testing:

1. Create test advertisement via SellCar form
2. Login to admin panel with default credentials
3. Review and approve/reject test advertisement
4. Verify status changes in database

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## 🔒 Security Notes

- **Production**: Change default admin password
- **Environment Variables**: Move Firebase config to environment variables
- **Rate Limiting**: Implement rate limiting for advertisement creation
- **Image Validation**: Add image size and type validation
- **Admin Access**: Restrict admin access to specific IPs if needed
