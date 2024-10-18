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


let initialNumberToSetLeft  = 0;
let initialNumberToSetRight  = 0;
let initialNumberToSetForward  = 0;
let forwardStepCount = 0;  // Step counter for forward movement
const stepThreshold = 200;
interface Position {
  position: number[]
}
const Home = () => {
  const [pathPoints, setPathPoints] = useState<Array<Position>>([{position: [0, -2, -2]}]);
  const [step, setStep] = useState(0);
  // const prevValueRef = useRef<number>(0);


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




  const onTrackingUpdated = (state: ViroTrackingState, reason: ViroTrackingReason) => {
    // console.log('anchor: ', state, ' :: ', reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setStep(state);
    }
  };

  const getDifference = (value1: number, value2: number) => {
    console.log('value1: number, value2: number: ', value1, value2);
    return value1 - value2;
  };



  const oncameraTransformHandler = (cameraTransform: ViroCameraTransform) => {
    const [fx,fy,fz] = cameraTransform.forward;

    const [px,py,pz] = cameraTransform.position;
  if (fx < -0.6 ) {
    const obj:Position = {position: [fx, -2, -pathPoints.length + 1]};
    if (!(initialNumberToSetLeft > 1)) {
      // console.log('LEFT ::: ');

      setPathPoints([...pathPoints, obj]);
      initialNumberToSetLeft = initialNumberToSetLeft + 1;
      return;
    }

  }else if(fx > 0.6 ){
    const obj:Position = {position: [fx, -2, -pathPoints.length + 1]};
    if (!(initialNumberToSetRight > 1)) {
      // console.log('RIGHT :::');
      setPathPoints([...pathPoints, obj]);
      initialNumberToSetRight = initialNumberToSetRight + 1;
      return;
    }

  }else if (pz > 0.5 || pz < -0.5) {

    // const xVal = pathPoints[pathPoints.length - 1].position[0];
    // const obj:Position = {position: [xVal, -2, -(pathPoints.length + 2)]};
    // if (!(initialNumberToSetForward > 2)) {
    //   initialNumberToSetForward = initialNumberToSetForward + 1;
    //   setPathPoints([...pathPoints, obj]);
    //   return;
    // }

    // if (pathPoints.length === 2) {
    //   initialNumberToSetForward = 0;
    // }

    if (forwardStepCount < stepThreshold) {
      if (!(initialNumberToSetForward > 1)) {
        const xVal = pathPoints[pathPoints.length - 1].position[0];
        const obj: Position = { position: [xVal, -2, -(pathPoints.length + 2)] };
        console.log('AAA');

        setPathPoints([...pathPoints, obj]);
        initialNumberToSetForward += 1;
      }

      forwardStepCount += 1;
    }

    // When the forward step count reaches the threshold, reset the counters
    console.log('forwardStepCount: ', forwardStepCount);
    if (forwardStepCount === stepThreshold) {
      console.log(`Reached ${stepThreshold} steps forward!`);

      // Reset forward step count and other counters for the next round
      forwardStepCount = 0;              // Reset step counter
      initialNumberToSetLeft = 0;         // Reset left movement counter
      initialNumberToSetRight = 0;        // Reset right movement counter
      initialNumberToSetForward = 0;      // Reset forward movement counter
    }
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
