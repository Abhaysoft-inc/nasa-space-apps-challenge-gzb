"use client"

import { useEffect, useRef, useState } from 'react'

// Phaser scene functions defined outside the React component
let gameInstance = null

function preload() {
  // Load background images
  this.load.image('nasa_lab', '/backgrounds/nasa-ames-lab.jpg')
  this.load.image('launch_pad', '/backgrounds/baikonur-launch.jpg')
  this.load.image('mission_control', '/backgrounds/mission-control-room.jpg')
  this.load.image('space_station', '/backgrounds/space-station-interior.jpg')
  this.load.image('recovery_site', '/backgrounds/recovery-landing.jpg')
  
  // Load character sprites
  this.load.image('dr_sarah', '/characters/dr-sarah-chen.png')
  this.load.image('mission_director', '/characters/mission-director.png')
  this.load.image('control_officer', '/characters/control-officer.png')
  this.load.image('scientist_team', '/characters/scientist-team.png')
  
  // Load UI elements
  this.load.image('dialogue_box', '/ui/dialogue-panel.png')
  this.load.image('choice_button', '/ui/choice-button.png')
  
  // Load particle textures for effects
  this.load.image('spark', '/effects/spark-particle.png')
  this.load.image('smoke', '/effects/smoke-particle.png')
}

function create() {
  // Set the background
  this.add.image(600, 350, 'lab_bg').setScale(37.5, 21.875)
  
  // Story state
  this.storyState = {
    currentScene: 0,
    scientificAccuracy: 0,
    breakthroughPoints: 0,
    choices: []
  }

  // Start the story
  this.time.delayedCall(500, () => {
    startStory.call(this)
  })
}

function startStory() {
  const scenes = [
    {
      background: 'nasa_lab',
      title: 'Mission Preparation - NASA Ames Research Center',
      character: { name: 'Dr. Sarah Chen', sprite: 'dr_sarah', x: 300, y: 300 },
      dialogue: [
        'Six months before Bion-M1 launch.',
        'We are preparing the most comprehensive study of biological adaptation to spaceflight.',
        'Forty-five mice will spend 30 days in orbit.',
        'Every decision we make now will determine the success of this mission.'
      ],
      choices: [
        {
          text: 'Select C57BL/6 strain mice for consistent bone density data',
          effects: { scientificAccuracy: 15, breakthroughPoints: 10 },
          response: 'Excellent choice! C57BL/6 mice provide reliable, consistent results.'
        },
        {
          text: 'Choose BALB/c strain for immune system research focus',
          effects: { scientificAccuracy: 8 },
          response: 'Good for immune studies, but bone data may be less consistent.'
        },
        {
          text: 'Use mixed population for genetic diversity analysis',
          effects: { scientificAccuracy: 10, breakthroughPoints: 5 },
          response: 'Smart thinking - genetic diversity reveals individual variations.'
        }
      ]
    },
    {
      background: 'launch_pad',
      title: 'Launch Day - Baikonur Cosmodrome',
      character: { name: 'Mission Director', sprite: 'mission_director', x: 300, y: 300 },
      dialogue: [
        'Launch Day has arrived.',
        'All biological payload systems are nominal.',
        'Forty-five mice secured in habitat modules.',
        'Initiating launch sequence.'
      ],
      animation: 'rocket-launch',
      choices: [
        {
          text: 'Continue with launch sequence',
          effects: {},
          response: 'All systems green for launch!'
        }
      ]
    },
    {
      background: 'space_station',
      title: 'Day 5 in Orbit - Microgravity Adaptation',
      character: { name: 'Dr. Sarah Chen', sprite: 'dr_sarah', x: 300, y: 300 },
      dialogue: [
        'We are now five days into the mission.',
        'Telemetry shows mice are adapting to microgravity.',
        'Heart rates elevated but stabilizing.',
        'Subject #23 shows unusual spinning motions and reduced feeding.'
      ],
      animation: 'floating-mice',
      choices: [
        {
          text: 'Vestibular system disruption - inner ear affected by microgravity',
          effects: { scientificAccuracy: 20, breakthroughPoints: 15 },
          response: 'Correct! Vestibular system disruption causes spatial disorientation.'
        },
        {
          text: 'Psychological stress from confined environment',
          effects: { scientificAccuracy: 5 },
          response: 'Possible, but analysis shows vestibular disruption is the primary cause.'
        },
        {
          text: 'Equipment malfunction in habitat system',
          effects: {},
          response: 'All systems are functioning normally. This is biological adaptation.'
        }
      ]
    },
    {
      background: 'mission_control',
      title: 'Day 15 - Critical Bone Density Discovery',
      character: { name: 'Control Officer', sprite: 'control_officer', x: 300, y: 300 },
      dialogue: [
        'Day 15 bone analysis results are in.',
        'Weight-bearing bones show 21% density loss.',
        'Non-weight-bearing bones only show 8% loss.',
        'This pattern reveals something crucial about bone health in space.'
      ],
      animation: 'bone-analysis',
      choices: [
        {
          text: 'Mechanical loading is critical - gravity provides essential bone stress',
          effects: { scientificAccuracy: 25, breakthroughPoints: 30 },
          response: 'BREAKTHROUGH! Mechanical loading is absolutely critical for bone health!'
        },
        {
          text: 'Blood flow changes affect bone formation',
          effects: { scientificAccuracy: 10, breakthroughPoints: 5 },
          response: 'Blood flow matters, but the pattern clearly points to mechanical loading.'
        }
      ]
    },
    {
      background: 'recovery_site',
      title: 'Day 30 - Mission Completion',
      character: { name: 'Dr. Sarah Chen', sprite: 'dr_sarah', x: 300, y: 300 },
      dialogue: [
        'Thirty days in space completed successfully.',
        'All biological samples recovered.',
        'We have revolutionized understanding of space biology.',
        'This data will be crucial for future Mars missions.'
      ],
      animation: 'mission-success',
      isEnd: true,
      choices: [
        {
          text: 'View final mission results',
          effects: {},
          response: 'Mission accomplished! Data will shape future human spaceflight.'
        }
      ]
    }
  ]

  displayScene.call(this, scenes[this.storyState.currentScene] || scenes[0])
}

