import ScoreButton from './ScoreButton';

type DartValues = '15' | '16' | '17' | '18' | '19' | '20' | 'B' | 'T' | 'D';

interface DartButtonRowProps {
  value: DartValues;
  onSinglePress: (value: DartValues) => void;
  onDoublePress: (value: DartValues) => void;
  onTriplePress: (value: DartValues) => void;
  isDisabled?: boolean;
  isDoubleAvailable?: boolean;
  isTripleAvailable?: boolean;
}

export default function DartButtonRow({
  value,
  onSinglePress,
  onDoublePress,
  onTriplePress,
  isDisabled = false,
  isDoubleAvailable ,
  isTripleAvailable
}: DartButtonRowProps) {
  // For regular numbers and bulls-eye B: show double/triple options
  // For D and T targets: they are standalone areas, no double/triple options
  const showDoubleButton = value !== 'D' && value !== 'T';
  const showTripleButton = value !== 'D' && value !== 'T' && value !== 'B';

  const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className="flex items-center gap-3">
      {/* Double Button - for hitting numbers on double ring */}
      {showDoubleButton ? (
        <ScoreButton
          value="2"
          onClick={() => isDisabled ? !isDoubleAvailable? onDoublePress(value) : null : onDoublePress(value)}
          className={`w-12 h-10 text-sm border-blue-300 text-white font-bold ${
            isDisabled ? !isDoubleAvailable
              ? "opacity-50 cursor-not-allowed bg-gray-400"
              : "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 hover:from-blue-200 hover:via-blue-300 hover:to-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            : "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 hover:from-blue-200 hover:via-blue-300 hover:to-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"}`}
        />
      ) : (
        <div className="w-12 h-10"></div>
      )}

      {/* Main Target Button */}
      <ScoreButton
        value={value}
        onClick={() => !isDisabled && onSinglePress(value)}
        className={`w-16 h-12 text-base ${disabledClasses}`}
      />

      {/* Triple Button - for hitting numbers on triple ring */}
      {showTripleButton ? (
        <ScoreButton
          value="3"
          onClick={() => isDisabled ? !isTripleAvailable? onTriplePress(value) : null : onTriplePress(value)}
          className={`w-12 h-10 text-sm border-red-300 text-white font-bold ${
            isDisabled ? !isTripleAvailable
              ? "opacity-50 cursor-not-allowed bg-gray-400"
              : "bg-gradient-to-br from-red-300 via-red-400 to-red-500 hover:from-red-200 hover:via-red-300 hover:to-red-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            : "bg-gradient-to-br from-red-300 via-red-400 to-red-500 hover:from-red-200 hover:via-red-300 hover:to-red-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"}`}
        />
      ) : (
        <div className="w-12 h-10"></div>
      )}
    </div>
  );
}
