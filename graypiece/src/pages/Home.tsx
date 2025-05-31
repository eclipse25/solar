import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, TrackballControls } from '@react-three/drei';
import * as THREE from 'three';
import Moon from '../components/Moon';
import SendModal from '../components/SendModal';

export default function Home() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [targetLat, setTargetLat] = useState<number | null>(null);
  const [targetLng, setTargetLng] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);

  const CameraTracker = () => {
    const animationStartTime = useRef<number | null>(null);
    const startPos = useRef<THREE.Vector3>(new THREE.Vector3());
    const targetPos = useRef<THREE.Vector3>(new THREE.Vector3());
    const [animationLatLngSet, setAnimationLatLngSet] = useState(false);
  
    useFrame(({ clock }) => {
      const controls = controlsRef.current;
      const camera = cameraRef.current;
      if (!controls || !camera) return;
  
      if (isAnimating && targetLat !== null && targetLng !== null) {
        const now = clock.getElapsedTime() * 1000;
        const duration = 2000;
  
        if (animationStartTime.current === null) {
          animationStartTime.current = now;
          startPos.current = camera.position.clone();
  
          const radius = camera.position.length();
          const phi = THREE.MathUtils.degToRad(90 - targetLat);
          const theta = THREE.MathUtils.degToRad(targetLng);
          const sphericalTarget = new THREE.Spherical(radius, phi, theta);
          targetPos.current.setFromSpherical(sphericalTarget);
  
          // 숫자는 애니메이션 시작 순간에 고정
          setLat(Number(targetLat.toFixed(10)));
          setLng(Number(targetLng.toFixed(10)));
          setAnimationLatLngSet(true);
        }
  
        const elapsed = now - animationStartTime.current;
        const t = Math.min(elapsed / duration, 1);
        const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  
        camera.position.lerpVectors(startPos.current, targetPos.current, easedT);
        camera.lookAt(0, 0, 0);
        controls.update();
  
        // 종료 조건: 99% 이상 도달하면 자연스럽게 멈춤
        if (t >= 1 || camera.position.distanceTo(targetPos.current) < 0.000000001) {
          setIsAnimating(false);
          setTargetLat(null);
          setTargetLng(null);
          animationStartTime.current = null;
          setAnimationLatLngSet(false);
        }
      }
  
      // 유저 조작 중이 아니고, 애니메이션도 아닐 때만 실시간 위치 기록
      else if (!isUserEditing && !isAnimating && !animationLatLngSet) {
        const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().normalize());
        const currentLat = 90 - THREE.MathUtils.radToDeg(spherical.phi);
        const currentLng = THREE.MathUtils.radToDeg(spherical.theta);
  
        setLat(Number(currentLat.toFixed(10)));
        setLng(Number(currentLng.toFixed(10)));
      }
    });
  
    return null;
  };
  
  

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* 좌표 입력 */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 2, color: 'white' }}>
        <label>
          Latitude:
          <input
            type="number"
            value={lat}
            step="0.0000000001"
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) setLat(Number(val.toFixed(10)));
            }}
            onFocus={() => setIsUserEditing(true)}
            onBlur={() => setIsUserEditing(false)}
            style={{
              marginLeft: 5,
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              outline: 'none',
              padding: '2px 6px',
              width: '120px',
            }}
          />
        </label>
        <label>
          Longitude:
          <input
            type="number"
            value={lng}
            step="0.0000000001"
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) setLng(Number(val.toFixed(10)));
            }}
            onFocus={() => setIsUserEditing(true)}
            onBlur={() => setIsUserEditing(false)}
            style={{
              marginLeft: 5,
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              outline: 'none',
              padding: '2px 6px',
              width: '120px',
            }}
          />
        </label>
      </div>

      {/* Send 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 2,
          background: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Send
      </button>

      {/* 메시지 입력 모달 */}
      {showModal && (
        <SendModal
          onClose={() => setShowModal(false)}
          onSend={(data) => {
            setTargetLat(data.lat);
            setTargetLng(data.lng);
            setIsAnimating(true);
          }}
        />
      )}

      {/* 캔버스 */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'black' }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <Moon lat={lat} lng={lng} />
        <TrackballControls ref={controlsRef} />
        <CameraTracker />
      </Canvas>
    </div>
  );
}
