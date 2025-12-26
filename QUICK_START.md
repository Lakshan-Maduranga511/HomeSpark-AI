# ⚡ Quick Start Guide - HomeSpark AI

Get up and running with HomeSpark AI in under 10 minutes!

## 🚀 For Impatient Developers

```bash
# 1. Clone and setup
git clone https://github.com/yourusername/HomeSpark-AI.git
cd HomeSpark-AI

# 2. Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys

# 3. Frontend setup
cd ../homespark
npm install
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run both servers
# Terminal 1 (Backend):
cd backend && uvicorn main:app --reload

# Terminal 2 (Frontend):
cd homespark && npm run dev

# 5. Open http://localhost:3000 🎉
```

---

## 📝 Detailed Step-by-Step

### Step 1: Get API Keys (5 minutes)

#### OpenWeatherMap API

1. Go to https://openweathermap.org/api
2. Click "Sign Up" (or "Sign In" if you have an account)
3. After signing in, go to "API keys" tab
4. Copy your API key

#### Unsplash API

1. Go to https://unsplash.com/developers
2. Click "Register as a developer"
3. Create a "New Application"
4. Fill in the required information
5. Copy your "Access Key"

### Step 2: Clone Repository

```bash
# HTTPS (recommended for beginners)
git clone https://github.com/yourusername/HomeSpark-AI.git
cd HomeSpark-AI

# OR SSH (if you have SSH keys set up)
git clone git@github.com:yourusername/HomeSpark-AI.git
cd HomeSpark-AI
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env file with your API keys
# Use your favorite text editor (nano, vim, VS Code, etc.)
nano .env  # or code .env
```

**Add your keys to .env:**

```env
OPENWEATHER_API_KEY=paste_your_key_here
UNSPLASH_ACCESS_KEY=paste_your_key_here
MODEL_PATH=./models/home_renovation_model_package.pkl
DATASET_PATH=./data/renovation_dataset.csv
CORS_ORIGINS=http://localhost:3000
```

### Step 4: Prepare Model and Data Files

Make sure these files exist:

```bash
# Check if model file exists
ls -lh models/home_renovation_model_package.pkl

# Check if dataset exists
ls -lh data/renovation_dataset.csv
```

**If files are missing:**

1. Check if they're tracked by Git LFS:
   ```bash
   git lfs pull
   ```

2. Or download from external source (if provided in README)

3. Or regenerate model:
   ```bash
   python scripts/train_model.py  # if training script exists
   ```

### Step 5: Test Backend

```bash
# Make sure you're in backend directory with venv activated
cd backend
source venv/bin/activate  # if not already activated

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Server should start at http://localhost:8000
# API docs available at http://localhost:8000/docs
```

**Test the API:**

Open another terminal and run:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","timestamp":"2024-..."}
```

### Step 6: Frontend Setup

Open a NEW terminal (keep backend running):

```bash
# Navigate to frontend directory
cd homespark

# Install dependencies
npm install
# This might take a few minutes

# Create environment file
cp .env.example .env.local

# Edit .env.local with your API keys
code .env.local  # or nano .env.local
```

**Add your keys to .env.local:**

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=paste_your_key_here
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=paste_your_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 7: Start Frontend

```bash
# Make sure you're in homespark directory
cd homespark

# Start development server
npm run dev

# Server should start at http://localhost:3000
```

### Step 8: Access the Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the HomeSpark homepage! 🎉

---

## 🧪 Quick Test

### Test the Recommendation Flow

1. Click **"Get Started"** or **"Begin Renovation"**
2. Fill in the wizard:
   - **Style:** Modern
   - **Budget:** $10,000 - $20,000
   - **Room Type:** Living Room
   - **Location:** Colombo (or your city)
   - **Indoor/Outdoor:** Indoor
3. Click **"Get Recommendations"**
4. You should see AI-generated renovation suggestions!

### Test API Directly

```bash
# Test recommendation endpoint
curl -X POST http://localhost:8000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 15000,
    "style": "modern",
    "room_type": "living_room",
    "indoor_outdoor": "indoor",
    "location": "Colombo"
  }'
```

---

## 🐛 Common Issues & Quick Fixes

### Issue 1: "Module not found" Error

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd homespark
npm install
```

### Issue 2: "Port already in use"

```bash
# Backend (change port)
uvicorn main:app --reload --port 8001

# Update frontend .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8001

# Frontend (change port)
PORT=3001 npm run dev
```

### Issue 3: "API Key Invalid"

- Double-check your API keys in `.env` files
- Make sure there are no extra spaces
- Verify keys are active on respective platforms

### Issue 4: CORS Error

Make sure backend CORS settings include frontend URL:

```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 5: Model File Not Found

```bash
# Check if file exists
ls -lh backend/models/home_renovation_model_package.pkl

# If using Git LFS
git lfs pull

# Or download from external source
# See README.md for download links
```

### Issue 6: Python Version Mismatch

```bash
# Check Python version
python --version

# Should be 3.9 or higher
# If not, install correct version or use:
python3.9 -m venv venv
```

---

## 📚 Next Steps

Once everything is running:

1. **Explore the Documentation:**
   - [README.md](README.md) - Full project overview
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deploy to production
   - [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) - Upload to GitHub

2. **Customize Your Installation:**
   - Modify the dataset in `backend/data/`
   - Adjust ML model parameters
   - Customize UI in `homespark/components/`

3. **Deploy to Production:**
   - See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for Vercel/Render deployment

4. **Contribute:**
   - Report bugs via GitHub Issues
   - Submit pull requests
   - Star the repository ⭐

---

## 🆘 Still Having Issues?

### Check Logs

**Backend:**
```bash
# Logs are in terminal where you ran uvicorn
# Or check application logs
```

**Frontend:**
```bash
# Logs are in terminal where you ran npm run dev
# Or check browser console (F12)
```

### Get Help

1. **Review Documentation:**
   - README.md
   - DEPLOYMENT_GUIDE.md
   - GITHUB_SETUP_GUIDE.md

2. **Check GitHub Issues:**
   - https://github.com/yourusername/HomeSpark-AI/issues

3. **Create New Issue:**
   - Click "New Issue"
   - Describe your problem
   - Include error messages and logs

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] API documentation accessible at http://localhost:8000/docs
- [ ] Homepage loads correctly
- [ ] Wizard form works
- [ ] Recommendations are generated
- [ ] Images load from Unsplash
- [ ] Climate data integrates (check console logs)

---

## 🎉 You're All Set!

Your HomeSpark AI system is now running locally.

**Next Goals:**
- Test all features thoroughly
- Customize for your needs
- Deploy to production
- Share with others!

**Happy renovating! 🏠✨**

---

## 📞 Contact

- **GitHub:** https://github.com/yourusername
- **Email:** your.email@example.com
- **Project:** https://github.com/yourusername/HomeSpark-AI

---

**Estimated Setup Time:** 10-15 minutes  
**Difficulty:** Beginner-Friendly  
**Requirements:** Python 3.9+, Node.js 16+, Git
