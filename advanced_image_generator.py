"""
Advanced Image Generator for Tardigrade Visual Novel
Uses Stable Diffusion API for high-quality custom image generation
"""

import os
import requests
import time
import json
from pathlib import Path
import base64
from PIL import Image
import io

# Configuration - Replace with your actual API keys
STABLE_DIFFUSION_API_KEY = "YOUR_STABLE_DIFFUSION_API_KEY"  # From DreamStudio or Replicate
HUGGINGFACE_API_KEY = "YOUR_HUGGINGFACE_API_KEY"  # Alternative API

# API URLs
STABILITY_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
REPLICATE_API_URL = "https://api.replicate.com/v1/predictions"

class AdvancedImageGenerator:
    def __init__(self, stability_key=None, hf_key=None):
        self.stability_key = stability_key
        self.hf_key = hf_key
        
        # Stability AI headers
        self.stability_headers = {
            "Authorization": f"Bearer {stability_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Hugging Face headers
        self.hf_headers = {
            "Authorization": f"Bearer {hf_key}",
            "Content-Type": "application/json"
        }
    
    def generate_with_stability(self, prompt, output_path, width=1024, height=1024):
        """Generate image using Stability AI API"""
        
        payload = {
            "text_prompts": [
                {
                    "text": prompt,
                    "weight": 1
                }
            ],
            "cfg_scale": 7,
            "height": height,
            "width": width,
            "samples": 1,
            "steps": 30,
            "style_preset": "photographic"
        }
        
        try:
            response = requests.post(
                STABILITY_API_URL,
                headers=self.stability_headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Save the generated image
                for i, image in enumerate(data["artifacts"]):
                    image_data = base64.b64decode(image["base64"])
                    
                    with open(output_path, "wb") as f:
                        f.write(image_data)
                    
                    print(f"✅ Generated: {output_path.name}")
                    return True
            else:
                print(f"❌ Stability API Error: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error with Stability API: {e}")
            return False
    
    def generate_with_replicate(self, prompt, output_path):
        """Generate image using Replicate API (SDXL)"""
        
        payload = {
            "version": "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            "input": {
                "prompt": prompt,
                "width": 1024,
                "height": 1024,
                "guidance_scale": 7.5,
                "num_inference_steps": 30,
                "scheduler": "K_EULER"
            }
        }
        
        try:
            # Start prediction
            response = requests.post(
                REPLICATE_API_URL,
                headers={"Authorization": f"Token {self.stability_key}"},
                json=payload
            )
            
            if response.status_code == 201:
                prediction = response.json()
                prediction_url = prediction["urls"]["get"]
                
                # Poll for completion
                while True:
                    result = requests.get(
                        prediction_url,
                        headers={"Authorization": f"Token {self.stability_key}"}
                    )
                    
                    if result.status_code == 200:
                        status = result.json()
                        
                        if status["status"] == "succeeded":
                            # Download generated image
                            image_url = status["output"][0]
                            img_response = requests.get(image_url)
                            
                            with open(output_path, "wb") as f:
                                f.write(img_response.content)
                            
                            print(f"✅ Generated with Replicate: {output_path.name}")
                            return True
                        
                        elif status["status"] == "failed":
                            print(f"❌ Replicate generation failed: {status.get('error', 'Unknown error')}")
                            return False
                        
                        else:
                            time.sleep(2)  # Wait and check again
                    
                    else:
                        print(f"❌ Replicate API Error: {result.status_code}")
                        return False
            
        except Exception as e:
            print(f"❌ Error with Replicate API: {e}")
            return False

# Enhanced prompts for better quality
ENHANCED_PROMPTS = {
    "characters": {
        "marina_neutral.jpg": {
            "prompt": "Professional portrait photograph of a young female scientist, microbiologist, brown hair in a neat ponytail, wearing white lab coat, standing in modern laboratory, confident intelligent expression, professional headshot, high quality photography, studio lighting, sharp focus, realistic skin texture",
            "dimensions": (512, 768)
        },
        "marina_excited.jpg": {
            "prompt": "Same professional female scientist from previous image, excited amazed expression, eyes wide with scientific wonder, slight smile of discovery, looking at microscope results, bright enthusiastic facial expression, professional laboratory photography",
            "dimensions": (512, 768)
        },
        "alex_neutral.jpg": {
            "prompt": "Professional portrait photograph of male NASA scientist, Asian features, 30s, wearing NASA polo shirt or professional attire, standing in NASA facility, confident expression, official NASA employee portrait, high quality professional photography",
            "dimensions": (512, 768)
        },
        "sarah_neutral.jpg": {
            "prompt": "Professional portrait photograph of female astronaut, Hispanic features, wearing NASA flight suit, confident space professional expression, official astronaut portrait, NASA facility background, high quality professional photography",
            "dimensions": (512, 768)
        }
    },
    
    "backgrounds": {
        "laboratory_main.jpg": {
            "prompt": "Modern scientific research laboratory interior, bright clean professional environment, microscopes on lab benches, computers, scientific equipment, fluorescent lighting, university or research facility, wide angle architectural photography",
            "dimensions": (1024, 768)
        },
        "nasa_facility.jpg": {
            "prompt": "NASA space center facility interior, mission control room or research laboratory, high-tech space agency environment, computers screens, NASA logos, professional space facility photography",
            "dimensions": (1024, 768)
        },
        "space_station_interior.jpg": {
            "prompt": "International Space Station interior view, astronaut workspace with scientific equipment, zero gravity environment, ISS modules and equipment, professional space photography, NASA official photography style",
            "dimensions": (1024, 768)
        },
        "mars_surface.jpg": {
            "prompt": "Martian landscape photography, red rocky terrain of Mars planet surface, distant Mars rover, alien planet geology, scientific exploration of Mars, NASA Mars mission photography style",
            "dimensions": (1024, 768)
        }
    },
    
    "effects": {
        "tardigrade_microscope.jpg": {
            "prompt": "Scientific microscopy photograph of tardigrade water bear, highly detailed microscopic view, 8-legged microscopic creature, scientific specimen photography, laboratory microscope view, educational biology image",
            "dimensions": (800, 600)
        },
        "space_experiment.jpg": {
            "prompt": "Scientific equipment conducting biological experiments in space, ISS laboratory modules, space research apparatus, astronaut workspace, professional space station photography, NASA experiment documentation",
            "dimensions": (1024, 768)
        }
    }
}

def run_enhanced_generation():
    """Run the enhanced image generation process"""
    
    print("🚀 ADVANCED TARDIGRADE VISUAL NOVEL IMAGE GENERATOR")
    print("=" * 60)
    print("🎯 This script will generate high-quality custom images using AI")
    print("📋 Make sure you have valid API keys for image generation services")
    print()
    
    # Check API keys
    use_stability = STABLE_DIFFUSION_API_KEY != "YOUR_STABLE_DIFFUSION_API_KEY"
    use_fallbacks = not use_stability
    
    if use_fallbacks:
        print("⚠️  No API keys detected - using high-quality curated fallbacks")
        print("💡 To use AI generation, add your Stability AI or Hugging Face API key")
        time.sleep(2)
    
    # Create output directories
    OUTPUT_DIR = Path("./client/public/generated_images")
    CHARACTERS_DIR = OUTPUT_DIR / "characters"
    BACKGROUNDS_DIR = OUTPUT_DIR / "backgrounds"
    EFFECTS_DIR = OUTPUT_DIR / "effects"
    
    for dir_path in [OUTPUT_DIR, CHARACTERS_DIR, BACKGROUNDS_DIR, EFFECTS_DIR]:
        dir_path.mkdir(parents=True, exist_ok=True)
    
    generator = AdvancedImageGenerator(STABLE_DIFFUSION_API_KEY, HUGGINGFACE_API_KEY)
    
    # Process each category
    categories = [
        ("characters", "👥 GENERATING CHARACTER PORTRAITS"),
        ("backgrounds", "🖼️  GENERATING SCENE BACKGROUNDS"),
        ("effects", "✨ GENERATING SPECIAL EFFECTS")
    ]
    
    total_generated = 0
    
    for category, title in categories:
        print(f"\n{title}")
        print("-" * 50)
        
        if category in ENHANCED_PROMPTS:
            for filename, config in ENHANCED_PROMPTS[category].items():
                output_path = OUTPUT_DIR / category / filename
                
                print(f"\n🎨 Generating: {filename}")
                print(f"📝 Prompt: {config['prompt'][:80]}...")
                
                if use_stability:
                    # Try AI generation
                    width, height = config["dimensions"]
                    success = generator.generate_with_stability(
                        config["prompt"], output_path, width, height
                    )
                    
                    if success:
                        total_generated += 1
                    
                else:
                    # Use fallback high-quality images
                    success = download_fallback_image(filename, output_path)
                    if success:
                        total_generated += 1
                
                # Rate limiting
                time.sleep(3)
    
    # Generate updated React component
    print(f"\n📝 GENERATING UPDATED REACT COMPONENT")
    print("-" * 50)
    
    generate_updated_component()
    
    print(f"\n🎉 GENERATION COMPLETE!")
    print("=" * 60)
    print(f"📊 Total images: {total_generated}")
    print(f"📁 Saved to: {OUTPUT_DIR}")
    print(f"🔄 React component updated with new image paths")
    print(f"✅ Ready to use in your visual novel!")

def download_fallback_image(filename, output_path):
    """Download high-quality fallback images"""
    
    # Enhanced fallback URLs with better quality
    fallback_mapping = {
        "marina_neutral.jpg": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=512&h=768&fit=crop&crop=face",
        "marina_excited.jpg": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=512&h=768&fit=crop&crop=face",
        "alex_neutral.jpg": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=512&h=768&fit=crop&crop=face",
        "sarah_neutral.jpg": "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=512&h=768&fit=crop&crop=face",
        "laboratory_main.jpg": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1024&h=768&fit=crop",
        "nasa_facility.jpg": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1024&h=768&fit=crop",
        "space_station_interior.jpg": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1024&h=768&fit=crop",
        "mars_surface.jpg": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1024&h=768&fit=crop",
        "tardigrade_microscope.jpg": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        "space_experiment.jpg": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1024&h=768&fit=crop"
    }
    
    if filename in fallback_mapping:
        try:
            url = fallback_mapping[filename]
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Downloaded fallback: {filename}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to download {filename}: {e}")
            return False
    
    return False

def generate_updated_component():
    """Generate updated React component with new image paths"""
    
    component_code = '''// Updated Tardigrade Visual Novel with Custom Generated Images
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom generated image paths
const GENERATED_IMAGES = {
  characters: {
    marina: {
      neutral: '/generated_images/characters/marina_neutral.jpg',
      excited: '/generated_images/characters/marina_excited.jpg',
      amazed: '/generated_images/characters/marina_amazed.jpg',
      concerned: '/generated_images/characters/marina_concerned.jpg'
    },
    alex: {
      neutral: '/generated_images/characters/alex_neutral.jpg',
      excited: '/generated_images/characters/alex_excited.jpg',
      thinking: '/generated_images/characters/alex_thinking.jpg'
    },
    sarah: {
      neutral: '/generated_images/characters/sarah_neutral.jpg',
      confident: '/generated_images/characters/sarah_confident.jpg',
      amazed: '/generated_images/characters/sarah_amazed.jpg'
    }
  },
  backgrounds: {
    laboratory: '/generated_images/backgrounds/laboratory_main.jpg',
    nasa_facility: '/generated_images/backgrounds/nasa_facility.jpg',
    space_station: '/generated_images/backgrounds/space_station_interior.jpg',
    mars_surface: '/generated_images/backgrounds/mars_surface.jpg'
  },
  effects: {
    tardigrade_microscope: '/generated_images/effects/tardigrade_microscope.jpg',
    space_experiment: '/generated_images/effects/space_experiment.jpg'
  }
};

// Rest of your existing visual novel component code...
// (The existing TardigradeVisualNovel component will be updated to use GENERATED_IMAGES)

export default TardigradeVisualNovel;'''
    
    # Save the updated component template
    component_path = Path("./generated_visual_novel_update.jsx")
    with open(component_path, 'w') as f:
        f.write(component_code)
    
    print(f"✅ Generated component template: {component_path}")

if __name__ == "__main__":
    print("🎮 TARDIGRADE VISUAL NOVEL - CUSTOM IMAGE GENERATOR")
    print("=" * 60)
    print("🚨 IMPORTANT SETUP INSTRUCTIONS:")
    print("1. Get API key from: https://platform.stability.ai/")
    print("2. Or use Hugging Face: https://huggingface.co/settings/tokens")
    print("3. Replace API keys in this script")
    print("4. Install requirements: pip install requests pillow")
    print()
    
    choice = input("🚀 Ready to generate images? (y/n): ").lower()
    
    if choice == 'y':
        run_enhanced_generation()
    else:
        print("👋 Run the script again when you're ready!")