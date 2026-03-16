# 🚀 Mirrorverse Startup Instructions

## ONE-COMMAND STARTUP

```bash
python run.py
```

That's it! The application will:
1. ✅ Start Flask API on http://localhost:5000
2. ✅ Start Frontend server on http://localhost:3000
3. ✅ Automatically open in your browser

---

## FIRST-TIME SETUP (One-Time Only)

If you haven't already, run these commands once:

### Step 1: Install Dependencies
```bash
pip install flask flask-cors flask-sqlalchemy python-dotenv
```

### Step 2: Seed Database
```bash
python seed.py
```

You should see:
```
✅ Successfully seeded 120 women's dresses!
```

### Step 3: Run Application
```bash
python run.py
```

---

## WHAT YOU'LL SEE

### Home Page (http://localhost:3000)
- **Header**: Search bar, Smart Fit button, navigation
- **Categories**: Scroll through dress types
- **Grid**: 120 women's dresses with:
  - Beautiful images
  - Product names
  - Star ratings
  - Prices & discounts
  - Available sizes
  - Special badges (Free Delivery, New)
- **Filters**: Sort by popularity, rating, price
- **Search**: Find dresses by name, fabric, description
- **Infinite Scroll**: Automatically loads more as you scroll

### Smart Fit Scanner
1. Click "📏 Smart Fit" button
2. Enter body measurements:
   - Chest (cm)
   - Waist (cm)
   - Hip (cm)
   - Height (cm)
3. Click "Scan & Find Perfect Fit"
4. System calculates your size
5. Auto-filters to dresses in your size
6. Shows "Perfect Fit for You" recommendations

---

## API ENDPOINTS

### Browse Products
```bash
# All dresses
http://localhost:5000/api/dresses

# By size
http://localhost:5000/api/dresses?size=M

# By category
http://localhost:5000/api/dresses?category=Formal%20Dresses

# Search
http://localhost:5000/api/dresses?search=black

# Sorted
http://localhost:5000/api/dresses?sort=popularity
```

### Get Metadata
```bash
# All categories
http://localhost:5000/api/categories

# All colors
http://localhost:5000/api/dresses/colors

# Size guide
http://localhost:5000/api/scan/size-guide
```

### Smart Fit
```bash
# GET size guide
GET http://localhost:5000/api/scan/size-guide

# POST body scan
POST http://localhost:5000/api/scan
Content-Type: application/json

{
  "chest": 90,
  "waist": 70,
  "hip": 95,
  "height": 165
}
```

---

## FILE LOCATIONS

### Main Interface
📄 `frontend/shop-v2.html` - This is what you'll see in the browser

### API Service
📄 `frontend/js/api.js` - All API calls are here

### Product Data
📄 `frontend/data/products.json` - 120 dresses in JSON format

### Backend
📂 `backend/` - Flask REST API
- `app.py` - Main Flask app
- `models.py` - Product database model
- `routes/products.py` - Dress endpoints
- `routes/recommendations.py` - Smart recommendations
- `routes/scan.py` - Body scan/sizing

### Configuration
📄 `.env` - Environment variables (API keys, settings)

### Database
📄 `instance/mirrorverse.db` - SQLite database with 120 dresses

---

## WHAT'S INCLUDED

### 120 Women's Dresses
**12 Categories:**
1. Blazer Dresses
2. Pencil Dresses
3. Sheath Dresses
4. Wrap Dresses
5. Maxi Dresses
6. Casual Dresses
7. Party Dresses
8. Formal Dresses
9. Summer Dresses
10. Winter Dresses
11. Office Dresses
12. Evening Dresses

**Each Dress Includes:**
- Name, Category, Color
- Price (₹1,500-8,000)
- Discount (0-30%)
- Star rating (3.5-5.0)
- Review count (10-500+)
- Available sizes: S, M, L, XL, XXL
- Fabric type: Cotton, Silk, Polyester, etc.
- Fit type: Slim, A-Line, Bodycon, etc.
- High-quality image
- Detailed description
- Free Delivery badge
- New Arrival indicator
- Popularity score

---

## FEATURES

✅ **Infinite Scroll**
- Automatically loads more dresses
- No page reloads needed
- Smooth, seamless experience

✅ **Advanced Search**
- Search by dress name
- Search by fabric type
- Search by description
- Real-time filtering

✅ **Smart Filters**
- Filter by size (S, M, L, XL, XXL)
- Filter by category (12 types)
- Filter by color (25+ colors)
- Filter by price range

✅ **Sorting Options**
- New arrivals first
- Most popular first
- Highest rated first
- Price: Low to High
- Price: High to Low

