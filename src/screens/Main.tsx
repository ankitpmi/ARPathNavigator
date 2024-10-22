import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {ViroARSceneNavigator} from '@reactvision/react-viro';
import Home from './home/Home';
import ARPathNavigation from './ARPathNavigation';
// import {useLocationContext} from '../contexts';

const Main = () => {
  // const {currentLocation, initialLocation, clearWatchHandler} =
  //   useLocationContext();
  return (
    <>
      <ViroARSceneNavigator
        initialScene={{
          scene: Home,
        }}
        pbrEnabled={true}
      />
      {/* <View style={{padding: 8}}>
        <View
          style={{
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#000',
          }}>
          <Text style={{fontSize: 14, fontWeight: 600}}>Initial Location:</Text>
          <Text>Latitude : {initialLocation?.coords.latitude}</Text>
          <Text>Longitude : {initialLocation?.coords.longitude}</Text>
        </View>
        <View>
          <Text style={{fontSize: 14, fontWeight: 600}}>Current Location:</Text>
          <Text>Latitude : {currentLocation?.coords.latitude}</Text>
          <Text>Longitude : {currentLocation?.coords.longitude}</Text>
        </View>

        <Pressable
          onPress={clearWatchHandler}
          style={{
            width: 60,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ccc',
          }}>
          <Text>Stop Watching</Text>
        </Pressable>
      </View> */}
    </>
  );
};

export default Main;

// import React, { useState, useRef } from 'react';
// import { ViroARSceneNavigator, ViroARScene, ViroPolyline, ViroCameraTransform } from '@reactvision/react-viro';
// import { View, Text, StyleSheet } from 'react-native';
// import { ViroMaterials } from '@reactvision/react-viro';
// import { Viro3DPoint } from '@reactvision/react-viro/dist/components/Types/ViroUtils';

// // Main App Component
// const ARLineDrawingApp = () => {
//   return (
//     <ViroARSceneNavigator
//       initialScene={{ scene: LineDrawingARScene }}
//       style={styles.flex}
//     />
//   );
// };

// let lastPosition: Viro3DPoint = [0,0,0];
// // AR Scene for Drawing the Line
// const LineDrawingARScene = () => {
//   const [linePoints, setLinePoints] = useState([]);


//   const handleTrackingUpdate = (position: ViroCameraTransform) => {
//     // console.log('position: ', position);
//     const [ x, y, z ] = position.position;

//     lastPosition = position.position;
//     if (lastPosition) {
//       const distance = calculateDistance(lastPosition, position.position);
//       console.log('distance: ', distance);
//       if (distance > 0.0005) { // Move more than a threshold (0.05 units)
//         setLinePoints((prevPoints) => [...prevPoints, [x, y, z]]);
//         lastPosition[0] = position.position[0]; // Update last position
//         lastPosition[1] = position.position[1]; // Update last position
//         lastPosition[2] = position.position[2]; // Update last position
//       }
//     } else {
//       lastPosition = position.position; // Update last position
//         // lastPosition[1] = position.position[1]; // Update last position
//         // lastPosition[2] = position.position[2]; // Update last position
//     }
//   };

//   const calculateDistance = (pos1: Viro3DPoint, pos2: Viro3DPoint) => {
//     const [ax, ay, az] = pos1;
//     const [bx, by, bz] = pos2;
//     return Math.sqrt(
//       Math.pow(bx - ax, 2) +
//       Math.pow(by - ay, 2) +
//       Math.pow(bz - az, 2)
//     );
//   };

//   return (
//     <ViroARScene onCameraTransformUpdate={handleTrackingUpdate}>
//       {/* Draw Polyline with dynamic points */}
//       {linePoints.length > 1 && (
//         <ViroPolyline
//           position={[0, 0, 0]} // Always at origin
//           points={linePoints} // Dynamic line points
//           thickness={0.01} // Thickness of the line
//           materials={['lineMaterial']}
//         />
//       )}
//     </ViroARScene>
//   );
// };

// // Define the material for the line
// ViroMaterials.createMaterials({
//   lineMaterial: {
//     diffuseColor: '#00ff00', // Green color for the line
//   },
// });

// const styles = StyleSheet.create({
//   flex: { flex: 1 },
// });

// export default ARLineDrawingApp;

