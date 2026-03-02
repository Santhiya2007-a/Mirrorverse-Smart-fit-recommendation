from flask import Blueprint, jsonify, request

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/users/profile', methods=['GET'])
def get_profile():
    return jsonify({
        "username": "AI Fashion Enthusiast",
        "email": "user@mirrorverse.com",
        "orders": []
    })
