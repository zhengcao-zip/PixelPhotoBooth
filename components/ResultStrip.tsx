import React, { useEffect, useRef, useState } from 'react';
import { PhotoData } from '../types';
import { generatePhotoStripCaption } from '../services/geminiService';

interface ResultStripProps {
  photos: PhotoData[];
  onRetake: () => void;
}

const ResultStrip: React.FC<ResultStripProps> = ({ photos, onRetake }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stripDataUrl, setStripDataUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isLoadingCaption, setIsLoadingCaption] = useState(false);
  
  // Printing Animation States
  const [printing, setPrinting] = useState(false);
  const [printComplete, setPrintComplete] = useState(false);

  // Generate the strip canvas
  useEffect(() => {
    const generateStrip = async () => {
      if (!canvasRef.current || photos.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Settings for the strip
      const photoWidth = 400;
      const photoHeight = 300; // 4:3 aspect ratio roughly
      const gap = 20;
      const paddingX = 24;
      const paddingY = 24;
      const bottomSpace = 100;

      const totalWidth = photoWidth + (paddingX * 2);
      const totalHeight = (photoHeight * photos.length) + (gap * (photos.length - 1)) + (paddingY * 2) + bottomSpace;

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // Draw Background (Black Photo Paper)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, totalWidth, totalHeight);
      
      // Draw Photos
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.src = photos[i].dataUrl;
        await new Promise((resolve) => { img.onload = resolve; });

        const x = paddingX;
        const y = paddingY + (i * (photoHeight + gap));

        // Draw Photo
        ctx.save();
        // Apply Custom Filter Settings:
        // Contrast +31 -> 1.3
        // Brightness 0 (but Exp -100) -> 0.8
        // Saturation -61 -> 0.4
        ctx.filter = 'contrast(1.3) brightness(0.8) saturate(0.4)';
        ctx.drawImage(img, x, y, photoWidth, photoHeight);
        ctx.filter = 'none'; // Reset for overlays
        
        // Vignette (Gradient) - Subtle dark corners
        const grad = ctx.createRadialGradient(x + photoWidth/2, y + photoHeight/2, photoHeight/3, x + photoWidth/2, y + photoHeight/2, photoHeight/1.1);
        grad.addColorStop(0.6, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = "multiply";
        ctx.fillRect(x, y, photoWidth, photoHeight);

        // Noise / Grain Generation (Noise Reduction -21)
        // Create a small noise pattern
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = 100;
        noiseCanvas.height = 100;
        const nCtx = noiseCanvas.getContext('2d');
        if (nCtx) {
            const idata = nCtx.createImageData(100, 100);
            const buffer32 = new Uint32Array(idata.data.buffer);
            for (let j = 0; j < buffer32.length; j++) {
                 // Randomly set some pixels to white/grey with low alpha
                if (Math.random() < 0.5) {
                   // ABGR - High alpha noise, blended down later
                   buffer32[j] = 0x22FFFFFF; 
                }
            }
            nCtx.putImageData(idata, 0, 0);
            
            const pattern = ctx.createPattern(noiseCanvas, 'repeat');
            if (pattern) {
                ctx.globalCompositeOperation = "overlay";
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = pattern;
                ctx.fillRect(x, y, photoWidth, photoHeight);
            }
        }

        ctx.restore();

        // Border (Dark gray on black)
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoWidth, photoHeight);
      }

      // Draw Footer Timestamp (Stamp style)
      ctx.textAlign = 'right';
      ctx.font = '18px VT323';
      ctx.fillStyle = '#888888'; // Light gray on black
      const dateStr = new Date().toLocaleDateString();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ctx.fillText(`#${Math.floor(Math.random() * 10000)} • ${dateStr} ${timeStr}`, totalWidth - paddingX, totalHeight - 15);

      // If caption exists, draw it
      if (caption) {
         ctx.textAlign = 'center';
         ctx.font = '28px VT323';
         ctx.fillStyle = '#ffffff'; // White text on black
         ctx.fillText(caption, totalWidth / 2, totalHeight - 55);
      }

      setStripDataUrl(canvas.toDataURL('image/png'));
    };

    generateStrip();
  }, [photos, caption]);

  // Handle Printing Animation Sequence
  useEffect(() => {
    if (stripDataUrl) {
      const startTimer = setTimeout(() => {
        setPrinting(true);
      }, 100);

      const endTimer = setTimeout(() => {
        setPrintComplete(true);
      }, 5500);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [stripDataUrl]);

  const handleDownload = () => {
    if (stripDataUrl) {
      const link = document.createElement('a');
      link.download = `photobooth-${Date.now()}.png`;
      link.href = stripDataUrl;
      link.click();
    }
  };

  const handleMagicCaption = async () => {
    if (!stripDataUrl) return;
    setIsLoadingCaption(true);
    
    const base64 = stripDataUrl.split(',')[1];
    const newCaption = await generatePhotoStripCaption(base64);
    
    setCaption(newCaption);
    setIsLoadingCaption(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-[#1a0505] text-white overflow-hidden">
      
      {/* Left: Photo Output Area (The Printer Slot) */}
      <div 
        className={`flex-1 h-full bg-[#0f0000] relative flex flex-col items-center justify-center transition-colors duration-500 ${printComplete ? 'overflow-hidden' : 'overflow-hidden'}`}
      >
        {/* Printer Slot Visual - Fixed at top */}
        <div className="absolute top-0 w-full h-6 bg-[#1a0000] z-20 shadow-[0_15px_20px_-5px_rgba(0,0,0,0.9)] border-b border-gray-800">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white opacity-20"></div>
        </div>

        {/* Pattern Background inside the bin */}
        <div className="fixed inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>

        {/* The Moving Photo Strip */}
        <div className={`
            relative flex-shrink-0 z-10 h-full flex items-center justify-center
            transition-transform ease-linear will-change-transform
            ${printing ? 'duration-[5000ms] translate-y-0' : 'duration-0 -translate-y-[150%]'}
        `}>
            {stripDataUrl && (
              <img 
                src={stripDataUrl} 
                alt="Printed Strip" 
                className="max-h-[90vh] max-w-[95%] w-auto object-contain shadow-2xl border border-gray-800"
              />
            )}
        </div>

        {/* Printing Indicator */}
        {!printComplete && printing && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black border border-white text-white px-4 py-1 rounded font-['VT323'] tracking-widest animate-pulse z-50">
                 PRINTING...
            </div>
        )}
      </div>

      {/* Right: Controls */}
      <div className="w-full md:w-96 bg-[#2b0505] p-8 flex flex-col justify-center gap-6 z-30 shadow-2xl border-l border-black relative">
        
        {/* Lock controls during printing */}
        {!printComplete && (
            <div className="absolute inset-0 bg-black/80 z-50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                 <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            </div>
        )}

        <div className="mb-4 text-center">
          <h2 className="text-4xl text-white mb-2 tracking-wider">YOUR PHOTOS</h2>
          <p className="text-gray-400 text-lg">Fresh from the lab.</p>
        </div>

        {/* AI Button */}
        <button 
            onClick={handleMagicCaption}
            disabled={isLoadingCaption || !!caption || !printComplete}
            className={`group relative px-6 py-4 rounded border-2 font-bold text-xl transition-all overflow-hidden
            ${caption ? 'border-gray-500 text-gray-400 cursor-default' : 'border-white text-white hover:bg-white/10 hover:border-white'}`}
        >
             <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
                {isLoadingCaption ? (
                    <><span>ANALYZING...</span><span className="animate-spin">◐</span></>
                ) : caption ? (
                    <span>CAPTION ADDED ✓</span>
                ) : (
                    <><span>✨ ADD AI MEMORY</span></>
                )}
            </span>
        </button>

        {caption && (
            <div className="bg-black/50 p-4 rounded border border-white/20 text-center animate-fade-in">
                <p className="text-white text-lg italic">"{caption}"</p>
            </div>
        )}

        <div className="h-px bg-white/20 my-2"></div>

        <button 
            onClick={handleDownload}
            disabled={!printComplete}
            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 text-xl uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Download Strip
        </button>

        <button 
            onClick={onRetake}
            disabled={!printComplete}
            className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-bold py-3 text-lg uppercase tracking-widest transition-colors border-2 border-gray-700 hover:border-gray-500 disabled:opacity-50"
        >
            Trash & Retake
        </button>

      </div>

      {/* Hidden Canvas Generator */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ResultStrip;