# MIRRORVERSE – SMART FIT RECOMMENDATION (Amazon-Style AI Fashion)

## Elite Concept
Mirrorverse is a production-ready AI marketplace that solves the "Perfect Fit" problem. It uses **MediaPipe Pose** to scan a user's body silhouettes via their camera (mobile or laptop) and automatically recommends the correct dress size.

## Key Features
- **Amazon prime UI**: Professional Sticky Header, Yellow/Orange CTAs, and Category Ribbons (#131921 theme).
- **AI Size Engine**: Uses skeletal landmarks (shoulders, waist, hips) to calculate CM measurements and map to S/M/L/XL/XXL.
- **200 Garment Collection**: Fully populated database across Men's and Women's fashion (no jewelry, no shoes).
- **Infinite Discovery**: Infinite scroll on shop pages with "Perfect Fit for You" badges.
- **Responsive Architecture**: Smooth functionality on both Mobile and Laptops.

## Setup & Launch
1. Ensure Python 3.x is installed.
2. Install dependencies:
   ```bash
   pip install flask flask-cors flask-sqlalchemy python-dotenv
   ```
3. (Optional) Regenerate products if needed:
   ```bash
   python scripts/generate_products.py
   ```
4. Seed the database (IMPORTANT):
   ```bash
   python seed.py
   ```
5. Launch the Mirrorverse Elite Launcher:
   ```bash
   python run.py
   ```

## Tech Stack
- **AI Core**: MediaPipe Pose (Skeleton Tracking)
- **Backend API**: Python Flask + SQLAlchemy (SQLite)
- **Frontend Core**: Vanilla JS (ES6 Modules) + Amazon CSS Design System
- **Personalization**: Custom Size Logic for accurate sizing recommendations (Men/Women).

## API Key (Environment)
The system uses the following Google API Key for MediaPipe and Vision services (if enabled): 
`AIzaSyCT5inBXMbfnq41B_f_y86PGWM0adNnX7g`

---
Copyright © 2026 Mirrorverse Smart Fit. Portfolio-ready Enterprise Code.
