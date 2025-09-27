"use client"
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

function MarsModel({ isSelected, onClick }) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <mesh onClick={onClick} scale={isSelected ? 1.5 : 1}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#cd5c5c" />
            </mesh>
        );
    }

    try {
        const gltf = useGLTF('/Mars_1_6792.glb', true);
        if (gltf && gltf.scene) {
            return (
                <primitive
                    object={gltf.scene.clone()}
                    onClick={onClick}
                    scale={isSelected ? 0.02 : 0.01}
                    rotation={[0, 0, 0]}
                    position={[0, 0, 0]}
                />
            );
        }
    } catch (error) {
        console.warn('Mars GLB failed, using fallback sphere');
        setHasError(true);
    }

    return (
        <mesh onClick={onClick} scale={isSelected ? 1.5 : 1}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#cd5c5c" />
        </mesh>
    );
}

function MoonModel({ isSelected, onClick }) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <mesh onClick={onClick} scale={isSelected ? 1.5 : 1}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#c0c0c0" />
            </mesh>
        );
    }

    try {
        const gltf = useGLTF('/Moon_1_3474.glb', true);
        if (gltf && gltf.scene) {
            return (
                <primitive
                    object={gltf.scene.clone()}
                    onClick={onClick}
                    scale={isSelected ? 0.02 : 0.01}
                    rotation={[0, 0, 0]}
                    position={[0, 0, 0]}
                />
            );
        }
    } catch (error) {
        console.warn('Moon GLB failed, using fallback sphere');
        setHasError(true);
    }

    return (
        <mesh onClick={onClick} scale={isSelected ? 1.5 : 1}>
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

            {/* Left Hero Section - 1/3 width */}
            <div className="w-1/3 flex flex-col justify-center p-8 z-20 bg-black/20 backdrop-blur-sm">
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
            <div className="w-2/3 relative flex items-center justify-center z-20">
                {/* Horizontal Planet Container */}
                <div className="flex items-center justify-center gap-32">
                    {/* Moon 3D Model */}
                    <div
                        className={`cursor-pointer transition-all duration-700 ease-in-out ${selectedPlanet === 'moon'
                            ? 'w-40 h-40 z-30'
                            : 'w-24 h-24 hover:scale-110'
                            }`}
                    >
                        <Canvas
                            camera={{ position: [0, 0, 3], fov: 50 }}
                            style={{ width: '100%', height: '100%' }}
                            gl={{ alpha: true, antialias: true }}
                        >
                            <Suspense fallback={
                                <mesh>
                                    <sphereGeometry args={[1, 32, 32]} />
                                    <meshStandardMaterial color="#c0c0c0" />
                                </mesh>
                            }>
                                <ambientLight intensity={0.4} />
                                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                                <pointLight position={[-5, -5, -5]} intensity={0.3} />
                                <MoonModel
                                    isSelected={selectedPlanet === 'moon'}
                                    onClick={() => handlePlanetClick('moon')}
                                />
                                <OrbitControls
                                    enableZoom={false}
                                    enablePan={false}
                                    autoRotate={true}
                                    autoRotateSpeed={selectedPlanet === 'moon' ? 0.5 : 1}
                                />
                            </Suspense>
                        </Canvas>
                        {selectedPlanet !== 'moon' && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <span className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded">Moon</span>
                            </div>
                        )}
                    </div>

                    {/* Mars 3D Model */}
                    <div
                        className={`cursor-pointer transition-all duration-700 ease-in-out ${selectedPlanet === 'mars'
                            ? 'w-48 h-48 z-30'
                            : 'w-36 h-36 hover:scale-110'
                            }`}
                    >
                        <Canvas
                            camera={{ position: [0, 0, 3], fov: 50 }}
                            style={{ width: '100%', height: '100%' }}
                            gl={{ alpha: true, antialias: true }}
                        >
                            <Suspense fallback={
                                <mesh>
                                    <sphereGeometry args={[1, 32, 32]} />
                                    <meshStandardMaterial color="#cd5c5c" />
                                </mesh>
                            }>
                                <ambientLight intensity={0.4} />
                                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                                <pointLight position={[-5, -5, -5]} intensity={0.3} />
                                <MarsModel
                                    isSelected={selectedPlanet === 'mars'}
                                    onClick={() => handlePlanetClick('mars')}
                                />
                                <OrbitControls
                                    enableZoom={false}
                                    enablePan={false}
                                    autoRotate={true}
                                    autoRotateSpeed={selectedPlanet === 'mars' ? 0.5 : 1}
                                />
                            </Suspense>
                        </Canvas>
                        {selectedPlanet !== 'mars' && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <span className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded">Mars</span>
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

// Note: GLB preloading removed to avoid loading errors