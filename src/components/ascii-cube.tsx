"use client";

import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/components/github-icon';
import { Play, Pause } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const AsciiCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const stateRef = useRef({
    rotating: false,
    lastX: 0,
    lastY: 0,
    velX: 0,
    velY: 0,
    keyboardRotation: { x: 0, y: 0 },
    autoRotate: true,
  });

  useEffect(() => {
    stateRef.current.autoRotate = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    const effect = new AsciiEffect(renderer, ' .:-+*=#%@', { invert: true });
    effect.domElement.className = 'ascii-output';
    effect.domElement.style.outline = 'none';
    effect.domElement.style.cursor = 'grab';
    effect.domElement.style.userSelect = 'none';
    effect.domElement.style.touchAction = 'none';
    effect.domElement.tabIndex = 0;
    container.appendChild(effect.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemi.position.set(0, 1, 0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(3, 3, 3);
    scene.add(dir);

    const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.6,
      metalness: 0.0,
      color: 0xffffff,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const invertTexture = (url: string): Promise<THREE.Texture> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }
          ctx.putImageData(imgData, 0, 0);
          const tex = new THREE.Texture(canvas);
          tex.needsUpdate = true;
          resolve(tex);
        };
        img.onerror = (err) => reject(err);
        img.src = url;
      });
    };

    const githubLogo = PlaceHolderImages.find(img => img.id === 'github-logo');
    if (githubLogo?.imageUrl) {
        invertTexture(githubLogo.imageUrl).then((tex) => {
          material.map = tex;
          material.needsUpdate = true;
        }).catch(console.error);
    }
    
    const handlePointerDown = (e: PointerEvent) => {
      stateRef.current.rotating = true;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
      effect.domElement.setPointerCapture(e.pointerId);
      effect.domElement.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current.rotating) return;
      const dx = (e.clientX - stateRef.current.lastX) / 200;
      const dy = (e.clientY - stateRef.current.lastY) / 200;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
      stateRef.current.velY = dx;
      stateRef.current.velX = dy;
    };

    const handlePointerUp = (e: PointerEvent) => {
      stateRef.current.rotating = false;
      try {
        effect.domElement.releasePointerCapture(e.pointerId);
      } catch (error) {}
      effect.domElement.style.cursor = 'grab';
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.0015;
      camera.position.z = Math.max(1.5, Math.min(10, camera.position.z));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const step = 0.06;
        if (e.key === 'ArrowLeft') stateRef.current.keyboardRotation.y = -step;
        if (e.key === 'ArrowRight') stateRef.current.keyboardRotation.y = step;
        if (e.key === 'ArrowUp') stateRef.current.keyboardRotation.x = -step;
        if (e.key === 'ArrowDown') stateRef.current.keyboardRotation.x = step;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            stateRef.current.keyboardRotation.x = 0;
            stateRef.current.keyboardRotation.y = 0;
        }
    };

    effect.domElement.addEventListener('pointerdown', handlePointerDown);
    effect.domElement.addEventListener('pointermove', handlePointerMove);
    effect.domElement.addEventListener('pointerup', handlePointerUp);
    effect.domElement.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const onWindowResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      effect.setSize(w, h);
    };
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
    
    const clock = new THREE.Clock();
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      
      let autoRotX = 0;
      let autoRotY = 0;

      if(stateRef.current.autoRotate) {
        autoRotX = 0.2 * dt;
        autoRotY = 0.35 * dt;
      }
      
      cube.rotation.x += autoRotX + (stateRef.current.keyboardRotation.x + stateRef.current.velX) * dt * 10;
      cube.rotation.y += autoRotY + (stateRef.current.keyboardRotation.y + stateRef.current.velY) * dt * 10;
      
      const damping = 0.9;
      stateRef.current.velX *= damping;
      stateRef.current.velY *= damping;
      
      effect.render(scene, camera);
    };
    animate();

    effect.domElement.focus();
    
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (container.contains(effect.domElement)) {
        container.removeChild(effect.domElement);
      }
      cancelAnimationFrame(animationFrameId);
      
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute bottom-5 left-5 z-10">
        <Button 
          variant="ghost" 
          className="font-body tracking-widest text-foreground hover:bg-transparent hover:text-white"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </Button>
      </div>
      <div className="absolute top-5 right-5 z-10">
        <a href="https://github.com/firebase/genkit-patterns/tree/main/apps/ascii-art-cube" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <GithubIcon />
          </Button>
        </a>
      </div>
    </>
  );
};

export default AsciiCube;
