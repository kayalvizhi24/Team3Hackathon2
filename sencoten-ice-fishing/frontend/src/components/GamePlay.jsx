import React, { useState, useEffect, useRef } from 'react';
import { calculateDistance } from '../utils/helpers';
import { vocabularyAPI } from '../services/api';
import HUD from './HUD';
import Fish from './Fish';
import Garbage from './Garbage';
import Scoreboard from './Scoreboard';

export default function GamePlay({
  score,
  setScore,
  lives,
  setLives,
  setGameState,
  caughtWords,
  setCaughtWords,
  setDidWin
}) {
  const [currentTarget, setCurrentTarget] = useState(null);
  const [currentWordSet, setCurrentWordSet] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);

  const [fish, setFish] = useState([]);
  const [garbage, setGarbage] = useState([]);
  const [hookX, setHookX] = useState(50);
  const [hookY, setHookY] = useState(25);
  const [feedback, setFeedback] = useState('');
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [loading, setLoading] = useState(true);

  const gameRef = useRef(null);

  // -----------------------------
  // Fetch vocabulary
  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      const response = await vocabularyAPI.getRandom(5);
      if (response.success && response.data.length > 0) {
        setCurrentWordSet(response.data);

        const randomTarget = response.data[Math.floor(Math.random() * response.data.length)];
        setCurrentTarget(randomTarget);

        // Shuffle words
        const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffle(response.data));
      }
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      alert('Unable to connect to server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, []);

  // -----------------------------
  // Pick a new target word
  const pickNewTarget = () => {
    if (currentWordSet.length > 0) {
      const randomTarget = currentWordSet[Math.floor(Math.random() * currentWordSet.length)];
      setCurrentTarget(randomTarget);
    }
  };

  // -----------------------------
  // Handle catching a fish
  const handleCatchFish = (f) => {
    const isCorrect = f.vocab.word === currentTarget?.word;

    if (isCorrect) {
      const points = 10;
      const newScore = score + points;
      setScore(newScore);
      setCaughtWords((prev) => [
        ...prev,
        {
          word: f.vocab.word,
          translation: f.vocab.translation,
          points,
        },
      ]);
      setFeedback(`✓ Correct! +${points} points`);
      setShowScoreboard(true);
      setTimeout(() => setShowScoreboard(false), 3000);
      
      // Check if player won
      if (newScore >= 50) {
  setDidWin(true);
  setTimeout(() => {
    setGameState('gameover');
  }, 500);
} else {
  pickNewTarget();
}
    } else {
      setFeedback(`Try again! That's "${f.vocab.translation}"`);
      setTimeout(() => setFeedback(''), 2000);
    }

    setFish((prev) => prev.filter((x) => x.id !== f.id));
  };

  // -----------------------------
  // Spawn multiple fish periodically
  useEffect(() => {
    if (shuffledWords.length === 0) return;

    const spawnFishInterval = setInterval(() => {
      setFish((prev) => {
        // Limit to 8 fish maximum
        if (prev.length >= 8) return prev;

        // Get words that are already on screen
        const existingWords = prev.map((f) => f.vocab.word);

        // Find available words not currently on screen
        const availableWords = shuffledWords.filter((v) => !existingWords.includes(v.word));

        // If all words are on screen, don't spawn
        if (availableWords.length === 0) return prev;

        // Spawn 1-2 fish with unique words
        const numberOfFish = Math.min(2, availableWords.length, 8 - prev.length);
        const newFishArray = [];

        for (let i = 0; i < numberOfFish; i++) {
          const vocab = availableWords[i];

          newFishArray.push({
            id: Date.now() + Math.random() + i,
            x: Math.random() < 0.5 ? -15 : 115,
            y: Math.random() * 50 + 35,
            direction: Math.random() < 0.5 ? 1 : -1,
            speed: Math.random() * 0.25 + 0.15,
            vocab,
          });
        }

        return [...prev, ...newFishArray];
      });
    }, 1500); // spawn every 1.5s

    return () => clearInterval(spawnFishInterval);
  }, [shuffledWords]);

  // -----------------------------
  // Spawn garbage
  useEffect(() => {
    const spawnGarbage = setInterval(() => {
      const newGarbage = {
        id: Date.now() + Math.random() + 10000,
        x: Math.random() < 0.5 ? -15 : 115,
        y: Math.random() * 50 + 35,
        direction: Math.random() < 0.5 ? 1 : -1,
        speed: Math.random() * 0.3 + 0.2,
      };
      setGarbage((prev) => [...prev, newGarbage]);
    }, 5000);

    return () => clearInterval(spawnGarbage);
  }, []);

  // -----------------------------
  // Move fish and garbage
  useEffect(() => {
    const moveObjects = setInterval(() => {
      setFish((prev) =>
        prev
          .map((f) => ({ ...f, x: f.x + f.speed * f.direction }))
          .filter((f) => f.x > -20 && f.x < 120)
      );

      setGarbage((prev) =>
        prev
          .map((g) => ({ ...g, x: g.x + g.speed * g.direction }))
          .filter((g) => g.x > -20 && g.x < 120)
      );
    }, 20);

    return () => clearInterval(moveObjects);
  }, []);

  // -----------------------------
  // Collision detection for garbage
// Collision detection for garbage
// Collision detection for garbage
useEffect(() => {
  if (garbage.length === 0) return;
  
  const checkGarbageCollisions = () => {
    garbage.forEach((g) => {
      const horizontalDistance = Math.abs(g.x - hookX);
      const verticalDistance = Math.abs(g.y - hookY);
      
      // Check if hits the fishing LINE (between top and hook)
      const lineTop = 8;
      const lineBottom = hookY;
      const hitsLine = horizontalDistance < 8 && g.y >= lineTop && g.y <= lineBottom;
      
      // Check if hits the HOOK directly
      const hitsHook = horizontalDistance < 6 && verticalDistance < 6;
      
      console.log(`Garbage X:${g.x.toFixed(1)} Y:${g.y.toFixed(1)} | Hook X:${hookX.toFixed(1)} Y:${hookY.toFixed(1)} | HitsLine:${hitsLine} HitsHook:${hitsHook}`);
      
      if (hitsLine || hitsHook) {
        console.log('💥 GARBAGE COLLISION!');
        
        setGarbage((prev) => prev.filter((item) => item.id !== g.id));
        
        setLives((prev) => {
          const newLives = prev - 1;
          console.log(`Lives: ${prev} → ${newLives}`);
          if (newLives <= 0) {
            setTimeout(() => setGameState('gameover'), 500);
          }
          return newLives;
        });
        
        setFeedback('✗ Garbage hit! -1 life');
        setTimeout(() => setFeedback(''), 2000);
      }
    });
  };

  const interval = setInterval(checkGarbageCollisions, 20);
  return () => clearInterval(interval);
}, [garbage, hookX, hookY]);

  // -----------------------------
  // Mouse movement
  const handleMouseMove = (e) => {
    const rect = gameRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setHookX(Math.max(5, Math.min(95, x)));
    setHookY(Math.max(20, Math.min(95, y)));
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-cyan-100 to-blue-500 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-12 text-center">
          <div className="text-4xl mb-4">🎣</div>
          <p className="text-2xl font-bold text-blue-900">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gameRef}
      onMouseMove={handleMouseMove}
      className="w-full h-screen bg-gradient-to-b from-cyan-100 to-blue-500 relative overflow-hidden"
    >
      {/* Target word */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-2xl px-8 py-4 border-4 border-blue-600 z-20">
        <p className="text-lg text-gray-600 mb-1 text-center">Catch the fish that means:</p>
        <p className="text-4xl font-bold text-blue-900 text-center">
          {currentTarget ? currentTarget.translation.toUpperCase() : '...'}
        </p>
      </div>

      <HUD score={score} lives={lives} />
      <Scoreboard caughtWords={caughtWords} show={showScoreboard} />

      {/* Feedback */}
      {feedback && (
        <div
          className={`absolute top-32 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-xl font-bold shadow-lg z-20 ${
            feedback.includes('✓') ? 'bg-green-500 text-white' : feedback.includes('Try again') ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Ice surface */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-cyan-50 to-transparent"></div>

      {/* Fisherman */}
      <div className="absolute top-4 z-10" style={{ left: `${hookX}%`, transform: 'translateX(-50%)' }}>
        <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center border-4 border-blue-900">
          <span className="text-3xl">🧊</span>
        </div>
      </div>

      {/* Fishing line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        <line x1={`${hookX}%`} y1="80" x2={`${hookX}%`} y2={`${hookY}%`} stroke="#1f2937" strokeWidth="3" strokeDasharray="5,5" />
      </svg>

      {/* Hook */}
      <div
        className="absolute w-8 h-8 rounded-full pointer-events-none z-10 flex items-center justify-center"
        style={{
          left: `${hookX}%`,
          top: `${hookY}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 100%)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        }}
      >
        <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
      </div>

      <Fish fish={fish} hookX={hookX} hookY={hookY} onCatch={handleCatchFish} />
      <Garbage garbage={garbage} />

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-full text-lg">
        Move mouse to control hook
      </div>
    </div>
  );
}
// import React, { useState, useEffect, useRef } from 'react';
// import { calculateDistance } from '../utils/helpers';
// import { vocabularyAPI } from '../services/api';
// import HUD from './HUD';
// import Fish from './Fish';
// import Garbage from './Garbage';
// import Scoreboard from './Scoreboard';

