// App.js
import React, { useState, createContext } from 'react';
import { Canvas } from '@react-three/fiber';
import HumanBody from './Components/HumanBody';
import MovingPlane from './Components/MovingPlane';
import InputControls from './Components/InputControls';
import { OrbitControls } from '@react-three/drei';

// Create a context with default values
export const PlaneContext = React.createContext({
  planeData: {
    position: [0, 0, 0],
    normal: [0, 1, 0],
  },
  isPlaneMoving: false,
  bodyPartToActivate: null,
  resetBodyPart: () => {}, // Add reset function
});


function App() {
  const [theta, setTheta] = useState(0); // Azimuthal angle in degrees
  const [phi, setPhi] = useState(90); // Polar angle in degrees
  const [speed, setSpeed] = useState(3);
  const [isPlaneMoving, setIsPlaneMoving] = useState(false);

  const [planeData, setPlaneData] = useState({
    position: [0, 0, 0],
    normal: [0, 1, 0],
  });

  const [bodyPartToActivate, setBodyPartToActivate] = useState(null);

  // Function to trigger body part animations
  const triggerBodyPartAnimation = (bodyPart) => {
    setBodyPartToActivate(bodyPart);
  };

  // Function to reset bodyPartToActivate
  const resetBodyPart = () => {
    setBodyPartToActivate(null);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <InputControls
        theta={theta}
        setTheta={setTheta}
        phi={phi}
        setPhi={setPhi}
        speed={speed}
        setSpeed={setSpeed}
        isPlaneMoving={isPlaneMoving}
        setIsPlaneMoving={setIsPlaneMoving}
        triggerBodyPartAnimation={triggerBodyPartAnimation}
      />
      <div style={{ flex: 1 }}>
        <PlaneContext.Provider value={{ planeData, isPlaneMoving, bodyPartToActivate, resetBodyPart }}>
          <Canvas
            camera={{ position: [0, 2, 8], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={1} />
            <HumanBody />
            <MovingPlane
              theta={theta}
              phi={phi}
              speed={speed}
              isPlaneMoving={isPlaneMoving}
              setPlaneData={setPlaneData}
              setPlanMoving={setIsPlaneMoving}
            />
            <OrbitControls />
          </Canvas>
        </PlaneContext.Provider>
      </div>
    </div>
  );
}

export default App;
