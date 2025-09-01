import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, X, Linkedin, Youtube ,Github} from "lucide-react";

// The new SVG component for the decorative rainbow arches.
// It's used for both sides; the left side is just a CSS-transformed version of this.
const RainbowArch = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 321 626"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    {/* Black outlines to create a cartoonish effect */}
    <path d="M26 0V400C26 510.457 115.543 600 226 600H321" stroke="#121212" strokeWidth="52"></path>
    <path d="M76 0V400C76 482.843 143.157 550 226 550H321" stroke="#121212" strokeWidth="52"></path>
    <path d="M126 0V400C126 455.228 170.772 500 226 500H321" stroke="#121212" strokeWidth="52"></path>
    <path d="M176 0V400C176 427.614 198.386 450 226 450H321" stroke="#121212" strokeWidth="52"></path>
    
    {/* Colored paths that sit on top of the black outlines */}
    <path d="M26 0V400C26 510.457 115.543 600 226 600H321" stroke="#F489A3" strokeWidth="48"></path>
    <path d="M76 0V400C76 482.843 143.157 550 226 550H321" stroke="#F0BB0D" strokeWidth="48"></path>
    <path d="M126 0V400C126 455.228 170.772 500 226 500H321" stroke="#F3A20F" strokeWidth="48"></path>
    <path d="M176 0V400C176 427.614 198.386 450 226 450H321" stroke="#F97028" strokeWidth="48"></path>
  </svg>
);


// Header Component (unchanged)
const Header = () => (
  <header className="relative z-10 w-full px-4 py-4 sm:px-8">
    <div className="container mx-auto flex items-center justify-between border-b-2 border-black pb-2">
      <div className="text-2xl font-bold tracking-widest" style={{ fontFamily: "'Fredoka One', cursive" }}>
        ASHU
      </div>
      <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
           <a href="https://www.linkedin.com/in/ashutosh-dureja-919072209/" className="bg-pink-200 cursor-pointer rounded-full p-2 sm:p-2.5 hover:bg-pink-200 transform transition-colors  duration-[0.4s] ease-out">
            <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
          </a>
          <a href="https://www.instagram.com/ashudureja_/" className="rounded-full cursor-pointer bg-pink-200 p-2 sm:p-2.5 hover:bg-pink-200 transform transition-colors  duration-[0.4s] ease-out">
            <Instagram size={16} className="sm:w-[18px]  sm:h-[18px]" />
          </a>
          <a href="https://github.com/ashudureja?tab=overview&from=2025-06-01&to=2025-06-30" className="bg-pink-200  cursor-pointer rounded-full p-2 sm:p-2.5 hover:bg-pink-200transform transition-colors  duration-[0.4s] ease-out">
            <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
          </a>
          <a href="https://www.linkedin.com/in/ashutosh-dureja-919072209/" className="bg-pink-200 cursor-pointer rounded-full p-2 sm:p-2.5 hover:bg-pink-200 transform transition-colors  duration-[0.4s] ease-out">
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </a>
         
        </div>
      <Link to="/justdraw" className="rounded-lg border-2 border-black bg-pink-300 px-6 py-2 font-semibold shadow-[4px_4px_0px_#000] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1">
       Try For Free
      </Link>
    </div>
  </header>
);

// Main App Component, now using the new RainbowArch
function App() {
  return (
    <div className="relative flex h-screen flex-col items-center overflow-hidden bg-[#f3ecd2] font-sans ">
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter:wght@400;600;700;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      {/* Container for the left rainbow arch. It's flipped horizontally using 'scale-x-[-1]' */}
      <div className="absolute -bottom-8 left-0 w-[255px] h-[500px] hidden lg:block transform scale-x-[-1] scale-y-[-1]">
        <RainbowArch />
      </div>
      
      {/* Container for the right rainbow arch. */}
      <div className="absolute -bottom-8 scale-y-[-1] right-0 w-[255px] h-[500px] hidden lg:block">
        <RainbowArch />
      </div>
      
      <Header />

      <main className="relative lg:mt-5 z-10 flex flex-grow flex-col items-center justify-center px-4 text-center">
        <h1 
          className="text-4xl md:text-7xl lg:text-8xl font-black uppercase"
          style={{ 
            fontFamily: "'Fredoka One', cursive",
            textShadow: '0.25rem 0.25rem 0 #fff, -0.25rem -0.25rem 0 #fff, 0.25rem -0.25rem 0 #fff, -0.25rem 0.25rem 0 #fff, 0.25rem 0.25rem 0 #000, 0.35rem 0.35rem 0 #000',
            transform: 'rotate(-1deg)',
            lineHeight: '1'
          }}
        >
        Think. Create. Draw. The ultimate whiteboard tool.
        </h1>
        
        <Link 
        to="/justdraw"
          className="mt-4 cursor-pointer -rotate-2 border-2 transform rounded-lg bg-orange-400 px-6 py-2 shadow-[4px_4px_0px_#000] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1"
         
        >
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white"
            style={{ 
              fontFamily: "'Fredoka One', cursive",
              WebkitTextStroke: '2px black',
            }}
          >
           Just Draw
          </h2>
        </Link>

        <div className="mt-8 -rotate-3 transform">
          <img 
            src="https://images.squarespace-cdn.com/content/v1/631f91105dc0cf136b50d4ae/1678834282165-O2Q6O5P2JRLPZ4L1UT8B/image-asset.gif" 
            alt="Festival goers enjoying the event"
            className="h-auto w-64 md:w-80 rounded-2xl border-4 border-black object-cover shadow-[10px_10px_0px_#000]"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/320x400/FDF6E9/000?text=Hero+Image'; }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;