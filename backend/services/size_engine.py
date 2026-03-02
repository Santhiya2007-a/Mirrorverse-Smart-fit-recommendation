# Size match logic for Men and Women

def calculate_best_size(gender, chest, waist, hip):
    # Mapping based on user request logic
    # Women Sizes: S: 86-90, M: 90-94, L: 94-100, XL: 100-106, XXL: 106-112
    # Men Sizes: S: 88-92, M: 92-98, L: 98-104, XL: 104-110, XXL: 110-116

    if gender.lower() == 'women':
        if chest <= 90: return 'S'
        elif chest <= 94: return 'M'
        elif chest <= 100: return 'L'
        elif chest <= 106: return 'XL'
        else: return 'XXL'
    else: # Men
        if chest <= 92: return 'S'
        elif chest <= 98: return 'M'
        elif chest <= 104: return 'L'
        elif chest <= 110: return 'XL'
        else: return 'XXL'
