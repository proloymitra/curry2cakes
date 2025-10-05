# Firebase Google OAuth Setup Guide

This guide will help you set up Firebase for Google OAuth authentication in your Curry2Cakes application.

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Create a project" or "Add project"

2. **Project Configuration**
   - **Project name**: `curry2cakes` (or your preferred name)
   - **Google Analytics**: Enable (recommended for tracking)
   - **Analytics account**: Use existing or create new

3. **Wait for Project Creation**
   - Firebase will set up your project (takes 1-2 minutes)

### Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In Firebase Console, click "Authentication" in left sidebar
   - Click "Get started" if it's your first time

2. **Configure Sign-in Methods**
   - Go to "Sign-in method" tab
   - Click on "Google" provider
   - **Enable** the Google sign-in method
   - **Project support email**: Enter your email address
   - Click "Save"

### Step 3: Get Firebase Configuration

1. **Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

2. **Add Web App**
   - Scroll down to "Your apps" section
   - Click the web icon `</>`
   - **App nickname**: `curry2cakes-web`
   - **Firebase Hosting**: Check this box (optional)
   - Click "Register app"

3. **Copy Configuration**
   - Copy the `firebaseConfig` object
   - It should look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "curry2cakes-xxxxx.firebaseapp.com",
     projectId: "curry2cakes-xxxxx",
     storageBucket: "curry2cakes-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456",
     measurementId: "G-XXXXXXXXXX"
   };
   ```

### Step 4: Configure Environment Variables

1. **Update .env.local**
   Replace the demo values in your `.env.local` file:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=AIzaSyC...
   VITE_FIREBASE_AUTH_DOMAIN=curry2cakes-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=curry2cakes-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=curry2cakes-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Update Google Analytics ID**
   In `index.html`, replace the tracking ID:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

## 🌐 Domain Configuration

### For Development
- **Authorized domains** are automatically configured for `localhost`
- No additional setup needed for local development

### For Production Deployment

1. **Add Authorized Domains**
   - In Firebase Console → Authentication → Settings
   - Scroll to "Authorized domains"
   - Add your production domain (e.g., `curry2cakes.com`)
   - Add your GitHub Pages domain (e.g., `yourusername.github.io`)

2. **Update CORS Settings**
   - Firebase automatically handles CORS for authorized domains
   - Ensure your deployment domain is added to authorized domains

## 🔒 Security Rules

### Authentication Security
Firebase Authentication is secure by default, but consider these best practices:

1. **Email Verification**
   ```javascript
   // Optional: Require email verification
   if (user && !user.emailVerified) {
     // Handle unverified email
   }
   ```

2. **Domain Restrictions**
   - Only add trusted domains to authorized domains
   - Remove localhost from production authorized domains

## 🧪 Testing the Integration

### Test Google OAuth Flow

1. **Start Development Server**
   ```bash
   pnpm run dev
   ```

2. **Test Sign-in Process**
   - Navigate to `http://localhost:5173`
   - Click "Sign In to Explore"
   - Click "Sign In with Google"
   - Complete Google OAuth flow
   - Verify user information is displayed

3. **Check Firebase Console**
   - Go to Authentication → Users
   - Verify new user appears after sign-in

### Troubleshooting Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check that all environment variables are set correctly
   - Restart development server after changing .env.local

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console
   - For localhost, use `http://localhost:5173` (with port)

3. **Popup Blocked**
   - The app automatically handles popup blocking
   - Users will see a helpful error message
   - Consider implementing redirect flow for mobile

## 📊 Analytics Integration

### Google Analytics 4 Events

The app automatically tracks these events:
- **login**: When user signs in with Google
- **logout**: When user signs out
- **invite_code_validated**: When invite code is successfully validated
- **invite_code_requested**: When user requests an invite code

### Custom Events
Add more tracking as needed:
```javascript
gtag('event', 'menu_item_viewed', {
  event_category: 'engagement',
  event_label: 'butter_chicken_curry'
});
```

## 🚀 Production Deployment

### Environment Variables for Production

1. **GitHub Secrets** (for GitHub Actions)
   - Add all Firebase environment variables as GitHub secrets
   - Use the same names as in .env.local but without VITE_ prefix

2. **Vercel/Netlify Environment Variables**
   - Add all VITE_FIREBASE_* variables in your hosting platform
   - Ensure they're available at build time

### Security Checklist

- [ ] Remove demo/localhost domains from authorized domains
- [ ] Add production domain to authorized domains
- [ ] Update Google Analytics tracking ID
- [ ] Test OAuth flow on production domain
- [ ] Verify user data appears in Firebase Console
- [ ] Check Analytics events are being tracked

## 📞 Support

### Firebase Documentation
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Google Sign-in for Web](https://firebase.google.com/docs/auth/web/google-signin)

### Common Resources
- [Firebase Console](https://console.firebase.google.com/)
- [Google Analytics](https://analytics.google.com/)
- [Firebase Status](https://status.firebase.google.com/)

---

**🎉 Congratulations!** Your Curry2Cakes application now has real Google OAuth authentication powered by Firebase!