// export default function GamePlay({ 
//   score, 
//   setScore, 
//   lives, 
//   setLives, 
//   setGameState,
//   caughtWords,
//   setCaughtWords 
// }) {
//   const [currentTarget, setCurrentTarget] = useState(null);
//   const [currentWordSet, setCurrentWordSet] = useState([]);
//   const [fish, setFish] = useState([]);
//   const [garbage, setGarbage] = useState([]);
//   const [hookX, setHookX] = useState(50);
//   const [hookY, setHookY] = useState(25);
//   const [feedback, setFeedback] = useState('');
//   const [showScoreboard, setShowScoreboard] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const gameRef = useRef(null);

//   // Fetch random vocabulary from backend
//   const fetchVocabulary = async () => {
//     try {
//       setLoading(true);
//       const response = await vocabularyAPI.getRandom(5);
//       if (response.success && response.data.length > 0) {
//         setCurrentWordSet(response.data);
//         const randomTarget = response.data[Math.floor(Math.random() * response.data.length)];
//         setCurrentTarget(randomTarget);
//       }
//     } catch (error) {
//       console.error('Error fetching vocabulary:', error);
//       alert('Unable to connect to server. Please make sure the backend is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Set new target word from current set
//   const pickNewTarget = () => {
//     if (currentWordSet.length > 0) {
//       const randomTarget = currentWordSet[Math.floor(Math.random() * currentWordSet.length)];
//       setCurrentTarget(randomTarget);
//     }
//   };

