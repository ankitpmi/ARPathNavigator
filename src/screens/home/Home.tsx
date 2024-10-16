import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroPolyline,
  ViroTrackingStateConstants,
  ViroText,
  ViroTrackingState,
  ViroTrackingReason,
  ViroCameraTransform,
} from '@reactvision/react-viro';
import {calculateARPosition, convertLatLongToAR} from '../../utils/helper';
import { useLocationContext } from '../../contexts';

let initialNumberToSetLeft  = 0;
let initialNumberToSetRight  = 0;
let initialNumberToSetForward  = 0;
let arr: Array<any> = [];
interface Position {
  position: number[]
}
const Home = () => {
  // const {currentLocation,initialLocation} = useLocationContext();
  const [pathPoints, setPathPoints] = useState<Array<Position>>([{position: [0, -2, -2]}]);
  const [step, setStep] = useState(0);
  const prevValueRef = useRef(0);


  // const [pathPoints, setPathPoints] = useState(
  //   [
  //     { position: [0,-2, -2] },
  //     { position: [0, -2, -3] },
  //     { position: [0, -2, -4] },
  //     { position: [0, -2, -5] },
  //     { position: [0.5, -2, -6] },
  //     { position: [0.6, -2, -7] },
  //     { position: [0.7, -2, -8] },
  //     { position: [0.8, -2, -9] },
  //     { position: [1, -2, -10] },
  //   ]
  // );

  // useEffect(() => {
  //   if (currentLocation && initialLocation) {
  //     // const positionData = convertGeoToAR(
  //     //   currentLocation?.latitude,
  //     //   currentLocation?.longitude,
  //     // );
  //     const positionData = calculateARPosition(
  //       initialLocation.coords,
  //       currentLocation.coords,
  //     );



  //     // console.log('positionData: ', positionData);
  //     // console.log('distance ::: ', positionData.distance);
  //     console.log('distance IN SIDE ::: ', positionData.distance);

  //     if (positionData.distance > 1) {
  //       arr = [...arr, {lat: currentLocation.coords.latitude, long: currentLocation.coords.longitude}];
  //       console.log('arr: ', arr);
  //       setPathPoints(preState => [...preState, {position: positionData.position}]);
  //     }
  //   }
  // }, [currentLocation, initialLocation]);


  const onTrackingUpdated = (state: ViroTrackingState, reason: ViroTrackingReason) => {
    // console.log('anchor: ', state, ' :: ', reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setStep(state);
      // console.log('CALLED');
      // setPathPoints
      // Tracking is normal; you can handle further navigation logic here if needed.
    }
  };

  const getDifference = (value1: number, value2: number) => {
    console.log('value1: number, value2: number: ', value1, value2);
    return value1 - value2;
  };



  const oncameraTransformHandler = (cameraTransform: ViroCameraTransform) => {
    const [fx,fy,fz] = cameraTransform.forward;
    // console.log('fy: ', fy);
    // const [rx,ry,rz] = cameraTransform.rotation;
    const [px,py,pz] = cameraTransform.position;
    // if (px > 0.3) {

    //   console.log('px,py,pz: ', px,py,pz);
    // }
    // console.log('cameraTransform: ', cameraTransform);

  if (fx < -0.8 ) {
    const obj:Position = {position: [fx, -2, -pathPoints.length + 2]};
    if (!(initialNumberToSetLeft > 2)) {
      // console.log('LEFT ::: ');

      setPathPoints([...pathPoints, obj]);
      initialNumberToSetLeft = initialNumberToSetLeft + 1;
      return;
    }
    // initialNumberToSetLeft = 0;
    // console.log('Left::::::::::', fx);
  }else if(fx > 0.8 ){
    const obj:Position = {position: [fx, -2, -pathPoints.length + 2]};
    if (!(initialNumberToSetRight > 2)) {
      // console.log('RIGHT :::');

      setPathPoints([...pathPoints, obj]);
      initialNumberToSetRight = initialNumberToSetRight + 1;
      return;
    }
    // initialNumberToSetRight = 0;
    // console.log('Right::::::::::::', fx);
  }else if (pz > 0.5 || pz < -0.5) {

    const xVal = pathPoints[pathPoints.length - 1].position[0];
    const obj:Position = {position: [xVal, -2, -(pathPoints.length + 2)]};
    const prevValue = pathPoints[pathPoints.length - 1].position[2]; // Access previous value from ref
    const difference = prevValue - obj.position[2];


    console.log('difference: ', difference);
    if (!(initialNumberToSetForward > 2)) {
      // console.log('AAA' , initialNumberToSetForward);

      initialNumberToSetForward = initialNumberToSetForward + 1;
      setPathPoints([...pathPoints, obj]);
      return;
    }
    prevValueRef.current = pz;
    if (pathPoints.length === 2) {
      initialNumberToSetForward = 0;
    }
  }



    // if (pz > (-0.4) || pz > 0.4) {
      // console.log('CALL ::: ', pz);
      // if (fx < -0.6 ) {
      //   const obj:Position = {position: [fx, -2, -pathPoints.length + 1]};
      //   setPathPoints([...pathPoints, obj]);
      //   // console.log('Left::::::::::', fx);
      // }else if(fx > 0.6 ){
      //   const obj:Position = {position: [fx, -2, -pathPoints.length + 1]};
      //   setPathPoints([...pathPoints, obj]);
      //   // console.log('Right::::::::::::', fx);
      // }
    // }


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
    <>
      <ViroARScene onCameraTransformUpdate={oncameraTransformHandler} onTrackingUpdated={onTrackingUpdated} >
        {renderPath()}
        {pathPoints.map((point, index) => {
          return (
            <ViroText
              key={index}
              text={`Point ${index}`}
              scale={[0.5, 0.5, 0.5]}
              position={point.position} // Position slightly above the path
              style={styles.helloWorldTextStyle}
              // textAlign="center"
            />
          );
        })}
      </ViroARScene>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
