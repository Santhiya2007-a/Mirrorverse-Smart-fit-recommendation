import json
import random

def fix_data():
    with open('c:/Users/Dell/Desktop/PROJECTS/mirrorverse-smart fit recommendation/frontend/data/products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    # A list of good fashion/dress Unsplash images
    good_images = [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
        "https://images.unsplash.com/photo-1515347619152-edfbfae03722?w=600&q=80",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
        "https://images.unsplash.com/photo-1502716113813-2df8d48ce0c9?w=600&q=80",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
        "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80",
        "https://images.unsplash.com/photo-1520638023360-6def4617c3bf?w=600&q=80",
        "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
        "https://images.unsplash.com/photo-1518767761162-d533c8d9cf0a?w=600&q=80",
        "https://images.unsplash.com/photo-1572491975432-1417559667f3?w=600&q=80",
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
        "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&q=80",
        "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=600&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
        "https://images.unsplash.com/photo-1537832816519-689ad163238b?w=600&q=80",
        "https://images.unsplash.com/photo-1576188973526-0e5d742990af?w=600&q=80",
        "https://images.unsplash.com/photo-1594750825068-d300e791b8cf?w=600&q=80",
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
        "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=80",
        "https://images.unsplash.com/photo-1484399172022-72a90b12e3c1?w=600&q=80",
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80"
    ]

    for i, p in enumerate(products):
        # We assign a rotating valid Unsplash image so it's diverse and not identical
        # Plus it won't trigger the onerror identical placeholder.
        p['image'] = good_images[i % len(good_images)]
        
        # We also enforce INR by making sure prices are whole numbers
        # without decimals that might look like dollars.
        p['price'] = round(p['price'])
        if 'originalPrice' in p:
            p['originalPrice'] = round(p['originalPrice'])

    with open('c:/Users/Dell/Desktop/PROJECTS/mirrorverse-smart fit recommendation/frontend/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)
    
    # We should also update the seed file which generates the fallback SQLite db
    with open('c:/Users/Dell/Desktop/PROJECTS/mirrorverse-smart fit recommendation/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)

if __name__ == '__main__':
    fix_data()
