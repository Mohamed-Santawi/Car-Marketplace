# 🚀 Deployment Guide - Saudi Car Marketplace

This guide will help you deploy your Saudi Car Marketplace project to Vercel.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- Vercel account (free at [vercel.com](https://vercel.com))

## 🛠️ Method 1: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### Step 3: Deploy

```bash
vercel
```

### Step 4: Follow the Prompts

When prompted, answer as follows:

```
? Set up and deploy "~/path/to/car-marketplace"? [Y/n] Y
? Which scope do you want to deploy to? [your-account]
? Link to existing project? [y/N] N
? What's your project's name? saudi-car-marketplace
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

### Step 5: Wait for Deployment

Vercel will:

1. Build your project
2. Deploy it to their global CDN
3. Provide you with a live URL

## 🌐 Method 2: Deploy via GitHub

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Click "Deploy"

## ⚙️ Configuration Files

### vercel.json

This file is already configured for optimal deployment:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Environment Variables (Optional)

If you need environment variables, add them in Vercel dashboard:

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add variables like:
   - `VITE_APP_TITLE=Saudi Car Marketplace`
   - `VITE_APP_DESCRIPTION=Find your perfect car in Saudi Arabia`

## 🔧 Build Configuration

The project is configured for optimal Vercel deployment:

- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Framework:** Vite (auto-detected)
- **Node Version:** 18.x (auto-detected)

## 📱 Post-Deployment

### Custom Domain (Optional)

1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables

If you need to add environment variables after deployment:

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add your variables
4. Redeploy if needed

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Fails

**Error:** Build command failed
**Solution:**

- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally
- Check Vercel logs for specific errors

#### 2. Routing Issues

**Error:** 404 on page refresh
**Solution:**

- The `vercel.json` file includes proper rewrites
- This should handle React Router correctly

#### 3. Image Loading Issues

**Error:** Images not loading
**Solution:**

- Check that image URLs are accessible
- Ensure CORS is properly configured
- Verify image URLs in the Saudi image API

#### 4. Arabic Text Issues

**Error:** Arabic text not displaying correctly
**Solution:**

- The Cairo font is included in `index.css`
- RTL support is configured
- Check browser console for font loading errors

### Debugging Steps

1. **Check Build Logs**

   ```bash
   vercel logs
   ```

2. **Test Locally**

   ```bash
   npm run build
   npm run preview
   ```

3. **Check Dependencies**
   ```bash
   npm install
   npm run build
   ```

## 📊 Performance Optimization

Your deployment includes:

- **Automatic Optimization:** Vercel optimizes images and assets
- **Global CDN:** Content delivered from edge locations
- **Automatic HTTPS:** SSL certificates provided
- **Compression:** Assets are automatically compressed

## 🔄 Continuous Deployment

Once deployed, Vercel will automatically:

- Deploy on every push to main branch
- Create preview deployments for pull requests
- Rollback to previous versions if needed

## 📈 Monitoring

After deployment, you can monitor:

- **Performance:** Core Web Vitals
- **Analytics:** Page views and user behavior
- **Errors:** JavaScript errors and build failures
- **Functions:** Serverless function performance

## 🎉 Success!

Your Saudi Car Marketplace is now live!

**Features deployed:**

- ✅ Real Saudi car data
- ✅ Real Saudi images from Syarah.com
- ✅ Arabic RTL support
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Advanced filtering
- ✅ Multi-step forms

**Next steps:**

1. Test all features on the live site
2. Share your deployment URL
3. Monitor performance and errors
4. Consider adding analytics

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Test locally with `npm run build`
4. Check GitHub issues for similar problems

---

**Your Saudi Car Marketplace is ready for the world! 🚗✨**
