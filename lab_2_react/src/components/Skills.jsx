import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function SkillOrb({ label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(80, 80, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.z = 3;

    const geo = new THREE.IcosahedronGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const innerGeo = new THREE.SphereGeometry(0.85, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xdbeafe,
      transparent: true,
      opacity: 0.15,
    });
    scene.add(new THREE.Mesh(innerGeo, innerMat));

    let hovered = false;
    canvas.addEventListener('mouseenter', () => { hovered = true; });
    canvas.addEventListener('mouseleave', () => { hovered = false; });

    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const speed = hovered ? 0.03 : 0.008;
      mesh.rotation.y += speed;
      mesh.rotation.x += speed * 0.5;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 group cursor-default select-none">
      <canvas
        ref={canvasRef}
        width={80}
        height={80}
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight max-w-[80px]">
        {label}
      </span>
    </div>
  );
}

export default function Skills() {
  const skills = ['SQL', 'OSINT', 'Google Sheets', 'Excel', 'Командна робота', 'Англійська B1'];

  return (
    <section className="bg-white dark:bg-slate-800 border-l-4 border-blue-600 p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-blue-600 dark:text-blue-400 font-bold uppercase mb-6">
        Навички
      </h2>
      <div className="flex flex-wrap gap-6 justify-start">
        {skills.map(skill => (
          <SkillOrb key={skill} label={skill} />
        ))}
      </div>
    </section>
  );
}