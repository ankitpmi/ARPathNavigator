import React, {useState} from 'react';
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
import { useGlobalContext } from '../../contexts';

let initialNumberToSetLeft = 0;
let initialNumberToSetRight = 0;
let initialNumberToSetForward = 0;
let forwardStepCount = 0; // Step counter for forward movement
let rightStepCount = 0; // Step counter for forward movement
const stepThreshold = 200;
interface Position {
  position: number[];
}
const Home = () => {
  const [pathPoints, setPathPoints] = useState<Array<Position>>([
    {position: [0, -2, -2]},
  ]);
  const {isStopTracking, directionHandler, direction} =
  useGlobalContext();
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

  const onTrackingUpdated = (
    state: ViroTrackingState,
    reason: ViroTrackingReason,
  ) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setStep(state);
    }
  };

  const oncameraTransformHandler = (cameraTransform: ViroCameraTransform) => {
    if (isStopTracking) {
      return;
    }
    const [fx, fy, fz] = cameraTransform.forward;

    const [px, py, pz] = cameraTransform.position;

    if (fx < -0.6) {
      // console.log('LEFT ::: ');
      if (!(initialNumberToSetLeft > 1)) {
        const lastZval = pathPoints[pathPoints.length - 1].position[2];
        // const obj:Position = {position: [fx - (-0.12) , -2, -pathPoints.length ]};
        const obj: Position = {position: [fx - -0.12, -2, lastZval]};
        setPathPoints([...pathPoints, obj]);
        directionHandler({...direction, left: fx - -0.12});
        initialNumberToSetLeft = initialNumberToSetLeft + 1;
        return;
      }
      // const lastZval = pathPoints[pathPoints.length - 1].position[2];
      // const obj: Position = { position: [px - 0.12, -2, lastZval] };  // Adjusted px for left movement
      // setPathPoints([...pathPoints, obj]);
      // initialNumberToSetLeft += 1;

      // // Reset other direction counters
      // initialNumberToSetRight = 0;
      // initialNumberToSetForward = 0;
      // return;
    } else if (fx > 0.6) {
      // console.log('RIGHT :::');
      if (rightStepCount <= 0.5) {
        if (!(initialNumberToSetRight > 1)) {
          const lastZval = pathPoints[pathPoints.length - 1].position[2];
          const obj: Position = {position: [fx + 0.12 , -2, lastZval ]};
          setPathPoints([...pathPoints, obj]);
          directionHandler({...direction, right: fx + 0.12});
          initialNumberToSetRight = initialNumberToSetRight + 1;
          return;
        }
        rightStepCount += 0.5;
      }

      if (rightStepCount === 0.5) {
        console.log('call right');

        // Reset forward step count and other counters for the next round
        rightStepCount = 0; // Reset step counter
        // initialNumberToSetLeft = 0; // Reset left movement counter
        initialNumberToSetRight = 0; // Reset right movement counter
        // initialNumberToSetForward = 0; // Reset forward movement counter
      }
      // const lastZval = pathPoints[pathPoints.length - 1].position[2];
      // const obj: Position = { position: [px + 0.12, -2, lastZval] };  // Adjusted px for right movement
      // setPathPoints([...pathPoints, obj]);
      // initialNumberToSetRight += 1;

      // // Reset other direction counters
      // initialNumberToSetLeft = 0;
      // initialNumberToSetForward = 0;
      // return;
    } else if (pz > 0.5 || pz < -0.5) {
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
          const zVal = -(pathPoints.length + 1);
          const obj: Position = {position: [xVal, -2, zVal]};

          setPathPoints([...pathPoints, obj]);
          directionHandler({...direction, forward: fx + 0.12});
          initialNumberToSetForward += 1;
        }
        forwardStepCount += 1;
      }

      // When the forward step count reaches the threshold, reset the counters
      if (forwardStepCount === stepThreshold) {
        console.log('call');

        // Reset forward step count and other counters for the next round
        forwardStepCount = 0; // Reset step counter
        initialNumberToSetLeft = 0; // Reset left movement counter
        initialNumberToSetRight = 0; // Reset right movement counter
        initialNumberToSetForward = 0; // Reset forward movement counter
      }
    }
  };

  const renderPath = () => {
    return (
      <ViroPolyline
        points={pathPoints.map(point => point.position)}
        color={'#FF0000'} // Red color for the path
        thickness={0.1}
      />
    );
  };

  return (
    <>
      <ViroARScene
        anchorDetectionTypes="None"
        onCameraTransformUpdate={oncameraTransformHandler}
        onTrackingUpdated={onTrackingUpdated}>
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
