# 📡 Mirrorverse API Documentation

Base URL: `http://localhost:5000/api`

---

## 🛍️ Dresses Endpoints

### GET /dresses
Get paginated list of women's dresses with advanced filtering.

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `size` (string) - Filter by available size: S, M, L, XL, XXL
- `category` (string) - Filter by dress category
- `color` (string) - Filter by color
- `search` (string) - Search by name/description/fabric
- `sort` (string) - Sort order:
  - `new` (default) - New arrivals first
  - `popularity` - Most popular first
  - `rating` - Highest rated first
  - `price_asc` - Price low to high
  - `price_desc` - Price high to low
- `min_price` (float) - Minimum price
- `max_price` (float) - Maximum price

**Examples:**
```bash
# Get all dresses (page 1)
GET /dresses

# Get page 2 of dresses
GET /dresses?page=2

# Get dresses in size M, sorted by popularity
GET /dresses?size=M&sort=popularity

# Get formal dresses, sorted by rating
GET /dresses?category=Formal%20Dresses&sort=rating

# Get black dresses under ₹5000
GET /dresses?color=Black&max_price=5000

# Search for "blazer" dresses
GET /dresses?search=blazer
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Black Elegant Blazer Dress",
      "category": "Blazer Dresses",
      "image": "https://...",
      "price": 3499,
      "discount": 15,
      "originalPrice": 4116,
      "rating": 4.7,
      "reviews": 428,
      "fabric": "Cotton Blend",
      "fitType": "Slim",
      "color": "Black",
      "availableSizes": ["S", "M", "L", "XL", "XXL"],
      "popularity": 450,
      "description": "...",
      "isNew": false,
      "freeDelivery": true
    },
    ...
  ],
  "pagination": {
    "total": 120,
    "pages": 10,
    "current_page": 1,
    "per_page": 12,
    "has_next": true
  }
}
```

---

### GET /dresses/{id}
Get a specific dress by ID.

**Parameters:**
- `id` (integer, required) - Dress ID

**Example:**
```bash
GET /dresses/42
```

**Response:**
```json
{
  "id": 42,
  "name": "Red Party Sequin Dress",
  "category": "Party Dresses",
  "image": "https://...",
  "price": 4499,
  "discount": 20,
  "rating": 4.8,
  "reviews": 156,
  "fabric": "Polyester",
  "fitType": "Bodycon",
  "color": "Red",
  "availableSizes": ["S", "M", "L", "XL"],
  "popularity": 380,
  "description": "Glamorous red party dress...",
  "isNew": true,
  "freeDelivery": true
}
```

---

### GET /dresses/category/{category}
Get dresses by category.

**Parameters:**
- `category` (string, required) - Category name
- `page` (integer, query param) - Page number

**Valid Categories:**
- Blazer Dresses
- Pencil Dresses
- Sheath Dresses
- Wrap Dresses
- Maxi Dresses
- Casual Dresses
- Party Dresses
- Formal Dresses
- Summer Dresses
- Winter Dresses
- Office Dresses
- Evening Dresses

**Example:**
```bash
GET /dresses/category/Maxi%20Dresses?page=1
```

**Response:**
```json
{
  "data": [
    { dress objects... }
  ],
  "pagination": {
    "total": 10,
    "pages": 1,
    "current_page": 1,
    "has_next": false
  }
}
```

---

### GET /dresses/size/{size}
Get dresses available in a specific size.

**Parameters:**
- `size` (string, required) - Size: S, M, L, XL, XXL
- `page` (integer, query param) - Page number
- `sort` (string, query param) - Sort order

**Example:**
```bash
GET /dresses/size/M?sort=popularity
```

**Response:**
```json
{
  "data": [
    { dress objects matching size M... }
  ],
  "pagination": {
    "total": 95,
    "pages": 8,
    "current_page": 1,
    "has_next": true
  }
}
```

---

### GET /dresses/search
Search for dresses.

**Parameters:**
- `q` (string, required, min 2 chars) - Search query
- `page` (integer, query param) - Page number

**Searches:** name, description, fabric

**Example:**
```bash
GET /dresses/search?q=cotton&page=1
```

**Response:**
```json
{
  "data": [
    { dress objects matching "cotton"... }
  ],
  "pagination": {
    "total": 35,
    "pages": 3,
    "current_page": 1,
    "has_next": true
  }
}
```

