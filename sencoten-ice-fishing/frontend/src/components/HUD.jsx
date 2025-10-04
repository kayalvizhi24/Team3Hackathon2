import React from 'react';
import { Award, Heart } from 'lucide-react';

export default function HUD({ score, lives }) {
  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg z-20">
      <div className="flex items-center gap-4 text-xl font-bold">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          <span>{score}</span>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart key={i} className="w-6 h-6 text-red-500 fill-red-500" />
          ))}
        </div>
      </div>
    </div>
  );
}