import React from 'react';

interface PixelBoothProps {
  onClick: () => void;
}

const PixelBooth: React.FC<PixelBoothProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in">
      {/* The Booth Sprite Container */}
      <div 
        onClick={onClick}
        className="relative w-[320px] h-[480px] group cursor-pointer select-none transition-transform hover:scale-105 duration-300"
      >
        {/* --- Top Banner / Marquee --- */}
        <div className="absolute top-0 left-4 right-4 h-16 bg-[#2b0505] border-4 border-black z-30 flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.3)]">
            {/* Sign */}
            <div className="bg-white border-2 border-black px-4 py-1 flex items-center gap-2 shadow-sm">
                <span className="font-['VT323'] text-3xl text-black tracking-[0.2em] font-bold">PHOTO</span>
            </div>
            {/* Flashing Bulbs - White */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white border border-black animate-pulse shadow-[0_0_5px_white]"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-white border border-black animate-pulse delay-700 shadow-[0_0_5px_white]"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-white border border-black animate-pulse delay-300 shadow-[0_0_5px_white]"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-white border border-black animate-pulse delay-1000 shadow-[0_0_5px_white]"></div>
        </div>

        {/* --- Main Structure --- */}
        <div className="absolute top-14 left-0 w-full bottom-8 bg-[#4a0404] border-4 border-black flex z-20">
            
            {/* Left Panel */}
            <div className="w-12 h-full bg-[#2b0505] border-r-4 border-black flex flex-col gap-3 py-6 items-center">
                 {/* Decorative pixels (bolts) */}
                 <div className="w-2 h-2 bg-black/60"></div>
                 <div className="w-2 h-2 bg-black/60"></div>
                 <div className="w-2 h-2 bg-black/60"></div>
                 <div className="w-2 h-2 bg-black/60 mt-auto"></div>
            </div>

            {/* Center Entrance (Curtains) */}
            <div className="flex-1 relative bg-[#1a0000] overflow-hidden">
                {/* Inside of booth (Background) */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#0f0000]">
                    {/* Seat */}
                    <div className="absolute bottom-0 w-24 h-24 bg-black rounded-t-lg"></div>
                    {/* Screen/Mirror hint */}
                    <div className="absolute top-10 w-24 h-32 bg-gray-800 border-4 border-gray-600 opacity-40"></div>
                    
                    {/* Prompt text inside */}
                     <span className="z-10 bg-white text-black border border-black px-2 py-1 text-xl font-['VT323'] animate-bounce">ENTER</span>
                </div>
                
                {/* Curtain Left - Burgundy */}
                <div className="absolute top-0 left-0 h-full w-1/2 bg-[#800020] border-r-2 border-black/50 origin-left transition-transform duration-500 group-hover:scale-x-25 ease-in-out z-10">
                     {/* Texture for curtain folds */}
                     <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.3)_20px,rgba(0,0,0,0.3)_40px)]"></div>
                </div>

                {/* Curtain Right - Burgundy */}
                <div className="absolute top-0 right-0 h-full w-1/2 bg-[#800020] border-l-2 border-black/50 origin-right transition-transform duration-500 group-hover:scale-x-25 ease-in-out z-10">
                     <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.3)_20px,rgba(0,0,0,0.3)_40px)]"></div>
                </div>
            </div>

            {/* Right Panel (Controls) */}
            <div className="w-20 h-full bg-[#2b0505] border-l-4 border-black flex flex-col items-center py-8">
                 {/* Coin Slot */}
                 <div className="w-10 h-14 bg-black border-2 border-gray-700 mb-2 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-gray-800 border border-gray-600"></div>
                 </div>
                 <div className="text-sm text-white font-['VT323'] mb-8 text-center leading-3">INSERT<br/>COIN</div>

                 {/* Buttons */}
                 <div className="flex flex-col gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#800020] border-2 border-black shadow-[2px_2px_0_black]"></div>
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-black shadow-[2px_2px_0_black]"></div>
                 </div>

                 {/* Photos Slot */}
                 <div className="mt-auto mb-8 w-12 h-4 bg-black border-y-2 border-gray-800"></div>
            </div>
        </div>

        {/* --- Base Platform --- */}
        <div className="absolute bottom-0 left-[-10px] right-[-10px] h-8 bg-[#1a0505] border-4 border-black z-10 flex items-center justify-center">
            <div className="w-full h-2 bg-white/5"></div>
        </div>
      </div>
      
      {/* Floor Shadow */}
      <div className="w-[360px] h-6 bg-black/60 rounded-[50%] mt-2 blur-md"></div>
      
      <div className="mt-8 text-center">
         <p className="text-white text-2xl font-['VT323'] tracking-widest animate-pulse drop-shadow-md">
            [ CLICK MACHINE TO START ]
         </p>
      </div>
    </div>
  );
};

export default PixelBooth;