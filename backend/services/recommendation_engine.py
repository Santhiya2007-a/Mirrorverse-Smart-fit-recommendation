from backend.models import Product

def get_recommended_products(gender, size):
    # Matches gender and available sizes in comma-separated list
    # Sorts by popularity
    products = Product.query.filter(
        Product.gender == gender.capitalize(),
        Product.availableSizes.like(f"%{size}%")
    ).order_by(Product.popularity.desc()).all()
    
    return [p.to_dict() for p in products]
