import React, { useEffect } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import '../Components/Mall.css';
import { useNavigate } from 'react-router-dom';


const Mall = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const isLoggedIn = !!localStorage.getItem('token'); // Replace with your logic if needed
      if (!isLoggedIn) {
        navigate('/home'); // Redirect to home page if user is not logged in
      }
    }, 1000); // Check every second
  
    return () => {
      clearInterval(interval); // Cleanup on component unmount
    };
  }, [navigate]);
  


  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "game/Build/game.loader.js",         // Path to the loader script
    dataUrl: "game/Build/game.data.unityweb",       // Path to the .data file
    frameworkUrl: "game/Build/game.framework.js.unityweb",  // Path to the .framework.js file
    codeUrl: "game/Build/game.wasm.unityweb",       // Path to the .wasm file
  });

  return (
    <div className="unity-container">
     

      {/* Loading Progress */}
      {!isLoaded && (
        <div className="loading">
          <p>Loading... {Math.round(loadingProgression * 100)}%</p>
        </div>
      )}

      {/* Unity Content */}
      <Unity unityProvider={unityProvider} className="unity-content" />
    </div>
  );
};

export default Mall;
