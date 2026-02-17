interface HeaderProps {
  showPlayerNames?: boolean;
  player1Name?: string;
  player2Name?: string;
  currentPlayer?: 1 | 2;
  onMenuClick?: () => void;
}

export default function Header({
  showPlayerNames = false,
  player1Name = "Player 1",
  player2Name = "Player 2",
  currentPlayer = 1,
  onMenuClick
}: HeaderProps) {
  return (
    <div className="w-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 shadow-lg border-b-2 border-gray-500">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="flex flex-col justify-center items-center w-8 h-8 space-y-1 hover:opacity-70 transition-opacity"
        >
          <div className="w-6 h-0.5 bg-gray-800"></div>
          <div className="w-6 h-0.5 bg-gray-800"></div>
          <div className="w-6 h-0.5 bg-gray-800"></div>
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
          Dart-Smith
        </h1>

        {/* Spacer for symmetry */}
        <div className="w-8"></div>
      </div>

      {/* Player Names Section (conditionally rendered) */}
      {showPlayerNames && (
        <div className="flex justify-between items-center px-8 pb-3">
          <div className="text-center">
            <h2 className={`text-xl font-bold ${
              currentPlayer === 1 ? 'text-yellow-600' : 'text-gray-700'
            }`}>
              {player1Name}
            </h2>
          </div>

          <div className="text-center">
            <h2 className={`text-xl font-bold ${
              currentPlayer === 2 ? 'text-yellow-600' : 'text-gray-700'
            }`}>
              {player2Name}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
