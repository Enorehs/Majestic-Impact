import React, { useState, useEffect } from 'react';
import { Settings, Star, X } from 'lucide-react';

const QUEST_POOL = {
  1: [
    { title: "Oof... Missed it!", desc: '"What ra, expecting a 5-star bro? Showing too much cock. Try next time!"' }
  ],
  3: [
    { title: "Chopstick Dosa", desc: "Eat a Masala Dosa using only chopsticks." },
    { title: "Subway Surfer", desc: "Get stuck in traffic and film a split-screen 'Subway Surfers' vlog." },
    { title: "Darshini Critic", desc: "Try Filter Coffee at a random Darshini and review it like a harsh food critic." },
    { title: "NPC Idle", desc: "Stand in a random queue doing a video game 'idle animation'." },
    { title: "Local Slang 101", desc: "Ask a local to teach you 3 Kannada phrases and use them in a sentence." },
    { title: "Supermarket K-Pop", desc: "Do a 5-second K-pop choreo in a grocery aisle." },
    { title: "Mewing Streak", desc: "Order your food while maintaining a perfect 'mewing' face (no speaking)." }
  ],
  4: [
    { title: "The Recognition Challenge", desc: "Walk through any busy area. The 7th person to recognize your cosplay wins a merch prize!" },
    { title: "Main Character Entrance", desc: "Walk into a busy cafe/store with epic anime music playing on a speaker." },
    { title: "Domain Expansion", desc: "Hit a dramatic Domain Expansion pose while eating Meghana Foods Biryani." },
    { title: "Startup Pitch", desc: "Find a stranger and ask them to pitch their startup to you." },
    { title: "The 'Are You...?'", desc: "Wear a very subtle anime accessory; see if anyone spots it and comments." },
    { title: "Cinematic Tourist", desc: "Offer to take a photo for a tourist, but make it super dramatic and cinematic." }
  ],
  5: [
    { title: "Flash Mob", desc: "Find a group of people and lead a simple, 10-second viral dance." },
    { title: "Rameshwaram Trial", desc: "Eat a whole plate of Rameshwaram Cafe Ghee Podi Idli without flinching." },
    { title: "Secret Lore Hunt", desc: "Hide a handwritten doodle/note in a public spot and post a 'treasure map' clue on your story." },
    { title: "Cosplay Prop Swap", desc: "Swap a small prop or accessory with a willing fan for a selfie." },
    { title: "PAX Hype Speech", desc: "Give a 10-second hype speech about PAX in the middle of a public park." }
  ]
};

const sketchyStyle = {
  borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
  border: '3px solid #4a4a4a',
  boxShadow: '4px 4px 0px #4a4a4a'
};

const DoodleCloud = ({ size, top, speed, delay, opacity }) => (
  <div 
    className="absolute left-[-250px] pointer-events-none" 
    style={{ top, animation: `float ${speed} linear infinite ${delay}`, opacity }}
  >
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" fill="#ffffff" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 25 50 C 10 50 5 40 10 25 C 10 10 30 10 40 20 C 50 5 75 5 85 20 C 95 25 95 50 75 50 Z" />
    </svg>
  </div>
);

const HangingStar = ({ left, right, delay, length, size, color, hiddenMobile }) => (
  <div 
    className={`absolute top-0 pointer-events-none z-0 ${hiddenMobile ? 'hidden md:block' : ''}`} 
    style={{ 
      left, 
      right, 
      transformOrigin: 'top center', 
      animation: `sway 4s ease-in-out infinite ${delay}` 
    }}
  >
    <div style={{ width: '4px', height: `${length}px`, backgroundColor: '#4a4a4a', margin: '0 auto' }} />
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ margin: '0 auto', marginTop: '-4px' }}>
      <path d="M 50 5 L 65 35 L 95 40 L 70 60 L 80 90 L 50 75 L 20 90 L 30 60 L 5 40 L 35 35 Z" fill={color} stroke="#4a4a4a" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  </div>
);

