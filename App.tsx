import React from 'react';
import Home from './src/screens/home/Home';
import { ViroARSceneNavigator } from '@reactvision/react-viro';

const App = () => {
  return (
    // <Home />
    <ViroARSceneNavigator
      initialScene={{
        scene: Home,
      }}
    />
  );
};

export default App;

