"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

// Off-screen canvases stop rendering continuously; R3F draws again when they return.
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

function SpatialCore({ reduced }: { reduced: boolean }) {
  const assembly = useRef<THREE.Group>(null);
  const innerCore = useRef<THREE.Mesh>(null);
  const outerRing = useRef<THREE.Mesh>(null);
  const satelliteRing = useRef<THREE.Group>(null);

  const satellites = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const radius = index % 2 === 0 ? 2.6 : 3.2;
        return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.48, Math.sin(angle * 1.7) * 0.7] as const;
      }),
    []
  );

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(90 * 3);
    for (let index = 0; index < 90; index += 1) {
      const radius = 4 + ((index * 17) % 100) / 30;
      const angle = index * 2.399963;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(angle) * radius * 0.65;
      positions[index * 3 + 2] = ((index * 29) % 100) / 20 - 2.5;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!assembly.current || reduced) return;
    const damping = 1 - Math.pow(0.002, delta);
    assembly.current.rotation.y = THREE.MathUtils.lerp(
      assembly.current.rotation.y,
      state.pointer.x * 0.3 + state.clock.elapsedTime * 0.06,
      damping * 0.12
    );
    assembly.current.rotation.x = THREE.MathUtils.lerp(
      assembly.current.rotation.x,
      -state.pointer.y * 0.18,
      damping * 0.12
    );
    if (innerCore.current) {
      innerCore.current.rotation.x += delta * 0.16;
      innerCore.current.rotation.z -= delta * 0.11;
    }
    if (outerRing.current) outerRing.current.rotation.z += delta * 0.07;
    if (satelliteRing.current) satelliteRing.current.rotation.z -= delta * 0.035;
  });

  return (
    <group ref={assembly} rotation={[0.18, -0.35, -0.12]}>
      <mesh ref={innerCore}>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshStandardMaterial color="#0b0d12" metalness={0.9} roughness={0.2} emissive="#342778" emissiveIntensity={0.45} />
      </mesh>
      <mesh scale={1.035}>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshBasicMaterial color="#d8ff3e" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={outerRing} rotation={[Math.PI / 2.4, 0.2, 0.1]}>
        <torusGeometry args={[2.3, 0.025, 12, 160]} />
        <meshBasicMaterial color="#f6f2e9" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 3.2, 0.5, Math.PI / 2]}>
        <torusGeometry args={[2.75, 0.018, 10, 160]} />
        <meshBasicMaterial color="#8662ff" transparent opacity={0.65} />
      </mesh>
      <group ref={satelliteRing}>
        {satellites.map((position, index) => (
          <mesh key={position.join("-")} position={position} scale={index % 3 === 0 ? 0.12 : 0.07}>
            {index % 3 === 0 ? <octahedronGeometry args={[1, 0]} /> : <sphereGeometry args={[1, 10, 10]} />}
            <meshBasicMaterial color={index % 3 === 0 ? "#d8ff3e" : "#b7a7ff"} />
          </mesh>
        ))}
      </group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#f6f2e9" size={0.025} transparent opacity={0.42} sizeAttenuation />
      </points>
    </group>
  );
}

export default function SpatialScene() {
  const reduced = useReducedMotion();
  const [container, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={container} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 46 }}
        dpr={[1, 1.45]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        frameloop={reduced || !inView ? "demand" : "always"}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 3, 6]} intensity={2.2} color="#f6f2e9" />
        <pointLight position={[-4, -2, 4]} intensity={15} color="#7957ff" distance={12} />
        <pointLight position={[3, 2, 2]} intensity={9} color="#d8ff3e" distance={10} />
        <SpatialCore reduced={reduced} />
      </Canvas>
    </div>
  );
}
