# 🚀 Mirrorverse - Quick Start Guide

## 📦 Installation & Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
cd c:\Users\Dell\Desktop\PROJECTS\mirrorverse-smart fit recommendation
pip install -r backend/requirements.txt
```

Expected output:
```
Successfully installed flask flask-cors flask-sqlalchemy python-dotenv
```

### Step 2: Generate Product Data (Optional - Already Done)
```bash
python scripts/generate_women_dresses.py
```

This creates 120 unique women's dresses with:
- ✅ 12 different categories
- ✅ Multiple colors per dress
- ✅ All 5 sizes (S, M, L, XL, XXL)
- ✅ Random discounts (0-30%)
- ✅ Star ratings & review counts
- ✅ Realistic pricing (₹1500-8000)

Output:
```
✅ Generated 120 women's dresses!
📁 Saved to: frontend/data/products.json
```

### Step 3: Seed the Database
```bash
python seed.py
```

This initializes SQLite with all 120 dresses.

Output:
```
✅ Successfully seeded 120 women's dresses!
```

### Step 4: Launch the Application
```bash
python run.py
```

This automatically:
- ✅ Starts Flask API on `http://localhost:5000`
- ✅ Starts Frontend server on `http://localhost:3000`
- ✅ Opens browser to the app

---

## 🎯 What You Get

### Backend API (Port 5000)

**Base URL:** `http://localhost:5000/api`

#### Dress Endpoints
```bash
# Get all dresses (paginated, 12 per page)
GET /dresses
GET /dresses?page=2
GET /dresses?page=1&sort=popularity
GET /dresses?page=1&size=M
GET /dresses?page=1&category=Maxi%20Dresses
GET /dresses?search=black

# Get specific dress
GET /dresses/1

# Filter by size
GET /dresses/size/M
GET /dresses/size/L?sort=price_asc

# Filter by category
GET /dresses/category/Formal%20Dresses
GET /dresses/category/Party%20Dresses

# Search
GET /dresses/search?q=blazer
GET /dresses/search?q=cotton

# Get metadata
GET /categories
GET /dresses/colors
```

#### Recommendations
```bash
# Smart size recommendations
GET /recommendations/size/M
GET /recommendations/size/L?page=1&sort=popularity

# Trending dresses
GET /recommendations/trending

# New arrivals
GET /recommendations/new

# Category recommendations
GET /recommendations/category/Summer%20Dresses
```

#### Smart Fit (Body Scan)
```bash
# Scan body measurements
POST /scan
Content-Type: application/json

{
  "chest": 90,
  "waist": 70,
  "hip": 95,
  "height": 165
}

Response:
{
  "success": true,
  "detectedSize": "M",
  "measurements": {...},
  "message": "✨ Perfect Fit Found! Size M is ideal for you.",
  "matchingDresses": [
    { dress objects... }
  ],
  "totalMatches": 47
}

# Get size guide
GET /scan/size-guide
```

### Frontend (Port 3000)

**Main Interface:** `http://localhost:3000`

Features:
- ✅ **Shop Page** (`shop-v2.html`)
  - Browse 120+ dresses
  - Infinite scroll loading
  - Search & filtering
  - Category browsing
  - Sort by popularity, rating, price
  - Filter by size
  - View product details

- ✅ **Smart Fit Scanner**
  - Enter body measurements
  - Get perfect dress size
  - Auto-filter dresses to your size
  - See personalized recommendations

- ✅ **Product Cards**
  - Product image
  - Category & name
  - Star rating & reviews
  - Price & discount
  - Available sizes
  - Special badges (New, Free Delivery)

---

## 🎨 Product Database

### Sample Dress Data

```json
{
  "id": 1,
  "name": "Black Elegant Blazer Dress",
  "category": "Blazer Dresses",
  "color": "Black",
  "price": 3499,
  "discount": 15,
  "originalPrice": 4116,
  "rating": 4.7,
  "reviews": 428,
  "fabric": "Cotton Blend",
  "fitType": "Slim",
  "availableSizes": ["S", "M", "L", "XL", "XXL"],
  "popularity": 450,
  "description": "Beautiful black blazer dress made with premium cotton blend. Perfect fit with slim silhouette...",
  "isNew": false,
  "freeDelivery": true,
  "image": "https://images.unsplash.com/..."
}
```

### All 12 Categories

1. **Blazer Dresses** - Professional, structured blazer dresses
2. **Pencil Dresses** - Fitted, elegant pencil cuts
3. **Sheath Dresses** - Formal, column silhouettes
4. **Wrap Dresses** - Flattering wrap style dresses
5. **Maxi Dresses** - Long, flowing floor-length dresses
6. **Casual Dresses** - Relaxed, everyday dresses
7. **Party Dresses** - Glamorous, statement party wear
8. **Formal Dresses** - Evening gowns & formal wear
9. **Summer Dresses** - Light, breezy summer styles
10. **Winter Dresses** - Warm, cozy winter dresses
11. **Office Dresses** - Professional workplace dresses
12. **Evening Dresses** - Sophisticated evening wear

---

## 🧪 Test the API

### Using Postman

1. **Import API URLs** from list above
2. **Test GET /dresses** to see all dresses
3. **Test POST /scan** with sample measurements
4. **Test filtering** with size, category, search params

### Using cURL

