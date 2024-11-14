// MovingPlane.js
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function MovingPlane({ theta, phi, speed, isPlaneMoving, setPlanMoving, setPlaneData }) {
  const DISTANCEREF = 3;

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
  const initialPosition = direction.clone().multiplyScalar(-DISTANCEREF);

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

  // Reset time when plane stops moving
  useEffect(() => {
    if (!isPlaneMoving) {
      timeRef.current = 0;
    }
    if(timeRef.current > DISTANCEREF){
      timeRef.current = 0;
    }
  }, [isPlaneMoving]);

  useFrame((state, delta) => {
    if (!isPlaneMoving) {
      // If the plane is not moving, position it at the initial position
      if (planeRef.current) {
        planeRef.current.position.copy(initialPosition);
        planeRef.current.lookAt(
          initialPosition.x + direction.x,
          initialPosition.y + direction.y,
          initialPosition.z + direction.z
        );
      }
      // Update plane data in context
      setPlaneData({
        position: [initialPosition.x, initialPosition.y, initialPosition.z],
        normal: [direction.x, direction.y, direction.z],
      });

      // Update arrow position
      if (arrowRef.current) {
        arrowRef.current.position.copy(initialPosition);
        arrowRef.current.setDirection(direction);
      }
      return;
    }
    else{
      timeRef.current += delta * speed;
    } 

    if(timeRef.current > 2*DISTANCEREF){
      timeRef.current = 0;
      setPlanMoving(false);      
    }

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
