from flask import Blueprint, jsonify, request
from backend.services.recommendation_engine import get_recommended_products

recommendations_bp = Blueprint('recommendations_bp', __name__)

@recommendations_bp.route('/recommendations/<gender>/<size>', methods=['GET'])
def get_recommendations(gender, size):
    products = get_recommended_products(gender, size)
    return jsonify(products)
