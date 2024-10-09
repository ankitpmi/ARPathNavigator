import React, {useCallback, useEffect, useState} from 'react';
// import Home from './src/screens/home/Home';
// // import { ViroARSceneNavigator } from '@reactvision/react-viro';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {PermissionsAndroid,  Text, View} from 'react-native';



const App = () => {
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinates | undefined>();

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


  console.log('currentLocation :: ', currentLocation);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Test</Text>
      <Text>longitude: {currentLocation && currentLocation.longitude}</Text>
      <Text>latitude: {currentLocation && currentLocation.latitude}</Text>
      <Text>altitude: {currentLocation && currentLocation.altitude}</Text>
    </View>
    // <Home />
    // <ViroARSceneNavigator
    //   initialScene={{
    //     scene: Home,
    //   }}
    // />
  );
};

export default App;
