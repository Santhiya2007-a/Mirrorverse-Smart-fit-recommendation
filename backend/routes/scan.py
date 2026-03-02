from flask import Blueprint, jsonify, request
from backend.services.size_engine import calculate_best_size

scan_bp = Blueprint('scan_bp', __name__)

@scan_bp.route('/scan', methods=['POST'])
def process_scan():
    data = request.json # { gender, chest, waist, hip, height }
    if not data: return jsonify({"error": "No data received"}), 400
    
    gender = data.get('gender', 'Women')
    chest = data.get('chest', 0)
    waist = data.get('waist', 0)
    hip = data.get('hip', 0)
    height = data.get('height', 0)

    recommended_size = calculate_best_size(gender, chest, waist, hip)
    
    return jsonify({
        "recommendedSize": recommended_size,
        "measurements": {
            "chest": chest,
            "waist": waist,
            "hip": hip,
            "height": height
        },
        "advice": f"Size {recommended_size} should provide a comfortable and elite fit for your silhouette."
    })
