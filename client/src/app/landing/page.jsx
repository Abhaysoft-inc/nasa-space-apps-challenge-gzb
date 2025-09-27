"use client"
import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

function MarsModel({ isSelected }) {
    const gltf = useGLTF('/Mars_1_6792.glb');

    if (gltf && gltf.scene) {
        return (
            <primitive
                object={gltf.scene.clone()}
                scale={isSelected ? 0.01 : 0.006}
                rotation={[0, 0, 0]}
                position={[0, 0, 0]}
            />
        );
    }

    // Fallback if GLB doesn't load
    return (
        <mesh scale={isSelected ? 0.3 : 0.2}>
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

function MoonModel({ isSelected }) {
    const gltf = useGLTF('/Moon_1_3474.glb');

    if (gltf && gltf.scene) {
        return (
            <primitive
                object={gltf.scene.clone()}
                scale={isSelected ? 0.008 : 0.005}
                rotation={[0, 0, 0]}
                position={[0, 0, 0]}
            />
        );
    }

    // Fallback if GLB doesn't load
    return (
        <mesh scale={isSelected ? 0.25 : 0.15}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#c0c0c0" />
        </mesh>
    );
}

export default function SpaceHeroPage() {
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    // Moon section scroll animations
    const moonSectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: moonSectionRef, offset: ["start start", "end start"] });
    const headerY = useTransform(scrollYProgress, [0, 0.7, 1], [0, -40, -80]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 0.4, 0]);
    const moonLabelOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);
    const moonX = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);
    // Keep the moon fully opaque once it starts entering
    // (we remove opacity animation to avoid any transparent look)
    const leftWidth = '55%';

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
        <div className="w-full relative">
            {/* Global fixed background: shared by all sections */}
            <div className="fixed inset-0 -z-10">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/landing_bg.mp4" type="video/mp4" />
                    <source src="/Landing_bg.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/30" />
            </div>
            {/* Section 1: Hero */}
            <section className="relative min-h-screen flex">

                {/* Navigation Menu */}
                <nav className="absolute top-0 left-0 right-0 z-30 p-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <span className="text-white font-semibold text-xl">Biolore</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-white/80 hover:text-white transition-colors duration-300 ">
                            Home
                        </a>
                        <a href="/papers" className="text-white/80 hover:text-white transition-colors duration-300 ">
                            Research
                        </a>
                        <a href="/games" className="text-white/80 hover:text-white transition-colors duration-300 ">
                            Games
                        </a>
                        <a href="/mission" className="text-white/80 hover:text-white transition-colors duration-300">
                            Mission
                        </a>
                        <button className=" text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 bg-orange-500/90 backdrop-blur-2xl  ">
                            Learn
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-white p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                </nav>

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
                            <h1 className="text-5xl font-bold bg-white  bg-clip-text text-transparent leading-tight">
                                Explore Biolores From Space
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Embark on an interplanetary journey through space and time. Click on the celestial bodies to discover their secrets and unlock the mysteries of our solar system.
                            </p>
                            <div className="flex space-x-4 mt-8">
                                <button className="px-6 py-3 bg-[#e77d11] rounded-full font-semibold  transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    Start Journey
                                </button>
                                <button className="px-6 py-3 border border-white/30 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 text-white">
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
                        onClick={() => handlePlanetClick('moon')}
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
                        onClick={() => handlePlanetClick('mars')}
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
                    </section>

                    {/* Section 2: Moon research scroll section */}
                    <section ref={moonSectionRef} className="relative min-h-screen h-screen overflow-hidden">
                        {/* Sticky header (navbar style) that retracts */}
                        <div className="sticky top-0 z-30">
                            <motion.div style={{ y: headerY, opacity: headerOpacity }} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-white font-semibold text-xl">Biolore</span>
                                    </div>
                                    <div className="hidden md:flex items-center space-x-8">
                                        <a href="/" className="text-white/80 hover:text-white transition-colors duration-300 ">Home</a>
                                        <a href="/papers" className="text-white/80 hover:text-white transition-colors duration-300 ">Research</a>
                                        <a href="/games" className="text-white/80 hover:text-white transition-colors duration-300 ">Games</a>
                                        <a href="/mission" className="text-white/80 hover:text-white transition-colors duration-300">Mission</a>
                                        <button className=" text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 bg-orange-500/90 backdrop-blur-2xl  ">Learn</button>
                                    </div>
                                </div>
                            </motion.div>
                            {/* Moon label that appears when fully open */}
                            <motion.div style={{ opacity: moonLabelOpacity }} className="absolute top-6 left-6">
                                <div className="px-4 py-2 rounded-lg border border-white/20 bg-black/30 backdrop-blur text-white font-semibold">Moon</div>
                            </motion.div>
                        </div>

                        {/* Moon image slides in from left, half width, full height, below header */}
                        <motion.div
                            className="absolute top-0 left-0 h-full z-10 flex items-center justify-start"
                            style={{ x: moonX, width: leftWidth }}
                        >
                            <div className="relative h-full w-full">
                                <Image src="/moon-unscreen.gif" alt="Moon animation" fill priority unoptimized className="object-contain object-left" />
                            </div>
                        </motion.div>

                        {/* Right-side hardcoded moon research text */}
                        <div className="relative z-20 h-full" style={{ marginLeft: leftWidth }}>
                            <div className="h-full flex items-center">
                                <div className="max-w-3xl px-6 md:px-12">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Research on and for the Moon</h2>
                                    <p className="text-lg text-gray-200 mb-4">
                                        The Moon is our nearest off-world laboratory. Studies here inform planetary science, human health in partial gravity, and technologies for sustainable presence.
                                    </p>
                                    <ul className="space-y-3 text-gray-200 text-base list-disc pl-5">
                                        <li><span className="font-semibold text-white">Lunar Regolith Biology:</span> Plant and microbial responses to regolith simulants and Apollo samples; nutrient cycling and toxicity mitigation.</li>
                                        <li><span className="font-semibold text-white">Radiation Biology:</span> DNA damage/repair dynamics and shielding approaches under lunar surface radiation and SPEs.</li>
                                        <li><span className="font-semibold text-white">Dust Toxicology:</span> Ultra-fine dust impacts on lungs, eyes, skin; filtration and adhesion control for suits and habitats.</li>
                                        <li><span className="font-semibold text-white">Human Physiology (1/6 g):</span> Locomotion, cardiovascular load, bone remodeling, fluid shifts, and circadian adaptation in partial gravity.</li>
                                        <li><span className="font-semibold text-white">ISRU & Life Support:</span> Regolith-based materials, oxygen extraction, and polar ice utilization for water and propellant.</li>
                                        <li><span className="font-semibold text-white">Polar Volatiles:</span> Prospecting permanently shadowed regions; cold-trap chemistry relevant to fuel and life support.</li>
                                        <li><span className="font-semibold text-white">Biocontainment:</span> Preventing forward/back contamination during sample return and in-situ biology experiments.</li>
                                    </ul>
                                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-200">
                                            <h3 className="text-white font-semibold mb-2">Artemis Science Objectives</h3>
                                            <p>Surface ops validating habitat systems, EVA biomedical monitoring, and long-duration partial gravity studies.</p>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-200">
                                            <h3 className="text-white font-semibold mb-2">Lunar Analog Research</h3>
                                            <p>Antarctic stations and volcanic fields simulate isolation, dust, and cold for testing life support and biology payloads.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
        </div>
    );
}