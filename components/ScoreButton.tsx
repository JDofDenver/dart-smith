"use client";

interface ScoreButtonProps {
  value: string;
  onClick: () => void;
  className?: string;
}

export default function ScoreButton({ value, onClick, className = "" }: ScoreButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-lg
        bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500
        hover:from-gray-200 hover:via-gray-300 hover:to-gray-400
        active:from-gray-400 active:via-gray-500 active:to-gray-600
        shadow-lg hover:shadow-xl
        border-2 border-gray-300
        text-gray-800 font-bold
        transition-all duration-150
        transform hover:scale-105 active:scale-95
        ${className}
      `}
    >
      {value}
    </button>
  );
}
