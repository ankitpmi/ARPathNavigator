import React from 'react';
import { View, Text } from 'react-native';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import Home from './home/Home';
import { useLocationContext } from '../contexts';

const Main = () => {
  const {currentLocation,initialLocation} = useLocationContext();
  return (
    <>
     <ViroARSceneNavigator
      initialScene={{
        scene: Home,
      }}
      />
    <View style={{padding: 8}}>

      <View style={{marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#000'}}>
      <Text style={{fontSize: 14, fontWeight: 600}}>Initial Location:</Text>
      <Text>Latitude : {initialLocation?.latitude}</Text>
      <Text>Longitude : {initialLocation?.longitude}</Text>
      </View>
      <View>
      <Text style={{fontSize: 14, fontWeight: 600}}>Current Location:</Text>
      <Text>Latitude : {currentLocation?.latitude}</Text>
      <Text>Longitude : {currentLocation?.longitude}</Text>
      </View>
    </View>
    </>
  );
};

export default Main;
