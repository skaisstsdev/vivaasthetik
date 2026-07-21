from PIL import Image
import math

img = Image.open('Визитка-1.pdf.png').convert('RGBA')
width, height = img.size
pixels = img.load()

# Let's find the most common color that is NOT blue or white
colors = {}
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Ignore blue-ish and white-ish
        if b > r + 20 or (r > 240 and g > 240 and b > 240):
            continue
        # Round to nearest 5 to group similar colors
        cr = (r//5)*5
        cg = (g//5)*5
        cb = (b//5)*5
        ck = (cr, cg, cb)
        colors[ck] = colors.get(ck, 0) + 1

sorted_colors = sorted(colors.items(), key=lambda x: x[1], reverse=True)
print("Top gold-ish colors:")
for k, v in sorted_colors[:5]:
    print(k, v)
