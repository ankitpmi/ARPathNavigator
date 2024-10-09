import React, { useState } from 'react';
import { StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroPolyline,
  ViroTrackingStateConstants,
  ViroText,
} from '@reactvision/react-viro';


const Home = () => {
const [pathPoints, setPathPoints] = useState(
  [
    { position: [0,-1, -1] },
    { position: [0, -1, -2] },
    { position: [0, -1, -3] },
    { position: [0, -1, -4] },
    { position: [0.5, -1, -5] },
    { position: [0.6, -1, -4] },
    { position: [0.7, -1, -3] },
    { position: [0.8, -1, -1] },
  ]
);




const onTrackingUpdated = (anchor) => {
  console.log('anchor: ', anchor);
  if (anchor.tracking === ViroTrackingStateConstants.TRACKING_NORMAL) {
    console.log('CALLED');

    // Tracking is normal; you can handle further navigation logic here if needed.
  }
};
  const renderPath = () => {


    return (
      <ViroPolyline
        points={pathPoints.map(point => point.position)}
        color={'#FF0000'} // Red color for the path
        // width={0.01} // Adjust the width of the line
        thickness={0.1}
      />
    );
  };

  return (
    <ViroARScene   onTrackingUpdated={onTrackingUpdated}>
    {renderPath()}
    {pathPoints.map((point, index) =>
    {
      console.log('TEST :: ', point.position);

return     (
  <ViroText
    key={index}
    text={`Point ${index }`}
    scale={[0.5, 0.5, 0.5]}

    position={point.position} // Position slightly above the path
    style={styles.helloWorldTextStyle}

    // textAlign="center"

  />
);
    }

    )}
  </ViroARScene>
  );
};

export default Home;

const styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
