// BodyPart.js
import React, { forwardRef } from 'react';
import { Box } from '@react-three/drei';

const BodyPart = forwardRef(({ position, args, color, rotation = [0, 0, 0], children }, ref) => {
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Box args={args}>
        <meshStandardMaterial attach="material" color={color} />
      </Box>
      {children}
    </group>
  );
});

export default BodyPart;
