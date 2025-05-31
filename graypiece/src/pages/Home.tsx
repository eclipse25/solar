import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Moon from '../components/Moon';
import * as THREE from 'three';

export default function Home() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const controlsRef = useRef<any>(null);

  const CameraTracker = () => {
    const { camera } = useThree();

    useFrame(() => {
      if (!controlsRef.current || isUserEditing) return;

      const azimuthalAngle = controlsRef.current.getAzimuthalAngle(); // 좌우
      const polarAngle = controlsRef.current.getPolarAngle(); // 상하

      const longitude = THREE.MathUtils.radToDeg(azimuthalAngle);
      const latitude = 90 - THREE.MathUtils.radToDeg(polarAngle);

      setLat(parseFloat(latitude.toFixed(2)));
      setLng(parseFloat(longitude.toFixed(2)));
    });

    return null;
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* 위도/경도 입력 UI */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1, color: 'white' }}>
        <label>
          위도:
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(Number(e.target.value))}
            onFocus={() => setIsUserEditing(true)}
            onBlur={() => setIsUserEditing(false)}
            style={{
              marginLeft: 5,
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              outline: 'none',
              padding: '2px 6px',
              width: '60px',
            }}
          />
        </label>
        <label>
          경도:
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(Number(e.target.value))}
            onFocus={() => setIsUserEditing(true)}
            onBlur={() => setIsUserEditing(false)}
            style={{
              marginLeft: 5,
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              outline: 'none',
              padding: '2px 6px',
              width: '60px',
            }}
          />
        </label>
      </div>

      {/* 3D 캔버스 */}
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ background: 'black' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <Moon lat={lat} lng={lng} />
        <OrbitControls ref={controlsRef} enableZoom />
        <CameraTracker />
      </Canvas>
    </div>
  );
}
