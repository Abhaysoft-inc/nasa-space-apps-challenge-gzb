# Bion-M1 Visual Novel Assets Guide

## 🎨 Required Assets for Professional Visual Novel Look

### Background Images (1920x1080 recommended)
Place these in `/client/public/backgrounds/`:

1. **nasa-ames-lab.jpg** - Modern NASA laboratory facility
   - Clean, professional lab environment
   - Equipment, computers, scientific instruments visible
   - Bright, sterile lighting

2. **baikonur-launch.jpg** - Baikonur Cosmodrome launch pad
   - Rocket on launch pad (preferably Soyuz)
   - Industrial space facility background
   - Dramatic sky (dawn/dusk preferred)

3. **mission-control-room.jpg** - NASA Mission Control Center
   - Multiple screens and control stations
   - Professional operators at work
   - Blue/green screen lighting

4. **space-station-interior.jpg** - International Space Station interior
   - Cylindrical modules with equipment
   - Floating scientific instruments
   - Clean, technical environment

5. **recovery-landing.jpg** - Capsule recovery site
   - Open field or steppe landscape
   - Recovery vehicles in background
   - Clear sky

### Character Sprites (512x1024 recommended, PNG with transparency)
Place these in `/client/public/characters/`:

1. **dr-sarah-chen.png** - Female scientist character
   - Professional woman in lab coat
   - Confident, intelligent appearance
   - Multiple expressions if possible (happy, concerned, excited)

2. **mission-director.png** - Mission Director
   - Authoritative figure in NASA polo/uniform
   - Middle-aged, experienced look
   - Professional demeanor

3. **control-officer.png** - Mission Control Officer
   - Technical specialist at console
   - Headset, professional attire
   - Focused, analytical expression

4. **scientist-team.png** - Supporting scientists
   - Group of diverse researchers
   - Lab coats, casual professional wear
   - Collaborative team appearance

### UI Elements (Optional but recommended)
Place these in `/client/public/ui/`:

1. **dialogue-panel.png** - Custom dialogue box design
2. **choice-button.png** - Custom button styling
3. **nameplate.png** - Character name background

### Particle Effects
Place these in `/client/public/effects/`:

1. **spark-particle.png** - Small spark/star for effects
2. **smoke-particle.png** - Smoke/exhaust effects

## 🛠️ Implementation Features

The code now includes:

✅ **Professional Visual Novel Styling**
- Full-screen background images
- Character sprites with smooth animations
- Enhanced dialogue boxes with borders
- Numbered choice buttons with hover effects

✅ **Enhanced Animations**
- Character entrance with bounce effects
- Smooth button transitions
- Typing effects with better timing
- Screen flash effects for immersion

✅ **Better UI Design**
- Styled nameplates for characters
- Professional color scheme (dark blue/cyan)
- Rounded corners and visual polish
- Responsive button interactions

## 🎭 Character Positioning

Characters are positioned at:
- X: 300 (left side of screen for dialogue)
- Y: 300 (middle height)
- Scale: 0.8 (80% of original size)
- Origin: bottom-center for proper ground alignment

## 📝 How to Use

1. Place images in the correct folders as listed above
2. Ensure image files match the exact names in the code
3. Restart the development server
4. The game will automatically load the new assets

## 🎨 Art Style Recommendations

**For Characters:**
- Anime/manga style similar to your references
- Clean line art with cell shading
- Professional clothing appropriate for NASA scientists
- Neutral expressions that can work in multiple contexts

**For Backgrounds:**
- Photorealistic or high-quality digital paintings
- Consistent lighting and color temperature
- High resolution for crisp display
- Wide aspect ratio (16:9) for full coverage

**Color Palette:**
- Cool blues and cyans for UI elements
- Warm lighting in character scenes
- Professional, scientific atmosphere
- High contrast for readability

## 🚀 Result

With proper assets, your game will look like a professional visual novel with:
- Immersive backgrounds that set the scene
- Detailed character sprites that bring the story to life
- Smooth animations and transitions
- Professional UI that matches the scientific theme

The visual style will be similar to your reference images with anime-style characters against realistic/semi-realistic backgrounds, creating an engaging and immersive storytelling experience!