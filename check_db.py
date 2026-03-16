from backend.app import app
from backend.models import Product

with app.app_context():
    products = Product.query.limit(5).all()
    for p in products:
        print(f"ID: {p.id}, Name: {p.name}, Price: {p.price}")
