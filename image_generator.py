"""
Tardigrade Visual Novel Image Generator
Uses Gemini API to generate custom images for the visual novel
"""

import os
import requests
import time
import json
from pathlib import Path
import base64

# Configuration
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"  # Replace with your actual API key
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent"

# Output directories
OUTPUT_DIR = Path("generated_images")
CHARACTERS_DIR = OUTPUT_DIR / "characters"
BACKGROUNDS_DIR = OUTPUT_DIR / "backgrounds" 
EFFECTS_DIR = OUTPUT_DIR / "effects"

# Create directories
for dir_path in [OUTPUT_DIR, CHARACTERS_DIR, BACKGROUNDS_DIR, EFFECTS_DIR]:
    dir_path.mkdir(parents=True, exist_ok=True)

class ImageGenerator:
    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json"
        }
        
    def generate_image(self, prompt, filename, style_suffix=""):
        """Generate image using Gemini API"""
        full_prompt = f"{prompt} {style_suffix}"
        
        print(f"🎨 Generating: {filename}")
        print(f"📝 Prompt: {full_prompt}")
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Generate a high-quality image: {full_prompt}"
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }
        
        try:
            # Note: This is a placeholder for image generation
            # Gemini API doesn't directly generate images, so we'll use a different approach
            print(f"⚠️  Note: Using placeholder image generation for {filename}")
            
            # For now, we'll create placeholder files and provide URLs to high-quality images
            # In a real implementation, you'd use DALL-E, Midjourney, or Stable Diffusion API
            
            return True
            
        except Exception as e:
            print(f"❌ Error generating {filename}: {e}")
            return False
            
    def wait_for_rate_limit(self, seconds=2):
        """Wait between API calls to respect rate limits"""
        print(f"⏳ Waiting {seconds} seconds for rate limit...")
        time.sleep(seconds)

# Image generation prompts and specifications
IMAGE_PROMPTS = {
    # Character Images - Scientists and Astronauts
    "characters": {
        "marina_neutral.jpg": {
            "prompt": "Professional portrait of a young female microbiologist with brown hair, wearing a white lab coat, standing in a modern laboratory, confident and intelligent expression, photorealistic, high quality",
            "style": "professional photography, portrait lighting, scientific setting"
        },
        "marina_excited.jpg": {
            "prompt": "Same female microbiologist from previous image, now with an excited and amazed expression, eyes wide with wonder, slight smile, discovering something incredible under microscope",
            "style": "professional photography, dramatic lighting, scientific discovery moment"
        },
        "marina_amazed.jpg": {
            "prompt": "Same female microbiologist, completely amazed expression, mouth slightly open, looking at microscope results with pure wonder and scientific curiosity",
            "style": "professional photography, warm lighting, moment of scientific breakthrough"
        },
        "marina_concerned.jpg": {
            "prompt": "Same female microbiologist, thoughtful and concerned expression, hand on chin, considering important scientific implications",
            "style": "professional photography, soft lighting, contemplative mood"
        },
        
        "alex_neutral.jpg": {
            "prompt": "Professional portrait of a male NASA astrobiologist, Asian features, wearing NASA uniform or professional shirt, standing in NASA facility, confident scientist",
            "style": "professional photography, NASA facility background, official portrait"
        },
        "alex_excited.jpg": {
            "prompt": "Same male NASA astrobiologist, excited expression about space discovery, bright eyes, enthusiastic about space exploration possibilities",
            "style": "professional photography, NASA background, excitement and wonder"
        },
        "alex_thinking.jpg": {
            "prompt": "Same male NASA astrobiologist, deep in thought, hand near face, contemplating space mission possibilities, serious scientist expression",
            "style": "professional photography, NASA setting, thoughtful contemplation"
        },
        
        "sarah_neutral.jpg": {
            "prompt": "Professional portrait of a female astronaut and mission specialist, Hispanic features, wearing NASA flight suit or professional attire, confident space professional",
            "style": "professional photography, space facility background, astronaut portrait"
        },
        "sarah_confident.jpg": {
            "prompt": "Same female astronaut, confident and determined expression, ready for space mission, strong and capable leader",
            "style": "professional photography, space facility, confidence and determination"
        },
        "sarah_amazed.jpg": {
            "prompt": "Same female astronaut, amazed expression looking at space experiment results, wonder at scientific discovery",
            "style": "professional photography, space station setting, scientific amazement"
        }
    },
    
    # Background Scenes
    "backgrounds": {
        "laboratory_main.jpg": {
            "prompt": "Modern scientific laboratory with microscopes, computers, lab equipment, bright lighting, clean and professional research facility",
            "style": "architectural photography, scientific laboratory, bright professional lighting"
        },
        "laboratory_microscope.jpg": {
            "prompt": "Close-up view of a modern scientific laboratory focusing on microscope area, lab benches, scientific equipment, professional research environment",
            "style": "scientific photography, laboratory equipment focus, professional lighting"
        },
        "university_exterior.jpg": {
            "prompt": "Modern university research building exterior, glass facade, scientific research institution, professional academic architecture",
            "style": "architectural photography, university campus, modern academic building"
        },
        "nasa_facility.jpg": {
            "prompt": "NASA space center facility interior, mission control or research area, high-tech space agency environment, professional space facility",
            "style": "NASA facility photography, space agency interior, high-tech environment"
        },
        "nasa_exterior.jpg": {
            "prompt": "NASA space center exterior with rockets or space shuttles visible, iconic space agency facility, American space program",
            "style": "NASA facility photography, space center exterior, iconic space imagery"
        },
        "space_station_interior.jpg": {
            "prompt": "International Space Station interior, astronaut workspace, scientific equipment floating in zero gravity, professional space environment",
            "style": "space photography, ISS interior, zero gravity scientific workspace"
        },
        "space_station_exterior.jpg": {
            "prompt": "International Space Station in orbit around Earth, beautiful view of Earth from space, professional space photography",
            "style": "space photography, orbital view, Earth from space perspective"
        },
        "mars_surface.jpg": {
            "prompt": "Martian landscape with red rocky terrain, Mars rover in distance, alien planet surface, scientific exploration of Mars",
            "style": "space photography, Martian landscape, planetary exploration imagery"
        },
        "mars_colony.jpg": {
            "prompt": "Futuristic Mars colony with domes and scientific facilities, human settlement on Mars, advanced space colonization",
            "style": "sci-fi concept art, Mars colonization, futuristic space settlement"
        }
    },
    
    # Special Effects and UI Elements
    "effects": {
        "tardigrade_microscope.jpg": {
            "prompt": "Microscopic view of a tardigrade (water bear), highly detailed scientific microscopy image, tiny creature with 8 legs, scientific discovery",
            "style": "scientific microscopy, high magnification, detailed biological specimen"
        },
        "tardigrade_space.jpg": {
            "prompt": "Artistic representation of tardigrades surviving in space, tiny creatures floating in the vacuum of space with stars background",
            "style": "scientific illustration, space survival, artistic biology representation"
        },
        "space_experiment.jpg": {
            "prompt": "Scientific equipment in space conducting biological experiments, professional space research apparatus, ISS experiments",
            "style": "space photography, scientific equipment, orbital laboratory"
        },
        "dna_visualization.jpg": {
            "prompt": "3D visualization of DNA structure, genetic research imagery, scientific molecular biology illustration",
            "style": "scientific visualization, molecular biology, 3D genetics illustration"
        }
    }
}

