// MovingPlane.js
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function MovingPlane({ theta, phi, speed, setPlaneData }) {
  const planeRef = useRef();
  const arrowRef = useRef();
  const timeRef = useRef(0);

  const { scene } = useThree();

  // Convert angles from degrees to radians
  const thetaRad = THREE.MathUtils.degToRad(theta);
  const phiRad = THREE.MathUtils.degToRad(phi);

  // Direction vector
  const direction = new THREE.Vector3(
    Math.sin(phiRad) * Math.cos(thetaRad),
    Math.cos(phiRad),
    Math.sin(phiRad) * Math.sin(thetaRad)
  ).normalize();

  // Initial position
  const initialPosition = direction.clone().multiplyScalar(-10);

  useEffect(() => {
    // Create an ArrowHelper
    const arrowHelper = new THREE.ArrowHelper(
      direction,
      initialPosition,
      2,          // Length of the arrow
      0xff0000    // Color of the arrow (red)
    );
    scene.add(arrowHelper);
    arrowRef.current = arrowHelper;

    // Cleanup on unmount
    return () => {
      scene.remove(arrowHelper);
    };
  }, [direction, initialPosition, scene]);

  useFrame((state, delta) => {
    timeRef.current += delta * speed;

    const currentPosition = initialPosition.clone().addScaledVector(direction, timeRef.current);

    if (planeRef.current) {
      planeRef.current.position.copy(currentPosition);

      // Update plane orientation
      planeRef.current.lookAt(
        currentPosition.x + direction.x,
        currentPosition.y + direction.y,
        currentPosition.z + direction.z
      );
    }

    // Update the plane data in the context
    setPlaneData({
      position: [currentPosition.x, currentPosition.y, currentPosition.z],
      normal: [direction.x, direction.y, direction.z],
    });

    // Update arrow position
    if (arrowRef.current) {
      arrowRef.current.position.copy(currentPosition);
      arrowRef.current.setDirection(direction);
    }
  });

  return (
    <mesh ref={planeRef}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial color="yellow" side={THREE.DoubleSide} transparent opacity={0.3} />
    </mesh>
  );
}

export default MovingPlane;
