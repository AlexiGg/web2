import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DataGlobe() {

  // посилання на canvas
  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    // рендерер
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);

    // сцена
    const scene = new THREE.Scene();

    // камера
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 4;

    // глобус
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      })
    );
    scene.add(globe);

    // внутрішня сфера
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.38, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x1e40af,
        transparent: true,
        opacity: 0.08
      })
    ));

    // точки на сфері
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

    scene.add(new THREE.Points(
      dotGeo,
      new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.06
      })
    ));

    // кільця
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.005, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.5 })
    );
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    const ring2 = ring.clone();
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // супутник
    const satellite = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.08),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    );
    scene.add(satellite);

    // resize
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

    // миша
    const state = { dragging: false, lastX: 0, lastY: 0, velX: 0, velY: 0 };

    const onDown = e => {
      state.dragging = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
    };

    const onUp = () => state.dragging = false;

    const onMove = e => {
      if (!state.dragging) return;
      state.velX = (e.clientX - state.lastX) * 0.005;
      state.velY = (e.clientY - state.lastY) * 0.005;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
    };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);

    // анімація
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

      // рух кілець
      ring.rotation.z  += 0.004;
      ring2.rotation.z -= 0.003;

      // орбіта супутника
      satellite.position.x = Math.cos(t * 0.8) * 1.9;
      satellite.position.y = Math.sin(t * 0.8) * 0.9;
      satellite.position.z = Math.sin(t * 0.8) * 1.2;

      renderer.render(scene, camera);
    };

    animate();

    // cleanup
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
    <div className="relative ...">

      {/* canvas для 3D */}
      <canvas ref={canvasRef} />

      {/* текст */}
      <div>
        <h3>Аналіз даних</h3>
      </div>
    </div>
  );
}