import cv2
import numpy as np
from PIL import Image
import math

# Read the raw thumbnail which is huge (2000px wide)
img = Image.open('Визитка-1.pdf.png').convert('RGBA')
width, height = img.size
pixels = img.load()

bg_blue = (28, 85, 156)
bg_white = (255, 255, 255)
target_gold = (205, 165, 87)

# Physically erase the outer 50 pixels! The letters are in the center.
# The thin lines are artifacts from the PDF page bounding box or clipping path.
for y in range(height):
    for x in range(width):
        if x < 50 or x > width - 50 or y < 50 or y > height - 50:
            pixels[x, y] = (0, 0, 0, 0)
            continue
            
        r, g, b, a = pixels[x, y]
        
        dist_blue = math.sqrt((r-bg_blue[0])**2 + (g-bg_blue[1])**2 + (b-bg_blue[2])**2)
        dist_white = math.sqrt((r-bg_white[0])**2 + (g-bg_white[1])**2 + (b-bg_white[2])**2)
        
        min_dist = min(dist_blue, dist_white)
        
        if min_dist > 50: 
            alpha = min(255, int((min_dist - 50) * 3))
            pixels[x, y] = (target_gold[0], target_gold[1], target_gold[2], alpha)
        else:
            pixels[x, y] = (0, 0, 0, 0)

# Now find the bounding box
min_x, min_y = width, height
max_x, max_y = 0, 0
found = False

for y in range(height):
    for x in range(width):
        if pixels[x, y][3] > 0:
            found = True
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

if found:
    padding = 20
    box = (max(0, min_x - padding), max(0, min_y - padding), 
           min(width, max_x + padding), min(height, max_y + padding))
    cropped = img.crop(box)
    
    # Save with a new name to bust Next.js cache completely
    cropped.save('../viva_logo_final.png', 'PNG')
    print('Saved to ../viva_logo_final.png')
else:
    print('No logo found')
