import os
from PIL import Image

src_path = r'C:\Users\Manjot Singh\.gemini\antigravity\brain\e4c1360f-f5af-4f9d-950c-d354aa7de1a5\.user_uploaded\media_1788187359779.jpg'
out_dir = r'c:\Users\Manjot Singh\Downloads\ecopocket-app\frontend\public\images\products'
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path)
W, H = img.size

# Tile definitions: (name, (left, top, right, bottom))
tiles = [
    # Row 1 (y: 0 to 186)
    ('quilted-sandwich-pocket', (0, 0, 256, 186)),
    ('chapati-pocket', (256, 0, 512, 186)),
    ('snack-bag', (512, 0, 768, 186)),
    ('bread-bag', (768, 0, 1024, 186)),

    # Row 2 & 3
    ('fruit-pocket', (0, 186, 228, 372)),
    ('cutlery-holder', (228, 186, 616, 372)),
    ('tiffin-tote', (616, 186, 820, 559)),
    ('lunch-wrap', (820, 186, 1024, 372)),

    # Row 3 (y: 372 to 559)
    ('bottle-sleeve', (204, 372, 409, 559)),
    ('coffee-cup-sleeve', (409, 372, 614, 559)),
    ('beeswax-fabric-wrap', (820, 372, 1024, 559)),
]

for name, box in tiles:
    cropped = img.crop(box)
    target = os.path.join(out_dir, f'{name}.jpg')
    cropped.save(target, quality=95)
    print(f'Saved {name}.jpg ({cropped.size})')

print('All 11 product tiles extracted successfully!')

