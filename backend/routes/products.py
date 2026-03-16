from flask import Blueprint, jsonify, request
from backend.models import Product, db

products_bp = Blueprint('products_bp', __name__)

# Constants
ITEMS_PER_PAGE = 12
WOMEN_CATEGORIES = [
    "Blazer Dresses", "Pencil Dresses", "Sheath Dresses", "Wrap Dresses",
    "Maxi Dresses", "Casual Dresses", "Party Dresses", "Formal Dresses",
    "Summer Dresses", "Winter Dresses", "Office Dresses", "Evening Dresses",
    "Mini Dresses", "Midi Dresses", "Bodycon Dresses", "A-Line Dresses",
    "Floral Dresses", "Bohemian Dresses", "Cocktail Dresses", "Wedding Guest Dresses"
]

ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']

@products_bp.route('/dresses', methods=['GET'])
def get_dresses():
    """
    Get women's dresses with pagination, filtering, and sorting
    Query params:
    - page: page number (default 1)
    - size: filter by available size (S, M, L, XL, XXL)
    - category: filter by category
    - color: filter by color
    - search: search by name/description
    - sort: price_asc, price_desc, popularity, rating, new (default)
    - min_price, max_price: price range
    """
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size')
    category = request.args.get('category')
    color = request.args.get('color')
    search = request.args.get('search')
    sort = request.args.get('sort', 'new')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    # Start query - Women dresses only
    query = Product.query.filter(Product.gender == "Women")
    
    # Filter by category
    if category and category in WOMEN_CATEGORIES:
        query = query.filter(Product.category == category)
    
    # Filter by color
    if color:
        query = query.filter(Product.color.ilike(f"%{color}%"))
    
    # Filter by available size
    if size and size.upper() in ALL_SIZES:
        query = query.filter(Product.availableSizes.ilike(f"%{size}%"))
    
    # Filter by price range
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Search functionality
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) | 
            (Product.description.ilike(f"%{search}%")) |
            (Product.fabric.ilike(f"%{search}%"))
        )
    
    # Sorting
    if sort == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort == 'popularity':
        query = query.order_by(Product.popularity.desc())
    elif sort == 'rating':
        query = query.order_by(Product.rating.desc())
    else:  # new
        query = query.order_by(Product.is_new.desc(), Product.created_at.desc())
    
    
    # Return all items for MVP without pagination to simplify frontend
    items = query.all()
    
    return jsonify({
        "data": [p.to_dict() for p in items],
        "pagination": {
            "total": len(items),
            "pages": 1,
            "current_page": 1,
            "per_page": len(items),
            "has_next": False
        }
    })

@products_bp.route('/dresses/<int:pid>', methods=['GET'])
def get_dress(pid):
    """Get a specific dress by ID"""
    product = Product.query.get_or_404(pid)
    if product.gender != "Women":
        return jsonify({"error": "Not found"}), 404
    return jsonify(product.to_dict())

@products_bp.route('/dresses/category/<category>', methods=['GET'])
def get_by_category(category):
    """Get dresses by category"""
    page = request.args.get('page', 1, type=int)
    
    if category not in WOMEN_CATEGORIES:
        return jsonify({"error": "Invalid category"}), 400
    
    query = Product.query.filter(
        Product.gender == "Women",
        Product.category == category
    ).order_by(Product.created_at.desc())
    items = query.all()
    
    return jsonify({
        "data": [p.to_dict() for p in items],
        "pagination": {
            "total": len(items),
            "pages": 1,
            "current_page": 1,
            "has_next": False
        }
    })

@products_bp.route('/dresses/size/<size>', methods=['GET'])
def get_by_size(size):
    """Get dresses available in specific size"""
    page = request.args.get('page', 1, type=int)
    sort = request.args.get('sort', 'new')
    
    if size.upper() not in ALL_SIZES:
        return jsonify({"error": "Invalid size"}), 400
    
    query = Product.query.filter(
        Product.gender == "Women",
        Product.availableSizes.ilike(f"%{size}%")
    )
    
    # Apply sorting
    if sort == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort == 'popularity':
        query = query.order_by(Product.popularity.desc())
    elif sort == 'rating':
        query = query.order_by(Product.rating.desc())
    else:
        query = query.order_by(Product.is_new.desc(), Product.created_at.desc())
    
    items = query.all()
    
    return jsonify({
        "data": [p.to_dict() for p in items],
        "pagination": {
            "total": len(items),
            "pages": 1,
            "current_page": 1,
            "has_next": False
        }
    })

@products_bp.route('/dresses/search', methods=['GET'])
def search_dresses():
    """Search dresses by query"""
    query_str = request.args.get('q', '')
    page = request.args.get('page', 1, type=int)
    
    if not query_str or len(query_str) < 2:
        return jsonify({"error": "Query too short"}), 400
    
    query = Product.query.filter(
        Product.gender == "Women",
        (Product.name.ilike(f"%{query_str}%")) | 
        (Product.description.ilike(f"%{query_str}%")) |
        (Product.fabric.ilike(f"%{query_str}%"))
    ).order_by(Product.popularity.desc())
    
    items = query.all()
    
    return jsonify({
        "data": [p.to_dict() for p in items],
        "pagination": {
            "total": len(items),
            "pages": 1,
            "current_page": 1,
            "has_next": False
        }
    })

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all available dress categories"""
    return jsonify({
        "categories": WOMEN_CATEGORIES
    })

@products_bp.route('/dresses/colors', methods=['GET'])
def get_colors():
    """Get all available colors"""
    colors = db.session.query(Product.color).filter(
        Product.gender == "Women"
    ).distinct().all()
    return jsonify({
        "colors": [c[0] for c in colors if c[0]]
    })
