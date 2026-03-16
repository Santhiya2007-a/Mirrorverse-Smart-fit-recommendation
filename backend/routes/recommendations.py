from flask import Blueprint, jsonify, request
from backend.models import Product, db

recommendations_bp = Blueprint('recommendations_bp', __name__)

@recommendations_bp.route('/recommendations/size/<size>', methods=['GET'])
def get_by_size_recommendation(size):
    """
    Get personalized dress recommendations for a specific size
    Sorted by popularity, rating, and new arrivals
    """
    page = request.args.get('page', 1, type=int)
    sort = request.args.get('sort', 'popularity')  # popularity, rating, new
    
    if size.upper() not in ['S', 'M', 'L', 'XL', 'XXL']:
        return jsonify({"error": "Invalid size"}), 400
    
    query = Product.query.filter(
        Product.gender == "Women",
        Product.availableSizes.ilike(f"%{size}%")
    )
    
    # Apply sorting
    if sort == 'popularity':
        query = query.order_by(Product.popularity.desc(), Product.rating.desc())
    elif sort == 'rating':
        query = query.order_by(Product.rating.desc(), Product.popularity.desc())
    elif sort == 'new':
        query = query.order_by(Product.is_new.desc(), Product.created_at.desc())
    else:
        query = query.order_by(Product.popularity.desc())
    
    paginated = query.paginate(page=page, per_page=12)
    
    return jsonify({
        "size": size.upper(),
        "message": f"Perfect Fit for You - All dresses available in size {size.upper()}",
        "data": [p.to_dict() for p in paginated.items],
        "pagination": {
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": page,
            "has_next": paginated.has_next
        }
    })

@recommendations_bp.route('/recommendations/trending', methods=['GET'])
def get_trending_dresses():
    """Get trending women's dresses"""
    page = request.args.get('page', 1, type=int)
    
    query = Product.query.filter(Product.gender == "Women").order_by(
        Product.popularity.desc(),
        Product.rating.desc()
    )
    
    paginated = query.paginate(page=page, per_page=12)
    
    return jsonify({
        "message": "Trending Women's Dresses",
        "data": [p.to_dict() for p in paginated.items],
        "pagination": {
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": page,
            "has_next": paginated.has_next
        }
    })

@recommendations_bp.route('/recommendations/new', methods=['GET'])
def get_new_dresses():
    """Get new arrival women's dresses"""
    page = request.args.get('page', 1, type=int)
    
    query = Product.query.filter(
        Product.gender == "Women",
        Product.is_new == True
    ).order_by(Product.created_at.desc())
    
    paginated = query.paginate(page=page, per_page=12)
    
    return jsonify({
        "message": "New Arrivals",
        "data": [p.to_dict() for p in paginated.items],
        "pagination": {
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": page,
            "has_next": paginated.has_next
        }
    })

@recommendations_bp.route('/recommendations/category/<category>', methods=['GET'])
def get_category_recommendations(category):
    """Get recommendations for a specific dress category"""
    page = request.args.get('page', 1, type=int)
    
    query = Product.query.filter(
        Product.gender == "Women",
        Product.category == category
    ).order_by(Product.popularity.desc(), Product.rating.desc())
    
    paginated = query.paginate(page=page, per_page=12)
    
    if paginated.total == 0:
        return jsonify({"error": "Category not found"}), 404
    
    return jsonify({
        "category": category,
        "message": f"Shop {category}",
        "data": [p.to_dict() for p in paginated.items],
        "pagination": {
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": page,
            "has_next": paginated.has_next
        }
    })
