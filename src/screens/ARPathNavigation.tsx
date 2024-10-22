import React, { useState, useEffect, useRef } from 'react';
import { ViroARScene, ViroCameraTransform, ViroPolyline, ViroText } from '@reactvision/react-viro';
import { Viro3DPoint } from '@reactvision/react-viro/dist/components/Types/ViroUtils';

let initialNumberToSet  = 0;
const stepThreshold = 10;
const ARPathNavigation = () => {
  const [userPosition, setUserPosition] = useState([0, 0, 0]); // Initial camera position
  const [path, setPath] = useState<any | []>([[0, -2, -1]]); // List of positions where text should render
  const [distanceWalked, setDistanceWalked] = useState(0); // Track distance walked

  const previousPosition = useRef<Viro3DPoint>([0, 0, 0]); // Keep track of the previous camera position
  const [minDistance] = useState(2);


  const onCameraTransformUpdate = (cameraTransform: ViroCameraTransform) => {
    const currentPosition = cameraTransform.position;

    // Calculate the distance from the previous position to the current one
    const distance = calculateDistance(previousPosition.current, currentPosition);

    // Update the total distance walked
    setDistanceWalked(prev => prev + distance);

    // If the user walks more than the minDistance, update the path and render new text
    if (distanceWalked + distance >= minDistance) {

      if (!(initialNumberToSet > 2)) {

        setPath(prevPath => [...prevPath, [currentPosition[0],-2, -(path.length + 1)]]); // Add current position to path
        setDistanceWalked(0); // Reset the distance tracker for the next step
        initialNumberToSet += 1;
      }
    }

    if (minDistance === stepThreshold) {
      initialNumberToSet = 0;
    }

    // Store the current position for the next calculation
    previousPosition.current = currentPosition;

    // Update the user's current position
    setUserPosition([...currentPosition]);
  };

  // Function to calculate distance between two points
  const calculateDistance = (start: Viro3DPoint, end: Viro3DPoint) => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };


  console.log('direction: ', path);

  const renderPath = () => {
    return (
      <ViroPolyline
        points={path.map(point => point)}
        color={'#FF0000'} // Red color for the path
        // width={0.01} // Adjust the width of the line
        thickness={0.1}
      />
    );
  };
  return (
    <ViroARScene anchorDetectionTypes="None" onCameraTransformUpdate={onCameraTransformUpdate}>
      {/* Render Text for each 10-meter segment walked */}
      {renderPath()}
      {path.map((position: any, index: number) => (
        <ViroText
          key={index}
          text={`Step ${index}`}
          position={position}
          scale={[0.5, 0.5, 0.5]}
          style={{ fontFamily: 'Arial', fontSize: 30, color: '#FFFFFF' }}
        />
      ))}
    </ViroARScene>
  );
};

export default ARPathNavigation;
