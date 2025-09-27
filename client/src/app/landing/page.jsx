"use client"
import React, { useState } from 'react';

export default function SpaceHeroPage() {
    const [selectedPlanet, setSelectedPlanet] = useState(null);

    const planets = {
        moon: {
            name: "Moon",
            color: "bg-gray-300",
            shadowColor: "shadow-gray-400/30",
            heroText: {
                title: "Luna Awaits",
                subtitle: "Discover the mysteries of Earth's closest companion. A world of craters, seas, and endless possibilities for human exploration."
            }
        },
        mars: {
            name: "Mars",
            color: "bg-red-500",
            shadowColor: "shadow-red-500/30",
            heroText: {
                title: "The Red Planet",
                subtitle: "Journey to the frontier of human ambition. Mars beckons with ancient secrets and the promise of a new world to call home."
            }
        }
    };

    const handlePlanetClick = (planetKey) => {
        setSelectedPlanet(selectedPlanet === planetKey ? null : planetKey);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex overflow-hidden relative">
            {/* Animated stars background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Left Hero Section - 1/3 width */}
            <div className="w-1/3 flex flex-col justify-center p-8 z-10 bg-black/20 backdrop-blur-sm">
                <div className="space-y-6">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                        Explore the Cosmos
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        Embark on an interplanetary journey through space and time. Click on the celestial bodies to discover their secrets and unlock the mysteries of our solar system.
                    </p>
                    <div className="flex space-x-4 mt-8">
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Start Journey
                        </button>
                        <button className="px-6 py-3 border border-white/30 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Planet Section - 2/3 width */}
            <div className="w-2/3 relative flex items-center justify-center">
                {/* Moon */}
                <div
                    className={`absolute cursor-pointer transition-all duration-700 ease-in-out ${selectedPlanet === 'moon'
                            ? 'w-48 h-48 top-1/4 left-1/4 z-20'
                            : 'w-24 h-24 top-1/3 left-1/4 hover:scale-110'
                        }`}
                    onClick={() => handlePlanetClick('moon')}
                >
                    <div className={`w-full h-full rounded-full ${planets.moon.color} ${planets.moon.shadowColor} shadow-2xl relative overflow-hidden group`}>
                        {/* Moon craters */}
                        <div className="absolute top-2 left-3 w-2 h-2 bg-gray-400 rounded-full opacity-60"></div>
                        <div className="absolute top-6 right-4 w-3 h-3 bg-gray-400 rounded-full opacity-40"></div>
                        <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-50"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                        {selectedPlanet !== 'moon' && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs font-semibold text-gray-800">Moon</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mars */}
                <div
                    className={`absolute cursor-pointer transition-all duration-700 ease-in-out ${selectedPlanet === 'mars'
                            ? 'w-52 h-52 bottom-1/4 right-1/4 z-20'
                            : 'w-28 h-28 bottom-1/3 right-1/3 hover:scale-110'
                        }`}
                    onClick={() => handlePlanetClick('mars')}
                >
                    <div className={`w-full h-full rounded-full ${planets.mars.color} ${planets.mars.shadowColor} shadow-2xl relative overflow-hidden group`}>
                        {/* Mars surface features */}
                        <div className="absolute top-3 left-2 w-4 h-1 bg-red-700 rounded-full opacity-70"></div>
                        <div className="absolute top-1/2 right-2 w-2 h-2 bg-red-700 rounded-full opacity-60"></div>
                        <div className="absolute bottom-3 left-1/3 w-3 h-1.5 bg-red-700 rounded-full opacity-50"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/30 to-red-800/30 rounded-full"></div>
                        {selectedPlanet !== 'mars' && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs font-semibold text-white">Mars</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Planet Hero Text Overlay */}
                {selectedPlanet && (
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 transform animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                {planets[selectedPlanet].heroText.title}
                            </h2>
                            <p className="text-gray-200 text-lg leading-relaxed mb-6">
                                {planets[selectedPlanet].heroText.subtitle}
                            </p>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300">
                                    Explore
                                </button>
                                <button
                                    className="px-4 py-2 border border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-400/20 transition-all duration-300"
                                    onClick={() => setSelectedPlanet(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/40 rounded-full animate-bounce"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}