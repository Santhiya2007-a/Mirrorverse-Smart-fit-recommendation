#!/usr/bin/env python3
"""
Mirrorverse - Generate 300+ Women's Dresses Data
Comprehensive dress database with all categories, colors, fabrics, and ALL sizes
"""

import json
import random
from datetime import datetime, timedelta

CATEGORIES = [
    "Blazer Dresses",
    "Pencil Dresses",
    "Sheath Dresses",
    "Wrap Dresses",
    "Maxi Dresses",
    "Casual Dresses",
    "Party Dresses",
    "Formal Dresses",
    "Summer Dresses",
    "Winter Dresses",
    "Office Dresses",
    "Evening Dresses",
    "Mini Dresses",
    "Midi Dresses",
    "Bodycon Dresses",
    "A-Line Dresses",
    "Floral Dresses",
    "Bohemian Dresses",
    "Cocktail Dresses",
    "Wedding Guest Dresses"
]

COLORS = [
    "Black", "White", "Navy Blue", "Red", "Burgundy", "Gray", "Charcoal",
    "Blush Pink", "Rose", "Coral", "Orange", "Gold", "Yellow",
    "Olive Green", "Emerald", "Sage Green", "Teal", "Cyan", "Purple",
    "Lavender", "Cream", "Beige", "Taupe", "Brown", "Maroon",
    "Dusty Pink", "Champagne", "Cobalt Blue", "Forest Green", "Magenta",
    "Fuchsia", "Terracotta", "Powder Blue", "Mint Green", "Plum",
    "Nude", "Off-White", "Sky Blue", "Hot Pink", "Khaki",
    "Steel Blue", "Rust", "Peacock Blue", "Lilac", "Caramel"
]

FABRICS = [
    "Cotton", "Silk", "Polyester", "Blend", "Linen", "Wool", "Satin",
    "Crepe", "Chiffon", "Jacquard", "Rayon", "Elastane Mix", "Cotton Blend",
    "Jersey", "Organza", "Velvet", "Georgette", "Ponte", "Taffeta", "Denim"
]

FIT_TYPES = [
    "Slim", "Regular", "Loose", "Bodycon", "A-Line", "Fit & Flare",
    "Empire Waist", "Wrap", "Shift", "Adjustable",
    "Relaxed", "Structured", "Flared", "Column", "Balloon"
]

# All 8 inclusive sizes
ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"]

STYLES = ["Simple", "Modern", "Ultra Modern"]

