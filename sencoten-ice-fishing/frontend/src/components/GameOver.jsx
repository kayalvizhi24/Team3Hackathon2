import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { scoreAPI } from '../services/api';

export default function GameOver({ score, caughtWords, onPlayAgain }) {
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    fetchTopScores();
  }, []);

  const fetchTopScores = async () => {
    try {
      const response = await scoreAPI.getTop(5);
      if (response.success) {
        setTopScores(response.data);
      }
    } catch (error) {
      console.error('Error fetching top scores:', error);
    }
  };

  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    try {
      const scoreData = {
        player_name: playerName,
        score: score,
        words_caught: caughtWords.length,
        duration: 0
      };

      await scoreAPI.submit(scoreData);
      setScoreSaved(true);
      fetchTopScores();
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Failed to save score. Please try again.');
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-blue-900 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-12 text-center max-w-4xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Game Over!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Score Section */}
          <div className="bg-yellow-50 p-8 rounded-lg">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
            <p className="text-3xl font-bold text-gray-800 mb-2">Final Score</p>
            <p className="text-6xl font-bold text-blue-600 mb-6">{score}</p>
            
            {caughtWords.length > 0 && (
              <div className="mt-6">
                <p className="text-xl font-bold text-gray-700 mb-3">Words You Caught:</p>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {caughtWords.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border-2 border-blue-300">
                      <p className="text-lg font-bold text-blue-700">{item.word}</p>
                      <p className="text-sm text-gray-600">{item.translation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Score Form */}
            {!scoreSaved && (
              <div className="mt-6">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg mb-3 text-lg"
                  maxLength={50}
                />
                <button
                  onClick={handleSaveScore}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Save Score
                </button>
              </div>
            )}

            {scoreSaved && (
              <div className="mt-6 bg-green-100 p-4 rounded-lg">
                <p className="text-green-700 font-bold">✓ Score saved successfully!</p>
              </div>
            )}
          </div>

          {/* Leaderboard Section */}
          <div className="bg-blue-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">🏆 Top Scores</h2>
            {topScores.length > 0 ? (
              <div className="space-y-2">
                {topScores.map((s, idx) => (
                  <div 
                    key={s.id} 
                    className={`p-3 rounded-lg flex justify-between items-center ${
                      idx === 0 ? 'bg-yellow-200' : 
                      idx === 1 ? 'bg-gray-200' : 
                      idx === 2 ? 'bg-orange-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-700">{idx + 1}.</span>
                      <div className="text-left">
                        <p className="font-bold text-gray-800">{s.player_name}</p>
                        <p className="text-sm text-gray-600">{s.words_caught} words</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{s.score}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No scores yet. Be the first!</p>
            )}
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}