'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural Cedar Branch matching the requested styling:
 * - Pure R3F and Three primitives
 * - Material: Brushed Gold (matte gold)
 * - Kinetic Parallax: Driven explicitly by cursor
 */
function ProceduralBranch() {
  const groupRef = useRef<THREE.Group>(null);

  const branchObj = useMemo(() => {
    const materials = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Matte Gold Base
      roughness: 0.35, // Brushed / Satin feel
      metalness: 0.9,  // Highly metallic
    });

    const group = new THREE.Group();

    // 1. Trunk (Curved Tube)
    class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
      scale: number;
      constructor(scale = 1.2) {
        super();
        this.scale = scale;
      }
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const tx = Math.sin(t * Math.PI) * 0.4;
        const ty = (t * 2.5) - 1.25;
        const tz = Math.cos(t * Math.PI) * 0.1;
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
      }
    }
    const path = new CustomSinCurve(1.2);
    const trunkGeo = new THREE.TubeGeometry(path, 64, 0.04, 12, false);
    const trunk = new THREE.Mesh(trunkGeo, materials);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // 2. Needles (Scattered Cones for a fuller, richer look)
    const needleCount = 120;
    const needleGeo = new THREE.ConeGeometry(0.015, 0.35, 5);
    needleGeo.translate(0, 0.175, 0); // Pivot at the base
    
    for (let i = 0; i < needleCount; i++) {
        const t = i / needleCount;
        if (t < 0.05 || t > 0.95) continue;
        const point = path.getPoint(t);
        
        // Calculate tangent to point needles outwards along the curve
        const tangent = path.getTangent(t);
        
        const needle = new THREE.Mesh(needleGeo, materials);
        needle.position.copy(point);
        
        // Create an elegant spiral cluster effect
        const angle = i * Math.PI * 0.77; // Golden ratio-ish spiral
        const spread = (Math.PI / 2.5); // How far they point out
        
        // Point along normal and rotate
        needle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        needle.rotateX(spread * Math.sin(angle));
        needle.rotateZ(spread * Math.cos(angle));

        needle.castShadow = true;
        group.add(needle);
    }

    // 3. Pinecones (Clusters of small scales simulated by squeezed spheres)
    const coneCount = 5; // A few premium pinecones
    const pineconeGeo = new THREE.SphereGeometry(0.04, 8, 8);
    pineconeGeo.scale(1, 1.8, 1); // Make it oblong like an elegant pinecone
    
    // Slightly different material for cones - perhaps darker bronze
    const coneMaterial = new THREE.MeshStandardMaterial({
        color: 0x8c6a49, // Darker bronze
        roughness: 0.6,
        metalness: 0.8,
    });

    for (let c = 0; c < coneCount; c++) {
        // Place cones sporadically in the middle-lower section
        const t = 0.2 + (c * 0.15) + (Math.random() * 0.05); 
        if (t > 0.8) continue;
        
        const point = path.getPoint(t);
        const tangent = path.getTangent(t);
        
        const pinecone = new THREE.Mesh(pineconeGeo, coneMaterial);
        
        // Offset pinecone slightly from the main trunk so it "hangs"
        const offsetAxis = new THREE.Vector3(1, 0, 0).cross(tangent).normalize();
        pinecone.position.copy(point).add(offsetAxis.multiplyScalar(0.06));
        
        pinecone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        // Tilt the cone down to hang naturally
        pinecone.rotateX(Math.PI / 3);
        
        pinecone.castShadow = true;
        group.add(pinecone);
    }
    
    // 4. Secondary Branch (Intersecting)
    class SecondaryCurve extends THREE.Curve<THREE.Vector3> {
      scale: number;
      constructor(scale = 0.8) {
        super();
        this.scale = scale;
      }
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const tx = Math.sin(t * Math.PI) * 0.5 + 0.2; // Offset
        const ty = (t * 2.0) - 1.0; 
        const tz = Math.cos(t * Math.PI) * 0.3 - 0.2;
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
      }
    }
    const path2 = new SecondaryCurve(1.0);
    const trunk2Geo = new THREE.TubeGeometry(path2, 40, 0.03, 8, false);
    const trunk2 = new THREE.Mesh(trunk2Geo, materials);
    trunk2.castShadow = true;
    
    // Position the secondary branch so it intersects the main one
    trunk2.position.set(-0.3, -0.2, 0.1);
    trunk2.rotation.z = Math.PI / 6;
    trunk2.rotation.y = -Math.PI / 8;
    group.add(trunk2);
    
    // Add needles to secondary branch
    for (let i = 0; i < 60; i++) {
        const t = i / 60;
        if (t < 0.1 || t > 0.9) continue;
        const point = path2.getPoint(t);
        const tangent = path2.getTangent(t);
        const needle = new THREE.Mesh(needleGeo, materials);
        
        needle.position.copy(point);
        
        const angle = i * Math.PI * 0.77; 
        const spread = (Math.PI / 2.5); 
        
        needle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        needle.rotateX(spread * Math.sin(angle));
        needle.rotateZ(spread * Math.cos(angle));
        
        needle.castShadow = true;
        trunk2.add(needle);
    }
    
    // Initial Base Rotation for visual elegance inside its local group
    group.rotation.z = -Math.PI / 4; // Tilt it a bit more
    group.rotation.x = Math.PI / 10;
    return group;
  }, []);

  const parallaxGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (parallaxGroupRef.current) {
      // Kinetic Parallax: Movement tied strictly to cursor position
      // target is small so it feels subtle and weighty
      const targetX = state.pointer.x * 0.3;
      const targetY = state.pointer.y * 0.3;
      
      parallaxGroupRef.current.rotation.y += (targetX - parallaxGroupRef.current.rotation.y) * 0.05;
      parallaxGroupRef.current.rotation.x += (-targetY - parallaxGroupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={parallaxGroupRef}>
      <primitive object={branchObj} />
    </group>
  );
}

export function PremiumLogo3D() {
  return (
    <div className="relative flex flex-col items-center justify-center cursor-crosshair group mt-8 sm:mt-12 mb-8">
      {/* 3D Canvas Container */}
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 z-10 drop-shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-transform duration-1000 ease-out group-hover:scale-[1.05]">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          {/* Preset 'city' provides high-end studio-like reflections on gold */}
          <Environment preset="city" />
          <directionalLight position={[5, 10, 8]} intensity={2.0} color="#ffffff" castShadow />
          <directionalLight position={[-5, -10, 5]} intensity={1.5} color="#d4af37" />
          <directionalLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />
          
          <ProceduralBranch />
        </Canvas>
      </div>

      {/* Main Company Title */}
      <div className="relative z-10 text-center transition-transform duration-700 ease-out group-hover:scale-[1.02] py-4">
        <h1 
          className="flex flex-col items-center font-black uppercase font-serif"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          <span className="text-xl md:text-2xl text-[#c19b76] tracking-[0.4em] md:tracking-[0.6em] mb-4 drop-shadow-md">ООО ПИФ</span>
          <span className="text-5xl md:text-7xl lg:text-8xl text-hover-shimmer tracking-[0.05em] md:tracking-[0.1em] leading-normal pb-4">
            Возрождение
          </span>
        </h1>
      </div>
    </div>
  );
}