```bash
# Get first page of dresses
curl http://localhost:5000/api/dresses

# Get dresses in size M
curl http://localhost:5000/api/dresses/size/M

# Get trending dresses
curl http://localhost:5000/api/recommendations/trending

# Test body scan
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "chest": 90,
    "waist": 70,
    "hip": 95,
    "height": 165
  }'
```

### Using Browser

Just visit and interact with the frontend:
```
http://localhost:3000
```

Features to test:
1. ✅ Scroll down - more dresses load automatically
2. ✅ Click "Smart Fit" - enter measurements
3. ✅ Use search bar - find dresses
4. ✅ Click filters - sort & filter dresses
5. ✅ View categories - browse by type

---

## 📊 Database

### SQLite Database File
- **Location:** `instance/database.db` (created after seeding)
- **Tables:** `products` table with 120 rows
- **Indexes:** Optimized for filtering by gender, category, size

### Check Database

```bash
# View database file
ls -la instance/

# Query with Python
python
>>> from backend.models import db, Product
>>> from backend.app import app
>>> with app.app_context():
...     count = Product.query.count()
...     print(f"Total dresses: {count}")
...
Total dresses: 120
```

---

## 🔧 Configuration

### .env File
```env
FLASK_ENV=development
DATABASE_URL=sqlite:///database.db
SECRET_KEY=mirrorverse-elite-secret
GOOGLE_API_KEY=AIzaSyCT5inBXMbfnq41B_f_y86PGWM0adNnX7g
ENABLE_SMART_FIT=true
```

### Modify Behavior

**Change Products Per Page:**
Edit `backend/routes/products.py`:
```python
ITEMS_PER_PAGE = 12  # Change to 24, 36, etc.
```

**Add More Dresses:**
1. Edit `scripts/generate_women_dresses.py`
2. Change the loop count: `for i in range(10):` → `for i in range(20):`
3. Run: `python scripts/generate_women_dresses.py`
4. Re-seed: `python seed.py`

---

## ⚡ Performance Tips

### For Development
```bash
# Run in debug mode (auto-reload)
python -m flask run --reload --port 5000
```

### For Production
```bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Issues
```bash
# Reset database
rm instance/database.db

# Re-seed
python seed.py
```

### API Not Responding
```bash
# Check Flask is running
curl http://localhost:5000/api/dresses

# Check frontend is running
curl http://localhost:3000
```

### CORS Issues
- ✅ Already configured in backend
- Backend has `CORS(app)` enabled
- All endpoints accessible from frontend

---

## 📱 Mobile Testing

### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test infinite scroll & interactions

### Responsive Breakpoints
- **Mobile:** < 768px (2 columns)
- **Tablet:** 768-1024px (3-4 columns)
- **Desktop:** > 1024px (4-5 columns)

---

## 🚢 Deployment

### Deploy Backend to Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend to Netlify
```bash
netlify deploy --prod
```

---

## 📚 File Structure

```
.
├── backend/
│   ├── app.py                    # Flask app factory
│   ├── config.py                 # Configuration
│   ├── models.py                 # Product model ✅ UPDATED
│   ├── routes/
│   │   ├── products.py           # Dress endpoints ✅ UPDATED
│   │   ├── recommendations.py    # Smart recommendations ✅ UPDATED
│   │   ├── scan.py               # Body scan ✅ UPDATED
│   │   └── users.py
│   └── services/
│       ├── size_engine.py        # Size calculation
│       └── recommendation_engine.py
├── frontend/
│   ├── shop-v2.html              # ✅ NEW Modern shop interface
│   ├── js/
│   │   ├── api.js                # ✅ UPDATED API service
│   │   ├── cart.js
│   │   └── main.js
│   └── data/
│       └── products.json         # ✅ 120 dresses
├── scripts/
│   ├── generate_women_dresses.py # ✅ NEW Data generator
│   └── generate_products.py
├── seed.py                        # ✅ UPDATED
├── run.py                         # Launch script
├── .env                           # ✅ NEW Environment config
└── README.md                      # ✅ UPDATED
```

---

## ✅ What Was Built

### Backend Enhancements
- ✅ Enhanced Product model with colors, discounts, new/delivery badges
- ✅ Comprehensive pagination (12 items per page)
- ✅ Advanced filtering (size, category, color, price range)
- ✅ Sorting (new, popularity, rating, price)
- ✅ Search functionality
- ✅ Size-based recommendations
- ✅ Body scan with size detection
- ✅ Trending & new arrival endpoints

### Frontend
- ✅ Modern shop-v2.html with infinite scroll
- ✅ Responsive grid (2-4-5 columns)
- ✅ Search & filtering UI
- ✅ Category carousel
- ✅ Smart Fit button & modal
- ✅ Product cards with ratings, badges, sizes
- ✅ Auto-load on scroll
- ✅ Lazy image loading

### Data
- ✅ 120 unique women's dresses
- ✅ 12 categories (all premium dress types)
- ✅ 25+ colors
- ✅ All 5 sizes (S-XXL)
- ✅ Realistic pricing & discounts
- ✅ Star ratings & reviews
- ✅ Fabric types & fit styles

### Configuration
- ✅ .env file for secrets
- ✅ Database seeding script
- ✅ Product generation script
- ✅ Updated requirements.txt
- ✅ Comprehensive README

---

## 🎉 You're All Set!

Everything is ready to go. Just run:

```bash
python run.py
```

And start shopping! 👗✨

---

**Happy Coding! 🚀**
Copyright © 2026 Mirrorverse Smart Fit
