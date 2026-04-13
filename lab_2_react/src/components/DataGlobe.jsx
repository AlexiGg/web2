import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DataGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const globeGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    const innerGeo = new THREE.SphereGeometry(1.38, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x1e40af,
      transparent: true,
      opacity: 0.08,
    });
    scene.add(new THREE.Mesh(innerGeo, innerMat));

    const dotCount = 80;
    const dotGeo = new THREE.BufferGeometry();
    const dotPos = new Float32Array(dotCount * 3);

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / dotCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.42;
      dotPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      dotPos[i * 3 + 1] = r * Math.cos(phi);
      dotPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.06,
      transparent: true,
      opacity: 0.9,
    });
    scene.add(new THREE.Points(dotGeo, dotMat));

    const ringGeo = new THREE.TorusGeometry(1.9, 0.005, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    const ring2 = ring.clone();
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    const satGeo = new THREE.OctahedronGeometry(0.08);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const satellite = new THREE.Mesh(satGeo, satMat);
    scene.add(satellite);

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

    const state = { dragging: false, lastX: 0, lastY: 0, velX: 0, velY: 0 };

    const onDown = (e) => { state.dragging = true; state.lastX = e.clientX; state.lastY = e.clientY; };
    const onUp   = ()  => { state.dragging = false; };
    const onMove = (e) => {
      if (!state.dragging) return;
      state.velX = (e.clientX - state.lastX) * 0.005;
      state.velY = (e.clientY - state.lastY) * 0.005;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
    };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);

    let frame;
    let t = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      t += 0.01;

      if (state.dragging) {
        globe.rotation.y += state.velX;
        globe.rotation.x += state.velY;
        state.velX *= 0.9;
        state.velY *= 0.9;
      } else {
        globe.rotation.y += 0.003;
        state.velX *= 0.95;
        state.velY *= 0.95;
      }


      dotGeo.attributes.position.array.set(dotPos);


      ring.rotation.z  += 0.004;
      ring2.rotation.z -= 0.003;


      satellite.position.x = Math.cos(t * 0.8) * 1.9;
      satellite.position.y = Math.sin(t * 0.8) * 0.9;
      satellite.position.z = Math.sin(t * 0.8) * 1.2;
      satellite.rotation.y += 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl shadow-xl overflow-hidden flex items-center"
         style={{ minHeight: 220 }}>

      <canvas
        ref={canvasRef}
        className="absolute right-0 top-0 h-full cursor-grab active:cursor-grabbing"
        style={{ width: '55%' }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />

      <div className="relative z-10 p-8 max-w-xs">
        <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-2">
          Data Analyst
        </p>
        <h3 className="text-white text-2xl font-bold leading-snug mb-3">
          Аналіз даних<br />у глобальному масштабі
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Збір, обробка та візуалізація даних з різних джерел по всьому світу.
        </p>
      </div>
    </div>
  );
}