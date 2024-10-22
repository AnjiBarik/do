import React, { useEffect, useState, Suspense } from 'react';
import { IconProvider } from '../../IconContext';  
import { initialIcons } from './iconImports';  
import getPublicUrl from '../functional/getPublicUrl';
import LoadingSpinner from '../utils/LoadingSpinner';

const loadIcon = async (iconName, defaultUrl) => {  
  const folder = 'iconimg';  
  const url = getPublicUrl({ folder, filename: iconName });  
  try {    
    const img = new Image();    
    img.src = url;    
    await new Promise((resolve, reject) => {      
      img.onload = resolve;      
      img.onerror = reject;    
    });    
    return url;  
  } catch (error) {    
    //console.error(`Error loading icon ${iconName}:`, error);    
    return defaultUrl;  
  }
};

const IconLoader = ({ children }) => {  
  const [icons, setIcons] = useState({});  
  useEffect(() => {    
    const loadAllIcons = async () => {      
      const iconEntries = Object.entries(initialIcons);      
      const updatedIcons = {};      
      await Promise.all(        
        iconEntries.map(async ([key, defaultUrl]) => {          
          updatedIcons[key] = await loadIcon(`${key}.png`, defaultUrl);        
        })      
      );      
      setIcons(updatedIcons);    
    };    
    loadAllIcons();  
  }, []);  

  if (Object.keys(icons).length === 0) {    
    return <LoadingSpinner />;  
  }  

  return (    
    <IconProvider icons={icons}>      
      <Suspense fallback={<LoadingSpinner />}>        
        {children}      
      </Suspense>    
    </IconProvider>  
  );
};

export default IconLoader;