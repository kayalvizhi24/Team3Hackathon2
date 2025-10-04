import React from 'react';
import { Star } from 'lucide-react';

export default function Scoreboard({ caughtWords, show }) {
  if (!show || caughtWords.length === 0) return null;

  const lastCatch = caughtWords[caughtWords.length - 1];

  return (
    <div className="absolute top-32 right-4 bg-white rounded-lg shadow-2xl p-6 border-4 border-green-500 z-20 animate-bounce">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        <h3 className="text-2xl font-bold text-green-700">Nice Catch!</h3>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-xl font-bold text-blue-700">{lastCatch.word}</p>
        <p className="text-lg text-gray-700">{lastCatch.translation}</p>
        <p className="text-lg font-bold text-green-600 mt-2">+{lastCatch.points} points</p>
      </div>
    </div>
  );
}