//   // Initialize word set
//   useEffect(() => {
//     fetchVocabulary();
//   }, []);

//   // Spawn fish and garbage
//   useEffect(() => {
//     if (currentWordSet.length === 0) return;
    
//     const spawnFish = setInterval(() => {
//       const vocab = currentWordSet[Math.floor(Math.random() * currentWordSet.length)];
//       const newFish = {
//         id: Date.now() + Math.random(),
//         x: Math.random() < 0.5 ? -15 : 115,
//         y: Math.random() * 50 + 35,
//         direction: Math.random() < 0.5 ? 1 : -1,
//         speed: Math.random() * 0.25 + 0.15,
//         vocab: vocab
//       };
//       setFish(prev => [...prev, newFish]);
//     }, 2500);

//     const spawnGarbage = setInterval(() => {
//       const newGarbage = {
//         id: Date.now() + Math.random() + 10000,
//         x: Math.random() < 0.5 ? -15 : 115,
//         y: Math.random() * 50 + 35,
//         direction: Math.random() < 0.5 ? 1 : -1,
//         speed: Math.random() * 0.3 + 0.2
//       };
//       setGarbage(prev => [...prev, newGarbage]);
//     }, 5000);

//     return () => {
//       clearInterval(spawnFish);
//       clearInterval(spawnGarbage);
//     };
//   }, [currentWordSet]);

//   // Move fish and garbage
//   useEffect(() => {
//     const moveObjects = setInterval(() => {
//       setFish(prev => prev
//         .map(f => ({ ...f, x: f.x + (f.speed * f.direction) }))
//         .filter(f => f.x > -20 && f.x < 120)
//       );
//       setGarbage(prev => prev
//         .map(g => ({ ...g, x: g.x + (g.speed * g.direction) }))
//         .filter(g => g.x > -20 && g.x < 120)
//       );
//     }, 20);

//     return () => clearInterval(moveObjects);
//   }, []);

//   // Collision detection
//   // useEffect(() => {
//   //   const checkCollisions = () => {
//   //     fish.forEach(f => {
//   //       const distance = calculateDistance(f.x, f.y, hookX, hookY);
        
//   //       if (distance < 20) {
//   // Collision detection
//  // Collision detection
//   useEffect(() => {
//     const checkCollisions = () => {
//       fish.forEach(f => {
//         const distance = calculateDistance(f.x, f.y, hookX, hookY);
        
//         if (distance < 15) {
//         console.log('Close fish:', distance.toFixed(2), 'Fish pos:', f.x.toFixed(1), f.y.toFixed(1), 'Hook pos:', hookX.toFixed(1), hookY.toFixed(1));
//       }
      
//       if (distance < 8) {
//           const isCorrect = f.vocab.word === currentTarget?.word;
          