export default function App() {
  const [tabiCoins, setTabiCoins] = useState("⏳"); // Default fallback
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [customAmount, setCustomAmount] = useState(''); // NEW: State for custom coin input
  const [showWarning, setShowWarning] = useState(false); // NEW: State for the red warning
  
  const [phase, setPhase] = useState('idle'); 
  const [result, setResult] = useState(null);
  
  const costPerPull = 50;

  // FETCH DATA ON LOAD
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&family=Caveat:wght@600;700&family=Patrick+Hand&family=Luckiest+Guy&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Grab coins from Spring Boot
    fetch('https://pax-gacha-backend.onrender.com/api/coins')
      .then(res => res.json())
      .then(data => setTabiCoins(data))
      .catch(err => console.error("Backend not running or connected yet:", err));

    return () => document.head.removeChild(link);
  }, []);

  // SAVE DATA TO BACKEND
  const updateBackendCoins = (newAmount) => {
    setTabiCoins(newAmount); // Update UI instantly
    fetch(`https://pax-gacha-backend.onrender.com/api/coins/update?newBalance=${newAmount}`, {
      method: 'POST'
    }).catch(err => console.error("Failed to save to backend:", err));
  };

  const getRarity = () => {
    const rand = Math.random() * 100;
    if (rand < 5) return 5;
    if (rand < 25) return 4;
    if (rand < 70) return 3;
    return 1;
  };

  const handlePull = () => {
    const handlePull = () => {
    if (tabiCoins === "⏳") return;
    if (tabiCoins < costPerPull) {
      // Trigger the red text warning instead of an alert
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    updateBackendCoins(tabiCoins - costPerPull);
    
    const r = getRarity();
    const pool = QUEST_POOL[r];
    const item = pool[Math.floor(Math.random() * pool.length)];
    setResult({ ...item, rarity: r, id: Date.now() });

    setPhase('hiding'); 
    setTimeout(() => setPhase('notebook'), 600); 
    setTimeout(() => setPhase('page'), 1300); 
  };

  const handleReset = () => {
    setPhase('notebook'); 
    setTimeout(() => setPhase('hiding'), 500); 
    setTimeout(() => {
      setPhase('idle'); 
      setResult(null);
    }, 1000);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passcodeInput === 'PAX2026') {
      setIsAdminMode(true);
      setShowAdminPanel(false);
      setPasscodeInput('');
    } else {
      alert("Incorrect Passcode");
    }
  };

  // NEW: Handler for custom add/remove
  const handleCustomUpdate = (isAdding) => {
    const amount = parseInt(customAmount, 10);
    if (isNaN(amount) || amount <= 0) return; // Prevent empty or negative inputs
    
    const newBalance = isAdding ? tabiCoins + amount : Math.max(0, tabiCoins - amount);
    updateBackendCoins(newBalance);
    setCustomAmount(''); // Clear the input field after updating
  };

  const getRarityStyle = (rarity) => {
    if (rarity === 5) return { color: '#ffc857', bg: '#fff9e6', text: 'Legendary SSR' };
    if (rarity === 4) return { color: '#c8a2c8', bg: '#f5ebf5', text: 'Epic SR' };
    if (rarity === 3) return { color: '#a2c8cc', bg: '#eef8f9', text: 'Common R' };
    return { color: '#ff6b6b', bg: '#ffe5e5', text: 'Busted!' }; 
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col select-none text-[#4a4a4a]" style={{ fontFamily: "'Patrick Hand', cursive", backgroundColor: '#e0f7fa' }}>
      
      <style>{`
        @keyframes float {
          0% { transform: translateX(0vw); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(120vw); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .dot-pattern {
          background-image: radial-gradient(#b0e0e6 2px, transparent 2px);
          background-size: 24px 24px;
        }
        .hollow-text {
          color: #ffffff;
          -webkit-text-stroke: 3px #4a4a4a;
          text-shadow: 4px 4px 0px #4a4a4a;
        }
      `}</style>

      <div className="absolute inset-0 dot-pattern -z-20 opacity-60" />
      <DoodleCloud size={140} top="5%" speed="35s" delay="0s" opacity="0.9" />
      <DoodleCloud size={90} top="25%" speed="45s" delay="-15s" opacity="0.7" />
      <DoodleCloud size={180} top="55%" speed="40s" delay="-5s" opacity="0.8" />
      <DoodleCloud size={120} top="75%" speed="50s" delay="-25s" opacity="0.85" />

      <HangingStar left="8%" length={180} size={50} color="#ffffba" delay="0s" />
      <HangingStar left="20%" length={80} size={35} color="#ffb3ba" delay="1s" hiddenMobile />
      <HangingStar right="12%" length={140} size={45} color="#baffc9" delay="0.5s" />
      <HangingStar right="25%" length={220} size={40} color="#bae1ff" delay="1.5s" hiddenMobile />

      <div className={`absolute top-4 left-4 right-4 md:right-8 flex justify-between items-start z-10 transition-all duration-700 ease-in-out ${phase !== 'idle' ? '-translate-y-[20vh]' : 'translate-y-0'}`}>
        <button 
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="w-12 h-12 bg-[#fff0f5] flex items-center justify-center hover:bg-[#ffe4e1] transition active:scale-95"
          style={sketchyStyle}
        >
          <Settings className="w-6 h-6 text-[#4a4a4a]" strokeWidth={2.5} />
        </button>

        <div className="bg-white px-2 py-1 pr-5 flex items-center gap-3" style={sketchyStyle}>
          <div className="w-8 h-8 bg-[#ffffba] flex items-center justify-center rounded-full border-2 border-[#4a4a4a]">
            <Star className="w-4 h-4 text-[#4a4a4a]" fill="#4a4a4a" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-2xl tracking-wide pt-1">{tabiCoins}</span>
          <div className="w-6 h-6 bg-[#ffb3ba] rounded-full border-2 border-[#4a4a4a] flex items-center justify-center text-[#4a4a4a] text-lg font-bold cursor-pointer hover:bg-[#ffdfba] ml-2 pb-1">
            +
          </div>
        </div>
      </div>

      {showAdminPanel && (
        <div className="absolute top-20 left-4 bg-white p-5 z-50 w-72" style={sketchyStyle}>
          <div className="flex justify-between items-center mb-4 border-b-2 border-dashed border-[#4a4a4a] pb-2">
            <h3 className="text-xl font-bold">Secret Settings</h3>
            <X className="w-5 h-5 cursor-pointer hover:text-red-400" onClick={() => setShowAdminPanel(false)} />
          </div>
          {!isAdminMode ? (
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-3">
              <input 
                type="password" 
                placeholder="Passcode?"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="bg-[#f5f5f5] p-2 text-lg focus:outline-none focus:bg-[#eef8f9]"
                style={{ border: '2px solid #4a4a4a', borderRadius: '10px' }}
              />
              <button type="submit" className="bg-[#baffc9] font-bold text-xl py-2 hover:bg-[#a0e8af] transition" style={{ border: '2px solid #4a4a4a', borderRadius: '10px' }}>Unlock</button>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-lg text-green-600 font-bold text-center border-2 border-green-300 bg-green-50 rounded-lg py-1">Admin Active ✎</div>
              
              <button onClick={() => updateBackendCoins(tabiCoins + 50)} className="bg-[#ffdfba] py-2 text-xl font-bold hover:bg-[#ffc996]" style={{ border: '2px solid #4a4a4a', borderRadius: '10px' }}>+50 Coins</button>
              <button onClick={() => updateBackendCoins(tabiCoins + 500)} className="bg-[#bae1ff] py-2 text-xl font-bold hover:bg-[#99cfff]" style={{ border: '2px solid #4a4a4a', borderRadius: '10px' }}>+500 Coins</button>
              
              {/* NEW: Custom Input & Add/Remove Buttons */}
              <div className="border-t-2 border-dashed border-[#4a4a4a] pt-3 mt-1">
                <input 
                  type="number" 
                  placeholder="Custom Amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="bg-[#f5f5f5] p-2 text-lg focus:outline-none focus:bg-[#eef8f9] w-full mb-2"
                  style={{ border: '2px solid #4a4a4a', borderRadius: '10px' }}
                />
                <div className="flex gap-2">
                  <button onClick={() => handleCustomUpdate(true)} className="bg-[#baffc9] py-1 text-lg font-bold flex-1 hover:bg-[#a0e8af] transition" style={{ border: '2px solid #4a4a4a', borderRadius: '10px' }}>Add</button>
                  <button onClick={() => handleCustomUpdate(false)} className="bg-[#ffb3ba] py-1 text-lg font-bold flex-1 hover:bg-[#ff99a3] transition" style={{ border: '2px solid #4a4a4a', borderRadius: '10px' }}>Remove</button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 relative z-0 mt-6 md:mt-0">
        <div className={`flex flex-col items-center text-center transition-all duration-700 ease-in-out ${phase !== 'idle' ? '-translate-y-[100vh] opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="flex gap-1 mb-6">
             {[1, 2, 3].map((i) => (
               <svg key={i} width="50" height="50" viewBox="0 0 100 100" className={`transform ${i === 2 ? 'scale-125 -translate-y-3' : ''}`}>
                 <path d="M 50 5 L 65 35 L 95 40 L 70 60 L 80 90 L 50 75 L 20 90 L 30 60 L 5 40 L 35 35 Z" fill="#baffc9" stroke="#4a4a4a" strokeWidth="4" strokeLinejoin="round" />
               </svg>
             ))}
          </div>

          <h2 className="text-[#4a4a4a] text-3xl md:text-4xl tracking-widest mb-0" style={{ fontFamily: "'Cabin Sketch', cursive" }}>
            PAX BENGALURU
          </h2>
          <h1 className="text-[#ff85a1] text-6xl md:text-8xl leading-none hollow-text mt-2" style={{ color: '#ffb0d8', fontFamily: "'Luckiest Guy', cursive", letterSpacing: '0.05em' }}>
            MAJESTIC IMPACT
          </h1>
          <div className="bg-[white] px-6 py-2 mt-6 text-2xl font-bold transform -rotate-2" style={sketchyStyle}>
            Bengaluru's First Gacha Quest! ✐
          </div>
        </div>

        {/* NOT ENOUGH COINS WARNING */}
        {showWarning && (
          <div 
            className="absolute top-1/2 left-0 w-full z-50 text-[#ff4d4d] text-4xl md:text-5xl font-bold text-center pointer-events-none drop-shadow-md animate-bounce" 
            style={{ fontFamily: "'Cabin Sketch', cursive", textShadow: '2px 2px 0px #4a4a4a', transform: 'translateY(-50%)' }}
          >
            Not enough Tabi Coins!<br/>We need more comments!
          </div>
        )}

        <div className={`mt-10 md:mt-16 w-full flex justify-center transition-all duration-700 ease-in-out ${phase !== 'idle' ? 'translate-y-[50vh] opacity-0' : 'translate-y-0 opacity-100'}`}>
          <button 
            onClick={handlePull}
            className="group relative flex flex-col items-center bg-[#bae1ff] text-[#4a4a4a] px-12 py-3 hover:bg-[#99cfff] hover:scale-105 active:scale-95 transition-all duration-200 max-w-sm w-full"
            style={sketchyStyle}
          >
            <div className="flex items-center gap-2 text-xl font-bold mb-0">
               <span>Cost: {costPerPull}</span>
               <Star className="w-4 h-4 text-[#4a4a4a]" fill="#4a4a4a" strokeWidth={2.5} />
            </div>
            <div className="text-3xl font-bold uppercase tracking-wider" style={{ fontFamily: "'Cabin Sketch', cursive" }}>
               1 Majestic Pull
            </div>
          </button>
        </div>
      </div>

      <div className={`absolute inset-0 z-40 pointer-events-none overflow-hidden flex flex-col items-center justify-end ${phase === 'idle' ? 'hidden' : ''}`}>
        
        {result && result.rarity === 1 && (
          <div 
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 transition-all duration-700 ease-out transform
              ${phase === 'page' ? 'scale-100 opacity-100 pointer-events-auto cursor-pointer' : 'scale-75 opacity-0'}
            `}
            onClick={handleReset}
          >
             <div className="relative bg-white px-10 py-8 md:px-14 md:py-10 rounded-[100px] border-[4px] border-[#4a4a4a] max-w-xl w-full text-center mb-6 shadow-[8px_8px_0px_rgba(74,74,74,1)]">
               <p className="text-3xl md:text-4xl font-bold text-[#ff6b6b] leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                 {result.desc}
               </p>
               <svg className="absolute -bottom-[22px] left-1/2 -translate-x-1/2 w-12 h-6" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon points="0,0 50,100 100,0" fill="white" />
                  <polyline points="0,0 50,100 100,0" fill="none" stroke="#4a4a4a" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
             </div>

             <div className="w-80 h-80 md:w-[26rem] md:h-[26rem] relative drop-shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/reddy-anna.png" 
                  alt="Reddy Anna" 
                  className="w-full h-full object-contain" 
                  onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} 
                />
                <div className="hidden w-full h-full items-center justify-center text-8xl bg-white border-4 border-[#4a4a4a] rounded-full shadow-[8px_8px_0px_rgba(74,74,74,1)]">😠</div>
             </div>
          </div>
        )}

        {result && result.rarity > 1 && (
          <div 
            className={`absolute top-[10%] md:top-[15%] left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-[450px] z-40 transition-all duration-700 ease-out transform
              ${phase === 'page' ? 'translate-y-0 opacity-100 pointer-events-auto cursor-pointer' : 'translate-y-[80vh] opacity-0'}
            `}
            onClick={handleReset}
          >
            <div 
              className="relative bg-[#fffdf5] w-full aspect-[3/4] p-8 pt-16 flex flex-col text-[#4a4a4a]"
              style={{ 
                fontFamily: "'Caveat', cursive",
                ...sketchyStyle,
                borderRadius: '2px 15px 5px 15px/15px 5px 15px 5px'
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-[#ffb3ba]/90 backdrop-blur-sm -rotate-2" style={{ border: '2px dashed #4a4a4a' }} />
              
              <div 
                className="absolute inset-0 top-16 pointer-events-none" 
                style={{ 
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, #bae1ff 35px, #bae1ff 37px)', 
                  backgroundSize: '100% 37px',
                  opacity: 0.5
                }} 
              />

              <div className="absolute top-0 bottom-0 left-12 w-[3px] bg-[#ffb3ba] pointer-events-none opacity-80" />

              <div className="relative z-10 pl-8 flex flex-col h-full">
                
                <div 
                  className="self-end px-3 mb-2 border-2 transform rotate-6 text-2xl font-bold bg-white"
                  style={{ 
                    borderColor: getRarityStyle(result.rarity).color,
                    color: getRarityStyle(result.rarity).color,
                    borderRadius: '5px 10px 5px 10px',
                    boxShadow: `3px 3px 0px ${getRarityStyle(result.rarity).color}40`
                  }}
                >
                  {Array(result.rarity).fill('★').join('')} <br className="md:hidden" />
                  <span className="text-xl ml-1">{getRarityStyle(result.rarity).text}</span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold leading-tight mb-6 mt-4 relative w-full break-words">
                  {result.title}
                  <svg className="absolute -bottom-3 left-0 w-full h-3" preserveAspectRatio="none">
                    <path d="M 0 5 Q 50 10, 100 0" fill="none" stroke={getRarityStyle(result.rarity).color} strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </h3>
                
                <p className="text-3xl md:text-4xl leading-[37px] text-[#4a4a4a] flex-1 mt-2">
                  {result.desc}
                </p>

                <div className="mt-auto pt-4 text-center text-[#4a4a4a]/60 text-2xl flex items-center justify-center gap-1 font-bold">
                  Tap anywhere to close 
                  <X className="w-6 h-6 ml-1" />
                </div>
              </div>
            </div>
          </div>
        )}

        {(!result || result.rarity > 1) && (
          <div 
            className={`absolute bottom-[-40px] w-[120vw] md:w-[600px] h-56 bg-[#baffc9] z-50 transition-transform duration-500 ease-out flex flex-col items-center shadow-[0_-10px_30px_rgba(0,0,0,0.1)]
              ${phase === 'notebook' || phase === 'page' ? 'translate-y-0' : 'translate-y-[100%]'}
            `}
            style={{ borderTop: '4px solid #4a4a4a', borderRadius: '40px 40px 0 0' }}
          >
             <div className="flex gap-4 md:gap-8 mt-4 w-full justify-center">
                {[1,2,3,4,5,6,7].map(i => (
                   <div key={i} className="w-5 h-16 bg-[#eef8f9] rounded-full shadow-md" style={{ border: '3px solid #4a4a4a' }} />
                ))}
             </div>
             
             <div className="text-[#4a4a4a] font-bold text-3xl mt-8 opacity-40 transform -rotate-2" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                PAX Quest Log ✐
             </div>
          </div>
        )}
      </div>
      
    </div>
  );
}