import cv2
import numpy as np
from PIL import Image

# Read the image
img = cv2.imread('../viva_logo_extracted.png', cv2.IMREAD_UNCHANGED)

if img is None:
    print("Error reading image")
    exit()

# Extract alpha channel
alpha = img[:, :, 3]

# Create a binary mask (pixels with significant alpha)
_, binary = cv2.threshold(alpha, 50, 255, cv2.THRESH_BINARY)

# Find connected components
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary, connectivity=8)

# We want to keep the main letters. 
# Letters will have a decent area and thickness.
# Background is label 0.
mask = np.zeros_like(alpha)

for i in range(1, num_labels):
    x, y, w, h, area = stats[i]
    
    # Check if component is a thin line
    # Thin lines are usually very narrow or very short, but have some area.
    # A real letter in a high-res image will have width > 10 and height > 10 and area > 100.
    if area > 100 and w > 5 and h > 5:
        # Keep this component
        mask[labels == i] = 255

# Now, we also want to keep the anti-aliasing (semi-transparent pixels) around the kept components.
# So we dilate the mask slightly to include edges, then bitwise AND with the original alpha.
kernel = np.ones((5,5), np.uint8)
dilated_mask = cv2.dilate(mask, kernel, iterations=2)

# Apply mask to original image
result = img.copy()
# Zero out alpha where dilated_mask is 0
result[:, :, 3] = np.where(dilated_mask == 255, img[:, :, 3], 0)

# Crop to the new bounding box
y_indices, x_indices = np.where(result[:, :, 3] > 0)
if len(y_indices) > 0:
    min_x, max_x = np.min(x_indices), np.max(x_indices)
    min_y, max_y = np.min(y_indices), np.max(y_indices)
    
    padding = 10
    min_x = max(0, min_x - padding)
    min_y = max(0, min_y - padding)
    max_x = min(result.shape[1], max_x + padding)
    max_y = min(result.shape[0], max_y + padding)
    
    cropped_result = result[min_y:max_y, min_x:max_x]
    
    cv2.imwrite('../viva_logo_extracted_clean.png', cropped_result)
    print("Cleaned and saved!")
else:
    print("No components left after filtering")
