import React from 'react';

export default function LacrosseStick({ garbage }) {
  return (
    <>
      {garbage.map(g => (
        <div
          key={g.id}
          className="absolute"
          style={{ 
            left: `${g.x}%`, 
            top: `${g.y}%`,
            transform: g.direction === 1 ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        >
          <div className="text-8xl">🥍</div>
        </div>
      ))}
    </>
  );
}