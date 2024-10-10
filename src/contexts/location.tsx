import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import { PermissionsAndroid } from 'react-native';

export interface LocationContextType {
  initialLocation: GeoCoordinates | undefined;
  currentLocation: GeoCoordinates | undefined;
}

export interface LocationProviderProps extends React.PropsWithChildren{

}

const initialContext: LocationContextType = {
  currentLocation: undefined,
  initialLocation: undefined,
};

export const LocationContext =
  createContext<LocationContextType>(initialContext);

export const useLocationContext = () =>
  useContext<LocationContextType>(LocationContext);

export const LocationProvider = ({children}: LocationProviderProps) => {
  const [currentLocation, setCurrentLocation] = useState<
    GeoCoordinates | undefined
  >();

  const [initialLocation, setInitialLocation] = useState<
    GeoCoordinates | undefined
  >();

  const startTracking = useCallback(async () => {
    Geolocation.requestAuthorization('always');

    Geolocation.getCurrentPosition(
      position => {
        setInitialLocation(position.coords);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    Geolocation.watchPosition(
      position => {
        setCurrentLocation(prevState =>
          prevState !== position.coords ? position.coords : prevState,
        );
      },
      error => {
        console.log('maperror in getting location', error.code, error.message);
      },

      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 0,
        fastestInterval: 0,
      },
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
  return(
    <>
    <LocationContext.Provider value={{currentLocation, initialLocation}}>
      {children}
    </LocationContext.Provider>
    </>
  );
};
