import json
import random

def update_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for p in data:
            if 'price' in p:
                p['price'] = random.randint(100, 500)
            if 'originalPrice' in p:
                p['originalPrice'] = p.get('price', 100) + random.randint(50, 200)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error {filepath}: {e}")

update_file('data/products.json')
update_file('frontend/data/products.json')
