import React, { useState } from 'react';
import GameMenu from './components/GameMenu';
import GameOver from './components/GameOver';
import GamePlay from './components/GamePlay';
import './App.css';

export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [caughtWords, setCaughtWords] = useState([]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCaughtWords([]);
  };

  if (gameState === 'menu') {
    return <GameMenu onStartGame={startGame} />;
  }

  if (gameState === 'gameover') {
    return (
      <GameOver 
        score={score} 
        caughtWords={caughtWords} 
        onPlayAgain={startGame} 
      />
    );
  }

  return (
    <GamePlay
      score={score}
      setScore={setScore}
      lives={lives}
      setLives={setLives}
      setGameState={setGameState}
      caughtWords={caughtWords}
      setCaughtWords={setCaughtWords}
    />
  );
}