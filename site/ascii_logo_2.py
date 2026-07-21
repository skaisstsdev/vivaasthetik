from PIL import Image
import numpy as np

img = Image.open('public/images/global/logo.png').convert('RGBA')
arr = np.array(img)
alpha = arr[:, :, 3]

y_indices, x_indices = np.where(alpha > 0)
y_min, y_max = y_indices.min(), y_indices.max()
x_min, x_max = x_indices.min(), x_indices.max()
cropped = img.crop((x_min, y_min, x_max, y_max))

small = cropped.resize((80, 20), Image.Resampling.LANCZOS)
small_arr = np.array(small)[:, :, 3]

for row in small_arr:
    line = ""
    for pixel in row:
        if pixel > 128:
            line += "#"
        elif pixel > 50:
            line += "*"
        else:
            line += " "
    print(line)
