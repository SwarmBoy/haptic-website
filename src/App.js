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
import ActuatorChart from './Components/ActuatorChart';

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
  setAllActuators: () => {},
  addRemoveActuator: (adress, add) => {},
  dataActuators: [],

});

function App() {
  const [theta, setTheta] = useState(0); // Azimuthal angle in degrees
  const [phi, setPhi] = useState(90); // Polar angle in degrees
  const [speed, setSpeed] = useState(3);
  const [isPlaneMoving, setIsPlaneMoving] = useState(false);
  const [isTestHaptics, setIsTestHaptics] = useState(false);
  const [launchModel, setLaunchModel] = useState(null); 
  const [allActuators, setAllActuators] = useState([]);
  const [actuatorsSelected, setActuatorsSelected] = useState([]);
  const [dataActuators, setDataActuators] = useState([]);
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
    // Fetch and process data periodically
    const fetchData = () => {
      fetch('http://localhost:5000/getCommands')
        .then((response) => response.json())
        .then((fetchedData) => {
          setDataActuators(fetchedData);
        })
        .catch((error) => console.error('Error fetching data:', error));
    };

    const intervalId = setInterval(fetchData, 50);
    return () => clearInterval(intervalId); // Cleanup interval on unmount

  
  }, []);


  const addRemoveActuator = (address, add) => {
    if (add) {
      setActuatorsSelected((prevState) => {
        if (!prevState.includes(address)) {
          return [...prevState, address];
        }
        return prevState;
      });
    } else {
      setActuatorsSelected((prevState) =>
        prevState.filter((actuator) => actuator !== address)
      );  
    }
  };

  useEffect(() => {

  }, [actuatorsSelected]);

  const handleFileLoaded = (jsonData) => {
    try {
      const envelopes = jsonData.signals.continuous.envelopes;
      setAmplitudeData(envelopes.amplitude);
      setFrequencyData(envelopes.frequency);
    } catch (error) {
      alert('Error parsing envelope data.');
    }
  };

  const handleFileSupress = () => {
    console.log('Suppressing data appp');
    setAmplitudeData(null);
    setFrequencyData(null);
  }

  useEffect(() => {
    if (amplitudeData && frequencyData) {
      setShowCombinedChart(true);
    } else {
      setShowCombinedChart(false);
    }
  }, [amplitudeData, frequencyData]);

  // Function to trigger body part animations
  const triggerBodyPartAnimation = (bodyPart) => {
    setBodyPartToActivate(bodyPart);
  };

  return (
    <div style={{ flexDirection: 'row', display: 'flex', height: '100vh' }}>
        <div className='controlPanel' style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'flex-start', 
              alignItems: 'center', 
              margin: '20px', 
              width: '70%', 
              position: 'sticky', 
              top: 0, 
              zIndex: 10,
              background: '#fff'
            }}>   
      <PlaneContext.Provider value={{ planeData, isPlaneMoving, bodyPartToActivate, launchModel, allActuators, setAllActuators, addRemoveActuator, dataActuators }}>
          <div style={{ padding: '20px' , height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className='control' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', margin: '20px' }}>
              <div style={{ justifyContent: 'center', alignItems: 'center', marginRight: '50px' }}>
                <h1>Haptic File Viewer</h1>
                <FileUploader onFileLoaded={handleFileLoaded} onFileSupress={handleFileSupress} />
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
    </div>
    <div className='graphs' style={{ display: 'flex', flexDirection:'column', alignItems: 'center', margin: '20px', width: '30%' }}>
      {actuatorsSelected.map(actuatorAddr => {
        const actuatorData = dataActuators['commands'].filter(d => d['addr'] === actuatorAddr);
      return (
        <div key={actuatorAddr} style={{ marginBottom: '20px', width: '100%', height:'200px' }}>
          <ActuatorChart actuatorAddr={actuatorAddr} actuatorData={actuatorData} />
        </div>
      );
  })}
    </div>

  </div>
  );
}

export default App;
