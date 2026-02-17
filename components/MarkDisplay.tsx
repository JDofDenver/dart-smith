interface MarkDisplayProps {
  marks: number;
  size?: 'small' | 'large';
}

export default function MarkDisplay({ marks, size = 'large' }: MarkDisplayProps) {
  const renderMark = () => {
    switch (marks) {
      case 1:
        return <span className="text-white font-black text-2xl">/</span>;
      case 2:
        return <span className="text-white font-black text-2xl">X</span>;
      case 3:
        return (
          <span className="relative">
            <span className="text-white font-black text-2xl">X</span>
            <span className="absolute inset-0 text-white text-3xl flex items-center justify-center">
              ◯
            </span>
          </span>
        );
      default:
        return null;
    }
  };

  const sizeClasses = size === 'large'
    ? 'w-16 h-12'
    : 'w-12 h-10';

  return (
    <div className={`${sizeClasses} flex items-center justify-center`}>
      {renderMark()}
    </div>
  );
}
