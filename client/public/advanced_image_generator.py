#!/usr/bin/env python3
"""
Advanced Bion-M1 Visual Novel Asset Generator
Uses Google AI Studio API for actual image generation
"""

import os
import requests
import json
import base64
import time
from pathlib import Path

# -------------------------------
# API CONFIGURATION
# -------------------------------
GEMINI_API_KEY = "AIzaSyDrqsFxk2IvCaJqZww3tQULa3do_8RGCso"

# Google AI Studio Text-to-Image endpoint (if available)
# Note: As of 2024, Gemini primarily focuses on text/vision, not image generation
# We'll create a comprehensive script that generates detailed prompts for external use

class BionM1AssetGenerator:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        
    def create_directories(self):
        """Create all asset directories"""
        directories = [
            'backgrounds',
            'characters', 
            'ui',
            'effects'
        ]
        
        for directory in directories:
            Path(directory).mkdir(exist_ok=True)
            print(f"📁 Created directory: {directory}/")
    
    def generate_comprehensive_prompts(self):
        """Generate detailed prompts for each asset"""
        
        assets = {
            # Backgrounds (1920x1080 JPG)
            "backgrounds/nasa-ames-lab.jpg": {
                "prompt": "Professional NASA Ames Research Center laboratory interior, modern scientific facility, clean white walls with fluorescent lighting, advanced equipment including microscopes, centrifuges, computers, glass containers with biological samples, sterile environment, bright clinical atmosphere, wide angle view, anime visual novel background style, high detail, 16:9 aspect ratio",
                "dimensions": "1920x1080",
                "format": "JPG",
                "type": "background"
            },
            
            "backgrounds/baikonur-launch.jpg": {
                "prompt": "Baikonur Cosmodrome launch pad at golden hour, Soyuz rocket standing tall on launch pad, industrial space facility infrastructure, dramatic orange-pink sunset sky, launch tower and support structures, wide open Kazakhstan landscape, epic inspiring atmosphere, anime visual novel background style, cinematic lighting, 16:9 aspect ratio",
                "dimensions": "1920x1080", 
                "format": "JPG",
                "type": "background"
            },
            
            "backgrounds/mission-control-room.jpg": {
                "prompt": "NASA Mission Control Houston, multiple tiers of control stations, large wall screens displaying orbital trajectory data and ISS feeds, professional flight controllers at computer consoles, blue and green ambient lighting, high-tech atmosphere, serious focused environment, anime visual novel background style, wide view, 16:9 aspect ratio",
                "dimensions": "1920x1080",
                "format": "JPG", 
                "type": "background"
            },
            
            "backgrounds/space-station-interior.jpg": {
                "prompt": "International Space Station interior module, cylindrical corridor with curved walls, scientific equipment and experiments floating in zero gravity, control panels and monitors, cables and technical apparatus, clean technical environment, natural lighting from Earth viewport, anime visual novel background style, 16:9 aspect ratio",
                "dimensions": "1920x1080",
                "format": "JPG",
                "type": "background"
            },
            
            "backgrounds/recovery-landing.jpg": {
                "prompt": "Soyuz capsule recovery site in Kazakhstan steppe, wide open grassland landscape, clear blue sky, recovery vehicles and helicopters in distance, parachute visible, peaceful successful mission completion mood, ground level perspective, anime visual novel background style, bright daylight, 16:9 aspect ratio",
                "dimensions": "1920x1080",
                "format": "JPG",
                "type": "background"
            },
            
            # Character Sprites (512x1024 PNG with transparency)
            "characters/dr-sarah-chen.png": {
                "prompt": "Dr. Sarah Chen, professional Asian-American female scientist, age 35-40, clean anime visual novel character art style, white lab coat over professional dark blouse, confident intelligent facial expression, shoulder-length professional black hair, standing pose facing forward, full body visible from head to feet, transparent background, 1:2 aspect ratio portrait",
                "dimensions": "512x1024",
                "format": "PNG",
                "type": "character"
            },
            
            "characters/mission-director.png": {
                "prompt": "NASA Mission Director, authoritative Caucasian male, age 50-55, anime visual novel character style, dark blue NASA polo shirt with logo, military bearing and experienced look, confident leadership expression, short professional gray hair, commanding presence, standing pose facing forward, full body from head to feet, transparent background, 1:2 aspect ratio",
                "dimensions": "512x1024", 
                "format": "PNG",
                "type": "character"
            },
            
            "characters/control-officer.png": {
                "prompt": "Mission Control Officer, technical specialist, diverse ethnicity, age 30-35, anime visual novel character style, NASA uniform with communication headset, holding tablet device, focused analytical expression, professional but approachable appearance, expert technician look, standing pose facing forward, full body visible, transparent background, 1:2 aspect ratio",
                "dimensions": "512x1024",
                "format": "PNG", 
                "type": "character"
            },
            
            "characters/scientist-team.png": {
                "prompt": "Young research scientist team member, diverse background, age 25-35, anime visual novel character style, white lab coat over casual professional attire, friendly collaborative facial expression, modern professional appearance, team player presence, standing pose facing forward, full body from head to feet, transparent background, 1:2 aspect ratio portrait",
                "dimensions": "512x1024",
                "format": "PNG",
                "type": "character"  
            },
            
            # UI Elements
            "ui/dialogue-panel.png": {
                "prompt": "Visual novel dialogue text panel UI element, rounded rectangle design with subtle shadows, dark navy blue background with bright cyan glowing borders, semi-transparent for text overlay, professional game interface style, clean modern design, 1100x200 pixel dimensions, PNG with transparency",
                "dimensions": "1100x200",
                "format": "PNG",
                "type": "ui"
            },
            
            "ui/choice-button.png": {
                "prompt": "Visual novel choice button UI element, rounded rectangular button design, dark blue gradient background with cyan accent borders, professional clickable appearance with subtle hover glow effect, clean game interface style, 1000x60 pixel dimensions, PNG with transparency", 
                "dimensions": "1000x60",
                "format": "PNG",
                "type": "ui"
            },
            
            # Particle Effects (32x32 PNG)
            "effects/spark-particle.png": {
                "prompt": "Small bright particle effect, white to cyan gradient sparkle, glowing center with radiating light rays, for launch and success animations, 32x32 pixels, PNG with full transparency, game particle effect style",
                "dimensions": "32x32",
                "format": "PNG", 
                "type": "effect"
            },
            
            "effects/smoke-particle.png": {
                "prompt": "Wispy smoke particle effect, light gray to white gradient, soft translucent edges, for rocket launch smoke trails, 32x32 pixels, PNG with transparency, realistic game particle style",
                "dimensions": "32x32", 
                "format": "PNG",
                "type": "effect"
            }
        }
        
        return assets
    
    def create_batch_generation_file(self, assets):
        """Create comprehensive batch generation instructions"""
        
        batch_content = f"""# 🚀 BION-M1 VISUAL NOVEL ASSET GENERATION
# Complete batch generation guide for AI image generators
# API Key: {self.api_key[:20]}...

## 📋 QUICK SETUP CHECKLIST
1. Copy each prompt below into your AI image generator
2. Generate with specified dimensions and format
3. Save with exact filename in correct folder
4. Restart development server to see results

## 🎨 MASTER STYLE GUIDE
- **Art Style:** Professional anime/visual novel aesthetic
- **Color Palette:** Cool scientific colors (blues, cyans, whites)
- **Quality:** High detail, clean lines, cell shading
- **Theme:** NASA space biology mission
- **Consistency:** Maintain same art style across all assets

"""
        
        # Group assets by type
        backgrounds = {k: v for k, v in assets.items() if v['type'] == 'background'}
        characters = {k: v for k, v in assets.items() if v['type'] == 'character'}
        ui_elements = {k: v for k, v in assets.items() if v['type'] == 'ui'}
        effects = {k: v for k, v in assets.items() if v['type'] == 'effect'}
        
        sections = [
            ("🖼️ BACKGROUND IMAGES", backgrounds),
            ("👥 CHARACTER SPRITES", characters), 
            ("🎮 UI ELEMENTS", ui_elements),
            ("✨ PARTICLE EFFECTS", effects)
        ]
        
        for section_name, section_assets in sections:
            batch_content += f"\n## {section_name}\n"
            batch_content += "=" * 60 + "\n\n"
            
            for i, (filepath, data) in enumerate(section_assets.items(), 1):
                batch_content += f"""### Asset {i}: {filepath}
**Dimensions:** {data['dimensions']}
**Format:** {data['format']}
**Type:** {data['type'].title()}

**PROMPT:**
{data['prompt']}

**Save as:** `{filepath}`

---

"""
        
        # Add single mega-prompt for batch generators
        batch_content += "\n## 🔥 SINGLE BATCH PROMPT (For Multi-Image Generators)\n"
        batch_content += "=" * 60 + "\n\n"
        batch_content += "**Copy this entire prompt for Leonardo AI, Ideogram, or similar batch generators:**\n\n"
        
        batch_content += "Generate 13 separate anime-style visual novel images for NASA Bion-M1 mission game:\n\n"
        
        for i, (filepath, data) in enumerate(assets.items(), 1):
            batch_content += f"IMAGE {i}: {data['prompt']} ({data['dimensions']} {data['format']})\n"
        
        batch_content += "\nGenerate all as separate files with consistent professional anime visual novel style.\n\n"
        
        # Add usage instructions
        batch_content += """
## 🚀 USAGE INSTRUCTIONS

### Method 1: Individual Generation
1. Copy each prompt above
2. Generate in your preferred AI tool
3. Download and rename to exact filename
4. Place in correct folder structure

### Method 2: Batch Generation  
1. Use the single batch prompt above
2. Generate all 13 images at once
3. Download and organize by type

### Method 3: Automated Tools
- Use Leonardo AI batch generation
- Try Ideogram multi-image feature
- Use Stable Diffusion batch scripts

## 📁 FOLDER STRUCTURE
```
client/public/
├── backgrounds/
│   ├── nasa-ames-lab.jpg
│   ├── baikonur-launch.jpg  
│   ├── mission-control-room.jpg
│   ├── space-station-interior.jpg
│   └── recovery-landing.jpg
├── characters/
│   ├── dr-sarah-chen.png
│   ├── mission-director.png
│   ├── control-officer.png
│   └── scientist-team.png
├── ui/
│   ├── dialogue-panel.png
│   └── choice-button.png
└── effects/
    ├── spark-particle.png
    └── smoke-particle.png
```

## ✅ VERIFICATION
After generation, verify:
- [ ] All 13 files created
- [ ] Correct dimensions for each type
- [ ] Proper file formats (JPG/PNG)
- [ ] Transparent backgrounds for characters/UI
- [ ] Consistent art style
- [ ] Files in correct folders

## 🎮 FINAL STEP
Run `npm run dev` to see your professional visual novel!
"""
        
        return batch_content
    
    def run_generation(self):
        """Main generation process"""
        print("🚀 Bion-M1 Visual Novel Asset Generator")
        print("=" * 60)
        print(f"🔑 API Key: {self.api_key[:20]}...")
        
        # Create directories
        self.create_directories()
        
        # Generate asset definitions
        assets = self.generate_comprehensive_prompts()
        
        # Create comprehensive batch file
        batch_content = self.create_batch_generation_file(assets)
        
        # Save batch generation file
        with open("COMPLETE_ASSET_GENERATION.md", "w", encoding='utf-8') as f:
            f.write(batch_content)
        
        # Create individual prompt files for manual generation
        for filepath, data in assets.items():
            # Create directory if it doesn't exist
            Path(filepath).parent.mkdir(exist_ok=True)
            
            # Create prompt file
            prompt_file = str(Path(filepath).with_suffix('.txt'))
            with open(prompt_file, 'w', encoding='utf-8') as f:
                f.write(f"GENERATE: {filepath}\n")
                f.write(f"DIMENSIONS: {data['dimensions']}\n") 
                f.write(f"FORMAT: {data['format']}\n")
                f.write(f"TYPE: {data['type']}\n\n")
                f.write(f"PROMPT:\n{data['prompt']}\n\n")
                f.write("After generation, replace this file with the actual image!")
        
        print("\n✅ Generation Complete!")
        print(f"📄 Created: COMPLETE_ASSET_GENERATION.md")
        print(f"📁 Created: {len(assets)} prompt files")
        print(f"🎯 Generated: {len(assets)} asset definitions")
        
        print("\n🎯 Next Steps:")
        print("1. Open COMPLETE_ASSET_GENERATION.md")
        print("2. Copy prompts into your AI image generator")
        print("3. Download and place images in correct folders") 
        print("4. Run 'npm run dev' to see results!")
        
        return assets

if __name__ == "__main__":
    generator = BionM1AssetGenerator(GEMINI_API_KEY)
    assets = generator.run_generation()
    
    print(f"\n🎮 Ready to generate {len(assets)} professional visual novel assets!")
    input("Press Enter to exit...")