"use client";

import { Edges } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// 12 unique vertices of an icosahedron, normalised to RADIUS.
const PHI = (1 + Math.sqrt(5)) / 2;
const MAG = Math.sqrt(1 + PHI * PHI);
const RADIUS = 2.2;
const K = RADIUS / MAG;

const VERTICES: [number, number, number][] = (
  [
    [-1, PHI, 0],
    [1, PHI, 0],
    [-1, -PHI, 0],
    [1, -PHI, 0],
    [0, -1, PHI],
    [0, 1, PHI],
    [0, -1, -PHI],
    [0, 1, -PHI],
    [PHI, 0, -1],
    [PHI, 0, 1],
    [-PHI, 0, -1],
    [-PHI, 0, 1],
  ] as [number, number, number][]
).map(([x, y, z]) => [x * K, y * K, z * K]);

function Icosahedron() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Continuous slow Y rotation
    groupRef.current.rotation.y += delta * 0.08;
    // Subtle X tilt that follows mouse Y, eased in
    const targetX = state.mouse.y * 0.15;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.04;
    // Subtle Z drift on mouse X
    const targetZ = state.mouse.x * 0.08;
    groupRef.current.rotation.z +=
      (targetZ - groupRef.current.rotation.z) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Inner solid — very translucent, gives the wireframe depth */}
      <mesh>
        <icosahedronGeometry args={[RADIUS, 0]} />
        <meshStandardMaterial
          color="#0e2e32"
          metalness={0.4}
          roughness={0.35}
          transparent
          opacity={0.55}
        />
        <Edges color="#00e5c9" threshold={1} />
      </mesh>

      {/* Outer larger wireframe — adds layered depth */}
      <mesh scale={1.45} rotation={[0.4, 0.6, 0]}>
        <icosahedronGeometry args={[RADIUS, 0]} />
        <meshBasicMaterial
          color="#00e5c9"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
        <Edges color="#00e5c9" threshold={1} />
      </mesh>

      {/* Glowing vertex spheres */}
      {VERTICES.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial
              color="#00e5c9"
              emissive="#00e5c9"
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
          {/* Soft halo to fake a bloom */}
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial
              color="#00e5c9"
              transparent
              opacity={0.12}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} intensity={1.4} color="#00e5c9" />
      <pointLight position={[-5, -3, -2]} intensity={0.8} color="#5eead4" />
      <Icosahedron />
    </Canvas>
  );
}
