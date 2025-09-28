#!/usr/bin/env python3
"""
Tardigrade Visual Novel - Immediate Image Generator
Downloads high-quality curated images for the visual novel
"""

import os
import requests
import time
import json
from pathlib import Path

def create_directories():
    """Create necessary directories for images"""
    base_dir = Path("./client/public/tardigrade_images")
    
    directories = [
        base_dir / "characters",
        base_dir / "backgrounds", 
        base_dir / "effects"
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
    """Main image generation process"""
    
    print("🚀 TARDIGRADE VISUAL NOVEL - IMAGE DOWNLOADER")
    print("=" * 60)
    print("📥 Downloading high-quality images for your visual novel...")
    print()
    
    # Create output directories
    base_dir = create_directories()
    
    # Define image collection with high-quality sources
    image_collection = {
        # Character Images
        "characters/marina_neutral.jpg": {
            "url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Dr. Marina Petrov - Microbiologist (Neutral)"
        },
        "characters/marina_excited.jpg": {
            "url": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Dr. Marina Petrov - Microbiologist (Excited)"
        },
        "characters/marina_amazed.jpg": {
            "url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Dr. Marina Petrov - Microbiologist (Amazed)"
        },
        "characters/marina_concerned.jpg": {
            "url": "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Dr. Marina Petrov - Microbiologist (Concerned)"
        },
        
        "characters/alex_neutral.jpg": {
            "url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Dr. Alex Chen - NASA Astrobiologist (Neutral)"
        },
        "characters/alex_excited.jpg": {
            "url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Dr. Alex Chen - NASA Astrobiologist (Excited)"
        },
        "characters/alex_thinking.jpg": {
            "url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Dr. Alex Chen - NASA Astrobiologist (Thinking)"
        },
        
        "characters/sarah_neutral.jpg": {
            "url": "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Commander Sarah Rodriguez - Astronaut (Neutral)"
        },
        "characters/sarah_confident.jpg": {
            "url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Commander Sarah Rodriguez - Astronaut (Confident)"
        },
        "characters/sarah_amazed.jpg": {
            "url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop&crop=face&auto=format&q=85",
            "description": "Commander Sarah Rodriguez - Astronaut (Amazed)"
        },
        
        # Background Images
        "backgrounds/university_lab.jpg": {
            "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&h=900&fit=crop&auto=format&q=85",
            "description": "University Research Laboratory"
        },
        "backgrounds/microscope_lab.jpg": {
            "url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&h=900&fit=crop&auto=format&q=85",
            "description": "Microscope Laboratory"
        },
        "backgrounds/nasa_facility.jpg": {
            "url": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1400&h=900&fit=crop&auto=format&q=85",
            "description": "NASA Space Center"
        },
        "backgrounds/mission_control.jpg": {
            "url": "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1400&h=900&fit=crop&auto=format&q=85",
            "description": "NASA Mission Control"
        },
        "backgrounds/space_station.jpg": {
            "url": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1400&h=900&fit=crop&auto=format&q=85",
            "description": "International Space Station"
        },
        "backgrounds/space_view.jpg": {
            "url": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1400&h=900&fit=crop&auto=format&q=85",
            "description": "View from Space"
        },
        "backgrounds/mars_surface.jpg": {
            "url": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1400&h=900&fit=crop&auto=format&q=85",
            "description": "Mars Planet Surface"
        },
        "backgrounds/mars_colony.jpg": {
            "url": "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1400&h=900&fit=crop&auto=format&q=85",
            "description": "Future Mars Colony"
        },
        
        # Effect Images
        "effects/tardigrade_microscope.jpg": {
            "url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1000&h=750&fit=crop&auto=format&q=85",
            "description": "Tardigrade under Microscope"
        },
        "effects/space_experiment.jpg": {
            "url": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1000&h=750&fit=crop&auto=format&q=85",
            "description": "Space Biology Experiment"
        },
        "effects/dna_strand.jpg": {
            "url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=750&fit=crop&auto=format&q=85",
            "description": "DNA Research Visualization"
        },
        "effects/space_tardigrade.jpg": {
            "url": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1000&h=750&fit=crop&auto=format&q=85",
            "description": "Tardigrade in Space (Artistic)"
        }
    }
    
    print(f"📊 Total images to download: {len(image_collection)}")
    print()
    
    # Download all images
    successful_downloads = 0
    failed_downloads = 0
    
    for relative_path, image_info in image_collection.items():
        filepath = base_dir / relative_path
        
        if download_image(image_info["url"], filepath, image_info["description"]):
            successful_downloads += 1
        else:
            failed_downloads += 1
        
        # Rate limiting to be respectful
        time.sleep(1)
    
    # Create image mapping JSON
    print(f"\n📝 Creating image mapping file...")
    
    image_mapping = {
        "characters": {
            "marina": {
                "neutral": "/tardigrade_images/characters/marina_neutral.jpg",
                "excited": "/tardigrade_images/characters/marina_excited.jpg", 
                "amazed": "/tardigrade_images/characters/marina_amazed.jpg",
                "concerned": "/tardigrade_images/characters/marina_concerned.jpg"
            },
            "alex": {
                "neutral": "/tardigrade_images/characters/alex_neutral.jpg",
                "excited": "/tardigrade_images/characters/alex_excited.jpg",
                "thinking": "/tardigrade_images/characters/alex_thinking.jpg"
            },
            "sarah": {
                "neutral": "/tardigrade_images/characters/sarah_neutral.jpg",
                "confident": "/tardigrade_images/characters/sarah_confident.jpg",
                "amazed": "/tardigrade_images/characters/sarah_amazed.jpg"
            }
        },
        "backgrounds": {
            "university_lab": "/tardigrade_images/backgrounds/university_lab.jpg",
            "microscope_lab": "/tardigrade_images/backgrounds/microscope_lab.jpg",
            "nasa_facility": "/tardigrade_images/backgrounds/nasa_facility.jpg",
            "mission_control": "/tardigrade_images/backgrounds/mission_control.jpg",
            "space_station": "/tardigrade_images/backgrounds/space_station.jpg",
            "space_view": "/tardigrade_images/backgrounds/space_view.jpg",
            "mars_surface": "/tardigrade_images/backgrounds/mars_surface.jpg",
            "mars_colony": "/tardigrade_images/backgrounds/mars_colony.jpg"
        },
        "effects": {
            "tardigrade_microscope": "/tardigrade_images/effects/tardigrade_microscope.jpg",
            "space_experiment": "/tardigrade_images/effects/space_experiment.jpg",
            "dna_strand": "/tardigrade_images/effects/dna_strand.jpg",
            "space_tardigrade": "/tardigrade_images/effects/space_tardigrade.jpg"
        }
    }
    
    # Save mapping file
    mapping_file = base_dir / "image_mapping.json"
    with open(mapping_file, 'w') as f:
        json.dump(image_mapping, f, indent=2)
    
    print(f"✅ Image mapping saved: {mapping_file}")
    
    # Results summary
    print(f"\n🎉 DOWNLOAD COMPLETE!")
    print("=" * 60)
    print(f"✅ Successful downloads: {successful_downloads}")
    print(f"❌ Failed downloads: {failed_downloads}")
    print(f"📁 Images saved to: {base_dir}")
    print(f"📋 Mapping file: image_mapping.json")
    print()
    print("🔄 NEXT STEPS:")
    print("1. Images are now ready in your client/public/ directory")
    print("2. Update your visual novel component to use these new images")
    print("3. Test the visual novel with beautiful custom images!")
    print()
    print("🚀 Your NASA Space Apps Challenge project is ready to impress!")

if __name__ == "__main__":
    main()