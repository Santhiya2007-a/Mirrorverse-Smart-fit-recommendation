import json
import random

def enhance_products():
    with open('data/products.json', 'r') as f:
        products = json.load(f)

    colors = ["Navy", "Charcoal", "Ivory", "Black", "Floral", "Emerald", "Rosewood", "Burgundy", "Satin", "Olive", "Sunshine Yellow", "Crimson", "Midnight Blue", "Peach", "Azure"]
    fabrics = ["Cotton", "Silk", "Chiffon", "Velvet", "Satin", "Linen", "Polyester Blend", "Lace", "Denim"]
    fit_types = ["Slim Fit", "Regular Fit", "Loose Fit", "Tailored", "A-Line", "Bodycon"]

    for product in products:
        if "color" not in product:
            product["color"] = random.choice(colors)
        if "fabric" not in product:
            product["fabric"] = random.choice(fabrics)
        if "fitType" not in product:
            product["fitType"] = random.choice(fit_types)
        
        # Ensure ID is present and unique-ish if needed
        if "id" not in product:
            product["id"] = f"dress_{random.randint(100, 999)}"

    with open('data/products.json', 'w') as f:
        json.dump(products, f, indent=2)

if __name__ == "__main__":
    enhance_products()
