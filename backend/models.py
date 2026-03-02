from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False) # Men, Women
    category = db.Column(db.String(50)) # e.g. Blazer, Pencil, etc.
    image = db.Column(db.String(500))
    price = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float, default=4.0)
    reviews = db.Column(db.Integer, default=0)
    fabric = db.Column(db.String(50))
    fitType = db.Column(db.String(50))
    availableSizes = db.Column(db.String(100)) # S,M,L,XL,XXL
    popularity = db.Column(db.Integer, default=0)
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "gender": self.gender,
            "category": self.category,
            "image": self.image,
            "price": self.price,
            "rating": self.rating,
            "reviews": self.reviews,
            "fabric": self.fabric,
            "fitType": self.fitType,
            "availableSizes": self.availableSizes.split(',') if self.availableSizes else [],
            "popularity": self.popularity,
            "description": self.description
        }
