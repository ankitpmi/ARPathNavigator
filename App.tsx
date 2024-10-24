import React from 'react';
import {GlobalProvider} from './src/contexts';
import Main from './src/screens/Main';

const App = () => {
  return (
    <GlobalProvider>
      <Main />
     </GlobalProvider>
  );
};

export default App;
