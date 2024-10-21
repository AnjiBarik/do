import React from 'react';

const LoadingSpinner = () => (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: `
      linear-gradient(to bottom, #000000, #001133),
      radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0) 50%)
    `,
    backgroundSize: "cover",
    overflow: "hidden",
    zIndex: 0,
  }}>
    <div style={{
      display: "inline-block",
      animation: "spin 1s linear infinite",
      fontSize: "5rem",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
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
      <div key={'comet'} style={{
        position: "absolute",
        fontSize: "2rem",
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        animation: `blink ${Math.random() * 5 + 2}s linear infinite ${Math.random() * 3}s, fly ${Math.random() * 5 + 2}s linear infinite ${Math.random() * 3}s`
      }}>🛸</div>
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
      @keyframes fly {
        0% { transform: translateX(-50%) translateY(-50%) skewY(0deg); opacity: 0; }
        50% { transform: translateX(50%) translateY(50%) skewY(30deg); opacity: 1; } 
        100% { transform: translateX(150%) translateY(150%) skewY(0deg); opacity: 0; }
  }
    `}</style>
  </div>
);

export default LoadingSpinner;


// import React from 'react';

// const LoadingSpinner = () => (
//   <div style={{
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100vw",
//     height: "100vh",
//     background: `
//       linear-gradient(to bottom, #000000, #001133),
//       radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0) 50%)
//     `,
//     backgroundSize: "cover",
//     overflow: "hidden",
//     zIndex: 0,
//   }}>
//     <div style={{
//       display: "inline-block",
//       animation: "spin 1s linear infinite",
//       fontSize: "5rem",
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)"
//     }}>
//      🌎
//     </div>
//     <div style={{
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       pointerEvents: "none",
//       overflow: "hidden"
//     }}>
//       {[...Array(150)].map((_, i) => (
//         <div key={i} style={{
//           position: "absolute",
//           width: "2px",
//           height: "2px",
//           backgroundColor: "white",
//           borderRadius: "50%",
//           top: `${Math.random() * 100}vh`,
//           left: `${Math.random() * 100}vw`,
//           animation: `blink ${Math.random() * 2 + 1}s infinite ${Math.random() * 2}s`
//         }}></div>
//       ))}     

//     </div>
//     <style>{`
//       @keyframes spin {
//         from { transform: rotate(0deg); }
//         to { transform: rotate(360deg); }
//       }
//       @keyframes blink {
//         0%, 100% { opacity: 0; }
//         50% { opacity: 1; }
//       }
//     `}</style>
//   </div>
// );

// export default LoadingSpinner;


// import React from 'react';

// const LoadingSpinner = () => (
//   <div style={{
//     margin: 0,
//     height: "100vh",
//     width: "100vw",
//     background: `
//       linear-gradient(to bottom, #000000, #001133),
//       radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0) 50%)
//     `,
//     backgroundSize: "cover",
//     position: "relative",
//     overflow: "hidden",
//     display: "flex",
//     justifyContent: "center",  // Центрирование по горизонтали
//     alignItems: "center"       // Центрирование по вертикали
//   }}>
//     <div style={{
//       display: "inline-block",
//       animation: "spin 1s linear infinite",
//       fontSize: "5rem",
//       zIndex: 2
//     }}>
//       🌎
//     </div>
//     <div style={{
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       pointerEvents: "none",
//       overflow: "hidden"
//     }}>
//       {[...Array(150)].map((_, i) => (
//         <div key={i} style={{
//           position: "absolute",
//           width: "2px",
//           height: "2px",
//           backgroundColor: "white",
//           borderRadius: "50%",
//           top: `${Math.random() * 100}vh`,
//           left: `${Math.random() * 100}vw`,
//           animation: `blink ${Math.random() * 2 + 1}s infinite ${Math.random() * 2}s`
//         }}></div>
//       ))}
//     </div>
//     <style>{`
//       @keyframes spin {
//         from { transform: rotate(0deg); }
//         to { transform: rotate(360deg); }
//       }
//       @keyframes blink {
//         0%, 100% { opacity: 0; }
//         50% { opacity: 1; }
//       }
//     `}</style>
//   </div>
// );

// export default LoadingSpinner;
