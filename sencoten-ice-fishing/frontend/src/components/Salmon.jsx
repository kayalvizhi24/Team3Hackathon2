
import React from 'react';

export default function Salmon({ fish }) {
  return (
    <>
      {fish.map(f => (
        <div
          key={f.id}
          className="absolute transition-transform"
          style={{ 
            left: `${f.x}%`, 
             top: `${f.y}%`,
            transform: f.direction === 1 ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        >
          <div className="relative">
            <div className="text-9xl">🐟</div>
            <div 
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-100 px-3 py-1 rounded-full shadow-md border-2 border-yellow-400 whitespace-nowrap text-xl font-bold"
              style={{ 
                transform: f.direction === 1 ? 'scaleX(-1)' : 'scaleX(1)' 
              }}
            >
              {f.vocab.word}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}