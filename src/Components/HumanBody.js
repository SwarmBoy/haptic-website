import React, { useContext, useEffect, useRef, forwardRef } from 'react';
import BodyPart from './BodyPart';
import Actuator from './Actuator';
import { Sphere } from '@react-three/drei';
import gsap from 'gsap';
import { PlaneContext } from '../App'; // Added import

const Torso = forwardRef((props, ref) => {
  const actuators = [
    // Front Torso Actuators (Positions relative to the Torso)
    { id: 1, position: [0, -0.2, 0.2] },
    { id: 2, position: [0.25, -0.3, 0.2] },
    { id: 3, position: [-0.25, -0.3, 0.2] },
    { id: 4, position: [0.2, 0.1, 0.2] },
    { id: 5, position: [-0.2, 0.1, 0.2] },
    { id: 6, position: [0, 0.3, 0.2] },
    // Back Torso Actuators
    { id: 11, position: [0, -0.2, -0.2] },
    { id: 12, position: [0.25, -0.3, -0.2] },
    { id: 13, position: [-0.25, -0.3, -0.2] },
    { id: 14, position: [0.2, 0.1, -0.2] },
    { id: 15, position: [-0.2, 0.1, -0.2] },
    { id: 16, position: [0, 0.3, -0.2] },
  ];

  return (
    <BodyPart ref={ref} position={[0, 0, 0]} args={[0.7, 1.5, 0.4]} color="lightblue">
      {actuators.map((actuator) => (
        <Actuator key={actuator.id} position={actuator.position} />
      ))}
    </BodyPart>
  );
});

const RightArm = forwardRef((props, ref) => {
  const actuators = [
    { id: 21, position: [0.1, 0.4, 0] },
    { id: 22, position: [0.1, 0, 0] },
    { id: 23, position: [0.1, -0.4, 0] },
  ];

  return (
    <BodyPart
      ref={ref}
      position={[0.6, 0.3, 0]}
      args={[0.2, 1, 0.2]}
      color="lightcoral"
      rotation={[0, 0, 0.50]} // 10 degrees in radians
    >
      {actuators.map((actuator) => (
        <Actuator key={actuator.id} position={actuator.position} />
      ))}
    </BodyPart>
  );
});

const LeftArm = forwardRef((props, ref) => {
  const actuators = [
    { id: 31, position: [-0.1, 0.4, 0] },
    { id: 32, position: [-0.1, 0, 0] },
    { id: 33, position: [-0.1, -0.4, 0] },
  ];
  return (
    <BodyPart
      ref={ref}
      position={[-0.6, 0.3, 0]}
      args={[0.2, 1, 0.2]}
      color="lightcoral"
      rotation={[0, 0, -0.5]} // -10 degrees in radians
    >
      {actuators.map((actuator) => (
        <Actuator key={actuator.id} position={actuator.position} />
      ))}
    </BodyPart>
  );
});

const Neck = forwardRef((props, ref) => {
  const actuators = [
    { id: 41, position: [0, 0, -0.2] },
    { id: 42, position: [0.1, 0, -0.25] },
    { id: 43, position: [-0.1, 0, -0.25] },
  ];

  return (
    <BodyPart ref={ref} position={[0, 0.7, 0]} args={[0.2, 0.3, 0.2]} color="lightgreen">
      {actuators.map((actuator) => (
        <Actuator key={actuator.id} position={actuator.position} />
      ))}
    </BodyPart>
  );
});

const Head = forwardRef((props, ref) => {
  const actuators = [
    { id: 51, position: [0, 0.3, 0] },
    { id: 52, position: [0.2, 0.25, 0.1] },
    { id: 53, position: [-0.2, 0.25, 0.1] },
  ];

  return (
    <Sphere ref={ref} position={[0, 1, 0]} args={[0.3, 16, 16]}>
      <meshStandardMaterial attach="material" color="lightgreen" />
      {actuators.map((actuator) => (
        <Actuator key={actuator.id} position={actuator.position} />
      ))}
    </Sphere>
  );
});

function HumanBody() {
  const { bodyPartToActivate, resetBodyPart } = useContext(PlaneContext);
  const torsoRef = useRef();
  const rightArmRef = useRef();
  const leftArmRef = useRef();
  const neckRef = useRef();
  const headRef = useRef();

  useEffect(() => {
    if (bodyPartToActivate) {
      //put to idle all actuators
      const allParts = [torsoRef, rightArmRef, leftArmRef, neckRef, headRef];
      allParts.forEach((part) => {
        part.current.children.forEach((actuator) => {
          if (actuator.userData && actuator.userData.setStatus) {
            actuator.userData.setStatus('idle');
          }
        });
      });




      let targetRef;

      switch(bodyPartToActivate) {
        case 'torso':
          targetRef = torsoRef;
          break;
        case 'rightArm':
          targetRef = rightArmRef;
          break;
        case 'leftArm':
          targetRef = leftArmRef;
          break;
        case 'neck':
          targetRef = neckRef;
          break;
        case 'head':
          targetRef = headRef;
          break;
        default:
          targetRef = null;
          break;
      }


      if (targetRef && targetRef.current) {
        targetRef.current.children.forEach((actuator) => {
          if (actuator.userData && actuator.userData.setStatus) {
            actuator.userData.setStatus('clicked');
          }
        });      
      }
    }
  }, [bodyPartToActivate]);

  return (
    <group>
      <Torso ref={torsoRef} />
      <RightArm ref={rightArmRef} />
      <LeftArm ref={leftArmRef} />
      <Neck ref={neckRef} />
      <Head ref={headRef} />
    </group>
  );
}

export default HumanBody;