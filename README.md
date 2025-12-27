# HomeSpark - AI-Powered Home Renovation Recommendation System

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)


## 🌐 Live Demo

**The application is now live and accessible!**

- **Frontend (Vercel):** https://homespark-ai.vercel.app/

## 🏠 About

HomeSpark is an innovative AI-driven home renovation recommendation system that provides personalized, budget-conscious, and climate-aware renovation suggestions. The system leverages unsupervised machine learning (K-Means & NMF), real-time climate data from OpenWeatherMap API, and visual inspiration from Unsplash API to deliver comprehensive renovation plans tailored to user preferences.

### Key Features

- **🤖 AI-Powered Recommendations**: Utilizes K-Means and NMF clustering algorithms for personalized suggestions
- **🌦️ Climate-Aware**: Integrates real-time weather data for climate-appropriate material recommendations
- **💰 Budget Optimization**: Smart cost analysis with flexible budget matching (±30%)
- **🎨 Visual Inspiration**: Dynamic design visuals from Unsplash API
- **📊 Multi-Step Wizard**: Intuitive step-by-step preference collection
- **♻️ Sustainability Focused**: Eco-scoring for environmentally conscious choices
- **📱 Responsive Design**: Modern UI built with Next.js and Tailwind CSS

### System Performance

- **Clustering Accuracy**: Silhouette Score of 0.75+
- **Response Time**: <2 seconds for recommendations
- **User Satisfaction**: 88% positive feedback (based on 50-user survey)
- **Model Success Rate**: 100% match accuracy in test scenarios

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 13+
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend

- **Framework**: FastAPI (Python)
- **Runtime**: Node.js (for Next.js)
- **APIs**: OpenWeatherMap, Unsplash

### Machine Learning

- **Language**: Python 3.9+
- **Libraries**:
  - scikit-learn (K-Means, NMF)
  - pandas, numpy (data processing)
  - matplotlib, seaborn (visualization)
- **Model Format**: .pkl (serialized)

### Data Storage

- **Primary**: Browser Local Storage
- **Dataset**: 2,500 renovation items (CSV)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.9 or higher
- Node.js 16.x or higher
- npm or yarn
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/HomeSpark-AI.git
cd HomeSpark-AI
```

### 2. Backend Setup (Python/FastAPI)

```bash
# Navigate to backend directory (if separate)
cd backend  # or wherever your Python files are located

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd homespark  # or your Next.js directory

# Install dependencies
npm install
# or
yarn install
```

### 4. Environment Variables

Create a `.env.local` file in the root of your Next.js application:

```env
# OpenWeatherMap API
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key

# Unsplash API
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# (Optional) Production URLs
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Create a `.env` file for your FastAPI backend:

```env
# API Keys
OPENWEATHER_API_KEY=your_openweathermap_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Model Path
MODEL_PATH=./models/home_renovation_model_package.pkl

# Dataset Path
DATASET_PATH=./data/renovation_dataset.csv
```

### 5. Prepare Model and Dataset

Ensure the following files are in place:

```
project-root/
├── models/
│   └── home_renovation_model_package.pkl
├── data/
│   └── renovation_dataset.csv
```

## 🎯 Running the Application

### Development Mode

#### 1. Start the FastAPI Backend

```bash
# In the backend directory with virtual environment activated
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

#### 2. Start the Next.js Frontend

```bash
# In the frontend directory
cd homespark
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Production Build

#### Frontend

```bash
cd homespark
npm run build
npm start
```

#### Backend

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📁 Project Structure

```
HomeSpark-AI/
├── homespark/                  # Next.js frontend application
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── recommendations/   # Recommendation display components
│   │   └── wizard/            # Multi-step form wizard
│   ├── pages/
│   │   ├── api/               # API routes (if using Next.js API)
│   │   ├── index.js           # Home page
│   │   ├── about.js           # About page
│   │   └── contact.js         # Contact page
│   ├── utils/
│   │   ├── dataTransforms.js  # Data transformation utilities
│   │   └── mlService.js       # ML service integration
│   ├── public/                # Static assets
│   └── styles/                # CSS/Tailwind styles
│
├── backend/                    # FastAPI backend
│   ├── main.py                # FastAPI application entry point
│   ├── models/                # ML model files
│   │   └── home_renovation_model_package.pkl
│   ├── data/                  # Dataset files
│   │   └── renovation_dataset.csv
│   ├── api/                   # API endpoints
│   └── utils/                 # Backend utilities
│
├── .env.local                 # Frontend environment variables (not committed)
├── .env                       # Backend environment variables (not committed)
├── .gitignore                 # Git ignore file
├── requirements.txt           # Python dependencies
├── package.json               # Node.js dependencies
└── README.md                  # Project documentation
```