DRESS_NAMES = {
    "Blazer Dresses": [
        "Classic {}  Blazer Dress", "Tailored {} Blazer Sheath",
        "{} Professional Blazer Dress", "Structured {} Blazer Midi",
        "Elegant {} Buttoned Blazer", "Modern {} Power Blazer",
        "Sophisticated {} Office Blazer", "Chic {} Pencil Blazer",
        "Executive {} Formal Blazer", "Polished {} Slim Blazer",
        "Sharp {} Double Breasted Blazer", "Bold {} Oversized Blazer",
        "Trendy {} Cropped Blazer Dress", "Refined {} Longline Blazer",
        "Luxe {} Belted Blazer Dress"
    ],
    "Pencil Dresses": [
        "Sleek {} Pencil Dress", "Fitted {} Office Pencil",
        "Classic {} Body-Con Pencil", "{} Knee Length Pencil",
        "Elegant {} Midi Pencil", "Modern {} Black Pencil",
        "Professional {} Career Pencil", "Sophisticated {} Wrap Pencil",
        "Chic {} Split Pencil", "Timeless {} Bodycon Pencil",
        "Bold {} Color Block Pencil", "Trendy {} Cut-Out Pencil",
        "Minimalist {} Pencil", "Flirty {} Asymmetric Pencil",
        "Chic {} Mesh Detail Pencil"
    ],
    "Sheath Dresses": [
        "{} Classic Sheath Dress", "Elegant {} Sheath Midi",
        "Fitted {} Formal Sheath", "Professional {} Office Sheath",
        "{} Sleeveless Sheath", "Modern {} Asymmetric Sheath",
        "Timeless {} Black Sheath", "Chic {} Column Sheath",
        "Sophisticated {} Party Sheath", "Smart {} Work Sheath",
        "Clean {} Structured Sheath", "{} Belted Sheath Dress",
        "Luxe {} Evening Sheath", "Retro {} Fitted Sheath",
        "Breezy {} Boatneck Sheath"
    ],
    "Wrap Dresses": [
        "{} Wrap Around Dress", "Flattering {} Wrap Midi",
        "Elegant {} Tie Wrap Dress", "Classic {} Crossover Wrap",
        "{} Summer Wrap Dress", "Professional {} Office Wrap",
        "Stylish {} Knot Wrap", "Timeless {} V-Neck Wrap",
        "Chic {} Print Wrap Dress", "Modern {} Waist Belt Wrap",
        "Flowing {} Faux Wrap", "Cozy {} Jersey Wrap",
        "{} Floral Wrap Dress", "Dramatic {} Satin Wrap",
        "Breezy {} Crepe Wrap Dress"
    ],
    "Maxi Dresses": [
        "{} Flowing Maxi Dress", "Elegant {} Floor Length Maxi",
        "Romantic {} Chiffon Maxi", "Casual {} Summer Maxi",
        "{} Bohemian Maxi Dress", "Sophisticated {} Evening Maxi",
        "Draped {} Silk Maxi", "Modern {} Minimalist Maxi",
        "Timeless {} Black Maxi", "Stylish {} Print Maxi",
        "Festive {} Embroidered Maxi", "Beach {} Linen Maxi",
        "{} Halter Neck Maxi", "Tiered {} Ruffle Maxi",
        "Goddess {} Draped Maxi"
    ],
    "Casual Dresses": [
        "{} Casual A-Line Dress", "Relaxed {} Cotton Casual",
        "Everyday {} Comfort Dress", "Laid-Back {} Casual Midi",
        "{} Weekend Casual Dress", "Simple {} Casual Shift",
        "Easy Wear {} Casual Dress", "Comfy {} Casual Fit",
        "Versatile {} Daily Casual", "Breezy {} Casual Summer",
        "Cool {} Jersey Casual", "Soft {} Everyday Dress",
        "{} Pullover Casual Dress", "Playful {} Tiered Casual",
        "Effortless {} Linen Casual"
    ],
    "Party Dresses": [
        "Glamorous {} Party Dress", "Stunning {} Sequin Party",
        "Chic {} Metallic Party", "Elegant {} Beaded Party",
        "{} Sexy Party Dress", "Show-Stopping {} Party Midi",
        "Fabulous {} Sparkle Party", "Fashionable {} Club Party",
        "Bold {} Statement Party", "Dazzling {} Party Cocktail",
        "Glam {} Ruched Party", "Statement {} Velvet Party",
        "{} Halter Party Dress", "Fierce {} Open Back Party",
        "Shimmer {} High-Low Party"
    ],
    "Formal Dresses": [
        "Elegant {} Formal Gown", "Sophisticated {} Evening Formal",
        "Timeless {} Black Tie Formal", "Graceful {} Floor Length Formal",
        "{} Luxe Formal Dress", "Regal {} Formal Ball Gown",
        "Stunning {} Formal Ceremony", "Premier {} Wedding Guest Formal",
        "Exquisite {} Formal Occasion", "Magnificent {} Gala Formal",
        "Classic {} Structured Formal", "Opulent {} Lace Formal",
        "{} Cape Formal Dress", "Sleek {} Column Formal",
        "Resort {} Embellished Formal"
    ],
    "Summer Dresses": [
        "Breezy {} Summer Dress", "Light {} Linen Summer",
        "Tropical {} Print Summer", "Cool {} Sleeveless Summer",
        "{} Sundress Summer Dress", "Refreshing {} Cotton Summer",
        "Vibrant {} Colorful Summer", "Relaxed {} Beach Summer",
        "Easy {} Summer Casual", "Flowy {} Bohemian Summer",
        "Fresh {} Eyelet Summer", "Chic {} Off-Shoulder Summer",
        "Bold {} Smocked Summer", "{} Cami Summer Dress",
        "Tied {} Mini Sundress"
    ],
    "Winter Dresses": [
        "Cozy {} Knit Winter Dress", "Warm {} Wool Winter",
        "Layered {} Winter Midi", "Sophisticated {} Winter Formal",
        "{} Long Sleeve Winter", "Elegant {} Turtleneck Winter",
        "Timeless {} Black Winter", "Classic {} Sweater Winter",
        "Stylish {} Winter Professional", "Luxe {} Cashmere Winter",
        "Rich {} Velvet Winter Dress", "Snug {} Ribbed Winter",
        "{} Puff Sleeve Winter", "Festive {} Winter Party",
        "Bold {} Color Block Winter"
    ],
    "Office Dresses": [
        "Professional {} Office Dress", "Career {} Work Dress",
        "Business {} Office Formal", "Smart {} Corporate Dress",
        "{} 9-to-5 Office", "Polished {} Workplace Dress",
        "Elegant {} Business Casual", "Power {} Executive Office",
        "Classic {} Professional Office", "Modern {} Tech Office",
        "Structured {} Boardroom Dress", "{} Tailored Office Midi",
        "Minimalist {} Desk-to-Dinner", "Sharp {} Work Blazer Dress",
        "Sleek {} Long Sleeve Office"
    ],
    "Evening Dresses": [
        "Glamorous {} Evening Gown", "Luxe {} Evening Formal",
        "Sophisticated {} Evening Wear", "Elegant {} Dinner Dress",
        "{} Upscale Evening Dress", "Refined {} Evening Cocktail",
        "Stunning {} Night Out Evening", "Chic {} Evening Party",
        "Timeless {} Evening Black Tie", "Exquisite {} Evening Reception",
        "Dazzling {} Embellished Evening", "Sleek {} Red Carpet Evening",
        "Goddess {} Draped Evening", "{} Sparkle Evening Midi",
        "Vintage {} Bow-Back Evening"
    ],
    "Mini Dresses": [
        "Flirty {} Mini Dress", "Chic {} Above-Knee Mini",
        "Bold {} Bodycon Mini", "Trendy {} Thigh-Length Mini",
        "{} Party Mini Dress", "Elegant {} Structured Mini",
        "Fun {} Ruffle Mini", "Edgy {} Leather Mini",
        "Playful {} Printed Mini", "Denim {} Casual Mini",
        "Glamorous {} Sequin Mini", "Cool {} Sporty Mini",
        "{} Wrap Style Mini", "Sweet {} Skater Mini",
        "Fierce {} Cut-Out Mini"
    ],
    "Midi Dresses": [
        "Classic {} Midi Dress", "Elegant {} Below-Knee Midi",
        "Flowy {} Satin Midi", "Trendy {} Pleated Midi",
        "{} Belted Midi Dress", "Sophisticated {} Formal Midi",
        "Casual {} Cotton Midi", "Chic {} Slip Midi",
        "Printed {} Maxi-Inspired Midi", "Fresh {} Linen Midi",
        "Tiered {} Ruffle Midi", "{} Smocked Midi Dress",
        "Boho {} Floral Midi", "Structured {} Power Midi",
        "Romantic {} Asymmetric Midi"
    ],
    "Bodycon Dresses": [
        "Edgy {} Bodycon Dress", "Sleek {} Curve Hugging Bodycon",
        "Bold {} Party Bodycon", "Trendy {} Cutout Bodycon",
        "{} Ruched Bodycon", "Chic {} Minimalist Bodycon",
        "Fierce {} Open Back Bodycon", "Glamorous {} Metallic Bodycon",
        "Seductive {} Mesh Bodycon", "Power {} Color Block Bodycon",
        "{} Bandage Bodycon", "Luxe {} Velvet Bodycon",
        "Modern {} Zip-Up Bodycon", "Sexy {} Lace-Trim Bodycon",
        "Classic {} Black Bodycon"
    ],
    "A-Line Dresses": [
        "Graceful {} A-Line Dress", "Classic {} Fit-and-Flare",
        "Timeless {} A-Line Midi", "Romantic {} Flared A-Line",
        "{} Tea Length A-Line", "Chic {} Empire A-Line",
        "Elegant {} Lace A-Line", "Feminine {} Floral A-Line",
        "Bold {} Color A-Line", "Casual {} Cotton A-Line",
        "Party {} Cocktail A-Line", "Bridal {} A-Line Dress",
        "{} Swing A-Line Dress", "Sleek {} Modern A-Line",
        "Cute {} Polka Dot A-Line"
    ],
    "Floral Dresses": [
        "Blooming {} Floral Dress", "Romantic {} Floral Maxi",
        "Spring {} Floral Wrap", "Whimsical {} Garden Floral",
        "{} Bouquet Floral Dress", "Summer {} Ditsy Floral",
        "Elegant {} Dark Floral", "Boho {} Wildflower Dress",
        "Vintage {} Rose Floral", "Tropical {} Floral Midi",
        "{} Sunflower Print Dress", "Delicate {} Cherry Blossom",
        "Bold {} Large Floral Print", "Fresh {} Daisy Dress",
        "Lush {} Botanical Floral"
    ],
    "Bohemian Dresses": [
        "Free-Spirit {} Boho Dress", "Wanderer {} Boho Maxi",
        "Earthy {} Boho Midi", "{} Festival Boho Dress",
        "Artsy {} Embroidered Boho", "Flowing {} Peasant Boho",
        "Natural {} Linen Boho", "Vintage {} Fringe Boho",
        "Dreamy {} Crochet Boho", "Sunset {} Boho Wrap",
        "{} Tassel Boho Dress", "Eclectic {} Patchwork Boho",
        "Serene {} Tie-Dye Boho", "Mystic {} Printed Boho",
        "Wanderlust {} Boho Maxi"
    ],
    "Cocktail Dresses": [
        "Chic {} Cocktail Dress", "Elegant {} Knee-Length Cocktail",
        "Glamorous {} Sequin Cocktail", "Timeless {} LBD Cocktail",
        "{} Flared Cocktail", "Modern {} Off-Shoulder Cocktail",
        "Classic {} Strapless Cocktail", "Sleek {} Column Cocktail",
        "Festive {} Holiday Cocktail", "Trendy {} Lace Cocktail",
        "Bold {} Ruffle Cocktail", "{} Asymmetric Cocktail",
        "Luxe {} Satin Cocktail", "Flirty {} Hot Pink Cocktail",
        "Retro {} Vintage Cocktail"
    ],
    "Wedding Guest Dresses": [
        "Elegant {} Wedding Guest", "Pretty {} Garden Wedding Dress",
        "Chic {} Beach Wedding Guest", "Formal {} Black-Tie Wedding",
        "{} Floral Wedding Guest", "Romantic {} Lace Wedding Guest",
        "Stunning {} Evening Wedding Guest", "Classic {} Wrap Wedding Guest",
        "Soft {} Midi Wedding Guest", "Bold {} Statement Wedding Guest",
        "Boho {} Outdoor Wedding Dress", "{} Pastel Wedding Guest",
        "Modern {} Geometric Wedding Guest", "Classy {} Ruched Wedding Guest",
        "Graceful {} Long Wedding Guest"
    ]
}

