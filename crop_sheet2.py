import os
from PIL import Image

src_path = r'C:\Users\Manjot Singh\.gemini\antigravity\brain\e4c1360f-f5af-4f9d-950c-d354aa7de1a5\.user_uploaded\media_1788246651383.jpg'
out_dir = r'c:\Users\Manjot Singh\Downloads\ecopocket-app\frontend\public\images\products'
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path)

# Grid 5 cols x 3 rows (1024 x 559)
# col_w ≈ 204.8, row_h ≈ 186.3
tiles = [
    # Row 0
    ('picnic-organizer', (0, 0, 205, 186)),
    ('reusable-produce-bag-set', (205, 0, 409, 186)),
    ('tea-time-wrap', (409, 0, 614, 186)),
    ('insulated-casserole-cover', (614, 0, 819, 186)),
    ('travel-toiletry-pouch', (819, 0, 1024, 186)),

    # Row 1
    ('herb-keeper-wrap', (0, 186, 205, 372)),
    ('artisan-bento-roll', (409, 186, 614, 372)),
    ('thermal-soup-jar-pouch', (614, 186, 819, 372)),
    ('zero-waste-market-tote', (819, 186, 1024, 372)),

    # Row 2
    ('quilted-snack-pod-set', (0, 372, 205, 559)),
    ('vintage-linen-tea-cozy', (205, 372, 409, 559)),
    ('eco-cutlery-straw-roll', (409, 372, 614, 559)),
    ('quilted-farmer-carryall', (614, 372, 819, 559)),
]

for name, box in tiles:
    cropped = img.crop(box)
    target = os.path.join(out_dir, f'{name}.jpg')
    cropped.save(target, quality=95)
    print(f'Saved {name}.jpg ({cropped.size})')

print('All 13 product tiles from Sheet 2 cropped successfully!')