//           if (isCorrect) {
//             const points = 10;
//             setScore(prev => prev + points);
//             setFeedback(`✓ Correct! +${points} points`);
//             setCaughtWords(prev => [...prev, { 
//               word: f.vocab.word, 
//               translation: f.vocab.translation, 
//               points 
//             }]);
//             setShowScoreboard(true);
//             setTimeout(() => setShowScoreboard(false), 3000);
//             pickNewTarget();
//           } else {
//             setFeedback(`Try again! That's "${f.vocab.translation}"`);
//           }
          
//           setFish(prev => prev.filter(fish => fish.id !== f.id));
//           setTimeout(() => setFeedback(''), 2000);
//         }
//       });

//       garbage.forEach(g => {
//         const isOnLine = Math.abs(g.x - hookX) < 4;
//         const isInLineRange = g.y >= 12 && g.y <= hookY;
        
//         if (isOnLine && isInLineRange) {
//           setLives(prev => {
//             const newLives = prev - 1;
//             if (newLives <= 0) setGameState('gameover');
//             return newLives;
//           });
//           setFeedback('✗ Garbage hit your line! -1 life');
//           setGarbage(prev => prev.filter(garbage => garbage.id !== g.id));
//           setTimeout(() => setFeedback(''), 2000);
//         }
//       });
//     };

//     const interval = setInterval(checkCollisions, 30);
//     return () => clearInterval(interval);
//   }, [fish, garbage, hookX, hookY, currentTarget]);

//   // Mouse movement
//   const handleMouseMove = (e) => {
//     const rect = gameRef.current?.getBoundingClientRect();
//     if (!rect) return;
    
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;
    
//     setHookX(Math.max(5, Math.min(95, x)));
//     setHookY(Math.max(10, Math.min(95, y)));
//     console.log('Hook position:', x, y, 'Final:', Math.max(5, Math.min(95, x)), Math.max(15, Math.min(90, y)));
//   };

//   if (loading) {
//     return (
//       <div className="w-full h-screen bg-gradient-to-b from-cyan-100 to-blue-500 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-2xl p-12 text-center">
//           <div className="text-4xl mb-4">🎣</div>
//           <p className="text-2xl font-bold text-blue-900">Loading vocabulary...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div 
//       ref={gameRef}
//       onMouseMove={handleMouseMove}
//       className="w-full h-screen bg-gradient-to-b from-cyan-100 to-blue-500 relative overflow-hidden"
//     >
//       {/* Target word display */}
//       <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-2xl px-8 py-4 border-4 border-blue-600 z-20">
//         <p className="text-lg text-gray-600 mb-1 text-center">Catch the fish that means:</p>
//         <p className="text-4xl font-bold text-blue-900 text-center">
//           {currentTarget ? currentTarget.translation.toUpperCase() : '...'}
//         </p>
//       </div>

//       <HUD score={score} lives={lives} />
//       <Scoreboard caughtWords={caughtWords} show={showScoreboard} />

//       {/* Feedback message */}
//       {feedback && (
//         <div className={`absolute top-32 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-xl font-bold shadow-lg z-20 ${
//           feedback.includes('✓') ? 'bg-green-500 text-white' : 
//           feedback.includes('Try again') ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
//         }`}>
//           {feedback}
//         </div>
//       )}

//       {/* Ice surface */}
//       <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-cyan-50 to-transparent"></div>
      
//       {/* Fisherman/Rod holder */}
//       <div className="absolute top-4 z-10" style={{ left: `${hookX}%`, transform: 'translateX(-50%)' }}>
//         <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center border-4 border-blue-900">
//           <span className="text-3xl">🧊</span>
//         </div>
//       </div>

//       {/* Fishing line */}
//       <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
//         <line
//           x1={`${hookX}%`}
//           y1="80"
//           x2={`${hookX}%`}
//           y2={`${hookY}%`}
//           stroke="#1f2937"
//           strokeWidth="3"
//           strokeDasharray="5,5"
//         />
//       </svg>

//       {/* Hook */}
//       <div
//         className="absolute w-8 h-8 rounded-full pointer-events-none z-10 flex items-center justify-center"
//         style={{ 
//           left: `${hookX}%`, 
//           top: `${hookY}%`, 
//           transform: 'translate(-50%, -50%)',
//           background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 100%)',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
//         }}
//       >
//         <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
//       </div>

//       <Fish fish={fish} />
//       <Garbage garbage={garbage} />

//       {/* Instructions */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-full text-lg">
//         Move mouse to control hook
//       </div>
//     </div>
//   );
// }
