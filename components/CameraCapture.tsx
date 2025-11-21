import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PhotoData } from '../types';

interface CameraCaptureProps {
  onComplete: (photos: PhotoData[]) => void;
  onCancel: () => void;
}

const PHOTO_COUNT = 4;
const COUNTDOWN_START = 3;

const CameraCapture: React.FC<CameraCaptureProps> = ({ onComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [isShooting, setIsShooting] = useState(false);
  const [currentShot, setCurrentShot] = useState(0);

  // Initialize Camera
  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Cannot access camera. Please check permissions.");
        onCancel();
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  // Capture Logic
  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Flip horizontally for mirror effect
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      
      context.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const newPhoto: PhotoData = {
        id: Date.now().toString(),
        dataUrl,
        timestamp: Date.now()
      };

      setPhotos(prev => {
        const updated = [...prev, newPhoto];
        if (updated.length === PHOTO_COUNT) {
            // Finished
            setTimeout(() => onComplete(updated), 1000);
        }
        return updated;
      });
      
      // Flash effect
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
    }
  }, [onComplete]);

  // Sequencer
  useEffect(() => {
    if (!isShooting) return;

    if (currentShot >= PHOTO_COUNT) {
      setIsShooting(false);
      return;
    }

    let timer = COUNTDOWN_START;
    setCountdown(timer);

    const interval = setInterval(() => {
      timer--;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        takePhoto();
        setCountdown(null);
        setCurrentShot(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isShooting, currentShot, takePhoto]);

  const startSession = () => {
    setIsShooting(true);
    setCurrentShot(0);
    setPhotos([]);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Camera Feed */}
      <div className="relative w-full max-w-4xl aspect-video bg-[#1a0505] rounded-lg overflow-hidden border-8 border-[#2b0505] shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
        
        {/* Filters Overlay (Preview only) */}
        {/* 
           Matching user settings: 
           Exposure -100 (~brightness 0.8), 
           Contrast +31 (~contrast 1.3), 
           Saturation -61 (~saturate 0.4) 
        */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ backdropFilter: 'contrast(1.3) brightness(0.8) saturate(0.4)' }}
        ></div>
        
        {/* Grain/Noise Texture (Noise Reduction -21) */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)]"></div>
        
        {/* Countdown Overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <span className="text-[12rem] font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Flash Overlay */}
        <div className={`absolute inset-0 bg-white transition-opacity duration-200 ease-out pointer-events-none ${flash ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Guide Lines */}
        <div className="absolute inset-0 border-2 border-white/20 pointer-events-none flex">
            <div className="w-1/3 h-full border-r border-white/20"></div>
            <div className="w-1/3 h-full border-r border-white/20"></div>
        </div>
        <div className="absolute inset-0 border-2 border-white/20 pointer-events-none flex flex-col">
            <div className="h-1/3 w-full border-b border-white/20"></div>
            <div className="h-1/3 w-full border-b border-white/20"></div>
        </div>
      </div>

      {/* Controls */}
      {!isShooting && photos.length === 0 && (
        <div className="mt-8 flex gap-4 z-10">
            <button 
                onClick={onCancel}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-xl border-b-4 border-black active:border-b-0 active:translate-y-1 rounded uppercase tracking-widest transition-all"
            >
                Exit
            </button>
            <button 
                onClick={startSession}
                className="px-8 py-4 bg-[#800020] hover:bg-[#600018] text-white font-xl border-b-4 border-black active:border-b-0 active:translate-y-1 rounded uppercase tracking-widest transition-all animate-pulse shadow-lg"
            >
                Start Booth
            </button>
        </div>
      )}
      
      {/* Status Text */}
      {isShooting && (
         <div className="mt-6 text-white text-2xl tracking-widest drop-shadow-md">
            PHOTO {currentShot + 1} / {PHOTO_COUNT}
         </div>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;