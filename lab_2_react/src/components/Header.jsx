import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Header() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const COUNT = 300;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i] = 0.002 + Math.random() * 0.004;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.07,
      transparent: true,
      opacity: 0.7,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
    });

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    canvas.addEventListener('mousemove', onMove);

    let frame;
    const pos = geo.attributes.position.array;

    const animate = () => {
      frame = requestAnimationFrame(animate);

      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += speeds[i];
        if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
      }
      geo.attributes.position.needsUpdate = true;

      // Плавний поворот за мишкою
      points.rotation.y += (mouse.x * 0.3 - points.rotation.y) * 0.05;
      points.rotation.x += (-mouse.y * 0.15 - points.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <header className="relative bg-blue-600 text-white rounded-2xl shadow-xl overflow-hidden" style={{ minHeight: 220 }}>
      {}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {}
      <div className="relative z-10 p-10 text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight drop-shadow-lg">
          Легенчук Олександр
        </h1>
        <p className="text-lg opacity-90 font-medium drop-shadow">
          м. Львів, Україна | +380 96 910 78 22
        </p>
        <p className="text-sm mt-2 font-mono bg-blue-700/50 py-1 px-3 rounded-full inline-block">
          Data Analyst 
        </p>
      </div>
    </header>
  );
}