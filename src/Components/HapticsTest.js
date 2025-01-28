import React, { useContext, useEffect, useRef, useState } from 'react';
import { AsyncZipDeflate } from 'three/examples/jsm/libs/fflate.module.js';
import { PlaneContext } from '../App'; // Adjust the import path as needed
import { all } from 'three/webgpu';

function HapticsTest({ amplitudeData, frequencyData, setLaunchModel, allActuators }) {
  const REFRESH_RATE = 10; // ms
  const planeData = useContext(PlaneContext);
  const actuatorsTest = [0,1,2,3,4,5,30,31,32,33,34,35, 60,61,62,63,64,65, 90,91,92,93,94,95, 96, 97, 98, 99];


  const socket = useRef(null);
  const [adrrID, setActuatorsID] = useState(0);
  const [addr, setAddr] = useState(0);
  const [duty, setDuty] = useState(8);
  const [freq, setFreq] = useState(2);

  useEffect(() => {

    if(socket.current){
        return;
    }
    setLaunchModel(() => launchModel); // Set the launchModel function

    socket.current = new WebSocket('ws://localhost:9052');

    socket.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.current.onclose = () => console.log('WebSocket connection closed');

  }, []);

  useEffect(() => {
    setLaunchModel(() => launchModel); // Set the launchModel function
  }, [amplitudeData, frequencyData]);

  //async function to send the command to the server
  const launchModelCommande = async (adresse) => {
    // Example: Send the data via WebSocket
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        const maxTime = Math.max(amplitudeData[amplitudeData.length - 1].time, frequencyData[frequencyData.length - 1].time)*1000;

        for (let time = 0; time < maxTime; time += REFRESH_RATE) {
            //so the data do not have at all the same time so find the closest superior and inferior time
            let amplitudeIndex = amplitudeData.findIndex((point) => point.time * 1000 >= time);
            let frequencyIndex = frequencyData.findIndex((point) => point.time * 1000 >= time);


            let frequency = 0;
            let amplitude = 0;
            if(amplitudeIndex != -1 && amplitudeIndex < amplitudeData.length-1){
                amplitude = amplitudeData[amplitudeIndex].amplitude;
                amplitude = Math.round(amplitude * 9) + 1; // Map amplitude from 0-1 to 1-10
            }
            if(frequencyIndex != -1 && frequencyIndex < frequencyData.length-1){
                frequency = frequencyData[frequencyIndex].frequency;
                frequency = Math.round(frequency * 9) + 1; // Map frequency from 0-1 to 1-10
            }

          //  console.log('Sending command to server:', adresse, amplitude, frequency, amplitudeIndex, frequencyIndex);
            sendCommand(adresse, 1, amplitude, frequency);
            await new Promise((resolve) => setTimeout(resolve, REFRESH_RATE));
        }
    }
    await new Promise((resolve) => setTimeout(resolve, REFRESH_RATE));
    sendCommand(adresse, 0, 0, 0);
};

  const launchOnAndOff = async (adresse, mode, duty, freq) => {
    sendCommand(adresse, mode, duty, freq);
    await new Promise((resolve) => setTimeout(resolve, 100));
    sendCommand(adresse, 0, 0, 0);
  };

  const launchModel = async (adress=null) => {
    // Example: Send the data via WebSocket
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      if(amplitudeData && frequencyData){
          await launchModelCommande(adress);
      }else{
        if(adress != null){
          launchOnAndOff(adress, 1, duty, freq); // launch by the send commande
        }else{
          launchOnAndOff(addr, 1, duty, freq); // Launch with then plan animation of animation per axctuator
        }
      }
    }
  };

  const sendCommand = (addr, mode, duty, freq) => {
    const command = JSON.stringify({ addr, mode, duty, freq });
 //   console.log('Sending command:', command);
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(command);
    } else {
      console.error('WebSocket is not open.');
    }
  };

  const stopAllCommand = () => {
    for (let addr = 0; addr < 130; addr++) {
        sendCommand(addr, 0, 0, 0);
    }
    };

  const testHaptics = async () => {
    planeData.allActuators.forEach(async (actuator) => {
      try {
        if(actuator.userData.getStatus() == 'clicked'){
          if(actuator.userData.getAdresse() != null){
         //   console.log('Sending command to server:', actuator.userData.getAdresse());
            await launchModel(actuator.userData.getAdresse());
          }
        }
      } catch (error) {
        console.error('Error setting actuator status:', error);
      }
    });
  };
  
  
  return (
    <div>
      <h2> Selected Actuators </h2>
      <button onClick={() => testHaptics()}>Launch on selected</button>

      
      <h2> Commande </h2>
      <button onClick={() => launchModel()}>Send Command</button>
      <button onClick={() => stopAllCommand()}>Stop All Command</button><div>
        <label>Address:</label>
        <input
          type="range"
          min="0"
          max={actuatorsTest.length - 1}
          value={adrrID}
          onChange={(e) => {
            setAddr(actuatorsTest[Number(e.target.value)]);
            setActuatorsID(Number(e.target.value));
          }}
        />
        <span>{addr}</span>
      </div>
      <div>
        <label>Duty:</label>
        <input
          type="range"
          min="0"
          max="10"
          value={duty}
          onChange={(e) => setDuty(Number(e.target.value))}
        />
        <span>{duty}</span>
      </div>
      <div>
        <label>Frequency:</label>
        <input
          type="range"
          min="0"
          max='10'
          value={freq}
          onChange={(e) => setFreq(Number(e.target.value))}
        />
        <span>{freq}</span>
      </div>
    </div>
  );
}

export default HapticsTest;
