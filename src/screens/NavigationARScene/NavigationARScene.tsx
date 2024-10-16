import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { ViroARScene, ViroText, ViroPolyline, ViroARPlaneSelector, ViroARPlane } from '@reactvision/react-viro';

interface Points {
  x: number,
  y: number,
  z: number
}

const NavigationARScene = () => {
  const [points, setPoints] = useState<Array<Points> | []>([]);

  // Function to add a new point at the user's position
  const addPoint = () => {
    // Example: Let's assume each point is at a fixed distance ahead (e.g., 1 meter)
    let newPoint = { x: 0, y: -1, z: -(points.length + 1) }; // Adjust z value for each new point
    setPoints([...points, newPoint]);
  };

  return (
<>
      <ViroARScene>
        <ViroARPlane  minHeight={250}
    minWidth={250}>
          {/* Render the points */}
          {points.map((point, index) => (
            <ViroText
              key={index}
              text={`Point ${index + 1}`}
              position={[point.x, point.y, point.z]}
              scale={[0.3, 0.3, 0.3]}
              style={{ fontFamily: 'Arial', fontSize: 10, color: '#00ff00' }}
            />
          ))}

          {/* Draw lines connecting the points */}
          {points.length > 1 && (
            <ViroPolyline
              position={[0, 0, 0]} // Origin
              points={points.map(p => [p.x, p.y, p.z])} // Connect points
              thickness={0.1}
              materials={['line_material']}
            />
          )}
        </ViroARPlane>
      </ViroARScene>

    </>
  );
};

export default NavigationARScene;
