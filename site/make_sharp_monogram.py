from PIL import Image, ImageFilter
import numpy as np
import os

# Load original tiny logo (119x158)
orig = Image.open('public/logo.png').convert('RGBA')

# Upscale by a factor of 10 to make it huge and sharp
factor = 10
large = orig.resize((orig.width * factor, orig.height * factor), Image.Resampling.LANCZOS)

# Create a sharp mask using a threshold on the alpha channel
arr = np.array(large)
alpha = arr[:, :, 3]
# Threshold the alpha channel (LANCZOS creates soft edges, so we threshold to make them sharp)
mask = np.where(alpha > 128, 255, 0).astype(np.uint8)

# Optionally, smooth the mask slightly to anti-alias
mask_img = Image.fromarray(mask).filter(ImageFilter.GaussianBlur(1))

# CREATE BLACK VERSION FOR FOOTER (viva_monogram.png)
black_arr = np.zeros_like(arr)
black_arr[:, :, 3] = np.array(mask_img) # use the smoothed mask for alpha
footer_img = Image.fromarray(black_arr)
# Resize to a reasonable size for the web (e.g. 300px height)
footer_img = footer_img.resize((int(footer_img.width * 300 / footer_img.height), 300), Image.Resampling.LANCZOS)
footer_img.save('public/images/viva_monogram.png')


# CREATE GOLD FAVICON ON BLUE BACKGROUND (icon.png)
# Gold color: #cda557 -> (205, 165, 87)
gold_arr = np.zeros_like(arr)
gold_arr[:, :, 0] = 205
gold_arr[:, :, 1] = 165
gold_arr[:, :, 2] = 87
gold_arr[:, :, 3] = np.array(mask_img)
gold_logo = Image.fromarray(gold_arr)

# Resize to fit in 512x512 with some padding (say, 300px height)
new_h = 300
new_w = int(gold_logo.width * new_h / gold_logo.height)
gold_logo = gold_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Create 512x512 blue background
bg_color = (6, 18, 32)
icon = Image.new('RGB', (512, 512), bg_color)
offset = ((512 - new_w) // 2, (512 - new_h) // 2)
icon.paste(gold_logo, offset, gold_logo)
icon.save('src/app/icon.png', 'PNG')

print("Monogram images created!")
