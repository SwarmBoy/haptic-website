// InputControls.js
import React, { useEffect } from 'react';

function InputControls({
  theta,
  setTheta,
  phi,
  setPhi,
  speed,
  setSpeed,
  isPlaneMoving,
  setIsPlaneMoving,
  triggerBodyPartAnimation, // New prop to trigger animations
}) {
  useEffect(() => {
    // Event handler for keydown events
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        setIsPlaneMoving((prev) => !prev); // Toggle plane movement
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsPlaneMoving]);

  return (
    <div style={{ padding: '10px' }}>
      <div>
        <label>Theta (θ): {theta.toFixed(1)}°</label>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={theta}
          onChange={(e) => setTheta(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Phi (φ): {phi.toFixed(1)}°</label>
        <input
          type="range"
          min="0"
          max="180"
          step="1"
          value={phi}
          onChange={(e) => setPhi(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Speed: {speed.toFixed(1)}</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        />
      </div>
      <div style={{ padding: '10px' }}>
        <p>
          Press <strong>Space Bar</strong> to {isPlaneMoving ? 'stop' : 'start'} the plane.
        </p>
      </div>
      <div style={{ padding: '10px' }}>
        <table>
          <tbody>
            <tr>
              <td><button onClick={() => triggerBodyPartAnimation('torso')}>Activate Torso</button></td>
              <td><button onClick={() => triggerBodyPartAnimation('rightArm')}>Activate Right Arm</button></td>
            </tr>
            <tr>
              <td><button onClick={(  ) => triggerBodyPartAnimation('leftArm')}>Activate Left Arm</button></td>
              <td><button onClick={() => triggerBodyPartAnimation('neck')}>Activate Neck</button></td>
            </tr>
            <tr>
              <td colSpan="2"><button onClick={() => triggerBodyPartAnimation('head')}>Activate Head</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InputControls;
