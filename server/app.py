from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Load products relative to this script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_FILE = os.path.join(BASE_DIR, 'data', 'products.json')

def load_products():
    if not os.path.exists(PRODUCTS_FILE):
        return []
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/api/dresses', methods=['GET'])
def get_dresses():
    products = load_products()
    
    # Query parameters
    category = request.args.get('category', 'all').lower()
    search = request.args.get('search', '').lower()
    size = request.args.get('size', '').upper()
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 12))
    
    # Filtering
    filtered = products
    if category != 'all':
        filtered = [p for p in filtered if p.get('category', '').lower() == category]
    
    if search:
        filtered = [p for p in filtered if search in p.get('name', '').lower() or search in p.get('category', '').lower()]
        
    if size:
        filtered = [p for p in filtered if size in p.get('sizes', [])]
        
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated = filtered[start:end]
    
    return jsonify({
        'dresses': paginated,
        'totalItems': len(filtered),
        'totalPages': (len(filtered) + limit - 1) // limit,
        'currentPage': page
    })

@app.route('/api/scan-result', methods=['POST'])
def save_scan():
    # Placeholder for saving scan results (Phase 3+)
    data = request.json
    return jsonify({'status': 'success', 'message': 'Scan result received', 'data': data})

if __name__ == '__main__':
    # Running on 5000 by default
    app.run(debug=True, port=5000)
