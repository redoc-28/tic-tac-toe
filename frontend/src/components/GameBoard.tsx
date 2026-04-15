import { GameState } from '../types';
import Badge from './Badge';
import Card from './Card';
import Icons from './Icons';

interface GameBoardProps {
  gameState: GameState;
  currentUserId: string;
  onCellClick: (position: number) => void;
}

export default function GameBoard({ gameState, currentUserId, onCellClick }: GameBoardProps) {
  const { board, currentPlayer, status, winner, winningLine, isDraw, playerX, playerO } = gameState;

  const isMyTurn = currentPlayer === currentUserId && status === 'active';
  const myMark = playerX === currentUserId ? 'X' : playerO === currentUserId ? 'O' : null;

  const getCellClassName = (index: number): string => {
    const baseClasses = 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center text-5xl sm:text-6xl md:text-7xl font-bold rounded-xl transition-all duration-200';

    if (winningLine?.includes(index)) {
      return `${baseClasses} bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg scale-105 animate-pulse`;
    }

    if (board[index]) {
      return `${baseClasses} bg-gradient-to-br from-gray-50 to-gray-100 cursor-not-allowed shadow-inner`;
    }

    if (!isMyTurn) {
      return `${baseClasses} bg-white cursor-not-allowed opacity-50 shadow-sm`;
    }

    return `${baseClasses} bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95 shadow-md`;
  };

  const getStatusMessage = (): string => {
    if (status === 'waiting') {
      return 'Waiting for opponent...';
    }

    if (status === 'finished') {
      if (isDraw) {
        return "It's a draw!";
      }
      if (winner === currentUserId) {
        return 'You won! 🎉';
      }
      return 'You lost!';
    }

    if (isMyTurn) {
      return `Your turn (${myMark})`;
    }

    return "Opponent's turn...";
  };

  const getCellContent = (value: string | null): JSX.Element => {
    if (!value) return <></>;

    if (value === 'X') {
      return (
        <div className="animate-scale-in">
          <Icons.XMark className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-blue-600" />
        </div>
      );
    }

    return (
      <div className="animate-scale-in">
        <Icons.OMark className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-red-600" />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      {/* Status Message */}
      <div className="text-center">
        {status === 'finished' ? (
          <Badge
            variant={isDraw ? 'gray' : (winner === currentUserId ? 'success' : 'danger')}
            size="lg"
            icon={
              isDraw ? (
                <Icons.Users className="w-6 h-6" />
              ) : winner === currentUserId ? (
                <Icons.Trophy className="w-6 h-6" />
              ) : (
                <Icons.Warning className="w-6 h-6" />
              )
            }
            className="text-2xl sm:text-3xl px-8 py-4"
          >
            {getStatusMessage()}
          </Badge>
        ) : (
          <Badge
            variant={isMyTurn ? 'primary' : 'gray'}
            size="lg"
            icon={isMyTurn ? <Icons.Lightning className="w-6 h-6" /> : <Icons.Clock className="w-6 h-6" />}
            pulse={isMyTurn}
            className="text-2xl sm:text-3xl px-8 py-4"
          >
            {getStatusMessage()}
          </Badge>
        )}
        {status === 'active' && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <p className="text-gray-600 text-lg">Playing as</p>
            {myMark === 'X' ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-xl">
                <Icons.XMark className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-xl text-blue-600">{myMark}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-xl">
                <Icons.OMark className="w-6 h-6 text-red-600" />
                <span className="font-bold text-xl text-red-600">{myMark}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl"></div>
        <div className="relative grid grid-cols-3 gap-3 bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-2xl shadow-2xl">
          {board.map((cell, index) => (
            <button
              key={index}
              className={getCellClassName(index)}
              onClick={() => onCellClick(index)}
              disabled={!isMyTurn || cell !== null || status !== 'active'}
            >
              {getCellContent(cell)}
            </button>
          ))}
        </div>
      </div>

      {/* Player Info */}
      <div className="flex gap-3 sm:gap-6 text-center w-full max-w-2xl justify-center items-center">
        <Card
          variant={playerX === currentUserId ? 'gradient' : 'default'}
          padding="lg"
          className={`flex-1 transition-all ${
            playerX === currentUserId
              ? 'border-2 border-blue-300 scale-105 shadow-xl'
              : 'border-2 border-gray-200'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-xl ${
              playerX === currentUserId ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Icons.XMark className={`w-8 h-8 ${
                playerX === currentUserId ? 'text-blue-600' : 'text-gray-500'
              }`} />
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Player X</div>
              <div className={`text-lg sm:text-xl font-bold ${
                playerX === currentUserId ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {playerX === currentUserId ? 'You' : 'Opponent'}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            VS
          </div>
        </div>

        <Card
          variant={playerO === currentUserId ? 'gradient' : 'default'}
          padding="lg"
          className={`flex-1 transition-all ${
            playerO === currentUserId
              ? 'border-2 border-red-300 scale-105 shadow-xl'
              : 'border-2 border-gray-200'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-xl ${
              playerO === currentUserId ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Icons.OMark className={`w-8 h-8 ${
                playerO === currentUserId ? 'text-red-600' : 'text-gray-500'
              }`} />
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Player O</div>
              <div className={`text-lg sm:text-xl font-bold ${
                playerO === currentUserId ? 'text-red-700' : 'text-gray-600'
              }`}>
                {playerO === currentUserId ? 'You' : 'Opponent'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
