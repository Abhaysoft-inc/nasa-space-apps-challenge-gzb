import os
import base64
import requests
import time
from pathlib import Path

# -------------------------------
# 1. API KEY SETUP
# -------------------------------
API_KEY = "AIzaSyDrqsFxk2IvCaJqZww3tQULa3do_8RGCso"
IMAGEN_API_URL = f"https://aiplatform.googleapis.com/v1/projects/your-project/locations/us-central1/publishers/google/models/imagegeneration:predict"

# Alternative: Use direct Google AI Studio API
GENAI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent"




# -------------------------------
# 2. MASTER PROMPT
# -------------------------------
master_prompt = """
You are an AI image generator. Generate a series of 13 images for a NASA-themed anime visual novel called "Bion-M1".
Each image must follow its filename and description exactly. Use professional anime/visual novel style with consistent
art direction, cool scientific colors (blue, cyan, white), and high-quality clean design.
"""

# -------------------------------
# 3. ASSET DEFINITIONS
# -------------------------------
assets = [
    # Backgrounds
    ("backgrounds/nasa-ames-lab.jpg", "Modern NASA Ames laboratory, sterile white interior, microscopes, centrifuges, computers."),
    ("backgrounds/baikonur-launch.jpg", "Soyuz rocket at Baikonur launch pad, golden hour, dramatic sky."),
    ("backgrounds/mission-control-room.jpg", "NASA mission control, operators at consoles, giant orbital screens, blue/green glow."),
    ("backgrounds/space-station-interior.jpg", "ISS interior, floating scientific equipment, control panels, zero-gravity lab."),
    ("backgrounds/recovery-landing.jpg", "Steppe landscape, recovery vehicles, blue sky, peaceful return."),

    # Characters
    ("characters/dr-sarah-chen.png", "Female Asian-American scientist, lab coat, confident intelligent expression, anime VN style."),
    ("characters/mission-director.png", "Older authoritative male director, NASA uniform, commanding presence."),
    ("characters/control-officer.png", "Technical officer with headset and tablet, focused expression, professional look."),
    ("characters/scientist-team.png", "Young diverse scientist, lab coat, friendly collaborative expression."),

    # UI
    ("ui/dialogue-panel.png", "Visual novel dialogue panel, rounded rectangle, dark blue with cyan border, 1100x200, semi-transparent."),
    ("ui/choice-button.png", "Visual novel choice button, dark blue with cyan accents, rounded edges, 1000x60."),

    # Particles
    ("effects/spark-particle.png", "Small cyan-white sparkle particle, glowing, 32x32."),
    ("effects/smoke-particle.png", "Wispy gray smoke particle, transparent edges, 32x32."),
]

# -------------------------------
# 4. DIRECTORY SETUP
# -------------------------------
def create_directories():
    """Create all necessary directories for assets"""
    directories = ['backgrounds', 'characters', 'ui', 'effects']
    for dir_name in directories:
        Path(dir_name).mkdir(exist_ok=True)
        print(f"✓ Directory {dir_name}/ ready")

# -------------------------------
# 5. IMAGE GENERATION FUNCTION
# -------------------------------
def generate_image_with_dalle(prompt, filename):
    """Generate image using DALL-E via OpenAI API (fallback)"""
    try:
        # This would require OpenAI API - let's use a different approach
        print(f"⚠️  DALL-E API not configured. Skipping {filename}")
        return False
    except Exception as e:
        print(f"❌ Error generating {filename}: {e}")
        return False

def generate_image_placeholder(prompt, filepath):
    """Generate placeholder image with description"""
    try:
        # Create a simple text file with the prompt for manual generation
        txt_path = filepath.replace('.jpg', '.txt').replace('.png', '.txt')
        with open(txt_path, 'w') as f:
            f.write(f"PROMPT FOR {filepath}:\n\n{prompt}\n\nGenerate this image manually and replace this file.")
        print(f"✓ Created prompt file: {txt_path}")
        return True
    except Exception as e:
        print(f"❌ Error creating prompt file for {filepath}: {e}")
        return False

# -------------------------------
# 6. BATCH GENERATION FUNCTION  
# -------------------------------
def generate_all_assets():
    """Generate all visual novel assets"""
    print("🚀 Starting Bion-M1 Visual Novel Asset Generation...")
    print("=" * 60)
    
    create_directories()
    
    successful = 0
    failed = 0
    
    for filepath, description in assets:
        print(f"\n📸 Generating: {filepath}")
        print(f"💭 Prompt: {description}")
        
        # Create full prompt
        full_prompt = f"{master_prompt}\n\nGenerate: {description}"
        
        # Try to generate image (placeholder for now)
        if generate_image_placeholder(full_prompt, filepath):
            successful += 1
            print(f"✅ Success: {filepath}")
        else:
            failed += 1
            print(f"❌ Failed: {filepath}")
        
        # Small delay to avoid rate limiting
        time.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"🎯 Generation Complete!")
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"📁 Check the created .txt files for manual generation prompts")

# -------------------------------
# 7. MANUAL PROMPT GENERATOR
# -------------------------------
def create_batch_prompt_file():
    """Create a single file with all prompts for manual batch generation"""
    batch_content = """# BATCH IMAGE GENERATION PROMPTS
# Copy each prompt below into your AI image generator

"""
    
    for i, (filepath, description) in enumerate(assets, 1):
        dimensions = "1920x1080" if "backgrounds" in filepath else "512x1024" if "characters" in filepath else "custom"
        format_type = "JPG" if filepath.endswith('.jpg') else "PNG"
        
        batch_content += f"""
## IMAGE {i}: {filepath}
**Prompt:** {master_prompt} Generate: {description}
**Dimensions:** {dimensions}
**Format:** {format_type}
**Save as:** {filepath}

---
"""
    
    with open("BATCH_PROMPTS.txt", "w") as f:
        f.write(batch_content)
    
    print("📄 Created BATCH_PROMPTS.txt - Use this for manual batch generation!")

# -------------------------------
# 8. MAIN EXECUTION
# -------------------------------
if __name__ == "__main__":
    print("🎮 Bion-M1 Visual Novel Asset Generator")
    print("🔑 Using Google Gemini API Key:", API_KEY[:20] + "...")
    
    choice = input("\nChoose generation method:\n1. Auto generate (placeholder)\n2. Create batch prompts file\n3. Both\nEnter choice (1-3): ")
    
    if choice in ['1', '3']:
        generate_all_assets()
    
    if choice in ['2', '3']:
        create_batch_prompt_file()
    
    print("\n🎯 Next Steps:")
    print("1. Use the generated .txt files to manually create images")
    print("2. Or copy prompts from BATCH_PROMPTS.txt into Leonardo AI/Midjourney") 
    print("3. Save images with exact filenames in correct folders")
    print("4. Run 'npm run dev' to see your visual novel!")
    
    input("\nPress Enter to exit...")
