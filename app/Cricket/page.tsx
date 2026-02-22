"use client";

import { useState, useEffect } from 'react';
import MarkDisplay from '../../components/MarkDisplay';
import ScoreButton from '../../components/ScoreButton';
import Header from '../../components/Header';

type DartValues = '15' | '16' | '17' | '18' | '19' | '20' | 'B';

interface DartThrow {
  value: DartValues;
  multiplier: number; // 1 for single, 2 for double, 3 for triple
}

interface PlayerStats {
  marks: { [key: string]: number };
  score: number;
  isClosed: { [key: string]: boolean };
}

interface GameSetup {
  player1Name: string;
  player2Name: string;
  matchType: 'best-of-3' | 'best-of-5' | 'best-of-7' | 'custom';
  customLegs: number;
  selectedGame: 'cricket';
}

interface MatchStats {
  player1Wins: number;
  player2Wins: number;
  currentLeg: number;
  totalLegs: number;
}

export default function Cricket() {
  // Screen navigation state
  const [currentScreen, setCurrentScreen] = useState<'setup' | 'game'>('setup');

  // Setup state
  const [showMatchWinner, setShowMatchWinner] = useState(false);
  const [gameSetup, setGameSetup] = useState<GameSetup>({
    player1Name: '',
    player2Name: '',
    matchType: 'best-of-3',
    customLegs: 3,
    selectedGame: 'cricket'
  });

  // Match tracking
  const [matchStats, setMatchStats] = useState<MatchStats>({
    player1Wins: 0,
    player2Wins: 0,
    currentLeg: 1,
    totalLegs: 3
  });

  // Game state
  const [player1Darts, setPlayer1Darts] = useState<DartThrow[]>([]);
  const [player2Darts, setPlayer2Darts] = useState<DartThrow[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [currentTurnDarts, setCurrentTurnDarts] = useState(0);
  const [gameWinner, setGameWinner] = useState<1 | 2 | null>(null);

  const dartValues: DartValues[] = ['20', '19', '18', '17', '16', '15', 'B'];

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

      stats.marks[value] = newMarks;

      // Close the number if we have 3+ marks
      if (newMarks >= 3) {
        stats.isClosed[value] = true;
      }
    });

    return stats;
  };

  // Calculate basic stats first (without scoring)
  const player1BaseStats = calculatePlayerStats(player1Darts);
  const player2BaseStats = calculatePlayerStats(player2Darts);

  // Calculate scoring with proper chronological state tracking (simplified for regular cricket)
  const calculateScore = (playerDarts: DartThrow[], opponentDarts: DartThrow[]): number => {
    let score = 0;

    // Determine which player we're calculating for
    const isCalculatingPlayer1 = playerDarts === player1Darts;

    // Create chronological dart sequence based on actual game flow
    const chronologicalDarts: (DartThrow & { player: 1 | 2, dartIndex: number })[] = [];

    // Players alternate turns of up to 3 darts each
    const maxTurns = Math.max(
      Math.ceil(player1Darts.length / 3),
      Math.ceil(player2Darts.length / 3)
    );

    for (let turn = 0; turn < maxTurns; turn++) {
      // Player 1's turn
      for (let dartInTurn = 0; dartInTurn < 3; dartInTurn++) {
        const dartIndex = turn * 3 + dartInTurn;
        if (dartIndex < player1Darts.length) {
          chronologicalDarts.push({
            ...player1Darts[dartIndex],
            player: 1,
            dartIndex
          });
        }
      }

      // Player 2's turn
      for (let dartInTurn = 0; dartInTurn < 3; dartInTurn++) {
        const dartIndex = turn * 3 + dartInTurn;
        if (dartIndex < player2Darts.length) {
          chronologicalDarts.push({
            ...player2Darts[dartIndex],
            player: 2,
            dartIndex
          });
        }
      }
    }

    // Track game state as it progresses chronologically
    const player1Marks: { [key: string]: number } = {};
    const player1Closed: { [key: string]: boolean } = {};
    const player2Marks: { [key: string]: number } = {};
    const player2Closed: { [key: string]: boolean } = {};

    // Initialize
    dartValues.forEach(value => {
      player1Marks[value] = 0;
      player1Closed[value] = false;
      player2Marks[value] = 0;
      player2Closed[value] = false;
    });

    // Process darts in chronological order
    chronologicalDarts.forEach(dart => {
      const isPlayer1 = dart.player === 1;
      const { value, multiplier } = dart;

      const currentMarks = isPlayer1 ? player1Marks : player2Marks;
      const currentClosed = isPlayer1 ? player1Closed : player2Closed;
      const opponentClosed = isPlayer1 ? player2Closed : player1Closed;

      const prevMarks = currentMarks[value];
      const newMarks = Math.min(prevMarks + multiplier, 3);
      const excessMarks = Math.max(0, (prevMarks + multiplier) - 3);

      // Update marks and closed status
      currentMarks[value] = newMarks;

      if (newMarks >= 3) {
        currentClosed[value] = true;
      }

      // Only score for the specific player we're calculating for
      const isTargetPlayer = (isCalculatingPlayer1 && isPlayer1) ||
                            (!isCalculatingPlayer1 && !isPlayer1);

      if (isTargetPlayer && excessMarks > 0 && newMarks >= 3) {
        // Score if opponent hasn't closed target (normal cricket rules)
        const shouldScore = !opponentClosed[value];

        if (shouldScore) {
          let pointValue;
          if (value === 'B') {
            pointValue = 25;
          } else {
            pointValue = parseInt(value);
          }

          score += excessMarks * pointValue;
        }
      }
    });

    return score;
  };

  const player1Stats: PlayerStats = {
    ...player1BaseStats,
    score: calculateScore(player1Darts, player2Darts)
  };

  const player2Stats: PlayerStats = {
    ...player2BaseStats,
    score: calculateScore(player2Darts, player1Darts)
  };

  // Check if a target is disabled (both players have 3+ marks)
  const isTargetDisabled = (value: DartValues) => {
    return player1Stats.isClosed[value] && player2Stats.isClosed[value];
  };

  // Update game winner when stats change
  useEffect(() => {
    const isAllClosed = (stats: PlayerStats) =>
      dartValues.every(value => stats.isClosed[value]);

    const p1AllClosed = isAllClosed(player1Stats);
    const p2AllClosed = isAllClosed(player2Stats);

    let winner: 1 | 2 | null = null;
    if (p1AllClosed && player1Stats.score >= player2Stats.score) {
      winner = 1;
    } else if (p2AllClosed && player2Stats.score >= player1Stats.score) {
      winner = 2;
    }

    setGameWinner(winner);
  }, [player1Darts, player2Darts, player1Stats, player2Stats, dartValues]);

  const startMatch = () => {
    let totalLegs = 3;
    switch (gameSetup.matchType) {
      case 'best-of-3': totalLegs = 3; break;
      case 'best-of-5': totalLegs = 5; break;
      case 'best-of-7': totalLegs = 7; break;
      case 'custom': totalLegs = gameSetup.customLegs; break;
    }

    setMatchStats({
      player1Wins: 0,
      player2Wins: 0,
      currentLeg: 1,
      totalLegs
    });

    setCurrentScreen('game');
  };

  const nextLeg = () => {
    if (gameWinner) {
      const newStats = { ...matchStats };
      if (gameWinner === 1) {
        newStats.player1Wins++;
      } else {
        newStats.player2Wins++;
      }
      newStats.currentLeg++;
      setMatchStats(newStats);

      // Check if match is won using the updated stats
      const matchWinner = getMatchWinner(newStats);
      if (matchWinner) {
        setShowMatchWinner(true);
        return;
      }

      // Reset current leg
      setPlayer1Darts([]);
      setPlayer2Darts([]);
      setCurrentPlayer(1);
      setCurrentTurnDarts(0);
      setGameWinner(null);
    }
  };

  const backToSetup = () => {
    setCurrentScreen('setup');
    setShowMatchWinner(false);
    setPlayer1Darts([]);
    setPlayer2Darts([]);
    setCurrentPlayer(1);
    setCurrentTurnDarts(0);
    setGameWinner(null);
    setMatchStats({
      player1Wins: 0,
      player2Wins: 0,
      currentLeg: 1,
      totalLegs: 3
    });
  };

  const backToHome = () => {
    window.location.href = '/GameSelection';
    setShowMatchWinner(false);
    setPlayer1Darts([]);
    setPlayer2Darts([]);
    setCurrentPlayer(1);
    setCurrentTurnDarts(0);
    setGameWinner(null);
    setGameSetup({
      player1Name: '',
      player2Name: '',
      matchType: 'best-of-3',
      customLegs: 3,
      selectedGame: 'cricket'
    });
    setMatchStats({
      player1Wins: 0,
      player2Wins: 0,
      currentLeg: 1,
      totalLegs: 3
    });
  };

  const getMatchWinner = (stats: MatchStats = matchStats): 1 | 2 | null => {
    const legsNeededToWin = Math.ceil(stats.totalLegs / 2);
    if (stats.player1Wins >= legsNeededToWin) return 1;
    if (stats.player2Wins >= legsNeededToWin) return 2;
    return null;
  };

  const addDart = (value: DartValues, multiplier: number) => {
    // Prevent adding darts if game is over or turn is full
    if (gameWinner || currentTurnDarts >= 3) return;

    // Allow hit if target isn't mutually closed
    const isMutuallyClosed = player1Stats.isClosed[value] && player2Stats.isClosed[value];

    if (isMutuallyClosed) {
      return;
    }

    const dartThrow: DartThrow = { value, multiplier };

    if (currentPlayer === 1) {
      setPlayer1Darts(prev => [...prev, dartThrow]);
    } else {
      setPlayer2Darts(prev => [...prev, dartThrow]);
    }

    setCurrentTurnDarts(prev => prev + 1);
  };

  const handleButtonPress = (value: DartValues, multiplier: number = 1) => {
    addDart(value, multiplier);
  };

  // Simplified - no double/triple handling
  const handleDoublePress = (value: DartValues) => {
    addDart(value, 2);
  };

  const handleTriplePress = (value: DartValues) => {
    addDart(value, 3);
  };

  const undoLastDart = () => {
    if (currentPlayer === 1 && player1Darts.length > 0) {
      setPlayer1Darts(prev => prev.slice(0, -1));
      setCurrentTurnDarts(prev => Math.max(0, prev - 1));
    } else if (currentPlayer === 2 && player2Darts.length > 0) {
      setPlayer2Darts(prev => prev.slice(0, -1));
      setCurrentTurnDarts(prev => Math.max(0, prev - 1));
    }
  };

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setCurrentTurnDarts(0);
  };

  const resetGame = () => {
    setPlayer1Darts([]);
    setPlayer2Darts([]);
    setCurrentPlayer(1);
    setCurrentTurnDarts(0);
    setGameWinner(null);
  };

  const handleMenuClick = () => {
    backToHome();
  };

  const matchWinner = getMatchWinner();



  // Match Winner Popup
  if (showMatchWinner) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              🏆 Match Winner! 🏆
            </h2>
            <p className="text-2xl text-white mb-6">
              {matchWinner === 1 ? gameSetup.player1Name : gameSetup.player2Name}
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Final Score: {matchStats.player1Wins} - {matchStats.player2Wins}
            </p>
            <button
              onClick={backToHome}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Setup screen
  if (currentScreen === 'setup') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header
          showPlayerNames={false}
          player1Name="Player 1"
          player2Name="Player 2"
          currentPlayer={1}
          onMenuClick={() => {}}
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full space-y-6">
            <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
              Cricket Setup
            </h2>

            {/* Player Names */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player 1 Name
                </label>
                <input
                  type="text"
                  value={gameSetup.player1Name}
                  onChange={(e) => setGameSetup({...gameSetup, player1Name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter player 1 name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player 2 Name
                </label>
                <input
                  type="text"
                  value={gameSetup.player2Name}
                  onChange={(e) => setGameSetup({...gameSetup, player2Name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter player 2 name"
                />
              </div>
            </div>

            {/* Match Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Match Type
              </label>
              <div className="space-y-2">
                {['best-of-3', 'best-of-5', 'best-of-7', 'custom'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      value={type}
                      checked={gameSetup.matchType === type}
                      onChange={(e) => setGameSetup({
                        ...gameSetup,
                        matchType: e.target.value as typeof gameSetup.matchType
                      })}
                      className="mr-3 text-yellow-400"
                    />
                    <span className="text-gray-300 capitalize">
                      {type === 'custom' ? 'Custom' : type.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Legs Input */}
            {gameSetup.matchType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Legs (odd numbers only)
                </label>
                <input
                  type="number"
                  min="1"
                  step="2"
                  value={gameSetup.customLegs}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0 && value % 2 === 1) {
                      setGameSetup({...gameSetup, customLegs: value});
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={startMatch}
              disabled={!gameSetup.player1Name.trim() || !gameSetup.player2Name.trim()}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Start Match
            </button>

            {/* Back Button */}
            <button
              onClick={backToHome}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Back to Game Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Component */}
      <Header
        showPlayerNames={false}
        player1Name={gameSetup.player1Name}
        player2Name={gameSetup.player2Name}
        currentPlayer={currentPlayer}
        onMenuClick={handleMenuClick}
      />

      {/* Cricket Title with Match Info */}
      <div className="bg-gray-900 py-2">
        <h2 className="text-center text-2xl font-bold text-yellow-400">
          Cricket
          {gameWinner ? (
            <span className="block text-lg text-green-400 mt-1">
              {gameWinner === 1 ? gameSetup.player1Name : gameSetup.player2Name} Wins Leg {matchStats.currentLeg}!
            </span>
          ) : (
            <div className="text-sm text-gray-300 mt-1">
              Leg {matchStats.currentLeg} of {matchStats.totalLegs} -
              {gameSetup.player1Name}: {matchStats.player1Wins} | {gameSetup.player2Name}: {matchStats.player2Wins}
            </div>
          )}
        </h2>
      </div>

      {/* Scores Section */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900">
        <div className="text-center flex-1">
          <h3 className={`text-sm font-semibold mb-2 ${
            currentPlayer === 1 ? 'text-yellow-400' : 'text-gray-400'
          }`}>{gameSetup.player1Name}</h3>
          <div className={`text-3xl font-mono bg-gray-800 px-6 py-2 rounded border-2 mx-auto inline-block ${
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
            {currentPlayer === 1 ? gameSetup.player1Name : gameSetup.player2Name}
          </div>
        </div>

        <div className="text-center flex-1">
          <h3 className={`text-sm font-semibold mb-2 ${
            currentPlayer === 2 ? 'text-yellow-400' : 'text-gray-400'
          }`}>{gameSetup.player2Name}</h3>
          <div className={`text-3xl font-mono bg-gray-800 px-6 py-2 rounded border-2 mx-auto inline-block ${
            currentPlayer === 2 ? 'border-yellow-400 shadow-yellow-400/50' : 'border-gray-600'
          } shadow-lg`}>
            {player2Stats.score}
          </div>
        </div>
      </div>

      {/* Main scoring area with 2x/3x buttons */}
      <div className="flex-1 flex justify-center items-center px-2 py-2">
        <div className="flex justify-center items-start gap-4 max-w-full w-full">
          {/* Player 1 Marks */}
          <div className="flex flex-col gap-2 items-center flex-1">
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

          {/* Button Rows with 2x/3x options */}
          <div className="flex flex-col gap-2 items-center">
            {dartValues.map((value) => (
              <div key={value} className="flex items-center gap-2">
                {/* 2x Button */}
                <ScoreButton
                  value="2"
                  onClick={() => !isTargetDisabled(value) && handleButtonPress(value, 2)}
                  className={`w-10 h-10 text-xs border-blue-300 text-white font-bold ${
                    isTargetDisabled(value)
                      ? "opacity-50 cursor-not-allowed bg-gray-400"
                      : "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 hover:from-blue-200 hover:via-blue-300 hover:to-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  }`}
                />

                {/* Main Target Button */}
                <ScoreButton
                  value={value}
                  onClick={() => !isTargetDisabled(value) && handleButtonPress(value)}
                  className={`w-16 h-12 text-base ${
                    isTargetDisabled(value) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />

                {/* 3x Button (not available for Bull) */}
                {value !== 'B' ? (
                  <ScoreButton
                    value="3"
                    onClick={() => !isTargetDisabled(value) && handleButtonPress(value, 3)}
                    className={`w-10 h-10 text-xs border-red-300 text-white font-bold ${
                      isTargetDisabled(value)
                        ? "opacity-50 cursor-not-allowed bg-gray-400"
                        : "bg-gradient-to-br from-red-300 via-red-400 to-red-500 hover:from-red-200 hover:via-red-300 hover:to-red-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    }`}
                  />
                ) : (
                  <div className="w-10 h-10"></div>
                )}
              </div>
            ))}
          </div>

          {/* Vertical divider */}
          <div className="w-0.5 bg-gray-600 self-stretch mx-2"></div>

          {/* Player 2 Marks */}
          <div className="flex flex-col gap-2 items-center flex-1">
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

          {gameWinner ? (
            <button
              onClick={nextLeg}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Next Leg
            </button>
          ) : (
            <button
              onClick={switchPlayer}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Next Player
            </button>
          )}

          <button
            onClick={resetGame}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            Reset Leg
          </button>
        </div>
      </div>
    </div>
  );
}
