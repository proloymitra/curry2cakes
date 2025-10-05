# Curry2Cakes - Production Deployment Guide

This guide provides step-by-step instructions for deploying Curry2Cakes to production with all features fully functional.

## 🚀 Quick Deployment Checklist

### ✅ Phase 1: GitHub Repository Setup
- [x] Git repository initialized
- [x] All files committed with proper .gitignore
- [x] Professional README documentation
- [x] Production build tested and working

### ✅ Phase 2: Environment Configuration

#### Google OAuth Setup
1. **Google Cloud Console Setup**
   ```bash
   # Visit: https://console.cloud.google.com/
   # Create new project: "Curry2Cakes"
   # Enable Google+ API
   # Create OAuth 2.0 credentials
   ```

2. **Configure OAuth Credentials**
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id
   ```

3. **Add Authorized Domains**
   - Add your GitHub Pages domain
   - Add localhost for development

#### Contentful CMS Setup
1. **Create Contentful Account**
   ```bash
   # Visit: https://www.contentful.com/
   # Create new space: "Curry2Cakes Menu"
   ```

2. **Content Model Setup**
   Create "Menu Item" content type with fields:
   - **name** (Short text, required)
   - **description** (Long text, required)
   - **price** (Number, required)
   - **category** (Short text, required, validation: "Curry" or "Dessert")
   - **image** (Media, required)
   - **isLimitedAccess** (Boolean, default: false)
   - **ingredients** (Short text, list)
   - **spiceLevel** (Number, 0-5)
   - **preparationTime** (Number, minutes)
   - **isVegetarian** (Boolean, default: false)
   - **isGlutenFree** (Boolean, default: false)
   - **calories** (Number)

3. **Environment Variables**
   ```env
   VITE_CONTENTFUL_SPACE_ID=your-contentful-space-id
   VITE_CONTENTFUL_ACCESS_TOKEN=your-contentful-delivery-token
   ```

#### GoDaddy Email API Setup
1. **GoDaddy Developer Account**
   ```bash
   # Visit: https://developer.godaddy.com/
   # Create API key and secret
   # Configure domain for email sending
   ```

2. **Backend Environment Variables**
   ```env
   GODADDY_API_KEY=your-godaddy-api-key
   GODADDY_API_SECRET=your-godaddy-api-secret
   GODADDY_DOMAIN=your-domain.com
   SMTP_HOST=smtp.godaddy.com
   SMTP_PORT=587
   SMTP_USER=noreply@your-domain.com
   SMTP_PASS=your-email-password
   ```

### ✅ Phase 3: GitHub Pages Deployment

#### Method 1: Using GitHub Actions (Recommended)
1. **Create GitHub Repository**
   ```bash
   # Push your code to GitHub
   git remote add origin https://github.com/yourusername/curry2cakes.git
   git branch -M main
   git push -u origin main
   ```

2. **GitHub Pages Configuration**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on push

3. **Environment Secrets**
   - Go to Settings → Secrets and variables → Actions
   - Add all environment variables as secrets

#### Method 2: Manual Deployment
1. **Build for Production**
   ```bash
   pnpm run build
   ```

2. **Deploy dist/ folder**
   - Upload contents of `dist/` to your hosting provider
   - Configure domain and SSL certificate

### ✅ Phase 4: Backend API Deployment

#### Option 1: Vercel (Recommended)
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy API**
   ```bash
   cd api/
   vercel --prod
   ```

3. **Update Frontend Environment**
   ```env
   VITE_API_BASE_URL=https://your-api.vercel.app
   ```

#### Option 2: Railway/Render
1. **Connect GitHub Repository**
2. **Configure Environment Variables**
3. **Deploy Backend Service**

### ✅ Phase 5: Domain Configuration

#### Custom Domain Setup
1. **Purchase Domain** (e.g., curry2cakes.com)
2. **Configure DNS**
   ```
   A Record: @ → GitHub Pages IP
   CNAME: www → yourusername.github.io
   ```

3. **SSL Certificate**
   - GitHub Pages automatically provides SSL
   - Verify HTTPS is working

### ✅ Phase 6: Production Testing

#### Functionality Checklist
- [ ] Landing page loads correctly
- [ ] Google OAuth sign-in works
- [ ] Invite code system functional
- [ ] Email invites being sent
- [ ] Menu loads from Contentful
- [ ] Search and filtering work
- [ ] Mobile responsiveness
- [ ] Performance optimization

#### Performance Optimization
1. **Image Optimization**
   - Use WebP format for images
   - Implement lazy loading
   - Optimize Contentful image delivery

2. **Bundle Optimization**
   - Code splitting implemented
   - Tree shaking enabled
   - Gzip compression active

3. **SEO Optimization**
   - Meta tags configured
   - Open Graph tags added
   - Sitemap generated

## 🔧 Production Configuration Files

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install pnpm
      run: npm install -g pnpm
      
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm run build
      env:
        VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
        VITE_CONTENTFUL_SPACE_ID: ${{ secrets.VITE_CONTENTFUL_SPACE_ID }}
        VITE_CONTENTFUL_ACCESS_TOKEN: ${{ secrets.VITE_CONTENTFUL_ACCESS_TOKEN }}
        
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Production Environment Template
```env
# Production .env file
NODE_ENV=production

# Frontend
VITE_API_BASE_URL=https://api.curry2cakes.com
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
VITE_CONTENTFUL_SPACE_ID=your-contentful-space-id
VITE_CONTENTFUL_ACCESS_TOKEN=your-contentful-delivery-token

# Backend API
GODADDY_API_KEY=your-godaddy-api-key
GODADDY_API_SECRET=your-godaddy-api-secret
GODADDY_DOMAIN=curry2cakes.com
SMTP_HOST=smtp.godaddy.com
SMTP_PORT=587
SMTP_USER=noreply@curry2cakes.com
SMTP_PASS=your-secure-email-password

# Security
CORS_ORIGIN=https://curry2cakes.com
RATE_LIMIT_WINDOW=300000
RATE_LIMIT_MAX=5
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to Git
- Use GitHub Secrets for sensitive data
- Rotate API keys regularly

### CORS Configuration
```javascript
// Secure CORS for production
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://curry2cakes.com',
  credentials: true
}));
```

### Rate Limiting
```javascript
// API rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});
```

## 📊 Monitoring & Analytics

### Google Analytics Setup
1. **Create GA4 Property**
2. **Add Tracking Code**
3. **Configure Goals**

### Error Monitoring
1. **Sentry Integration**
2. **Performance Monitoring**
3. **User Feedback Collection**

## 🚀 Go Live Checklist

- [ ] All environment variables configured
- [ ] Google OAuth working in production
- [ ] Contentful CMS populated with menu items
- [ ] GoDaddy email API sending invites
- [ ] Custom domain configured with SSL
- [ ] Performance testing completed
- [ ] Mobile testing on multiple devices
- [ ] SEO optimization verified
- [ ] Analytics and monitoring active
- [ ] Backup and recovery plan in place

## 📞 Support & Maintenance

### Regular Maintenance
- Update dependencies monthly
- Monitor API usage and costs
- Review and rotate API keys quarterly
- Backup Contentful data regularly

### Troubleshooting
- Check browser console for errors
- Verify API endpoints are responding
- Monitor email delivery rates
- Review analytics for user behavior

---

**Congratulations!** 🎉 Your Curry2Cakes exclusive cloud kitchen is now live and ready to serve your inner circle!

For technical support, refer to the main README.md or create an issue in the GitHub repository.