# 20 Verified direct CDN IDs (no redirect needed)
VERIFIED_DRESS_IMAGES = [
    "photo-1633077705107-8f53a004218f", "photo-1614098097306-c67b8020c04e",
    "photo-1528812969535-4bcefc071532", "photo-1769063382670-823451e5a7ef",
    "photo-1657373307141-349a3393d4d9", "photo-1714037301831-3f7cf52a1608",
    "photo-1507005941618-1ca013b9a018", "photo-1599662900253-994c7e706d3b",
    "premium_photo-1664868311681-0bb62d9dfd02", "photo-1649544144796-687d506ddcd8",
    "photo-1710002083813-3ae5f13a22d3", "premium_photo-1679439491446-3e4d1d1c68b5",
    "photo-1678637803638-0bcc1e13ecae", "premium_photo-1679933514012-7619a494c77b",
    "photo-1557771551-634f8d68b0a5", "photo-1645636988802-51a222ab72e0",
    "photo-1678637803367-ab57283cd9c2", "premium_photo-1671641797007-c6ede7fc388d",
    "photo-1765248149274-8dad37faa1cc", "premium_photo-1671379012427-ce867d9ac465"
]

# 90 extra IDs sourced from Unsplash search (use download redirect URL)
EXTRA_DRESS_IDS = [
    "OHTXdwX1WAI", "4rNUPDnUcpQ", "QPzQJvPIWio", "rz-i7eowkqQ", "l0444rJctoI",
    "7EU2zy6qHKQ", "Hz9yvR_uD9c", "SY0r8e1vtpo", "Ok5fxAW5lQ0", "jwcFXQKfGUY",
    "w2LcY2yhXrM", "oH2p566qcS8", "0k34GI9M_zk", "yBRIai6AyGQ", "cA-d_HkNzdE",
    "fgd4437E85g", "-Gd3wulxx0E", "UyTRhBuoW40", "6p1jcN1EqEA", "re0GeRuAZSo",
    "8hgBO9Mog0U", "L_exXBoO6Gs", "c7jp-aR_W1Q", "frpUdl4gOn4", "WWrmzl-NK7k",
    "RqOzGLr-2Rc", "GzzxsHpOgUY", "4LLG7kmnH74", "IuAYyiGeUKk", "mI-ggZ4sDZY",
    "Vj43eFOXryc", "CdrczoAAsxY", "vaeM4GtJA64", "UhC6eAMFjwQ", "4U0HzXXnPHc",
    "MkEJWRPY6gc", "FEfTE6qBbqE", "9UWOeBD4_ec", "etYbLDL3oKA", "knfi_0sW3Z8",
    "iYOyWdPsuiU", "I0JGmVvrgTo", "4rV7LIssZvM", "BRPi8ZO4V38", "lVXssLMAtyU",
    "q7ESAZstcZQ", "zyErGGkhyBc", "q-uPWDt804M", "VgyxlLuYzFQ", "dLovy0ESXoI",
    "mf5ELK4VMs4", "tVVjZaMuMZ4", "YdK1lMXoA78", "f-wLUS9KWlE", "7pmhHhIOWCI",
    "V8tQgPsu9i8", "YosZNuI05yM", "N904JyOyahc", "vcBsRWtzbZs", "BsdsRZ-7bBg",
    "TrSIqzEkliM", "39tJ_AgMJBA", "-iu5TCmI2ew", "iJKzgy31djU", "0JggLPRLDcs",
    "Bx3shusTh3I", "rnFzSRH-VS0", "tuift42PLIg", "_vlfqRhDdKA", "-3IKnIX14-s",
    "lfCjv6LW07c", "30W9rJwwyuA", "RziscjCqrH0", "x3g_rJ9mJkM", "AuX5ZayO79I",
    "5xQIAofzkJs", "pIuGGmNGG5g", "4voC7wmDp0c", "QgRwTk-SZXg", "_q3nMx5pqb8",
    "ZJfnAEk0_3c", "_vwBmS41lu8", "tPARJplJupM", "8mDQ_jfNFIU", "1ylj8vXJEys",
    "P9g4Wb6z5ZE", "Djvj55xIh7k", "tYz_ELDTRZA", "IszWZxleuJg", "hAT3yiEKFRk"
]

