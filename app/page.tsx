"use client";

import { useState, useEffect } from 'react';
import MarkDisplay from '../components/MarkDisplay';
import DartButtonRow from '../components/DartButtonRow';
import Header from '../components/Header';

type DartValues = '15' | '16' | '17' | '18' | '19' | '20' | 'D' | 'T' | 'B';

interface DartThrow {
  value: DartValues;
  multiplier: number; // 1 for single, 2 for double, 3 for triple
}

interface PlayerStats {
  marks: { [key: string]: number };
  score: number;
  isClosed: { [key: string]: boolean };
}

export default function Home() {
  const [player1Darts, setPlayer1Darts] = useState<DartThrow[]>([]);
  const [player2Darts, setPlayer2Darts] = useState<DartThrow[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [currentTurnDarts, setCurrentTurnDarts] = useState(0);
  const [gameWinner, setGameWinner] = useState<1 | 2 | null>(null);

  const dartValues: DartValues[] = ['20', '19', '18', '17', '16', '15', 'B', 'D', 'T'];

  // Calculate player stats from dart arrays
  const calculatePlayerStats = (darts: DartThrow[]): PlayerStats => {
    const stats: PlayerStats = {
      marks: {},
      score: 0,
      isClosed: {}
    };

    // Initialize all values
    dartValues.forEach(value => {
      stats.marks[value] = 0;
      stats.isClosed[value] = false;
    });

    // Process each dart throw
    darts.forEach(dart => {
      const { value, multiplier } = dart;
      const marksToAdd = multiplier;

      // Add marks, but only count up to 3 for closing
      const currentMarks = stats.marks[value];
      const newMarks = Math.min(currentMarks + marksToAdd, 3);
      const excessMarks = Math.max(0, (currentMarks + marksToAdd) - 3);

      stats.marks[value] = newMarks;

      // Close the number if we have 3+ marks
      if (newMarks >= 3) {
        stats.isClosed[value] = true;
      }

      // Add excess marks to score only if we've closed this number and opponent hasn't
      if (stats.isClosed[value] && excessMarks > 0) {
        let pointValue;
        if (value === 'B') {
          pointValue = 25;
        } else if (value === 'D' || value === 'T') {
          // D and T areas don't score points - they only control button availability
          pointValue = 0;
        } else {
          pointValue = parseInt(value);
        }
        stats.score += excessMarks * pointValue;
      }
    });

    return stats;
  };

  const player1Stats = calculatePlayerStats(player1Darts);
  const player2Stats = calculatePlayerStats(player2Darts);

  // Check if a target is disabled (both players have 3+ marks) - using calculated stats
  const isTargetDisabled = (value: DartValues) => {
    return player1Stats.isClosed[value] && player2Stats.isClosed[value];
  };

  // Check if double buttons should be available for a target
  const isDoubleButtonAvailable = (value: DartValues) => {
    if (value === 'D' || value === 'T') return false; // D and T don't have double buttons

    const currentStats = currentPlayer === 1 ? player1Stats : player2Stats;
    const opponentStats = currentPlayer === 1 ? player2Stats : player1Stats;

    // If current player has closed D and opponent hasn't, all double buttons available
    if (currentStats.isClosed['D'] && !opponentStats.isClosed['D']) {
      return true;
    }else if (currentStats.isClosed['D'] && opponentStats.isClosed['D']) {
      return false;
    }else {
      // If current player hasn't closed D, can only hit doubles on open numbers
    return !isTargetDisabled(value);
    }
  };

  // Check if triple buttons should be available for a target
  const isTripleButtonAvailable = (value: DartValues) => {
    if (value === 'D' || value === 'T' || value === 'B') return false; // These don't have triple buttons

    const currentStats = currentPlayer === 1 ? player1Stats : player2Stats;
    const opponentStats = currentPlayer === 1 ? player2Stats : player1Stats;

    // If current player has closed T and opponent hasn't, all triple buttons available
    if (currentStats.isClosed['T'] && !opponentStats.isClosed['T']) {
      return true;
    }

    // If both players have closed T, triple buttons disabled on closed numbers
    if (currentStats.isClosed['T'] && opponentStats.isClosed['T']) {
      return !isTargetDisabled(value);
    }

    // If current player hasn't closed T, can only hit triples on open numbers
    return !isTargetDisabled(value);
  };

  // Check for game winner
  const checkGameWinner = () => {
    const isAllClosed = (stats: PlayerStats) =>
      dartValues.every(value => stats.isClosed[value]);

    const p1AllClosed = isAllClosed(player1Stats);
    const p2AllClosed = isAllClosed(player2Stats);

    if (p1AllClosed && player1Stats.score >= player2Stats.score) {
      return 1;
    }
    if (p2AllClosed && player2Stats.score >= player1Stats.score) {
      return 2;
    }
    return null;
  };

  // Update game winner when stats change
  useEffect(() => {
    const winner = checkGameWinner();
    setGameWinner(winner);
  }, [player1Darts, player2Darts, player1Stats, player2Stats]);

  const addDart = (value: DartValues, multiplier: number) => {
    // Prevent adding darts if game is over, turn is full (3 darts), or target is disabled
    if (gameWinner || currentTurnDarts >= 3 || isTargetDisabled(value)) return;

    // Check if opponent has also closed this target (prevents scoring)
    const currentStats = currentPlayer === 1 ? player1Stats : player2Stats;
    const opponentStats = currentPlayer === 1 ? player2Stats : player1Stats;

    // Allow hit only if target isn't mutually closed
    if (currentStats.isClosed[value] && opponentStats.isClosed[value]) return;

    const dartThrow: DartThrow = { value, multiplier };

    if (currentPlayer === 1) {
      setPlayer1Darts(prev => [...prev, dartThrow]);
    } else {
      setPlayer2Darts(prev => [...prev, dartThrow]);
    }

    setCurrentTurnDarts(prev => prev + 1); // Count actual darts thrown, not marks
  };

  const handleButtonPress = (value: DartValues) => {
    addDart(value, 1);
  };

  const handleDoublePress = (value: DartValues) => {
    addDart(value, 2);
  };

  const handleTriplePress = (value: DartValues) => {
    addDart(value, 3);
  };

  const undoLastDart = () => {
    if (currentPlayer === 1 && player1Darts.length > 0) {
      setPlayer1Darts(prev => prev.slice(0, -1));
      setCurrentTurnDarts(prev => Math.max(0, prev - 1)); // Subtract one dart
    } else if (currentPlayer === 2 && player2Darts.length > 0) {
      setPlayer2Darts(prev => prev.slice(0, -1));
      setCurrentTurnDarts(prev => Math.max(0, prev - 1)); // Subtract one dart
    }
  };

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setCurrentTurnDarts(0); // Reset turn dart counter
  };

  const resetGame = () => {
    setPlayer1Darts([]);
    setPlayer2Darts([]);
    setCurrentPlayer(1);
    setCurrentTurnDarts(0);
    setGameWinner(null);
  };

  const handleMenuClick = () => {
    // Menu functionality to be implemented
    console.log('Menu clicked');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Component */}
      <Header
        showPlayerNames={true}
        player1Name="Player 1"
        player2Name="Player 2"
        currentPlayer={currentPlayer}
        onMenuClick={handleMenuClick}
      />

      {/* Super Cricket Title */}
      <div className="bg-gray-900 py-2">
        <h2 className="text-center text-2xl font-bold text-yellow-400">
          Super Cricket
          {gameWinner && (
            <span className="block text-lg text-green-400 mt-1">
              Player {gameWinner} Wins!
            </span>
          )}
        </h2>
      </div>

      {/* Scores Section */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900">
        <div className="text-center flex-1">
          <div className={`text-3xl font-mono bg-gray-800 px-4 py-2 rounded border-2 mx-auto inline-block ${
            currentPlayer === 1 ? 'border-yellow-400 shadow-yellow-400/50' : 'border-gray-600'
          } shadow-lg`}>
            {player1Stats.score}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-400">
            Darts: {currentTurnDarts}/3
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Player {currentPlayer}
          </div>
        </div>

        <div className="text-center flex-1">
          <div className={`text-3xl font-mono bg-gray-800 px-4 py-2 rounded border-2 mx-auto inline-block ${
            currentPlayer === 2 ? 'border-yellow-400 shadow-yellow-400/50' : 'border-gray-600'
          } shadow-lg`}>
            {player2Stats.score}
          </div>
        </div>
      </div>

      {/* Main scoring area - aligned button rows */}
      <div className="flex-1 flex justify-center items-center px-2 py-2">
        <div className="flex justify-center items-start gap-4 max-w-full w-full">
          {/* Player 1 Marks */}
          <div className="flex flex-col gap-2 items-center flex-1">
            <h3 className="text-sm font-semibold text-yellow-400 mb-1">Player 1</h3>
            {dartValues.map((value) => (
              <MarkDisplay
                key={`p1-${value}`}
                marks={player1Stats.marks[value] || 0}
                size="large"
              />
            ))}
          </div>

          {/* Vertical divider */}
          <div className="w-0.5 bg-gray-600 self-stretch mx-2"></div>

          {/* Button Rows */}
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-3 mb-1">
              <h3 className="text-sm font-semibold text-blue-400 w-12 text-center">2X</h3>
              <h3 className="text-sm font-semibold text-white w-16 text-center">Target</h3>
              <h3 className="text-sm font-semibold text-red-400 w-12 text-center">3X</h3>
            </div>
            {dartValues.map((value) => (
              <DartButtonRow
                key={value}
                value={value}
                onSinglePress={handleButtonPress}
                onDoublePress={handleDoublePress}
                onTriplePress={handleTriplePress}
                isDisabled={isTargetDisabled(value)}
                isDoubleAvailable={isDoubleButtonAvailable(value)}
                isTripleAvailable={isTripleButtonAvailable(value)}
              />
            ))}
          </div>

          {/* Vertical divider */}
          <div className="w-0.5 bg-gray-600 self-stretch mx-2"></div>

          {/* Player 2 Marks */}
          <div className="flex flex-col gap-2 items-center flex-1">
            <h3 className="text-sm font-semibold text-yellow-400 mb-1">Player 2</h3>
            {dartValues.map((value) => (
              <MarkDisplay
                key={`p2-${value}`}
                marks={player2Stats.marks[value] || 0}
                size="large"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="bg-gray-900 px-4 py-3 border-t-2 border-gray-700">
        <div className="flex justify-center gap-4">
          <button
            onClick={undoLastDart}
            disabled={
              (currentPlayer === 1 && player1Darts.length === 0) ||
              (currentPlayer === 2 && player2Darts.length === 0) ||
              gameWinner !== null
            }
            className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            Undo
          </button>

          <button
            onClick={switchPlayer}
            disabled={gameWinner !== null}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            {gameWinner ? 'Game Over' : 'Next Player'}
          </button>

          <button
            onClick={resetGame}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
