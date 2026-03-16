from flask import Blueprint, jsonify, request
from backend.services.size_engine import calculate_best_size
from backend.models import Product

scan_bp = Blueprint('scan_bp', __name__)

@scan_bp.route('/scan', methods=['POST'])
def process_scan():
    """
    Process body scan and return recommended size + matching dresses
    Expected payload:
    {
        "chest": 88,
        "waist": 70,
        "hip": 95,
        "height": 165
    }
    """
    data = request.json
    if not data:
        return jsonify({"error": "No data received"}), 400
    
    # Extract measurements (in CM)
    chest = data.get('chest', 0)
    waist = data.get('waist', 0)
    hip = data.get('hip', 0)
    height = data.get('height', 0)
    
    # Validate measurements
    if not all([chest > 0, waist > 0, hip > 0, height > 0]):
        return jsonify({"error": "Invalid measurements. All values must be greater than 0."}), 400
    
    # Calculate recommended size
    recommended_size = calculate_best_size("Women", chest, waist, hip)
    
    # Get dresses in recommended size
    matching_dresses = Product.query.filter(
        Product.gender == "Women",
        Product.availableSizes.ilike(f"%{recommended_size}%")
    ).order_by(
        Product.popularity.desc(),
        Product.rating.desc()
    ).limit(12).all()
    
    return jsonify({
        "success": True,
        "detectedSize": recommended_size,
        "measurements": {
            "chest": chest,
            "waist": waist,
            "hip": hip,
            "height": height
        },
        "message": f"✨ Perfect Fit Found! Size {recommended_size} is ideal for you.",
        "advice": f"Based on your measurements, Size {recommended_size} will provide the best fit for our dress collection.",
        "matchingDresses": [p.to_dict() for p in matching_dresses],
        "totalMatches": len(matching_dresses)
    })

@scan_bp.route('/scan/size-guide', methods=['GET'])
def get_size_guide():
    """Get detailed size guide for women's dresses"""
    return jsonify({
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
    })
