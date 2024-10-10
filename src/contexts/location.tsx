import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {PermissionsAndroid} from 'react-native';

interface LatLang {
  latitude: number;
  longitude: number;
}

export interface LocationContextType {
  initialLocation: GeoCoordinates | undefined;
  currentLocation: GeoCoordinates | undefined;
  clearWatchHandler: () => void;
}

export interface LocationProviderProps extends React.PropsWithChildren {}

const initialContext: LocationContextType = {
  currentLocation: undefined,
  initialLocation: undefined,
  clearWatchHandler: () => null,
};

export const LocationContext =
  createContext<LocationContextType>(initialContext);

export const useLocationContext = () =>
  useContext<LocationContextType>(LocationContext);

export const LocationProvider = ({children}: LocationProviderProps) => {
  const [currentLocation, setCurrentLocation] = useState<
    GeoCoordinates | undefined
  >();

  const [initialLocation, setInitialLocation] = useState<GeoCoordinates>();

  const [watchId, setWatchId] = useState<number | null>(0);

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
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );

    let getWatchId = Geolocation.watchPosition(
      position => {
        const distance = calculateDistance(
          {
            latitude: currentLocation?.latitude ?? 23.0710301,
            longitude: currentLocation?.longitude ?? 72.5181042,
          },
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        );
        console.log('distance: ', distance.toFixed());
        // }
        if (distance > 3) {
          setCurrentLocation(prevState =>
            prevState !== position.coords ? position.coords : prevState,
          );
        }
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
    setWatchId(getWatchId);
  }, [currentLocation?.latitude, currentLocation?.longitude]);
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
    // updateforeground();
    // Notification();
    startTracking();
  }, [startTracking]);

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

  const clearWatchHandler = () => {
    console.log('watchId in function ::: ', watchId);
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  return (
    <>
      <LocationContext.Provider
        value={{currentLocation, initialLocation, clearWatchHandler}}>
        {children}
      </LocationContext.Provider>
    </>
  );
};

// Utility to calculate distance between two locations using Haversine formula
function degToRad(deg: number) {
  return deg * (Math.PI / 180);
}
const calculateDistance = (prevPos: LatLang, newPos: LatLang) => {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = degToRad(newPos.latitude - prevPos.latitude);
  const dLon = degToRad(newPos.longitude - prevPos.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(prevPos.latitude)) *
      Math.cos(degToRad(newPos.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInMeters = R * c; // Distance in meters
  return distanceInMeters;
};
