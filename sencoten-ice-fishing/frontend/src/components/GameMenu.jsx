import React from 'react';

export default function GameMenu({ onStartGame }) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-cyan-200 via-blue-300 to-blue-400 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-12 text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">🎣 SENĆOŦEN Ice Fishing</h1>
        <p className="text-xl text-gray-700 mb-8">Catch the correct fish to learn SENĆOŦEN!</p>
        <div className="bg-blue-50 p-6 rounded-lg mb-8 text-left">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">How to Play:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>🎯 Look at the English word at the top</li>
            <li>🖱️ Move your mouse to control the hook up, down, left, and right</li>
            <li>🐟 Touch the fish with the matching SENĆOŦEN word</li>
            <li>📊 Scoreboard shows your catches!</li>
            <li>🥍 Avoid Lacrosse sticks!(costs 1 life)</li>
            <li>❌ Wrong fish? No penalty - just try again!</li>
            <li>❤️ You have 3 lives - game ends when you lose all lives</li>
          </ul>
        </div>
        <button
          onClick={onStartGame}
          className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition"
        >
          Start Fishing!
        </button>
      </div>
    </div>
  );
}