# Full image pool (CDN direct + redirect IDs)
# Tag each with format type
IMAGE_POOL_CDN = [("cdn", f"https://images.unsplash.com/{i}?w=600&q=80") for i in VERIFIED_DRESS_IMAGES]
IMAGE_POOL_REDIRECT = [("redirect", f"https://unsplash.com/photos/{i}/download?w=600") for i in EXTRA_DRESS_IDS]
ALL_IMAGE_URLS = [url for _, url in IMAGE_POOL_CDN + IMAGE_POOL_REDIRECT]

# Legacy alias
DRESS_IMAGES = ALL_IMAGE_URLS

BASE_IMAGE_URL = ""  # Not used, full URLs in ALL_IMAGE_URLS


def ensure_varied_sizes():
    """Generate a random subset of sizes for a dress to make it feel more varied."""
    # User requested: "donot give alll dresses are all sizes one dresses should be in one sizes another should be in another sizes"
    # We will pick a random number of sizes (between 1 and 4)
    num_sizes = random.choices([1, 2, 3, 4, 8], weights=[40, 30, 15, 10, 5])[0]
    
    if num_sizes == 8:
        return ",".join(ALL_SIZES)
    
    selected = random.sample(ALL_SIZES, num_sizes)
    # Sort them in the standard order
    order = {s: i for i, s in enumerate(ALL_SIZES)}
    selected.sort(key=lambda x: order[x])
    
    return ",".join(selected)

