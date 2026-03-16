from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    gender = db.Column(db.String(10), nullable=False, default="Women") # Women only
    category = db.Column(db.String(50), nullable=False) # Blazer, Pencil, Maxi, etc.
    image = db.Column(db.String(500), nullable=False)
    price = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Integer, default=0)  # Discount percentage
    original_price = db.Column(db.Float)  # Price before discount
    rating = db.Column(db.Float, default=4.5)
    reviews = db.Column(db.Integer, default=0)
    fabric = db.Column(db.String(100))  # Cotton, Silk, Polyester, etc.
    fitType = db.Column(db.String(50))  # Slim, Regular, Loose, Bodycon, etc.
    color = db.Column(db.String(50))  # Color of dress
    style = db.Column(db.String(50))  # Simple, Modern, Ultra Modern
    availableSizes = db.Column(db.String(100), nullable=False)  # S,M,L,XL,XXL
    popularity = db.Column(db.Integer, default=0)  # Score/rank for popularity
    description = db.Column(db.Text)
    is_new = db.Column(db.Boolean, default=False)
    free_delivery = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "gender": self.gender,
            "category": self.category,
            "image": self.image,
            "price": self.price,
            "discount": self.discount,
            "originalPrice": self.original_price or self.price,
            "rating": self.rating,
            "reviews": self.reviews,
            "fabric": self.fabric,
            "fitType": self.fitType,
            "color": self.color,
            "style": self.style,
            "availableSizes": self.availableSizes.split(',') if self.availableSizes else [],
            "popularity": self.popularity,
            "description": self.description,
            "isNew": self.is_new,
            "freeDelivery": self.free_delivery
        }
