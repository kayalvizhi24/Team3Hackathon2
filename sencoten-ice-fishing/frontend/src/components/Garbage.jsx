import React from 'react';

export default function Garbage({ garbage }) {
  return (
    <>
      {garbage.map(g => (
        <div
          key={g.id}
          className="absolute text-4xl"
          style={{ 
            left: `${g.x}%`, 
            top: `${g.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          🗑️
        </div>
      ))}
    </>
  );
}