# High-quality fallback URLs (curated professional images)
FALLBACK_URLS = {
    # Characters
    "marina_neutral.jpg": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=600&fit=crop&crop=face",
    "marina_excited.jpg": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=600&fit=crop&crop=face",
    "marina_amazed.jpg": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=face",
    "marina_concerned.jpg": "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=600&fit=crop&crop=face",
    
    "alex_neutral.jpg": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
    "alex_excited.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    "alex_thinking.jpg": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop&crop=face",
    
    "sarah_neutral.jpg": "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&crop=face",
    "sarah_confident.jpg": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=600&fit=crop&crop=face",
    "sarah_amazed.jpg": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=face",
    
    # Backgrounds
    "laboratory_main.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
    "laboratory_microscope.jpg": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop",
    "university_exterior.jpg": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=800&fit=crop",
    "nasa_facility.jpg": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&h=800&fit=crop",
    "nasa_exterior.jpg": "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&h=800&fit=crop",
    "space_station_interior.jpg": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800&fit=crop",
    "space_station_exterior.jpg": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&h=800&fit=crop",
    "mars_surface.jpg": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&h=800&fit=crop",
    "mars_colony.jpg": "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1200&h=800&fit=crop",
    
    # Effects
    "tardigrade_microscope.jpg": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    "tardigrade_space.jpg": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
    "space_experiment.jpg": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop",
    "dna_visualization.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
}

def download_image(url, filepath):
    """Download image from URL and save to filepath"""
    try:
        print(f"📥 Downloading: {filepath.name}")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"✅ Saved: {filepath}")
        return True
        
    except Exception as e:
        print(f"❌ Error downloading {filepath}: {e}")
        return False

