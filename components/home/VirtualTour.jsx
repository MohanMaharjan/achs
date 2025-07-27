'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Home, Building, DoorOpen, BookOpen, FlaskConical } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Sample scenes data with panorama images
const scenes = {
  'campus': {
    name: 'Campus Overview',
    panorama: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80',
  },
  'main-building': {
    name: 'Main Building',
    panorama: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80',
  },
  'classroom': {
    name: 'Classroom',
    panorama: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80',
  },
  'library': {
    name: 'Library',
    panorama: 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80',
  },
  'lab': {
    name: 'Science Lab',
    panorama: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80',
  }
};

export default function VirtualTour() {
  const mountRef = useRef(null);
  const [currentScene, setCurrentScene] = useState('campus');
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs to maintain Three.js objects
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    // Initialize Three.js
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Set camera position
    cameraRef.current.position.z = 0.1;

    // Add controls
    const controls = new OrbitControls(cameraRef.current, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Load initial scene
    loadPanorama(scenes[currentScene].panorama);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      if (meshRef.current) {
        meshRef.current.material.dispose();
        meshRef.current.geometry.dispose();
      }
    };
  }, []);

  const loadPanorama = (panoramaUrl) => {
    setIsLoading(true);
    
    // Remove previous mesh if exists
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.material.dispose();
      meshRef.current.geometry.dispose();
    }

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      panoramaUrl,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        meshRef.current = mesh;
        sceneRef.current.add(mesh);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
        setIsLoading(false);
      }
    );
  };

  const navigateTo = (scene) => {
    setCurrentScene(scene);
    loadPanorama(scenes[scene].panorama);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50 gap-2 p-4 bg-black/50 rounded-lg mx-auto w-max">
        {Object.keys(scenes).map((sceneKey) => (
          <button
            key={sceneKey}
            onClick={() => navigateTo(sceneKey)}
            className={`flex flex-col items-center p-3 rounded-lg transition ${
              currentScene === sceneKey
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={scenes[sceneKey].name}
          >
            {sceneKey === 'campus' && <Home size={20} />}
            {sceneKey === 'main-building' && <Building size={20} />}
            {sceneKey === 'classroom' && <DoorOpen size={20} />}
            {sceneKey === 'library' && <BookOpen size={20} />}
            {sceneKey === 'lab' && <FlaskConical size={20} />}
            <span className="text-xs mt-1">{scenes[sceneKey].name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Scene container */}
      <div ref={mountRef} className="flex-1" />
    </div>
  );
}