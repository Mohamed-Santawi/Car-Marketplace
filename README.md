# 🚗 Saudi Car Marketplace

A modern, responsive car marketplace website built with React, Tailwind CSS, and Framer Motion, featuring real Saudi Arabia used car data and images.

## ✨ Features

- **Real Saudi Car Data** - Authentic car listings based on Syarah.com patterns
- **Real Saudi Images** - Images from Syarah.com CDN and other Saudi marketplaces
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Arabic RTL Support** - Full Arabic language support with proper RTL layout
- **Smooth Animations** - Framer Motion animations for enhanced UX
- **Advanced Filtering** - Filter by brand, price, year, mileage, and city
- **Multi-step Forms** - User-friendly car advertisement forms
- **Modern UI/UX** - Beautiful, modern interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend:** React 19.1.0
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Routing:** React Router DOM
- **Language:** Arabic (RTL)
- **Deployment:** Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd car-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   ├── Hero.jsx        # Hero section
│   ├── CarCard.jsx     # Individual car card
│   ├── CarsGrid.jsx    # Car grid layout
│   ├── BrandFilter.jsx # Brand filtering
│   └── Features.jsx    # Features section
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── UsedCars.jsx    # Used cars page
│   ├── NewCars.jsx     # New cars page
│   ├── SellCar.jsx     # Sell car form
│   ├── Financing.jsx   # Financing page
│   ├── Login.jsx       # Login page
│   └── AddAdvertisement.jsx # Add advertisement page
├── layouts/            # Layout components
│   └── MainLayout.jsx  # Main layout wrapper
├── services/           # API and data services
│   ├── carService.js   # Car data management
│   ├── imageService.js # Image handling
│   ├── saudiCarAPI.js  # Saudi car API
│   └── saudiImageAPI.js # Saudi image API
└── index.css           # Global styles
```

## 🌟 Key Features

### Real Saudi Car Data
- Authentic car listings from Saudi marketplaces
- Real pricing in Saudi Riyals
- Saudi cities and locations
- Arabic car descriptions

### Advanced Filtering
- Filter by brand (هيونداي، تويوتا، نيسان، etc.)
- Price range filtering
- Year and mileage filters
- City-based filtering

### Responsive Design
- Mobile-first approach
- RTL layout support
- Arabic font integration (Cairo)
- Touch-friendly interface

### Smooth Animations
- Page transitions
- Scroll-triggered animations
- Hover effects
- Loading states

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? `Select your account`
   - Link to existing project? `N`
   - What's your project's name? `saudi-car-marketplace`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

### Alternative: Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project
   - Click "Deploy"

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Saudi Car Marketplace
VITE_APP_DESCRIPTION=Find your perfect car in Saudi Arabia
```

### Build Configuration

The project uses Vite for building. Key configurations:

- **Build Output:** `dist/`
- **Framework:** React
- **CSS:** Tailwind CSS
- **Assets:** Optimized for production

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Syarah.com](https://syarah.com/) for inspiration and car data patterns
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React](https://reactjs.org/) for the UI framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ for the Saudi car market**
