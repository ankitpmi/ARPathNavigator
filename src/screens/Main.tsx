import React from 'react';
import { View, Text } from 'react-native';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import Home from './home/Home';

const Main = () => {
  return (
    <>
     <ViroARSceneNavigator
      initialScene={{
        scene: Home,
      }}
      />
    <View>
      <Text>Test</Text>
    </View>
    </>
  );
};

export default Main;
