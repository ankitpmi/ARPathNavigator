import React, {} from 'react';
import Home from './src/screens/home/Home';
import { ViroARSceneNavigator } from '@reactvision/react-viro';



const App = () => {






  return (
    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //   <Text>Test</Text>
    //   <Text>longitude: {currentLocation && currentLocation.longitude}</Text>
    //   <Text>latitude: {currentLocation && currentLocation.latitude}</Text>
    //   <Text>altitude: {currentLocation && currentLocation.altitude}</Text>
    // </View>
    // <Home />
    <ViroARSceneNavigator
      initialScene={{
        scene: Home,
      }}
    />
  );
};

export default App;
