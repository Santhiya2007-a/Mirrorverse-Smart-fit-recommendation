from flask import Blueprint, jsonify, request
from backend.models import Product, db

products_bp = Blueprint('products_bp', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    gender = request.args.get('gender')
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Product.query
    
    if gender and gender.lower() != 'all':
        query = query.filter(Product.gender == gender.capitalize())
        
    if category and category.lower() != 'all':
        query = query.filter(Product.category.ilike(f"%{category}%"))
        
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) | 
            (Product.description.ilike(f"%{search}%")) |
            (Product.fabric.ilike(f"%{search}%"))
        )
        
    products = query.order_by(Product.id.desc()).all()
    return jsonify([p.to_dict() for p in products])

@products_bp.route('/products/<int:pid>', methods=['GET'])
def get_product(pid):
    product = Product.query.get_or_404(pid)
    return jsonify(product.to_dict())
