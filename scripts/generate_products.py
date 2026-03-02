import json
import random

def generate_products(count=200):
    men_items = ["Linen Shirt", "Cotton Chinos", "Slim-Fit Suit", "Silk Tie", "Wool Overcoat", "Cargo Shorts", "Denim Jacket", "V-Neck Sweater"]
    women_items = ["Maxi Dress", "Pencil Skirt", "Cashmere Wrap", "Formal Blazer", "Sheath Dress", "Floral Sundress", "Evening Gown", "Wide-Leg Trousers"]
    fabrics = ["Cotton", "Silk", "Linen", "Wool", "Polyester", "Cashmere"]
    fit_types = ["Slim", "Regular", "Loose", "Relaxed", "A-Line"]
    sizes = "S,M,L,XL,XXL"
    
    products = []
    
    for i in range(1, count + 1):
        gender = "Men" if i % 2 == 0 else "Women"
        category = random.choice(men_items if gender == "Men" else women_items).split()[0]
        base_name = random.choice(men_items if gender == "Men" else women_items)
        name = f"{gender}'s {base_name} {random.randint(2025, 2026)}"
        
        # Unsplash fashion placeholders
        if gender == "Men":
           img_id = random.randint(1500, 1600)
           image = f"https://picsum.photos/id/{img_id}/800/1200"
        else:
           img_id = random.randint(1601, 1700)
           image = f"https://picsum.photos/id/{img_id}/800/1200"
           
        products.append({
            "id": i,
            "name": name,
            "gender": gender,
            "category": category,
            "image": image, # Placeholder for now, real URLs better but for mass demo this works
            "price": round(random.uniform(49.99, 499.99), 2),
            "rating": round(random.uniform(3.5, 5.0), 1),
            "reviews": random.randint(10, 500),
            "fabric": random.choice(fabrics),
            "fitType": random.choice(fit_types),
            "availableSizes": sizes,
            "popularity": random.randint(1, 100),
            "description": f"This high-quality {gender.lower()}'s garment is a must-have for any modern wardrobe. Crafted from premium {random.choice(fabrics).lower()}, it offers a {random.choice(fit_types).lower()} fit for elegance and comfort."
        })
    return products

if __name__ == "__main__":
    data = generate_products(200)
    with open("c:/Users/Dell/Desktop/PROJECTS/mirrorverse-smart fit recommendation/frontend/data/products.json", "w") as f:
        json.dump(data, f, indent=4)
    print("Generated 200 products in products.json")
