import React from 'react';
import {LocationProvider} from './src/contexts';
import Main from './src/screens/Main';

const App = () => {
  return (
    <LocationProvider>
      <Main />
    </LocationProvider>
  );
};

export default App;
