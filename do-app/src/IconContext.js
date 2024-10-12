import React, { createContext, useContext } from 'react';

const IconContext = createContext();

export const IconProvider = ({ children, icons }) => {
  return (
    <IconContext.Provider value={icons}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcons = () => {
  return useContext(IconContext);
};