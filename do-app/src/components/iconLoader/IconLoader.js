import React, { useEffect, useState, Suspense } from 'react';
import { IconProvider } from '../../IconContext';  
import { initialIcons } from './iconImports';  
import getPublicUrl from '../functional/getPublicUrl';

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

const LoadingSpinner = () => (
  <div style={{
    margin: 0,
    height: "100vh",
    width: "100vw",
    background: `
      linear-gradient(to bottom, #000000, #001133),
      radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0) 50%)
    `,
    backgroundSize: "cover",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",  // Центрирование по горизонтали
    alignItems: "center"       // Центрирование по вертикали
  }}>
    <div style={{
      display: "inline-block",
      animation: "spin 1s linear infinite",
      fontSize: "5rem",
      zIndex: 2
    }}>
      🌎
    </div>
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      overflow: "hidden"
    }}>
      {[...Array(150)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: "2px",
          height: "2px",
          backgroundColor: "white",
          borderRadius: "50%",
          top: `${Math.random() * 100}vh`,
          left: `${Math.random() * 100}vw`,
          animation: `blink ${Math.random() * 2 + 1}s infinite ${Math.random() * 2}s`
        }}></div>
      ))}
    </div>
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes blink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);

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