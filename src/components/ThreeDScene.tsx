'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Environment } from '@react-three/drei';
import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';

function LidarPointCloud() {
  const pointsRef = useRef<THREE.Points>(null);
  const [scrollY, setScrollY] = useState(0);
  
  // Create 10,000 points representing terrain
  const { positions, randoms } = useMemo(() => {
    const count = 15000;
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 35; // Start picking from radius 6 to leave center empty
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Procedural terrain height (gentle rolling hills)
      const y = Math.sin(x * 0.15) * 3 + Math.cos(z * 0.15) * 3 - 5;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      rnd[i] = Math.random();
    }
    return { positions: pos, randoms: rnd };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (window.innerHeight * 2);
      setScrollY(Math.min(Math.max(scrolled, 0), 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Rotation & Pan based on scroll
      pointsRef.current.position.y = THREE.MathUtils.lerp(0, -5, scrollY);
      pointsRef.current.rotation.y += delta * 0.05; // slow pan
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 8, -Math.PI / 3, scrollY);
      
      // Wave effect via cursor
      pointsRef.current.rotation.z = state.pointer.x * 0.1;
    }
  });

  return (
    <group position={[0, -5, -5]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-random"
            count={randoms.length}
            array={randoms}
            itemSize={1}
            args={[randoms, 1]}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.08} 
          color="#8c6a49" // Darker bronze for light background
          transparent 
          opacity={0.6} 
          sizeAttenuation={true} 
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function ThreeDScene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none transition-opacity duration-1000">
      <Canvas 
        camera={{ position: [0, 8, 15], fov: 60 }} 
        dpr={[1, 2]}
      >
        <color attach="background" args={['#f8f6f0']} />
        <fog attach="fog" args={['#f8f6f0', 10, 40]} />
        <ScrollControls pages={3} damping={0.2}>
          <LidarPointCloud />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
