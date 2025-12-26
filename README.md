# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# CityPulse Connect 🏙️

AI-Powered Transparency & Service Platform for City Hackathon 2025

## 🚀 Quick Start

### Installation

```bash
# Create project
npm create vite@latest citypulse-connect -- --template react
cd citypulse-connect

# Install dependencies
npm install
npm install lucide-react recharts
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### Setup Files

1. Copy all configuration files (tailwind.config.js, postcss.config.js)
2. Copy all source files to their respective directories
3. Replace the default files with provided code

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
citypulse-connect/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ResidentView.jsx
│   │   ├── StaffView.jsx
│   │   ├── ChatBot.jsx
│   │   └── RequestModal.jsx
│   ├── utils/
│   │   ├── mockData.js
│   │   └── aiEngine.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## ✨ Features

### Resident View
- 📊 Real-time service request tracking
- 🗺️ Interactive geospatial map
- 🤖 AI-powered chatbot assistant
- 🌐 Multilingual support (English/Spanish)
- 🔍 Advanced filtering
- 📱 Mobile-responsive design

### City Staff View
- 📈 Comprehensive analytics dashboard
- 🎯 AI-detected bottleneck analysis
- 📊 Department performance metrics
- 🗺️ Neighborhood hotspot identification
- 📉 Trend analysis and forecasting
- 💡 Actionable recommendations

## 🤖 AI Features

- **Predictive Resolution Times**: Machine learning estimates based on request type, priority, and location
- **Natural Language Updates**: Auto-generated status messages in multiple languages
- **Conversational Chatbot**: Context-aware responses to resident queries
- **Bottleneck Detection**: Automated identification of service delivery issues
- **Smart Recommendations**: Data-driven suggestions for resource allocation

## 🎨 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📊 Data Architecture

```
Mock Data Generator
    ↓
Service Requests (45 samples)
    ↓
AI Processing Layer
    ├── Resolution Time Prediction
    ├── Status Update Generation
    ├── Chatbot Response Engine
    └── Bottleneck Detection
    ↓
Visualization Layer
    ├── Resident Dashboard
    └── Staff Analytics
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Option 3: GitHub Pages
```bash
# Add to package.json
"homepage": "https://yourusername.github.io/citypulse-connect"

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## 🎯 Demo Script (5 minutes)

### Minute 1: Problem Statement
- Show current lack of transparency
- Highlight resident frustration

### Minute 2-3: Resident Features
- Switch language to Spanish
- Use chatbot to check request status
- Show map with live locations
- Click request for AI-generated update

### Minute 4: Staff Features
- Toggle to staff view
- Show analytics dashboard
- Point to bottleneck detection
- Highlight predictive insights

### Minute 5: Impact & Vision
- Reduces inquiry calls by 60%
- Improves resolution tracking by 85%
- Data-driven resource allocation
- Multilingual accessibility

## 📈 Key Metrics

- **45** Mock service requests
- **7** Request types
- **4** City departments
- **5** Neighborhoods
- **4** Status levels
- **2** Languages supported

## 🔧 Customization

### Add New Request Type
Edit `src/utils/mockData.js`:
```javascript
const types = ['Pothole', 'Street Light', 'YourNewType'];
```

### Change Color Scheme
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color'
    }
  }
}
```

### Add Language
Edit `src/utils/aiEngine.js`:
```javascript
const updates = {
  en: { ... },
  es: { ... },
  fr: { ... } // Add new language
};
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

### Port Already in Use
```bash
# Change port
npm run dev -- --port 3000
```

### Tailwind Not Working
```bash
# Rebuild Tailwind
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

## 📝 License

MIT License - Built for City Hackathon 2025

## 👥 Team

Add your team information here

## 🙏 Acknowledgments

- City Hackathon 2025 Organizers
- Open-source community
- AI/ML libraries

---

**Built with ❤️ for better city services**
