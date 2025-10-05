# Curry2Cakes - Exclusive Cloud Kitchen

A modern, invite-only cloud kitchen web application featuring Google OAuth authentication, automated email invites, and dynamic menu management through Contentful CMS.

## 🌟 Features

### 🔐 Authentication & Access Control
- **Google OAuth Integration** - Secure sign-in with Google accounts
- **Invite-Only System** - Exclusive access through invite codes
- **Automated Email Invites** - Beautiful branded emails via GoDaddy API
- **Rate Limiting** - Prevents spam with 5-minute cooldowns

### 🍛 Dynamic Menu Management
- **Contentful CMS Integration** - Dynamic product and pricing management
- **Rich Product Display** - High-quality images, detailed descriptions
- **Advanced Filtering** - Search by name, ingredients, dietary preferences
- **Category Organization** - Curries, desserts, and more
- **Dietary Information** - Vegetarian, gluten-free, spice levels

### 🎨 Modern Design
- **Responsive Layout** - Works perfectly on all devices
- **Apple-Inspired Design** - Clean, professional aesthetics
- **Smooth Animations** - Hover effects and transitions
- **Professional Typography** - Carefully chosen fonts and spacing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Google OAuth credentials (for production)
- Contentful space (for dynamic content)
- GoDaddy email API access (for production emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd curry2cakes-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_CONTENTFUL_SPACE_ID=your-contentful-space-id
   VITE_CONTENTFUL_ACCESS_TOKEN=your-contentful-access-token
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   pnpm run dev:full
   
   # Or start individually
   pnpm run dev      # Frontend only
   pnpm run api      # Backend only
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
curry2cakes-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── DynamicMenu.jsx  # Main menu component
│   ├── services/
│   │   ├── api.js           # Backend API service
│   │   └── contentful.js    # Contentful CMS service
│   ├── App.jsx              # Main application
│   └── App.css              # Global styles
├── api/
│   ├── server.js            # Express.js API server
│   └── invite-service.js    # Email invite logic
├── public/                  # Static assets
└── package.json
```

## 🛠 Technology Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons

### Backend
- **Express.js** - Web application framework
- **Nodemailer** - Email sending capabilities
- **CORS** - Cross-origin resource sharing

### Services
- **Google OAuth** - Authentication provider
- **Contentful** - Headless CMS for content management
- **GoDaddy Email API** - Professional email delivery

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins

### Contentful Setup
1. Create account at [Contentful](https://www.contentful.com/)
2. Create a new space
3. Set up content model for menu items:
   - **name** (Short text)
   - **description** (Long text)
   - **price** (Number)
   - **category** (Short text)
   - **image** (Media)
   - **isLimitedAccess** (Boolean)
   - **ingredients** (Short text, list)
   - **spiceLevel** (Number)
   - **preparationTime** (Number)
   - **isVegetarian** (Boolean)
   - **isGlutenFree** (Boolean)
   - **calories** (Number)

### GoDaddy Email Setup
1. Get API credentials from GoDaddy
2. Configure domain for email sending
3. Update environment variables

## 🚀 Deployment

### GitHub Pages Deployment
```bash
# Build the project
pnpm run build

# Deploy to GitHub Pages (configure in package.json)
pnpm run deploy
```

### Manual Deployment
```bash
# Build for production
pnpm run build

# The dist/ folder contains the built application
# Upload to your hosting provider
```

## 🎯 Features in Detail

### Invite System
- **Unique Code Generation** - Cryptographically secure invite codes
- **Email Templates** - Beautiful HTML emails with branding
- **Expiry Management** - 30-day expiration with single-use validation
- **Rate Limiting** - Prevents abuse with time-based restrictions

### Menu Management
- **Dynamic Loading** - Real-time updates from Contentful
- **Fallback System** - Works offline with mock data
- **Search & Filter** - Advanced filtering by multiple criteria
- **Rich Media** - High-quality food photography

### Security
- **Environment Variables** - Secure credential management
- **CORS Protection** - Configured for production domains
- **Input Validation** - Server-side validation for all inputs
- **Rate Limiting** - API endpoint protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Unsplash** for high-quality food photography
- **Lucide** for the icon set
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

For support, email support@curry2cakes.com or create an issue in this repository.

---

**Curry2Cakes** - From Spicy to Sweet! 🍛➡️🍰