function displayScene(scene) {
  // Clear previous content
  this.children.removeAll()

  // Set background image (full screen)
  this.add.image(600, 350, scene.background).setDisplaySize(1200, 700)

  // Add atmospheric overlay
  this.add.graphics()
    .fillStyle(0x000000, 0.3)
    .fillRect(0, 0, 1200, 700)

  // Title with enhanced styling
  const titleText = this.add.text(600, 50, scene.title, {
    fontSize: '32px',
    color: '#FFFFFF',
    fontFamily: 'Arial Black',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5)

  // Character sprite (larger, positioned for dialogue)
  if (scene.character) {
    const character = this.add.image(scene.character.x, scene.character.y, scene.character.sprite)
      .setScale(0.8) // Adjust scale for character sprites
      .setAlpha(0)
      .setOrigin(0.5, 1) // Bottom-center origin for proper positioning
    
    // Character entrance animation with bounce effect
    this.tweens.add({
      targets: character,
      alpha: 1,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 1000,
      ease: 'Back.easeOut'
    })

    // Character name with stylized nameplate
    const nameplate = this.add.graphics()
      .fillStyle(0x000000, 0.8)
      .fillRoundedRect(scene.character.x - 80, scene.character.y + 10, 160, 40, 8)
    
    this.add.text(scene.character.x, scene.character.y + 30, scene.character.name, {
      fontSize: '18px',
      color: '#00FFFF',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5)
  }

  // Enhanced dialogue box with visual novel styling
  const dialogueBox = this.add.graphics()
    .fillStyle(0x000000, 0.85)
    .lineStyle(2, 0x00FFFF, 1)
    .fillRoundedRect(50, 450, 1100, 200, 15)
    .strokeRoundedRect(50, 450, 1100, 200, 15)

  // Add dialogue box decoration
  this.add.graphics()
    .fillStyle(0x00FFFF, 0.3)
    .fillRoundedRect(60, 460, 1080, 4, 2)

  const dialogueText = this.add.text(80, 480, '', {
    fontSize: '24px',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    wordWrap: { width: 1040 },
    lineSpacing: 8
  })

  // Enhanced sound effects simulation
  const playSound = (type) => {
    if (type === 'typing') {
      // Subtle screen flash for typing effect
      const flash = this.add.graphics()
        .fillStyle(0xFFFFFF, 0.05)
        .fillRect(0, 0, 1200, 700)
      this.time.delayedCall(30, () => flash.destroy())
    }
  }

  // Enhanced typing animation with character-by-character reveal
  const typeText = (text, callback) => {
    let currentText = ''
    let charIndex = 0
    
    playSound('typing')
    
    const typeTimer = this.time.addEvent({
      delay: 40, // Faster typing for better flow
      callback: () => {
        if (charIndex < text.length) {
          currentText += text[charIndex]
          dialogueText.setText(currentText)
          charIndex++
          
          // Play typing sound every few characters
          if (charIndex % 3 === 0) {
            playSound('typing')
          }
        } else {
          typeTimer.remove()
          if (callback) callback()
        }
      },
      loop: true
    })
  }

  // Display dialogue sequence with better pacing
  let dialogueIndex = 0
  const showNextDialogue = () => {
    if (dialogueIndex < scene.dialogue.length) {
      typeText(scene.dialogue[dialogueIndex], () => {
        dialogueIndex++
        this.time.delayedCall(2000, showNextDialogue) // Longer pause for reading
      })
    } else {
      // Show choices after dialogue
      showChoices.call(this, scene)
    }
  }

  // Add scene animations
  if (scene.animation) {
    addSceneAnimation.call(this, scene.animation)
  }

  showNextDialogue()
}

function addSceneAnimation(animationType) {
  switch (animationType) {
    case 'rocket-launch':
      // Rocket launch particles
      const particles = this.add.particles(600, 600, 'scientist', {
        speed: { min: 100, max: 200 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 1000
      })
      break

    case 'floating-mice':
      // Floating mice animation
      const mice = this.add.image(800, 200, 'mice').setScale(2)
      this.tweens.add({
        targets: mice,
        y: 180,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
      this.tweens.add({
        targets: mice,
        rotation: 0.2,
        duration: 3000,
        yoyo: true,
        repeat: -1
      })
      break

    case 'bone-analysis':
      // Scanning effect
      const scanLine = this.add.graphics()
        .lineStyle(3, 0x00FF00)
        .moveTo(400, 150)
        .lineTo(800, 150)

      this.tweens.add({
        targets: scanLine,
        y: 300,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Power2'
      })
      break

    case 'mission-success':
      // Success particles
      this.add.particles(600, 350, 'scientist', {
        speed: { min: 50, max: 150 },
        scale: { start: 0.3, end: 0 },
        blendMode: 'ADD',
        lifespan: 2000,
        frequency: 100
      })
      break
  }
}

function showChoices(scene) {
  const choiceY = 480
  scene.choices.forEach((choice, index) => {
    // Enhanced choice button styling
    const choiceButton = this.add.graphics()
      .fillStyle(0x1a1a2e, 0.9)
      .lineStyle(2, 0x00FFFF, 0.8)
      .fillRoundedRect(80, choiceY + (index * 70), 1040, 60, 12)
      .strokeRoundedRect(80, choiceY + (index * 70), 1040, 60, 12)
      .setInteractive(new Phaser.Geom.Rectangle(80, choiceY + (index * 70), 1040, 60), Phaser.Geom.Rectangle.Contains)

    // Choice number indicator
    const choiceNumber = this.add.graphics()
      .fillStyle(0x00FFFF, 1)
      .fillCircle(110, choiceY + (index * 70) + 30, 15)
    
    this.add.text(110, choiceY + (index * 70) + 30, (index + 1).toString(), {
      fontSize: '18px',
      color: '#000000',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5)

    const choiceText = this.add.text(140, choiceY + (index * 70) + 30, choice.text, {
      fontSize: '20px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      wordWrap: { width: 950 }
    }).setOrigin(0, 0.5)

    // Enhanced hover effects with smooth transitions
    choiceButton.on('pointerover', () => {
      this.tweens.add({
        targets: choiceButton,
        scaleX: 1.02,
        scaleY: 1.02,
        duration: 200,
        ease: 'Power2'
      })
      choiceButton.clear()
        .fillStyle(0x0066CC, 0.95)
        .lineStyle(3, 0x00DDFF, 1)
        .fillRoundedRect(80, choiceY + (index * 70), 1040, 60, 12)
        .strokeRoundedRect(80, choiceY + (index * 70), 1040, 60, 12)
      choiceText.setColor('#FFFF00')
    })

    choiceButton.on('pointerout', () => {
      this.tweens.add({
        targets: choiceButton,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      })
      choiceButton.clear()
        .fillStyle(0x1a1a2e, 0.9)
        .lineStyle(2, 0x00FFFF, 0.8)
        .fillRoundedRect(80, choiceY + (index * 70), 1040, 60, 12)
        .strokeRoundedRect(80, choiceY + (index * 70), 1040, 60, 12)
      choiceText.setColor('#FFFFFF')
    })

    choiceButton.on('pointerdown', () => {
      // Click animation
      this.tweens.add({
        targets: choiceButton,
        scaleX: 0.98,
        scaleY: 0.98,
        duration: 100,
        yoyo: true,
        ease: 'Power2'
      })
      
      // Delay the choice action slightly for visual feedback
      this.time.delayedCall(150, () => {
        makeChoice.call(this, choice, scene.isEnd)
      })
    })
  })
}

function makeChoice(choice, isEnd) {
  // Clear screen
  this.children.removeAll()

  // Show choice response
  this.add.graphics()
    .fillStyle(0x000000, 0.9)
    .fillRect(0, 0, 1200, 700)

  this.add.text(600, 300, choice.response, {
    fontSize: '24px',
    color: '#00FF00',
    fontFamily: 'Arial',
    align: 'center',
    wordWrap: { width: 1000 }
  }).setOrigin(0.5)

  // Update story state
  this.storyState.scientificAccuracy += choice.effects.scientificAccuracy || 0
  this.storyState.breakthroughPoints += choice.effects.breakthroughPoints || 0

  if (isEnd) {
    // Show final results
    this.time.delayedCall(3000, () => {
      showFinalResults.call(this)
    })
  } else {
    // Continue to next scene
    this.time.delayedCall(3000, () => {
      this.storyState.currentScene++
      startStory.call(this)
    })
  }
}

function showFinalResults() {
  this.children.removeAll()

  // Background
  this.add.graphics()
    .fillStyle(0x001122)
    .fillRect(0, 0, 1200, 700)

  // Title
  this.add.text(600, 100, 'MISSION COMPLETED', {
    fontSize: '48px',
    color: '#00FF00',
    fontFamily: 'Arial Black'
  }).setOrigin(0.5)

  // Results
  const results = [
    `Scientific Accuracy: ${this.storyState.scientificAccuracy}%`,
    `Breakthrough Points: ${this.storyState.breakthroughPoints}`,
    '',
    'Your contributions to space biology:',
    '• Advanced understanding of bone loss in microgravity',
    '• Identified mechanical loading as critical for bone health',  
    '• Enabled development of exercise countermeasures',
    '• Paved the way for long-duration Mars missions'
  ]

  results.forEach((result, index) => {
    this.add.text(600, 200 + (index * 40), result, {
      fontSize: '22px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5)
  })

  // Restart button
  const restartButton = this.add.graphics()
    .fillStyle(0x006600, 0.8)
    .fillRoundedRect(450, 550, 300, 60, 10)
    .setInteractive(new Phaser.Geom.Rectangle(450, 550, 300, 60), Phaser.Geom.Rectangle.Contains)

  this.add.text(600, 580, 'Experience Mission Again', {
    fontSize: '20px',
    color: '#FFFFFF',
    fontFamily: 'Arial'
  }).setOrigin(0.5)

  restartButton.on('pointerdown', () => {
    this.storyState = {
      currentScene: 0,
      scientificAccuracy: 0,
      breakthroughPoints: 0
    }
    startStory.call(this)
  })
}

export default function BionM1RenJS() {
  const gameRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const initializeRenJS = async () => {
      if (typeof window !== 'undefined' && gameRef.current) {
        try {
          // Import Phaser globally
          const Phaser = await import('phaser')
          window.Phaser = Phaser.default || Phaser

          // RenJS Game Configuration
          const config = {
            type: Phaser.AUTO,
            width: 1200,
            height: 700,
            parent: gameRef.current,
            backgroundColor: '#000011',
            scene: {
              preload: preload,
              create: create
            },
            physics: {
              default: 'arcade'
            }
          }

          // Initialize the game
          gameInstance = new Phaser.Game(config)
          setIsLoaded(true)

        } catch (error) {
          console.error('Failed to initialize Phaser game:', error)
        }
      }
    }

    initializeRenJS()

    // Cleanup function
    return () => {
      if (gameInstance) {
        gameInstance.destroy(true)
        gameInstance = null
      }
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      {!isLoaded && (
        <div className="text-white text-xl mb-4 animate-pulse">
          Loading Bion-M1 Mission Experience...
        </div>
      )}
      <div 
        ref={gameRef} 
        className="w-full h-full max-w-[1200px] max-h-[700px] border-2 border-gray-800 rounded-lg overflow-hidden"
        style={{ 
          background: '#000011'
        }}
      />
      {!isLoaded && (
        <div className="text-gray-400 text-sm mt-4 text-center max-w-2xl">
          An interactive animated story about the historic Bion-M1 space biology mission.
          <br />
          Experience authentic scientific decisions with dynamic visuals and animations.
        </div>
      )}
    </div>
  )
}