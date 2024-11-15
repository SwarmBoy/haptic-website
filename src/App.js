// App.js
import React, { useState, createContext, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import HumanBody from './Components/HumanBody';
import MovingPlane from './Components/MovingPlane';
import InputControls from './Components/InputControls';
import * as THREE from 'three';
import CombinedChart from './Components/CombinedChart';
import FileUploader from './Components/FileUploader';

import HapticsTest from './Components/HapticsTest';

// Create a context with default values
export const PlaneContext = createContext({
  planeData: {
    position: [0, 0, 0],
    normal: [0, 1, 0],
  },
  isPlaneMoving: false,
  bodyPartToActivate: null,
  launchModel: async (adresse) => {}, 
  allActuators: [],
});

function App() {
  const [theta, setTheta] = useState(0); // Azimuthal angle in degrees
  const [phi, setPhi] = useState(90); // Polar angle in degrees
  const [speed, setSpeed] = useState(3);
  const [isPlaneMoving, setIsPlaneMoving] = useState(false);
  const [isTestHaptics, setIsTestHaptics] = useState(false);
  const [launchModel, setLaunchModel] = useState(null); 
  const [allActuators, setAllActuators] = useState([]);

  const [planeData, setPlaneData] = useState({
    position: [0, 0, 0],
    normal: [0, 1, 0],
  });

  const [bodyPartToActivate, setBodyPartToActivate] = useState(null);
  const [points, setPoints] = useState([]); // Store points at intersections

  const [amplitudeData, setAmplitudeData] = useState(null);
  const [frequencyData, setFrequencyData] = useState(null);
  const [showCombinedChart, setShowCombinedChart] = useState(false);

  useEffect(() => {
    console.log(allActuators);
  }, [allActuators]);

  const handleFileLoaded = (jsonData) => {
    try {
      const envelopes = jsonData.signals.continuous.envelopes;
      setAmplitudeData(envelopes.amplitude);
      setFrequencyData(envelopes.frequency);
    } catch (error) {
      alert('Error parsing envelope data.');
    }
  };

  useEffect(() => {
    if (amplitudeData && frequencyData) {
      setShowCombinedChart(true);
    }
  }, [amplitudeData, frequencyData]);

  // Function to trigger body part animations
  const triggerBodyPartAnimation = (bodyPart) => {
    setBodyPartToActivate(bodyPart);
  };



  return (
    <PlaneContext.Provider value={{ planeData, isPlaneMoving, bodyPartToActivate, launchModel, allActuators }}>
      <div style={{ padding: '20px' , height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className='control' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', margin: '20px' }}>
          <div style={{ justifyContent: 'center', alignItems: 'center', marginRight: '50px' }}>
            <h1>Haptic File Viewer</h1>
            <FileUploader onFileLoaded={handleFileLoaded} />
            {showCombinedChart && (
              <CombinedChart
                amplitudeData={amplitudeData}
                frequencyData={frequencyData}
              />
            )}
          </div>
          <div style={{ justifyContent: 'center', alignItems: 'center', marginLeft: '50px' }}>
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
          </div>
          <div style={{ justifyContent: 'center', alignItems: 'center', marginLeft: '50px' }}>
            <h2> Launch the animation </h2>
            <button onClick={() => setIsPlaneMoving(true)}>Launch</button>


            <HapticsTest
              amplitudeData={amplitudeData}
              frequencyData={frequencyData}
              setLaunchModel={setLaunchModel} // Pass the setter function
            />

            
          </div>
      </div>
      <div style={{ flex: 1 }}>
          <Canvas
            camera={{ position: [0, 2, 8], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={1} />
            <HumanBody setActuator = {setAllActuators} />
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
      </div>
    </div>
  </PlaneContext.Provider>
  );
}

export default App;