def generate_dresses():
    """Generate women's dresses across 20 categories based on available images"""
    dresses = []
    dress_id = 1
    
    # Shuffle images to ensure variety and uniqueness
    images_available = ALL_IMAGE_URLS.copy()
    random.shuffle(images_available)
    num_images = len(images_available)
    cat_dresses_count = num_images // len(CATEGORIES)
    extra_dresses = num_images % len(CATEGORIES)

    for cat_idx, category in enumerate(CATEGORIES):
        names = DRESS_NAMES[category]
        num_to_generate = cat_dresses_count + (1 if cat_idx < extra_dresses else 0)
        for i in range(num_to_generate):
            name_template = names[i % len(names)]
            color = random.choice(COLORS)
            style = random.choice(STYLES)
            name = f"{style} {name_template.format(color)}"
            # Realistic Indian fashion market prices ₹799 — ₹4,999
            PRICE_TIERS = [
                (799, 1999),   # affordable
                (1299, 2999),  # mid-range
                (1999, 3999),  # premium
                (2999, 4999),  # luxury
            ]
            tier_min, tier_max = random.choices(
                PRICE_TIERS,
                weights=[35, 30, 20, 15]
            )[0]
            base_price = random.randint(tier_min // 100, tier_max // 100) * 100  # round to nearest 100
            discount = random.choices([0, 10, 15, 20, 25, 30, 40, 50], weights=[20, 15, 15, 15, 10, 10, 10, 5])[0]
            
            rating = round(random.uniform(3.5, 5.0), 1)
            reviews = int(rating * random.randint(20, 200))

            is_new = random.random() < 0.15
            available_sizes = ensure_varied_sizes()
            fabric = random.choice(FABRICS)
            fit_type = random.choice(FIT_TYPES)

            # Ensure unique image from our randomly shuffled pool
            image_url = images_available.pop()
            popularity = random.randint(10, 1000)

            dress = {
                "id": dress_id,
                "name": name,
                "gender": "Women",
                "category": category,
                "style": style,
                "image": image_url,
                "price": base_price,
                "discount": discount,
                "originalPrice": base_price if discount == 0 else round((base_price / (1 - discount / 100)) / 100) * 100,
                "rating": rating,
                "reviews": reviews,
                "fabric": fabric,
                "fitType": fit_type,
                "color": color,
                "availableSizes": available_sizes,
                "popularity": popularity,
                "description": (
                    f"A {style.lower()} {color.lower()} {category.lower()} crafted from premium "
                    f"{fabric.lower()}. Features a {fit_type.lower()} silhouette perfect for "
                    f"a {style.lower()} and elegant look. Available in sizes: {available_sizes.replace(',', ', ')}."
                ),
                "isNew": is_new,
                "freeDelivery": random.random() < 0.85,
                "createdAt": (datetime.utcnow() - timedelta(days=random.randint(0, 180))).isoformat()
            }

            dresses.append(dress)
            dress_id += 1

    return dresses


if __name__ == "__main__":
    dresses = generate_dresses()

    output_dir = "frontend/data"
    output_file = f"{output_dir}/products.json"

    import os
    os.makedirs(output_dir, exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(dresses, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {len(dresses)} women's dresses!")
    print(f"📁 Saved to: {output_file}")
    print(f"\nCategories: {len(CATEGORIES)}")
    print(f"Dresses per category: 3")
    print(f"Total Dresses: {len(dresses)}")
    print(f"All Sizes: {', '.join(['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'])}")
