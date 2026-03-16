import json
from backend.app import app
from backend.models import db, Product

def seed():
    with open("frontend/data/products.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    with app.app_context():
        # Clear existing
        db.drop_all()
        db.create_all()
        
        for p in data:
            new_p = Product(
                name=p.get('name'),
                gender=p.get('gender', 'Women'),
                category=p.get('category'),
                image=p.get('image'),
                price=p.get('price'),
                discount=p.get('discount', 0),
                original_price=p.get('originalPrice'),
                rating=p.get('rating', 4.0),
                reviews=p.get('reviews', 0),
                fabric=p.get('fabric'),
                fitType=p.get('fitType'),
                color=p.get('color'),
                style=p.get('style'),
                availableSizes=p.get('availableSizes', 'S,M,L,XL,XXL'),
                popularity=p.get('popularity', 0),
                description=p.get('description'),
                is_new=p.get('isNew', False),
                free_delivery=p.get('freeDelivery', True)
            )
            db.session.add(new_p)
        
        db.session.commit()
    print(f"✅ Successfully seeded {len(data)} women's dresses!")

if __name__ == "__main__":
    seed()