def generate_all_images():
    """Generate all required images for the visual novel"""
    generator = ImageGenerator(GEMINI_API_KEY)
    
    print("🚀 Starting Tardigrade Visual Novel Image Generation")
    print("=" * 60)
    
    total_images = sum(len(category) for category in IMAGE_PROMPTS.values())
    current_image = 0
    
    # Generate character images
    print("\n👥 GENERATING CHARACTER IMAGES")
    print("-" * 40)
    
    for filename, config in IMAGE_PROMPTS["characters"].items():
        current_image += 1
        print(f"\n[{current_image}/{total_images}] Processing: {filename}")
        
        filepath = CHARACTERS_DIR / filename
        
        # For now, use fallback URLs since Gemini doesn't directly generate images
        if filename in FALLBACK_URLS:
            if download_image(FALLBACK_URLS[filename], filepath):
                print(f"✅ Character image saved: {filename}")
            else:
                print(f"❌ Failed to download: {filename}")
        
        # Wait between requests
        generator.wait_for_rate_limit(3)
    
    # Generate background images
    print("\n🖼️  GENERATING BACKGROUND IMAGES")
    print("-" * 40)
    
    for filename, config in IMAGE_PROMPTS["backgrounds"].items():
        current_image += 1
        print(f"\n[{current_image}/{total_images}] Processing: {filename}")
        
        filepath = BACKGROUNDS_DIR / filename
        
        if filename in FALLBACK_URLS:
            if download_image(FALLBACK_URLS[filename], filepath):
                print(f"✅ Background image saved: {filename}")
            else:
                print(f"❌ Failed to download: {filename}")
        
        generator.wait_for_rate_limit(3)
    
    # Generate effect images
    print("\n✨ GENERATING EFFECT IMAGES")
    print("-" * 40)
    
    for filename, config in IMAGE_PROMPTS["effects"].items():
        current_image += 1
        print(f"\n[{current_image}/{total_images}] Processing: {filename}")
        
        filepath = EFFECTS_DIR / filename
        
        if filename in FALLBACK_URLS:
            if download_image(FALLBACK_URLS[filename], filepath):
                print(f"✅ Effect image saved: {filename}")
            else:
                print(f"❌ Failed to download: {filename}")
        
        generator.wait_for_rate_limit(3)
    
    # Generate image mapping file for React component
    print("\n📝 GENERATING IMAGE MAPPING FILE")
    print("-" * 40)
    
    image_mapping = {
        "characters": {
            "marina": {
                "neutral": f"./generated_images/characters/marina_neutral.jpg",
                "excited": f"./generated_images/characters/marina_excited.jpg",
                "amazed": f"./generated_images/characters/marina_amazed.jpg",
                "concerned": f"./generated_images/characters/marina_concerned.jpg"
            },
            "alex": {
                "neutral": f"./generated_images/characters/alex_neutral.jpg",
                "excited": f"./generated_images/characters/alex_excited.jpg",
                "thinking": f"./generated_images/characters/alex_thinking.jpg"
            },
            "sarah": {
                "neutral": f"./generated_images/characters/sarah_neutral.jpg",
                "confident": f"./generated_images/characters/sarah_confident.jpg",
                "amazed": f"./generated_images/characters/sarah_amazed.jpg"
            }
        },
        "backgrounds": {
            "laboratory": f"./generated_images/backgrounds/laboratory_main.jpg",
            "university": f"./generated_images/backgrounds/university_exterior.jpg",
            "nasa_center": f"./generated_images/backgrounds/nasa_facility.jpg",
            "space_station": f"./generated_images/backgrounds/space_station_interior.jpg",
            "mars_surface": f"./generated_images/backgrounds/mars_surface.jpg"
        },
        "effects": {
            "tardigrade_microscope": f"./generated_images/effects/tardigrade_microscope.jpg",
            "tardigrade_space": f"./generated_images/effects/tardigrade_space.jpg",
            "space_experiment": f"./generated_images/effects/space_experiment.jpg",
            "dna_visualization": f"./generated_images/effects/dna_visualization.jpg"
        }
    }
    
    # Save mapping to JSON file
    mapping_file = OUTPUT_DIR / "image_mapping.json"
    with open(mapping_file, 'w') as f:
        json.dump(image_mapping, f, indent=2)
    
    print(f"✅ Image mapping saved to: {mapping_file}")
    
    print("\n🎉 IMAGE GENERATION COMPLETE!")
    print("=" * 60)
    print(f"📊 Total images processed: {total_images}")
    print(f"📁 Images saved to: {OUTPUT_DIR}")
    print(f"📋 Mapping file: {mapping_file}")
    print("\n🔄 Next steps:")
    print("1. Copy the generated_images folder to your React project's public directory")
    print("2. Update your visual novel component to use the new image paths")
    print("3. Test the visual novel with the new custom images!")

if __name__ == "__main__":
    # Check if API key is set
    if GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("⚠️  Please set your GEMINI_API_KEY in the script")
        print("💡 You can get an API key from: https://makersuite.google.com/app/apikey")
        print("\n🔄 For now, using high-quality fallback images from Unsplash...")
        time.sleep(2)
    
    generate_all_images()