---

### GET /categories
Get all available dress categories.

**Example:**
```bash
GET /categories
```

**Response:**
```json
{
  "categories": [
    "Blazer Dresses",
    "Pencil Dresses",
    "Sheath Dresses",
    "Wrap Dresses",
    "Maxi Dresses",
    "Casual Dresses",
    "Party Dresses",
    "Formal Dresses",
    "Summer Dresses",
    "Winter Dresses",
    "Office Dresses",
    "Evening Dresses"
  ]
}
```

---

### GET /dresses/colors
Get all available colors.

**Example:**
```bash
GET /dresses/colors
```

**Response:**
```json
{
  "colors": [
    "Black",
    "White",
    "Navy Blue",
    "Red",
    "Burgundy",
    "Gray",
    "Charcoal",
    "Blush Pink",
    "Rose",
    "Coral",
    ...
  ]
}
```

---

## 💡 Recommendations Endpoints

### GET /recommendations/size/{size}
Get dress recommendations for a specific size (Perfect Fit for You).

**Parameters:**
- `size` (string, required) - Size: S, M, L, XL, XXL
- `page` (integer, query param) - Page number
- `sort` (string, query param) - popularity, rating, new

**Example:**
```bash
GET /recommendations/size/M?sort=popularity
```

**Response:**
```json
{
  "size": "M",
  "message": "Perfect Fit for You - All dresses available in size M",
  "data": [
    { dress objects sorted by popularity... }
  ],
  "pagination": {
    "total": 95,
    "pages": 8,
    "current_page": 1,
    "has_next": true
  }
}
```

---

### GET /recommendations/trending
Get trending women's dresses.

**Parameters:**
- `page` (integer, query param) - Page number

**Example:**
```bash
GET /recommendations/trending
```

**Response:**
```json
{
  "message": "Trending Women's Dresses",
  "data": [
    { dress objects sorted by popularity & rating... }
  ],
  "pagination": {
    "total": 120,
    "pages": 10,
    "current_page": 1,
    "has_next": true
  }
}
```

---

### GET /recommendations/new
Get new arrival women's dresses.

**Parameters:**
- `page` (integer, query param) - Page number

**Example:**
```bash
GET /recommendations/new
```

**Response:**
```json
{
  "message": "New Arrivals",
  "data": [
    { latest dress objects... }
  ],
  "pagination": {
    "total": 12,
    "pages": 1,
    "current_page": 1,
    "has_next": false
  }
}
```

---

### GET /recommendations/category/{category}
Get recommendations for a specific dress category.

**Parameters:**
- `category` (string, required) - Category name
- `page` (integer, query param) - Page number

**Example:**
```bash
GET /recommendations/category/Summer%20Dresses
```

**Response:**
```json
{
  "category": "Summer Dresses",
  "message": "Shop Summer Dresses",
  "data": [
    { dress objects in Summer Dresses category... }
  ],
  "pagination": {
    "total": 10,
    "pages": 1,
    "current_page": 1,
    "has_next": false
  }
}
```

---

## 📏 Smart Fit Endpoints

### POST /scan
Analyze body measurements and recommend dress size.

**Request Body:**
```json
{
  "chest": 90,
  "waist": 70,
  "hip": 95,
  "height": 165
}
```

**Parameters:**
- `chest` (float, required, cm) - Chest measurement
- `waist` (float, required, cm) - Waist measurement
- `hip` (float, required, cm) - Hip measurement
- `height` (float, required, cm) - Height measurement

**Example:**
```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "chest": 90,
    "waist": 70,
    "hip": 95,
    "height": 165
  }'
```

**Response:**
```json
{
  "success": true,
  "detectedSize": "M",
  "measurements": {
    "chest": 90,
    "waist": 70,
    "hip": 95,
    "height": 165
  },
  "message": "✨ Perfect Fit Found! Size M is ideal for you.",
  "advice": "Based on your measurements, Size M will provide the best fit for our dress collection.",
  "matchingDresses": [
    { dress objects available in size M... }
  ],
  "totalMatches": 95
}
```

---

### GET /scan/size-guide
Get detailed size guide for women's dresses.

**Example:**
```bash
GET /scan/size-guide
```

