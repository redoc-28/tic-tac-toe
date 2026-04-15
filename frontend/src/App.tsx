import { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import Button from './components/Button';
import Card from './components/Card';
import Icons from './components/Icons';
import Loading from './components/Loading';
import NakamaService from './services/NakamaService';
import { GameState } from './types';

type AppState = 'connecting' | 'menu' | 'finding' | 'playing' | 'error';

function App() {
  const [appState, setAppState] = useState<AppState>('connecting');
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: '',
    status: 'waiting',
    winner: null,
    winningLine: null,
    isDraw: false,
    playerX: null,
    playerO: null,
  });
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    initializeConnection();

    return () => {
      NakamaService.disconnect();
    };
  }, []);

  const initializeConnection = async () => {
    try {
      await NakamaService.connect();
      const session = NakamaService.getSession();
      if (session) {
        setUserId(session.user_id);
      }

      // Setup match data listener
      NakamaService.onMatchData((state) => {
        console.log('Received game state:', state);
        setGameState(state);
      });

      setAppState('menu');
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect to server');
      setAppState('error');
    }
  };

  const handleFindMatch = async () => {
    try {
      setAppState('finding');
      const matchId = await NakamaService.findMatch();
      await NakamaService.joinMatch(matchId);
      setAppState('playing');
    } catch (err) {
      console.error('Find match error:', err);
      setError('Failed to find match');
      setAppState('error');
    }
  };

  const handleCreateMatch = async () => {
    try {
      setAppState('finding');
      const matchId = await NakamaService.createMatch();
      await NakamaService.joinMatch(matchId);
      setAppState('playing');
    } catch (err) {
      console.error('Create match error:', err);
      setError('Failed to create match');
      setAppState('error');
    }
  };

  const handleCellClick = async (position: number) => {
    try {
      await NakamaService.sendMove(position);
    } catch (err) {
      console.error('Send move error:', err);
      setError('Failed to send move');
    }
  };

  const handleLeaveMatch = async () => {
    try {
      await NakamaService.leaveMatch();
      setGameState({
        board: Array(9).fill(null),
        currentPlayer: '',
        status: 'waiting',
        winner: null,
        winningLine: null,
        isDraw: false,
        playerX: null,
        playerO: null,
      });
      setAppState('menu');
    } catch (err) {
      console.error('Leave match error:', err);
    }
  };

  const handlePlayAgain = async () => {
    await handleLeaveMatch();
    await handleFindMatch();
  };

  const renderContent = () => {
    switch (appState) {
      case 'connecting':
        return (
          <Loading
            message="Connecting to server"
            submessage="Setting up your game session..."
            variant="primary"
            size="lg"
          />
        );

      case 'menu':
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            {/* Hero Section */}
            <div className="text-center mb-2">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl">
                  <Icons.Grid className="w-20 h-20 text-white" />
                </div>
              </div>
              <h1 className="text-6xl sm:text-7xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Tic-Tac-Toe
              </h1>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Icons.Lightning className="w-5 h-5 text-yellow-500" />
                <p className="text-gray-600 text-lg font-medium">
                  Real-time Multiplayer
                </p>
                <Icons.Lightning className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-gray-500 max-w-md mx-auto">
                Challenge players worldwide in fast-paced matches!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-md">
              <Button
                onClick={handleFindMatch}
                variant="primary"
                size="xl"
                icon={<Icons.Search className="w-6 h-6" />}
                fullWidth
              >
                Find Match
              </Button>

              <Button
                onClick={handleCreateMatch}
                variant="success"
                size="xl"
                icon={<Icons.Plus className="w-6 h-6" />}
                fullWidth
              >
                Create Private Match
              </Button>
            </div>

            {/* Match ID Display */}
            {NakamaService.getMatchId() && (
              <Card variant="gradient" padding="lg" className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Icons.Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">Active Match ID</p>
                </div>
                <div className="bg-white px-4 py-3 rounded-xl border-2 border-gray-200 shadow-inner">
                  <p className="font-mono text-sm text-gray-800 break-all text-center">
                    {NakamaService.getMatchId()}
                  </p>
                </div>
              </Card>
            )}

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-sm font-medium text-indigo-700 flex items-center gap-2">
                <Icons.Clock className="w-4 h-4" />
                Instant Play
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-purple-700 flex items-center gap-2">
                <Icons.Users className="w-4 h-4" />
                Global Players
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-sm font-medium text-green-700 flex items-center gap-2">
                <Icons.Sparkles className="w-4 h-4" />
                Free Forever
              </div>
            </div>
          </div>
        );

      case 'finding':
        return (
          <Loading
            message="Finding your opponent"
            submessage="Searching for available players..."
            variant="multi"
            size="xl"
          />
        );

      case 'playing':
        return (
          <div className="py-4">
            <GameBoard
              gameState={gameState}
              currentUserId={userId}
              onCellClick={handleCellClick}
            />
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {gameState.status === 'finished' && (
                <Button
                  onClick={handlePlayAgain}
                  variant="primary"
                  size="lg"
                  icon={<Icons.Refresh className="w-5 h-5" />}
                >
                  Play Again
                </Button>
              )}
              <Button
                onClick={handleLeaveMatch}
                variant="secondary"
                size="lg"
                icon={<Icons.Exit className="w-5 h-5" />}
              >
                Leave Match
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-12">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative p-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full">
                <Icons.Warning className="w-20 h-20 text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-800">Something went wrong</h2>
            <Card variant="gradient" padding="lg" className="max-w-md mx-auto mb-8">
              <p className="text-gray-700 text-lg">{error}</p>
            </Card>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              size="lg"
              icon={<Icons.Refresh className="w-5 h-5" />}
            >
              Try Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-3xl border border-white/20">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
