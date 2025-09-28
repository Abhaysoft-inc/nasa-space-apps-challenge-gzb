#!/usr/bin/env python3
"""
NASA Games & Interactives - Professional Image Generator
Creates NASA-style headers and story cards with space themes
"""

import os
import requests
import time
import json
from pathlib import Path

def create_directories():
    """Create necessary directories for NASA-style images"""
    base_dir = Path("./client/public/nasa_games_images")
    
    directories = [
        base_dir / "headers",
        base_dir / "story_cards", 
        base_dir / "backgrounds"
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
    
    return base_dir

def download_image(url, filepath, description):
    """Download image from URL"""
    try:
        print(f"📥 Downloading: {description}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Saved: {filepath.name}")
        return True
        
    except Exception as e:
        print(f"❌ Error downloading {description}: {e}")
        return False

def main():
    """Main NASA-style image generation process"""
    
    print("🚀 NASA GAMES & INTERACTIVES - IMAGE GENERATOR")
    print("=" * 60)
    print("📥 Creating professional NASA-style interface images...")
    print()
    
    # Create output directories
    base_dir = create_directories()
    
    # Define NASA-style image collection
    nasa_image_collection = {
        # Header Images - NASA Space Themes
        "headers/space_exploration_banner.jpg": {
            "url": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1400&h=400&fit=crop&auto=format&q=85",
            "description": "NASA Space Exploration Header Banner"
        },
        "headers/mars_missions_header.jpg": {
            "url": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1400&h=400&fit=crop&auto=format&q=85",
            "description": "Mars Missions Header Background"
        },
        "headers/space_station_header.jpg": {
            "url": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1400&h=400&fit=crop&auto=format&q=85",
            "description": "Space Station Header Background"
        },
        
        # Story Card Images - NASA Mission Posters Style
        "story_cards/tardigrade_mission_card.jpg": {
            "url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop&auto=format&q=85",
            "description": "Tardigrade Mission - Microscopic Life Card"
        },
        "story_cards/bion_m1_mission_card.jpg": {
            "url": "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&h=800&fit=crop&auto=format&q=85",
            "description": "BION-M1 Space Mission Card"
        },
        "story_cards/mars_exploration_card.jpg": {
            "url": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&h=800&fit=crop&auto=format&q=85",
            "description": "Mars Exploration Mission Card"
        },
        "story_cards/space_biology_card.jpg": {
            "url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&auto=format&q=85",
            "description": "Space Biology Research Card"
        },
        "story_cards/astronaut_training_card.jpg": {
            "url": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=800&fit=crop&auto=format&q=85",
            "description": "Astronaut Training Mission Card"
        },
        "story_cards/lunar_missions_card.jpg": {
            "url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop&auto=format&q=85",
            "description": "Lunar Missions Exploration Card"
        },
        
        # Background Elements
        "backgrounds/nasa_logo_overlay.png": {
            "url": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=200&fit=crop&auto=format&q=85",
            "description": "NASA Logo Space Background"
        },
        "backgrounds/earth_from_space.jpg": {
            "url": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&h=800&fit=crop&auto=format&q=85",
            "description": "Earth from Space Background"
        },
        "backgrounds/space_nebula.jpg": {
            "url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&auto=format&q=85",
            "description": "Space Nebula Background"
        }
    }
    
    print(f"📊 Total NASA-style images to download: {len(nasa_image_collection)}")
    print()
    
    # Download all images
    successful_downloads = 0
    failed_downloads = 0
    
    for relative_path, image_info in nasa_image_collection.items():
        filepath = base_dir / relative_path
        
        if download_image(image_info["url"], filepath, image_info["description"]):
            successful_downloads += 1
        else:
            failed_downloads += 1
        
        # Rate limiting to be respectful
        time.sleep(1)
    
    # Create NASA-style image mapping JSON
    print(f"\n📝 Creating NASA-style image mapping...")
    
    nasa_image_mapping = {
        "headers": {
            "main_banner": "/nasa_games_images/headers/space_exploration_banner.jpg",
            "mars_header": "/nasa_games_images/headers/mars_missions_header.jpg",
            "space_station_header": "/nasa_games_images/headers/space_station_header.jpg"
        },
        "story_cards": {
            "tardigrade_mission": "/nasa_games_images/story_cards/tardigrade_mission_card.jpg",
            "bion_m1_mission": "/nasa_games_images/story_cards/bion_m1_mission_card.jpg",
            "mars_exploration": "/nasa_games_images/story_cards/mars_exploration_card.jpg",
            "space_biology": "/nasa_games_images/story_cards/space_biology_card.jpg",
            "astronaut_training": "/nasa_games_images/story_cards/astronaut_training_card.jpg",
            "lunar_missions": "/nasa_games_images/story_cards/lunar_missions_card.jpg"
        },
        "backgrounds": {
            "nasa_logo": "/nasa_games_images/backgrounds/nasa_logo_overlay.png",
            "earth_space": "/nasa_games_images/backgrounds/earth_from_space.jpg",
            "space_nebula": "/nasa_games_images/backgrounds/space_nebula.jpg"
        }
    }
    
    # Save mapping file
    mapping_file = base_dir / "nasa_image_mapping.json"
    with open(mapping_file, 'w') as f:
        json.dump(nasa_image_mapping, f, indent=2)
    
    print(f"✅ NASA image mapping saved: {mapping_file}")
    
    # Results summary
    print(f"\n🎉 NASA GAMES IMAGES DOWNLOAD COMPLETE!")
    print("=" * 60)
    print(f"✅ Successful downloads: {successful_downloads}")
    print(f"❌ Failed downloads: {failed_downloads}")
    print(f"📁 Images saved to: {base_dir}")
    print(f"📋 Mapping file: nasa_image_mapping.json")
    print()
    print("🔄 NEXT STEPS:")
    print("1. NASA-style images are ready in client/public/ directory")
    print("2. Update Games Center component with new professional design")
    print("3. Implement expandable story cards with NASA styling")
    print("4. Use NASA color scheme (deep blues, whites, oranges)")
    print()
    print("🚀 Ready for professional NASA Space Apps Challenge presentation!")

if __name__ == "__main__":
    main()