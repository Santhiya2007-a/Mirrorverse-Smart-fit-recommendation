import json
from backend.app import app
from backend.models import db, Product

def seed():
    with open("frontend/data/products.json", "r") as f:
        data = json.load(f)
    
    with app.app_context():
        # Clear existing
        db.drop_all()
        db.create_all()
        
        for p in data:
            new_p = Product(
                name=p['name'],
                gender=p['gender'],
                category=p['category'],
                image=p['image'],
                price=p['price'],
                rating=p['rating'],
                reviews=p['reviews'],
                fabric=p['fabric'],
                fitType=p['fitType'],
                availableSizes=p['availableSizes'],
                popularity=p['popularity'],
                description=p['description']
            )
            db.session.add(new_p)
        
        db.session.commit()
    print(f"Successfully seeded {len(data)} products!")

if __name__ == "__main__":
    seed()
