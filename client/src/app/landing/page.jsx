"use client"
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

function MarsModel({ isSelected, onClick }) {
    const gltf = useGLTF('/Mars_1_6792.glb');

    if (gltf && gltf.scene) {
        return (
            <primitive
                object={gltf.scene.clone()}
                onClick={onClick}
                scale={isSelected ? 0.01 : 0.006}
                rotation={[0, 0, 0]}
                position={[0, 0, 0]}
            />
        );
    }

    // Fallback if GLB doesn't load
    return (
        <mesh onClick={onClick} scale={isSelected ? 0.3 : 0.2}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                color="#cd5c5c"
                roughness={0.9}
                metalness={0.1}
                bumpScale={0.1}
            />
        </mesh>
    );
}

function MoonModel({ isSelected, onClick }) {
    const gltf = useGLTF('/Moon_1_3474.glb');

    if (gltf && gltf.scene) {
        return (
            <primitive
                object={gltf.scene.clone()}
                onClick={onClick}
                scale={isSelected ? 0.012 : 0.008}
                rotation={[0, 0, 0]}
                position={[0, 0, 0]}
            />
        );
    }

    // Fallback if GLB doesn't load
    return (
        <mesh onClick={onClick} scale={isSelected ? 0.25 : 0.15}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#c0c0c0" />
        </mesh>
    );
}

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
        <div className="min-h-screen flex overflow-hidden relative">
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/Landing_bg.mp4" type="video/mp4" />
            </video>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>

            {/* Left Hero Section - Dynamic width based on selection */}
            <div className={`flex flex-col justify-center p-8 z-20 transition-all duration-1000 ease-out ${selectedPlanet ? 'w-1/2' : 'w-1/3'}`}>
                <div className="space-y-6">
                    {selectedPlanet ? (
                        <>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent leading-tight">
                                {planets[selectedPlanet].heroText.title}
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                {planets[selectedPlanet].heroText.subtitle}
                            </p>
                            <div className="flex space-x-4 mt-8">
                                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    Explore {planets[selectedPlanet].name}
                                </button>
                                <button
                                    className="px-6 py-3 border border-white/30 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
                                    onClick={() => setSelectedPlanet(null)}
                                >
                                    Back to Cosmos
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>

            {/* Right Planet Section - Dynamic width based on selection */}
            <div className={`relative flex items-center justify-center z-20 transition-all duration-1000 ease-out ${selectedPlanet ? 'w-1/2' : 'w-2/3'}`}>
                {/* Horizontal Planet Container */}
                <div className={`flex items-center justify-center transition-all duration-1000 ease-out ${selectedPlanet ? 'gap-0' : 'gap-32'} relative w-full h-full`}>
                    {/* Moon 3D Model */}
                    <div
                        className={`cursor-pointer transition-all duration-1000 ease-out ${selectedPlanet === 'moon'
                            ? 'w-full h-full absolute inset-0 z-30'
                            : selectedPlanet === 'mars'
                                ? 'w-0 h-0 opacity-0 scale-0'
                                : 'w-32 h-32 hover:scale-110'
                            } flex items-center justify-center`}
                    >
                        <Canvas
                            camera={{
                                position: selectedPlanet === 'moon' ? [0, 0, 12] : [0, 0, 8],
                                fov: 45
                            }}
                            style={{ width: '100%', height: '100%' }}
                            gl={{ alpha: true, antialias: true }}
                        >
                            <Suspense fallback={
                                <mesh>
                                    <sphereGeometry args={[1, 64, 64]} />
                                    <meshStandardMaterial color="#c0c0c0" />
                                </mesh>
                            }>
                                <ambientLight intensity={0.3} />
                                <directionalLight
                                    position={[10, 10, 5]}
                                    intensity={1.2}
                                    castShadow
                                    shadow-mapSize-width={2048}
                                    shadow-mapSize-height={2048}
                                />
                                <pointLight position={[-10, -10, -5]} intensity={0.4} color="#4169e1" />
                                <pointLight position={[5, -5, 10]} intensity={0.3} color="#ffa500" />
                                <MoonModel
                                    isSelected={selectedPlanet === 'moon'}
                                    onClick={() => handlePlanetClick('moon')}
                                />
                                <OrbitControls
                                    enableZoom={false}
                                    enablePan={false}
                                    autoRotate={true}
                                    autoRotateSpeed={selectedPlanet === 'moon' ? 0.3 : 1}
                                />
                            </Suspense>
                        </Canvas>
                        {selectedPlanet !== 'moon' && selectedPlanet !== 'mars' && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <span className="text-sm font-semibold text-white bg-black/70 px-3 py-1 rounded-full backdrop-blur-sm">Moon</span>
                            </div>
                        )}
                    </div>

                    {/* Mars 3D Model */}
                    <div
                        className={`cursor-pointer transition-all duration-1000 ease-out ${selectedPlanet === 'mars'
                            ? 'w-full h-full absolute inset-0 z-30'
                            : selectedPlanet === 'moon'
                                ? 'w-0 h-0 opacity-0 scale-0'
                                : 'w-40 h-40 hover:scale-110'
                            } flex items-center justify-center`}
                    >
                        <Canvas
                            camera={{
                                position: selectedPlanet === 'mars' ? [0, 0, 12] : [0, 0, 8],
                                fov: 45
                            }}
                            style={{ width: '100%', height: '100%' }}
                            gl={{ alpha: true, antialias: true }}
                        >
                            <Suspense fallback={
                                <mesh>
                                    <sphereGeometry args={[1, 64, 64]} />
                                    <meshStandardMaterial color="#cd5c5c" />
                                </mesh>
                            }>
                                <ambientLight intensity={0.3} />
                                <directionalLight
                                    position={[10, 10, 5]}
                                    intensity={1.2}
                                    castShadow
                                    shadow-mapSize-width={2048}
                                    shadow-mapSize-height={2048}
                                />
                                <pointLight position={[-10, -10, -5]} intensity={0.4} color="#4169e1" />
                                <pointLight position={[5, -5, 10]} intensity={0.3} color="#ffa500" />
                                <MarsModel
                                    isSelected={selectedPlanet === 'mars'}
                                    onClick={() => handlePlanetClick('mars')}
                                />
                                <OrbitControls
                                    enableZoom={false}
                                    enablePan={false}
                                    autoRotate={true}
                                    autoRotateSpeed={selectedPlanet === 'mars' ? 0.3 : 1}
                                />
                            </Suspense>
                        </Canvas>
                        {selectedPlanet !== 'mars' && selectedPlanet !== 'moon' && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <span className="text-sm font-semibold text-white bg-black/70 px-3 py-1 rounded-full backdrop-blur-sm">Mars</span>
                            </div>
                        )}
                    </div>
                </div>

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