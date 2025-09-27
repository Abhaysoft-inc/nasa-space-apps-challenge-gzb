import requests
from bs4 import BeautifulSoup
import os
import re
from urllib.parse import urljoin

# URL of the page you want to scrape
url = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4136787/'  # <- replace with your target URL

# Headers to make the request look like it's coming from a real browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

# Get page content
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

# Get <h1> text for folder name
h1_tag = soup.find('h1')
if h1_tag:
    # Clean the folder name by removing/replacing invalid characters
    folder_name = h1_tag.text.strip()
    # Remove or replace characters that are invalid in Windows filenames
    folder_name = re.sub(r'[<>:"/\\|?*]', '_', folder_name)
    # Limit length to avoid path length issues
    folder_name = folder_name[:100]
else:
    folder_name = 'images'
    
os.makedirs(folder_name, exist_ok=True)

# Find all images with class "graphic"
images = soup.find_all('img', class_='graphic')
print(f'Found {len(images)} images.')

# Download each image
for i, img in enumerate(images, start=1):
    img_url = img.get('src')
    if not img_url:
        continue
    
    # Handle relative URLs
    if img_url.startswith('//'):
        img_url = 'https:' + img_url
    elif img_url.startswith('/'):
        img_url = urljoin(url, img_url)
    
    # Get image content
    img_data = requests.get(img_url, headers=headers).content
    
    # Save the image
    img_name = os.path.join(folder_name, f'image_{i}.jpg')
    with open(img_name, 'wb') as f:
        f.write(img_data)
    
    print(f'Downloaded {img_name}')

print('All images saved in folder:', folder_name)
