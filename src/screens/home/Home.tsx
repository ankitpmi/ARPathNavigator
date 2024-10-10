import React, {useCallback, useEffect, useState} from 'react';
import {PermissionsAndroid, StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroPolyline,
  ViroTrackingStateConstants,
  ViroText,
} from '@reactvision/react-viro';
import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { calculateARPosition } from '../utils/helper';

// interface Data {
//   position: Array<Number>
// }

const Home = () => {
  const [currentLocation, setCurrentLocation] = useState<
    GeoCoordinates | undefined
  >();

  const [initialLocation, setInitialLocation] = useState<
  GeoCoordinates | undefined
>();
  const [pathPoints, setPathPoints] = useState([{position: [0, -1, -1]}]);
    // const [pathPoints, setPathPoints] = useState(
  //   [
  //     { position: [0,-1, -1] },
  //     { position: [0, -1, -2] },
  //     { position: [0, -1, -3] },
  //     { position: [0, -1, -4] },
  //     { position: [0.5, -1, -5] },
  //     { position: [0.6, -1, -4] },
  //     { position: [0.7, -1, -3] },
  //     { position: [0.8, -1, -1] },
  //   ]
  // );


  // LOCATION LOGIC START

  const startTracking = useCallback(async () => {
     Geolocation.requestAuthorization('always');

    Geolocation.getCurrentPosition(
      (position) => {
        setInitialLocation(position.coords);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );

    Geolocation.watchPosition(
      position => {
        setCurrentLocation(prevState => prevState !== position.coords ? position.coords : prevState);
      },
      error => {
        console.log('maperror in getting location', error.code, error.message);
      },

      {enableHighAccuracy: true, distanceFilter: 1, interval: 0, fastestInterval: 0},
    );
  }, []);
  const Notification = useCallback(() => {
    ReactNativeForegroundService.start({
      id: 1244,
      title: 'Location Tracking',
      message: 'Location Tracking',
      icon: 'ic_launcher',
      button: false,
      button2: false,
      // buttonText: "Button",
      // button2Text: "Anther Button",
      // buttonOnPress: "cray",
      setOnlyAlertOnce: 'true',
      color: '#000000',
    });
    startTracking();
  }, [startTracking]);

  const updateforeground = useCallback(() => {
    ReactNativeForegroundService.add_task(() => startTracking(), {
      delay: 100,
      onLoop: true,
      taskId: 'taskid',
      onError: e => console.log('Error logging:', e),
    });
  }, [startTracking]);

  useEffect(() => {
    requestLocationPermission();
    updateforeground();
    Notification();
    startTracking();
  }, [Notification, startTracking, updateforeground]);

  const requestLocationPermission = async () => {
    Geolocation.requestAuthorization('always');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('1Location permission granted');
      } else {
        console.log('Location permission denied');
      }
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message:
            'We need access to your location ' +
            'so you can get live quality updates.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const clampValue = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const convertGeoToAR = useCallback((latitude: number, longitude: number) => {
    const scaleFactor = 10000; // Adjust this factor as needed

    // Calculate AR position
    const xPosition = clampValue(longitude * scaleFactor, 1, -1); // X = Longitude
    const yPosition = -1; // Always -1 as per your requirement
    const zPosition = clampValue(-latitude * scaleFactor, 1, -1); // Z = -Latitude (depth)

    return [xPosition, yPosition, zPosition]; // Return AR coordinates
  }, []);

  useEffect(() => {
    if (currentLocation && initialLocation) {
      // const positionData = convertGeoToAR(
      //   currentLocation?.latitude,
      //   currentLocation?.longitude,
      // );
      const positionData = calculateARPosition(
        initialLocation,
        currentLocation,
      );
      console.log('distance ::: ', positionData.distance);
      // if (positionData.distance > 1) {
      //   setPathPoints(preState => [...preState, {position: positionData.position}]);
      // }

    }
  }, [ currentLocation, initialLocation]);

  // LOCATION LOGIC END


  const onTrackingUpdated = anchor => {
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

  console.log('PATH ::: ', pathPoints);


  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      {/* {renderPath()} */}
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
