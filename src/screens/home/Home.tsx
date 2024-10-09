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

// interface Data {
//   position: Array<Number>
// }

const Home = () => {
  const [currentLocation, setCurrentLocation] = useState<
    GeoCoordinates | undefined
  >();
  const [pathPoints, setPathPoints] = useState([{position: [0, 0, 0]}]);

  // const [pathPoints, setPathPoints] = useState();

  // LOCATION LOGIC START

  const startTracking = useCallback(async () => {
    let s = Geolocation.requestAuthorization('always');
    console.log('s: ', s);

    Geolocation.watchPosition(
      position => {
        let coordinates: any = [];
        coordinates[0] = position.coords.longitude;
        coordinates[1] = position.coords.latitude;
        coordinates[2] = position.coords.altitude;
        setCurrentLocation(position.coords);
      },
      error => {
        console.log('maperror in getting location', error.code, error.message);
      },

      {enableHighAccuracy: true, distanceFilter: 1},
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
    if (currentLocation) {
      const positionData = convertGeoToAR(
        currentLocation?.latitude,
        currentLocation?.longitude,
      );

      setPathPoints(preState => [...preState, {position: positionData}]);
    }
  }, [convertGeoToAR, currentLocation]);

  // LOCATION LOGIC END
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

  const onTrackingUpdated = anchor => {
    console.log('anchor: ', anchor);
    if (anchor.tracking === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log('CALLED');

      // Tracking is normal; you can handle further navigation logic here if needed.
    }
  };
  const renderPath = () => {
    return (
      <ViroPolyline
        // points={pathPoints.map(point => point.position)}
        color={'#FF0000'} // Red color for the path
        // width={0.01} // Adjust the width of the line
        thickness={0.1}
      />
    );
  };

  console.log('pathPoints :::::: ', pathPoints);

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      {renderPath()}
      {pathPoints.map((point, index) => {
        // console.log('TEST :: ', point.position);

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
