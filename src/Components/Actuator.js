import { Sphere, Html } from '@react-three/drei';
import React, { useState, useEffect, useRef, useContext, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { PlaneContext } from '../App';
import ActuatorPlot from './ActuatorPlot'; // Import the plot component
import { deltaTime, pass } from 'three/webgpu';
import { color } from 'chart.js/helpers';


const Actuator = (props, ref) => {
  const { position, scale, adresse, channel } = props;
  const ANIMATION_DURATION = 0.35;
  const [status, setStatus] = useState('idle');
  const materialRef = useRef();
  const meshRef = useRef();
  const planeData = useContext(PlaneContext);
  const [actuatorData, setActuatorData] = useState([]);
  const { camera } = useThree(); // Access the camera
  const [actuatorAmplitude, setActuatorAmplitude] = useState(0);

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
      if (Math.abs(distance) <= radius) {  
        setStatus('active');
            // Call the launchModel function from HapticsTest
        if  (adresse == null || channel == null) {
          return;
        }
        if (planeData.launchModel) {
          planeData.launchModel(adresse);
        }
      }
    }
  });

  useEffect(() => {
    if (planeData && planeData.dataActuators && planeData.dataActuators.commands) {
      const data = planeData.dataActuators.commands.filter(cmd => cmd.addr === adresse);
      setActuatorData(data);
    }
  }, [planeData.dataActuators]);

  const handleClick = () => {
    if (status !== 'clicked') {
      setStatus('clicked');
      console.log(actuatorData);
      if(adresse!=null && channel!=null){
        planeData.addRemoveActuator(adresse, true);
      }
    }

    if (status === 'clicked') {
      setStatus('idle');
      if(adresse!=null && channel!=null){
        planeData.addRemoveActuator(adresse, false);
      }
    }

    addToAllActuators();

  };

  const addToAllActuators = () => {
    const allActuators = planeData.allActuators;
    //check if the actuator is already in the list
    if (!allActuators.includes(meshRef.current)) {
      allActuators.push(meshRef.current);
      planeData.setAllActuators(allActuators);
    }
  };


  useEffect(() => {
    if (status === 'clicked') {
      // Set color to red immediately
      materialRef.current.color.set('red');
      planeData.addRemoveActuator(adresse, true);
      
    } else if (status === 'idle') {
      // Reset color to grey
      planeData.addRemoveActuator(adresse, false);
      materialRef.current.color.set('grey');
      if (adresse!=null && channel!=null) {
        // Send the command to the server
        materialRef.current.color.set('pink');
      }
      setStatus('data');
    } else {
      //create a color going fom grey to green grey is when the actuatorAmplitude is 0 and green when it is 10
      if (actuatorAmplitude > 8) {
          materialRef.current.color.set('red');
      } else if (actuatorAmplitude > 6) {
        materialRef.current.color.set('orange');
      }else if (actuatorAmplitude > 4) {
        materialRef.current.color.set('yellow');
      } else if (actuatorAmplitude > 2) {
        materialRef.current.color.set('green');
      }     
      else {
        if (adresse!=null && channel!=null) {
          //light grey
          materialRef.current.color.set('lightgrey'); 
        }else {
          materialRef.current.color.set('grey');
        }
      }
    }
  }, [status, actuatorAmplitude]);

  useEffect(() => {
    if (planeData.isPlaneMoving) {
      setStatus('idle');
    }
    
  }, [planeData.isPlaneMoving]);

  const calculateOffsetPosition = () => {
    if (meshRef.current) {
      const actuatorWorldPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(actuatorWorldPosition);
      return actuatorWorldPosition;
    }
    return [0, 0, 0];
  };

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.setStatus = setStatus;
      meshRef.current.userData.getStatus = () => status;
      meshRef.current.userData.getAdresse = () => adresse;
      meshRef.current.userData.getChannel = () => channel;
    }
  }, [status]);


  useEffect(() => {
    if (actuatorData.length > 0) {
      const lastData = actuatorData[actuatorData.length - 1];
      const duty = lastData.duty;
      if (duty !== undefined) {
        setActuatorAmplitude(duty);
      }

    }
  }, [actuatorData]);


  return ( 
    <mesh ref={meshRef} position={position} onClick={handleClick}>
    <Sphere args={[0.05, 16, 16]} scale={scale}>
      <meshStandardMaterial ref={materialRef} color="grey" />
    </Sphere>
    {status === 'clicked'  && (
      <Html
        position={calculateOffsetPosition()}
        transform
        occlude
        sprite
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '10px',
            height: '10px',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '1px solid black',
                                          }}>
              <p style={{fontSize: '10px', color: 'black', padding: '5px'}}>
                {adresse}
              </p>
        </div>
      </Html>
    )}
  </mesh>
  );
}

export default forwardRef(Actuator);
