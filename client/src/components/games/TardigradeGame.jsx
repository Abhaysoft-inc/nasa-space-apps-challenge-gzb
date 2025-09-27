'use client';

import React, { useState, useEffect } from 'react';
import DiscoveryScene from './TardigradeGame/scenes/DiscoveryScene';
import ExperimentScene from './TardigradeGame/scenes/ExperimentScene';
import NASAPartnershipScene from './TardigradeGame/scenes/NASAPartnershipScene';
import SpaceMissionScene from './TardigradeGame/scenes/SpaceMissionScene';
import ApplicationsScene from './TardigradeGame/scenes/ApplicationsScene';
import GameHeader from './TardigradeGame/components/GameHeader';
import ProgressTracker from './TardigradeGame/components/ProgressTracker';
import ScienceFactModal from './TardigradeGame/components/ScienceFactModal';
import ProfessionalBackground from './ProfessionalBackground';

const TardigradeGame = () => {
  const [gameState, setGameState] = useState({
    chapter: 1,
    scene: 'discovery',
    discoveries: [],
    tardigradesSurvived: 0,
    researchPoints: 0,
    playerChoices: [],
    showScienceFact: false,
    currentFact: null
  });

  const scienceFacts = [
    {
      id: 1,
      description: "Tardigrades can survive temperatures as low as -272°C (near absolute zero) and as high as 150°C. They achieve this through a process called cryptobiosis, where they essentially suspend all biological processes.",
      paperTitle: "Tardigrades Use Intrinsically Disordered Proteins to Survive Desiccation",
      year: "2017"
    },
    {
      id: 2,
      description: "In 2007, tardigrades became the first animals to survive open space exposure. 68% survived 10 days of space vacuum, cosmic radiation, and extreme temperatures.",
      paperTitle: "Tardigrades survive exposure to space in low Earth orbit",
      year: "2008"
    },
    {
      id: 3,
      description: "Tardigrades can lose up to 99% of their body water and come back to life when rehydrated. This process is called anhydrobiosis and involves unique proteins that protect their cellular structures.",
      paperTitle: "Production of reactive oxygen species and involvement of bioprotectants during anhydrobiosis",
      year: "2020"
    }
  ];

  const handleChoice = (choice) => {
    const newChoices = [...gameState.playerChoices, choice];
    
    setGameState(prev => ({
      ...prev,
      playerChoices: newChoices,
      researchPoints: prev.researchPoints + (choice.points || 10)
    }));

    // Trigger scene transitions
    if (choice.nextScene) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          scene: choice.nextScene,
          chapter: choice.nextChapter || prev.chapter
        }));
      }, 1000);
    }

    // Show science facts at certain points
    if (choice.showFact) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showScienceFact: true,
          currentFact: scienceFacts[choice.factId] || scienceFacts[0]
        }));
      }, 2000);
    }
  };

  const closeScienceFact = () => {
    setGameState(prev => ({
      ...prev,
      showScienceFact: false,
      currentFact: null
    }));
  };

  const updateGameState = (updates) => {
    setGameState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const renderCurrentScene = () => {
    switch (gameState.scene) {
      case 'discovery':
        return <DiscoveryScene onChoice={handleChoice} gameState={gameState} />;
      case 'experiment':
        return <ExperimentScene onChoice={handleChoice} gameState={gameState} updateGameState={updateGameState} />;
      case 'nasa-partnership':
        return <NASAPartnershipScene onChoice={handleChoice} gameState={gameState} />;
      case 'space-mission':
        return <SpaceMissionScene onChoice={handleChoice} gameState={gameState} updateGameState={updateGameState} />;
      case 'applications':
        return <ApplicationsScene onChoice={handleChoice} gameState={gameState} />;
      default:
        return <DiscoveryScene onChoice={handleChoice} gameState={gameState} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <ProfessionalBackground />
      
      <div className="relative z-10">
        <GameHeader gameState={gameState} />
        
        {renderCurrentScene()}
        
        <ProgressTracker gameState={gameState} />
        
        {gameState.showScienceFact && (
          <ScienceFactModal 
            fact={gameState.currentFact} 
            onClose={closeScienceFact} 
          />
        )}
      </div>
    </div>
  );
};

export default TardigradeGame;