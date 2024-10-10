import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {ViroARSceneNavigator} from '@reactvision/react-viro';
import Home from './home/Home';
import {useLocationContext} from '../contexts';

const Main = () => {
  const {currentLocation, initialLocation, clearWatchHandler} =
    useLocationContext();
  return (
    <>
      <ViroARSceneNavigator
        initialScene={{
          scene: Home,
        }}
      />
      <View style={{padding: 8}}>
        <View
          style={{
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#000',
          }}>
          <Text style={{fontSize: 14, fontWeight: 600}}>Initial Location:</Text>
          <Text>Latitude : {initialLocation?.latitude}</Text>
          <Text>Longitude : {initialLocation?.longitude}</Text>
        </View>
        <View>
          <Text style={{fontSize: 14, fontWeight: 600}}>Current Location:</Text>
          <Text>Latitude : {currentLocation?.latitude}</Text>
          <Text>Longitude : {currentLocation?.longitude}</Text>
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
      </View>
    </>
  );
};

export default Main;
