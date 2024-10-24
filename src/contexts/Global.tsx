import React, {
  createContext,
  useContext,
  useState,
} from 'react';

export interface Directions {
  left: number
  right:  number
  forward: number
}

export interface GlobalContextType {
  isStopTracking: boolean
  stopTrackingHandler: () => void;
  direction: Directions
  directionHandler: (val: Directions) => void
}

export interface GlobalProviderProps extends React.PropsWithChildren {}

const initialContext: GlobalContextType = {
  isStopTracking: false,
  stopTrackingHandler: () => null,
  directionHandler: () => null,
  direction: {
    forward: 0,
    left: 0,
    right: 0,
  },
};

export const GlobalContext =
  createContext<GlobalContextType>(initialContext);

export const useGlobalContext = () =>
  useContext<GlobalContextType>(GlobalContext);

export const GlobalProvider = ({children}: GlobalProviderProps) => {

  const [isStopTracking, setIsStopTracking] = useState(false);
  const [direction, setDirection] = useState<Directions>({
    forward: 0,
    left: 0,
    right: 0,
  });

  const stopTrackingHandler = () => {
    setIsStopTracking(prevState => !prevState);
  };

  const directionHandler = (val: Directions) => {
    const obj = { ...val};
    setDirection(obj);
  };

  return(
    <GlobalContext.Provider value={{isStopTracking, stopTrackingHandler, direction, directionHandler}}>
      {children}
    </GlobalContext.Provider>
  );
};