## 🔑 API Keys Setup

### OpenWeatherMap API

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key and add it to your `.env` files

### Unsplash API

1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key
4. Add it to your `.env` files

## 🌐 Deployment

### Deploying to Vercel (Frontend)

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
cd homespark
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_OPENWEATHER_API_KEY`
   - `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
   - `NEXT_PUBLIC_API_URL`

### Deploying to Render/Railway (Backend)

#### Option 1: Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard

#### Option 2: Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will auto-detect FastAPI
4. Add environment variables in Railway dashboard

### Alternative: Docker Deployment

```bash
# Build Docker image
docker build -t homespark-backend .

# Run container
docker run -p 8000:8000 --env-file .env homespark-backend
```

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd homespark
npm test
```

## 📊 Model Information

### Machine Learning Pipeline

The system uses a hybrid approach combining:

1. **NMF (Non-negative Matrix Factorization)**: For dimensionality reduction and latent feature extraction
2. **K-Means Clustering**: For user preference grouping (8 clusters)

### Model Performance Metrics

- **Silhouette Score**: 0.9876
- **Reconstruction Error**: 0.0001
- **Precision**: 0.872
- **Recall**: 0.872
- **F1-Score**: 0.872

### Training Dataset

- **Size**: 2,500 renovation items
- **Features**:
  - Item attributes (name, cost, style, room type)
  - Climate suitability
  - Sustainability scores
  - Indoor/outdoor classification

## 👥 User Guide

### For Users

1. **Access the Application**: Navigate to the homepage
2. **Create Account** (Optional): Sign up to save recommendations
3. **Start Wizard**: Click "Get Started" or "Begin Renovation"
4. **Enter Preferences**:
   - Select renovation style (Modern, Traditional, Minimalist, etc.)
   - Choose budget range
   - Select room type
   - Specify indoor/outdoor preference
   - Enter your location
5. **View Recommendations**: Review AI-generated suggestions
6. **Customize**: Apply filters to refine results
7. **Save Favorites**: Save designs for future reference

### For Developers

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Project Author**: M.L.M. Perera

**Project Link**: [https://github.com/LakshanMaduranga511/HomeSpark-AI](https://github.com/yourusername/HomeSpark-AI)

## 📚 Academic Reference

This project was developed as part of:

- **Module**: 6CS007 - Project and Professionalism
- **Degree**: BSc (Hons) Computer Science (Software Engineering) (Top-up)
- **Submission Date**: November 15, 2024

## 🐛 Known Issues & Limitations

### Technical Limitations

- Dataset limited to 2,500 items (region-specific)
- Cold start problem for new users
- API rate limits (OpenWeatherMap, Unsplash)
- NMF/K-Means processing time increases with dataset size

### Functional Limitations

- No collaborative filtering
- Limited to initial form inputs (no dynamic learning)
- No multi-plan comparison
- No direct supplier integration
- No AR/3D visualization

## 🔮 Future Enhancements

- [ ] Collaborative filtering integration
- [ ] Dynamic preference learning
- [ ] AR/3D room previews
- [ ] Supplier network integration
- [ ] Multi-plan comparison
- [ ] Social sharing features
- [ ] Mobile app development
- [ ] Expanded dataset (10,000+ items)
- [ ] Real-time cost tracking
- [ ] Expert consultation integration

## 📈 System Metrics

- **Average Response Time**: 1.8 seconds
- **Model Accuracy**: 80-95%
- **User Satisfaction**: 88%
- **Recommendation Accuracy**: 88% (Very Accurate/Accurate)
- **Interface Usability**: 90% (Very Easy/Easy)
- **Speed Rating**: 86% (Very Fast/Fast)

---

**Made with ❤️ by M.L.M. Perera | HomeSpark Project 2025**
