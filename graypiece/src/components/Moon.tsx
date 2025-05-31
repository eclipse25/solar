// src/components/Moon.tsx
import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  lat: number;
  lng: number;
}

export default function Moon({ lat, lng }: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, '/moon.jpg');

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = THREE.MathUtils.degToRad(lng);
      ref.current.rotation.x = THREE.MathUtils.degToRad(lat);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial map={texture} emissive={'white'} emissiveIntensity={0.05}/>
    </mesh>
  );
}