✅ **Body Scan / Smart Fit**
- Enter your body measurements
- System calculates perfect size
- Auto-filters to your size
- Shows personalized recommendations

✅ **Product Information**
- Star ratings with review count
- Pricing with discount display
- Available sizes clearly shown
- Special badges (Free Delivery, New)
- Fabric and fit information
- Detailed descriptions

✅ **Responsive Design**
- Mobile: 2-column layout
- Tablet: 3-4 columns
- Desktop: 4-5 columns
- Fast loading on all devices

---

## TROUBLESHOOTING

### Port Already in Use
If you get "Address already in use":
```bash
# Windows - Kill processes on ports
netstat -ano | findstr :5000
taskkill /PID <PID> /F

netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Error
If you get database errors:
```bash
# Reset database
rm instance/mirrorverse.db

# Re-seed
python seed.py
```

### API Not Found
If API endpoints fail:
1. Check Flask is running on port 5000
2. In browser, visit: http://localhost:5000/api/dresses
3. Should return JSON data

### Frontend Not Loading
If shop-v2.html doesn't work:
1. Make sure you're accessing http://localhost:3000
2. Not http://localhost:3000/shop-v2.html
3. Check browser console (F12) for errors

### No Data Showing
1. Verify database was seeded: `python seed.py`
2. Check if `mirrorverse.db` file exists in `instance/`
3. Verify `products.json` exists in `frontend/data/`

---

## DIRECTORY STRUCTURE

```
mirrorverse/
├── backend/                          # Flask API
│   ├── app.py
│   ├── models.py
│   ├── routes/
│   │   ├── products.py
│   │   ├── recommendations.py
│   │   └── scan.py
│   └── instance/
│       └── mirrorverse.db           # SQLite database
├── frontend/
│   ├── shop-v2.html                 # Main interface ⭐
│   ├── js/
│   │   └── api.js                   # API service
│   └── data/
│       └── products.json            # 120 dresses
├── scripts/
│   └── generate_women_dresses.py    # Data generator
├── seed.py                          # Database seeding
├── run.py                           # Application launcher ⭐
├── .env                             # Configuration
├── README.md                        # Documentation
├── QUICKSTART.md                    # Quick start
├── API_DOCUMENTATION.md             # API reference
└── BUILD_SUMMARY.md                 # Project summary
```

---

## QUICK REFERENCE

### Access Points
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000
- **API Docs**: Check API_DOCUMENTATION.md

### Main Files
- **Start app**: `python run.py`
- **Shop page**: `frontend/shop-v2.html`
- **API service**: `frontend/js/api.js`
- **Backend API**: `backend/routes/products.py`
- **Database**: `instance/mirrorverse.db`

### Documentation
- **Setup**: QUICKSTART.md
- **API**: API_DOCUMENTATION.md
- **Project**: PROJECT_COMPLETE.md
- **Summary**: BUILD_SUMMARY.md

---

## PERFORMANCE TIPS

### Development
- App auto-reloads on code changes
- Use DevTools (F12) to debug
- Check Network tab for API calls
- Check Console for JavaScript errors

### Production
- Consider adding caching
- Use a production WSGI server (Gunicorn)
- Add database indexes
- Implement CDN for images
- Add monitoring & logging

---

## NEXT STEPS

### To Explore
1. Open http://localhost:3000
2. Scroll infinite scroll
3. Use search bar
4. Try filters & sorting
5. Click "Smart Fit" button
6. Enter body measurements
7. See size recommendations

### To Develop
1. Modify `frontend/shop-v2.html` for UI changes
2. Edit `backend/routes/products.py` for API changes
3. Update `.env` for configuration
4. Check API_DOCUMENTATION.md for endpoints

### To Deploy
1. Push to GitHub
2. Deploy backend to Heroku/AWS/GCP
3. Deploy frontend to Netlify/Vercel
4. Connect custom domain
5. Set up SSL certificate

---

## SUPPORT

### Check Logs
- **Backend**: Look at Flask console output
- **Frontend**: Open DevTools (F12)
- **Database**: Query with Python shell

### Verify Setup
```bash
# Check database has dresses
python
>>> from backend.models import Product
>>> from backend.app import app
>>> with app.app_context():
...     count = Product.query.count()
...     print(f"Total dresses: {count}")
... 
Total dresses: 120

# Check API is running
curl http://localhost:5000/api/dresses
```

---

## 🎉 Everything is Ready!

```bash
python run.py
```

Then visit: http://localhost:3000

**Enjoy the Mirrorverse! 👗✨**

---

**Copyright © 2026 Mirrorverse Smart Fit**
Production-ready eCommerce for women's fashion.