**Response:**
```json
{
  "title": "Women's Dress Size Guide",
  "guide": {
    "S": {
      "size": "S (Small)",
      "chest": "86-90 cm",
      "waist": "60-66 cm",
      "hip": "90-96 cm",
      "recommended": "Petite to Average builds"
    },
    "M": {
      "size": "M (Medium)",
      "chest": "90-94 cm",
      "waist": "66-72 cm",
      "hip": "96-102 cm",
      "recommended": "Average builds"
    },
    "L": {
      "size": "L (Large)",
      "chest": "94-100 cm",
      "waist": "72-78 cm",
      "hip": "102-108 cm",
      "recommended": "Average to Curvy builds"
    },
    "XL": {
      "size": "XL (Extra Large)",
      "chest": "100-106 cm",
      "waist": "78-84 cm",
      "hip": "108-114 cm",
      "recommended": "Curvy builds"
    },
    "XXL": {
      "size": "XXL (Double Extra Large)",
      "chest": "106+ cm",
      "waist": "84+ cm",
      "hip": "114+ cm",
      "recommended": "Full-figured builds"
    }
  },
  "tips": [
    "Take measurements with a flexible tape measure",
    "Keep the tape snug but not tight",
    "Measure over regular clothing",
    "For best results, measure chest at the fullest point",
    "Measure waist at the narrowest point",
    "Measure hips at the fullest point"
  ]
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "data": [...],
  "pagination": {
    "total": 120,
    "pages": 10,
    "current_page": 1,
    "per_page": 12,
    "has_next": true
  }
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## 🔍 Filter Examples

### By Size
```bash
GET /dresses?size=M
GET /dresses?size=L&page=1
```

### By Category
```bash
GET /dresses?category=Formal%20Dresses
GET /dresses/category/Party%20Dresses?page=1
```

### By Color
```bash
GET /dresses?color=Black
GET /dresses?color=Red
```

### By Price Range
```bash
GET /dresses?min_price=2000&max_price=6000
GET /dresses?max_price=4000
```

### By Search
```bash
GET /dresses?search=blazer
GET /dresses?search=cotton
GET /dresses/search?q=silk&page=1
```

### Combined Filters
```bash
GET /dresses?size=M&category=Formal%20Dresses&sort=rating
GET /dresses?search=blue&max_price=5000&sort=price_asc
GET /dresses?size=L&color=Black&sort=popularity
```

### Sorting Options
```bash
GET /dresses?sort=new          # New arrivals
GET /dresses?sort=popularity   # Most popular
GET /dresses?sort=rating       # Highest rated
GET /dresses?sort=price_asc    # Price: Low to High
GET /dresses?sort=price_desc   # Price: High to Low
```

---

## ⚡ Pagination

### Page Navigation
```bash
# First page (default)
GET /dresses

# Specific page
GET /dresses?page=2

# Last page based on total (120 dresses, 12 per page = 10 pages)
GET /dresses?page=10
```

### Infinite Scroll
```bash
# Load next page on scroll
GET /dresses?page=1  # Initial load
GET /dresses?page=2  # User scrolls
GET /dresses?page=3  # Auto-loads more
```

---

## 🧪 Testing

### Using curl
```bash
# Test basic endpoint
curl http://localhost:5000/api/dresses

# Test with parameters
curl "http://localhost:5000/api/dresses?size=M&sort=popularity"

# Test body scan
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"chest": 90, "waist": 70, "hip": 95, "height": 165}'
```

### Using Postman
1. Import request collection
2. Set base URL: `http://localhost:5000/api`
3. Test each endpoint
4. Modify parameters and test

### Using Browser
```
http://localhost:5000/api/dresses
http://localhost:5000/api/dresses?page=2
http://localhost:5000/api/categories
http://localhost:5000/api/scan/size-guide
```

---

## 📝 Notes

- ✅ All endpoints return JSON
- ✅ All timestamps are ISO 8601 format
- ✅ Pagination: 12 items per page
- ✅ All sizes are case-insensitive but stored as uppercase
- ✅ Search is case-insensitive
- ✅ CORS enabled for all endpoints
- ✅ No authentication required for GET endpoints
- ✅ All prices in Indian Rupees (₹)

---

## 🚀 Rate Limits

Currently no rate limits. For production:
- Add rate limiting per IP
- Implement API key authentication
- Add caching for popular endpoints

---

**Built with ❤️ for Mirrorverse**
Copyright © 2026 Mirrorverse Smart Fit
