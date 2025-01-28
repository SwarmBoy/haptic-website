import React, { useContext, useEffect, useRef, forwardRef } from 'react';
import BodyPart from './BodyPart';
import Actuator from './Actuator';
import { Cylinder, Sphere } from '@react-three/drei';
import { PlaneContext } from '../App'; // Added import


const getPositionOnEllipse = (height, angledeg) => {
  const angle = (angledeg * Math.PI) / 180;
const x = 1/4 * Math.cos(angle);
  const y = 1/4 * Math.sin(angle);
  return [x, height, y];
};

const torsoActuators = [];
for (let i = 0; i < 10; i++) {
  torsoActuators.push({
    id: i,
    position: getPositionOnEllipse(-0.2, i * 31- 90),
    adresse: i,
    channel: 0
  });
}

/*for (let i = 16; i <= 27; i++) {
  torsoActuators.push({
    id: i,
    position: getPositionOnEllipse(0, (i - 16) * 30),
    adresse: 25 + (i - 16),
    channel: 0
  });
}

for (let i = 28; i <= 39; i++) {
  torsoActuators.push({
    id: i,
    position: getPositionOnEllipse(-0.2, (i - 28) * 30),
    adresse: 37 + (i - 28),
    channel: 0
  });
}

*/

const Torso = forwardRef((props, ref) => {
  const actuatorRefs = useRef([]);
  return (
    <Cylinder ref={ref} position={[0, 0, 0]} args={[0.25, 0.25, 1, 16]} scale={[2, 1, 1]} color="lightcoral">
      <meshStandardMaterial attach="material" color="lightgreen" />
      {torsoActuators.map((actuator, index) => (
        <Actuator key={actuator.id} ref={el => actuatorRefs.current[index] = el} position={actuator.position} scale={[1/2,1,1]} adresse={actuator.adresse!=null?actuator.adresse:null} channel={actuator.channel!=null?actuator.channel:null} />    
      ))}
    </Cylinder>
  );
});

const LeftArm = forwardRef((props, ref) => {
  const actuatorRefs = useRef([]);
  
  const actuators = [
    { id: 90, position: [0, -0.4, -0.1], adresse: 95, channel: 0},
    { id: 91, position: [0, -0.2, -0.1], adresse: 94, channel: 0},
    { id: 92, position: [0, 0, -0.1], adresse: 93, channel: 0},
    { id: 93, position: [0, 0.2, -0.1], adresse: 92, channel: 0},
    { id: 94, position: [0, 0.4, -0.1], adresse: 91, channel: 0},
    { id: 95, position: [0, 0.6, -0.1], adresse: 90, channel: 0},
  ];

  return (
    <BodyPart
      ref={ref}
      position={[0.4, 0.3, -0.4]}
      args={[0.2, 1, 0.2]}
      color="lightcoral"
      rotation={[1.3, 0, -0.3]} // 10 degrees in radians
    >
      {actuators.map((actuator, index) => (
        <Actuator key={actuator.id} ref={el => actuatorRefs.current[index] = el} position={actuator.position} adresse={actuator.adresse!=null?actuator.adresse:null} channel={actuator.channel!=null?actuator.channel:null} />    
      ))}

    </BodyPart>
  );
});

const RightArm = forwardRef((props, ref) => {
  const actuatorRefs = useRef([]);
  const actuators = [

  ];
  return (
    <BodyPart
      ref={ref}
      position={[-0.4, 0.3, -0.4]}
      args={[0.2, 1, 0.2]}
      color="lightcoral"
      rotation={[1.3, 0, 0.3]} // -10 degrees in radians
    >
      {actuators.map((actuator, index) => (
        <Actuator key={actuator.id} ref={el => actuatorRefs.current[index] = el} position={actuator.position} adresse={actuator.adresse!=null?actuator.adresse:null} channel={actuator.channel!=null?actuator.channel:null} />    
        ))}
    </BodyPart>
  );
});

const Neck = forwardRef((props, ref) => {
  const actuatorRefs = useRef([]);
  const actuators = [
    /*
    { id: 41, position: [0, 0, -0.2]},
    { id: 42, position: [0.1, 0, -0.25] },
    { id: 43, position: [-0.1, 0, -0.25] },*/
  ];

  return (
    <BodyPart ref={ref} position={[0, 0.7, 0]} args={[0.2, 0.3, 0.2]} color="lightgreen">
      {actuators.map((actuator, index) => (
        <Actuator key={actuator.id} ref={el => actuatorRefs.current[index] = el} position={actuator.position} adresse={actuator.adresse!=null?actuator.adresse:null} channel={actuator.channel!=null?actuator.channel:null} />    
        ))}
    </BodyPart>
  );
});

const Head = forwardRef((props, ref) => {
  const actuatorRefs = useRef([]);
  const actuators = [
    /*
    { id: 51, position: [0, 0.3, 0]},
    { id: 52, position: [0.2, 0.25, 0.1] },
    { id: 53, position: [-0.2, 0.25, 0.1] },*/
  ];

  return (
    <Sphere ref={ref} position={[0, 1, 0]} args={[0.3, 16, 16]}>
      <meshStandardMaterial attach="material" color="lightgreen" />
      {actuators.map((actuator, index) => (
        <Actuator key={actuator.id} ref={el => actuatorRefs.current[index] = el} position={actuator.position} adresse={actuator.adresse!=null?actuator.adresse:null} channel={actuator.channel!=null?actuator.channel:null} />    
        ))}
    </Sphere>
  );
});

function HumanBody({setActuator}) {
  const setActuattorsParent = setActuator;
  const { bodyPartToActivate } = useContext(PlaneContext);
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

  }, []);



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