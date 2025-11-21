import React, { useState } from 'react';
import { AppState, PhotoData } from './types';
import PixelBooth from './components/PixelBooth';
import CameraCapture from './components/CameraCapture';
import ResultStrip from './components/ResultStrip';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [capturedPhotos, setCapturedPhotos] = useState<PhotoData[]>([]);

  // Sound Effects (Simple Audio Context or HTML Audio) - Keeping it simple logic-wise
  // In a real production app, we'd use a dedicated sound hook.

  const handleStart = () => {
    setAppState(AppState.SHOOTING);
  };

  const handleCaptureComplete = (photos: PhotoData[]) => {
    setCapturedPhotos(photos);
    setAppState(AppState.PROCESSING);
    // Fake processing delay for retro feel
    setTimeout(() => {
      setAppState(AppState.RESULT);
    }, 2000);
  };

  const handleRetake = () => {
    setCapturedPhotos([]);
    setAppState(AppState.LANDING);
  };

  return (
    <div className="w-full h-screen bg-[#1a120b] relative overflow-hidden">
      
      {/* Room Atmosphere Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,50,30,0.3)_0%,rgba(10,5,0,0.8)_80%)] pointer-events-none"></div>
      
      {/* Wood Floor Effect (Subtle) */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

      {/* Global CRT Scanline Effect Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden h-full w-full opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)]"></div>

      {/* Scene Manager */}
      {appState === AppState.LANDING && (
        <main className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
          <PixelBooth onClick={handleStart} />
        </main>
      )}

      {appState === AppState.SHOOTING && (
        <div className="w-full h-full animate-slide-up">
          <CameraCapture 
            onComplete={handleCaptureComplete} 
            onCancel={() => setAppState(AppState.LANDING)}
          />
        </div>
      )}

      {appState === AppState.PROCESSING && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white font-mono">
          <div className="w-16 h-16 border-4 border-t-red-500 border-r-transparent border-b-red-500 border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl tracking-widest animate-pulse">DEVELOPING FILM...</p>
        </div>
      )}

      {appState === AppState.RESULT && (
        <div className="w-full h-full animate-fade-in">
          <ResultStrip 
            photos={capturedPhotos} 
            onRetake={handleRetake}
          />
        </div>
      )}

    </div>
  );
};

export default App;