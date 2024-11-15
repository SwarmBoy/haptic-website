// Actuator.js
import { Sphere } from '@react-three/drei';
import React, { useState, useEffect, useRef, useContext, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { PlaneContext } from '../App'; // Adjust the import path as needed
import { all } from 'three/webgpu';

const Actuator = (props, ref) => {
  const { position, adresse, channel } = props;
  const ANIMATION_DURATION = 0.35;
  const [status, setStatus] = useState('idle');
  const materialRef = useRef();
  const meshRef = useRef();
  const planeData = useContext(PlaneContext);

  useFrame(() => {
    if (planeData && meshRef.current) {
      // Create a plane from the plane data
      const plane = new THREE.Plane();
      plane.setFromNormalAndCoplanarPoint(
        new THREE.Vector3(...planeData.planeData.normal),
        new THREE.Vector3(...planeData.planeData.position)
      );

      // Get the actuator's world position
      const actuatorPosition = meshRef.current.getWorldPosition(new THREE.Vector3());

      // Calculate the distance from the plane to the actuator
      const distance = plane.distanceToPoint(actuatorPosition);

      // If the distance is less than or equal to the actuator's radius, they intersect
      const radius = 0.05; // Actuator sphere radius
      if (Math.abs(distance) <= radius && status === 'idle') {  
        setStatus('active');
            // Call the launchModel function from HapticsTest
        if (planeData.launchModel) {
          planeData.launchModel(adresse);
        }
      }
    }
  });

  const handleClick = () => {
    if (status !== 'clicked') {
      setStatus('clicked');
    }


  };

  const addToAllActuators = () => {
    const allActuators = planeData.allActuators;
    //check if the actuator is already in the list
    if (!allActuators.includes(meshRef.current)) {
      allActuators.push(meshRef.current);
      planeData.setAllActuators(allActuators);
    }else{
      console.log('Actuator already in the list');
    }
  };


  useEffect(() => {
    if (status === 'active') {
      // Start the animation from red to green
      gsap.fromTo(
        materialRef.current.color,
        { r: 1, g: 0, b: 0 },
        {
          r: 0,
          g: 1,
          b: 0,
          duration: ANIMATION_DURATION,
          onComplete: () => {
            setStatus('idle');
          },
        }
      );
    } else if (status === 'clicked') {
      // Set color to red immediately
      materialRef.current.color.set('red');
      // Optionally, you can start an animation from red to green
      
    } else if (status === 'idle') {
      // Reset color to grey
      materialRef.current.color.set('grey');
      if (adresse!=null && channel!=null) {
        console.log('Sending command to server:', adresse, channel);
        // Send the command to the server
        materialRef.current.color.set('pink');
      }
    }

    addToAllActuators();
  }, [status]);

  useEffect(() => {
    if (planeData.isPlaneMoving) {
      setStatus('idle');
    }
    
  }, [planeData.isPlaneMoving]);


  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.setStatus = setStatus;
      meshRef.current.userData.getStatus = () => status;
      meshRef.current.userData.getAdresse = () => adresse;
      meshRef.current.userData.getChannel = () => channel;
    }
  }, [status]);
  // Expose setStatus method to parent components
  React.useImperativeHandle(ref, () => ({
    setStatus: (newStatus) => setStatus(newStatus),
  }));

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <Sphere args={[0.05, 16, 16]}>
        <meshStandardMaterial ref={materialRef} color="grey" />
      </Sphere>
    </mesh>
  );
}

export default forwardRef(Actuator); // Ensure forwardRef wraps the Actuator correctly
