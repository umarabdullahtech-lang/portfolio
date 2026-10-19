"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import sceneStyles from "./AsciiSpatialScene.module.css";

type AsciiSpatialSceneProps = {
  className?: string;
};

const ASCII_RAMP = " .,:;irsXA253hMHGS#9B&@";
const ASCII_FALLBACK = [
  "                         o",
  "                 .-============-.",
  "            .-+*#@@@@@@@@@@@@@@@@#*+-.",
  "         .=#@@@#*+=--::::::::--=+*#@@@#=.",
  "       .*@@#+-.                      .-+#@@*.",
  "      +@@*:           .-++++-.           :*@@+",
  "  x  #@@-         .=#@@@@@@@@#=.         -@@#",
  "    :@@#         +@@#+=----=+#@@+         #@@:",
  "     #@@-         '=#@@@@@@@@#='         -@@#   o",
  "      +@@*:           '-====-'           :*@@+",
  "       .*@@#+-.                      .-+#@@*.",
  "         '=#@@@#*+=--::::::::--=+*#@@@#='",
  "            '-+*#@@@@@@@@@@@@@@@@#*+-'",
  "                 '-============-'",
  "                         x",
].join("\n");

export default function AsciiSpatialScene({ className }: AsciiSpatialSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 640px)");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 100);
    camera.position.set(0, 0.05, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const effect = new AsciiEffect(renderer, ASCII_RAMP, {
      resolution: compact.matches ? 0.105 : 0.135,
      scale: 1,
      color: false,
      alpha: true,
    });
    const effectElement = effect.domElement;
    effectElement.setAttribute("aria-hidden", "true");
    effectElement.style.position = "absolute";
    effectElement.style.inset = "0";
    effectElement.style.overflow = "hidden";
    effectElement.style.color = "#d8ff3e";
    effectElement.style.background = "transparent";
    effectElement.style.pointerEvents = "none";
    effectElement.style.textShadow = "0 0 10px rgba(216,255,62,.22)";
    mount.appendChild(effectElement);

    const topology = new THREE.Group();
    topology.rotation.set(0.18, -0.36, -0.11);
    scene.add(topology);

    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x8f8f8f,
      emissive: 0x090909,
      flatShading: true,
      shininess: 88,
      specular: 0xffffff,
    });
    const core = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.28, 0.34, 128, 16, 2, 3),
      coreMaterial
    );
    topology.add(core);

    const topologyCage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.12, 2),
      new THREE.MeshBasicMaterial({
        color: 0x090909,
        wireframe: true,
        transparent: true,
        opacity: 0.88,
      })
    );
    topology.add(topologyCage);

    const meridian = new THREE.Mesh(
      new THREE.TorusGeometry(2.72, 0.028, 6, 144),
      new THREE.MeshBasicMaterial({ color: 0x111111 })
    );
    meridian.rotation.set(Math.PI / 2.35, 0.2, -0.15);
    topology.add(meridian);

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(3.05, 0.022, 6, 144),
      new THREE.MeshBasicMaterial({ color: 0x171717 })
    );
    orbit.rotation.set(Math.PI / 3.1, 0.65, Math.PI / 2.1);
    topology.add(orbit);

    const satelliteGroup = new THREE.Group();
    const satelliteGeometry = new THREE.OctahedronGeometry(0.115, 0);
    const satelliteMaterial = new THREE.MeshPhongMaterial({
      color: 0x686868,
      flatShading: true,
      shininess: 100,
    });
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2;
      const radius = index % 2 === 0 ? 2.68 : 3.05;
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      satellite.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        Math.sin(angle * 1.6) * 0.72
      );
      satellite.scale.setScalar(index % 3 === 0 ? 1.35 : 0.72);
      satelliteGroup.add(satellite);
    }
    topology.add(satelliteGroup);

    const pointPositions = new Float32Array(64 * 3);
    for (let index = 0; index < 64; index += 1) {
      const radius = 3.5 + ((index * 19) % 47) / 26;
      const angle = index * 2.399963;
      pointPositions[index * 3] = Math.cos(angle) * radius;
      pointPositions[index * 3 + 1] = Math.sin(angle) * radius * 0.6;
      pointPositions[index * 3 + 2] = ((index * 23) % 70) / 18 - 1.95;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({ color: 0x050505, size: 0.055, sizeAttenuation: true })
    );
    topology.add(points);

    scene.add(new THREE.AmbientLight(0xffffff, 0.74));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(4, 4, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xffffff, 18, 14);
    rimLight.position.set(-4, -2, 3);
    scene.add(rimLight);

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    let lastRender = 0;
    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let renderedFrames = 0;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      effect.render(scene, camera);
      renderedFrames += 1;
      if (renderedFrames > 1 || reducedMotion.matches) {
        fallbackRef.current?.classList.add(sceneStyles.fallbackHidden);
      }
    };

    const resize = () => {
      const bounds = mount.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      effect.setSize(width, height);
      renderFrame();
    };

    const handlePointer = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointerX = THREE.MathUtils.clamp(
        ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 2 - 1,
        -1,
        1
      );
      pointerY = THREE.MathUtils.clamp(
        -(((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 2 - 1),
        -1,
        1
      );
    };

    const animate = (time: number) => {
      frame = window.requestAnimationFrame(animate);
      if (width < 2 || height < 2) return;

      smoothX = THREE.MathUtils.lerp(smoothX, pointerX, 0.045);
      smoothY = THREE.MathUtils.lerp(smoothY, pointerY, 0.045);
      const elapsed = clock.getElapsedTime();

      topology.rotation.y = -0.36 + elapsed * 0.09 + smoothX * 0.34;
      topology.rotation.x = 0.18 - smoothY * 0.2;
      core.rotation.x = elapsed * 0.16;
      core.rotation.z = -elapsed * 0.11;
      topologyCage.rotation.y = -elapsed * 0.045;
      topologyCage.rotation.z = elapsed * 0.035;
      meridian.rotation.z = -0.15 + elapsed * 0.025;
      orbit.rotation.y = 0.65 - elapsed * 0.04;
      satelliteGroup.rotation.z = -elapsed * 0.055;

      const targetFps = compact.matches ? 20 : 28;
      if (time - lastRender >= 1000 / targetFps) {
        lastRender = time;
        renderFrame();
      }
    };

    // The loop only runs while the scene is on screen, the tab is visible, and motion
    // is allowed; otherwise the last rendered frame stays as a still image.
    const syncLoop = () => {
      const shouldRun = visible && !document.hidden && !reducedMotion.matches;
      if (shouldRun && !running) {
        running = true;
        frame = window.requestAnimationFrame(animate);
      } else if (!shouldRun && running) {
        running = false;
        window.cancelAnimationFrame(frame);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncLoop();
    });
    visibility.observe(mount);
    document.addEventListener("visibilitychange", syncLoop);
    reducedMotion.addEventListener("change", syncLoop);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    resize();
    syncLoop();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("visibilitychange", syncLoop);
      reducedMotion.removeEventListener("change", syncLoop);
      visibility.disconnect();
      observer.disconnect();
      if (effectElement.parentElement === mount) mount.removeChild(effectElement);

      core.geometry.dispose();
      coreMaterial.dispose();
      topologyCage.geometry.dispose();
      (topologyCage.material as THREE.Material).dispose();
      meridian.geometry.dispose();
      (meridian.material as THREE.Material).dispose();
      orbit.geometry.dispose();
      (orbit.material as THREE.Material).dispose();
      satelliteGeometry.dispose();
      satelliteMaterial.dispose();
      pointGeometry.dispose();
      (points.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`${sceneStyles.root}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <pre ref={fallbackRef} className={sceneStyles.fallback}>{ASCII_FALLBACK}</pre>
    </div>
  );
}
