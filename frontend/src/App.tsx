import { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import Button from './components/Button';
import Icons from './components/Icons';
import Loading from './components/Loading';
import NakamaService from './services/NakamaService';
import { GameState } from './types';

type AppState = 'connecting' | 'nickname' | 'menu' | 'finding' | 'playing' | 'error';

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
  const [nickname, setNickname] = useState<string>('');
  const [nicknameInput, setNicknameInput] = useState<string>('');

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
      if (session?.user_id) {
        setUserId(session.user_id);
      }

      NakamaService.onMatchData((state) => {
        console.log('Received game state:', state);
        setGameState(state);
      });

      // Check if nickname already saved
      const savedNickname = localStorage.getItem('ttt_nickname');
      if (savedNickname) {
        setNickname(savedNickname);
        setAppState('menu');
      } else {
        setAppState('nickname');
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect to server');
      setAppState('error');
    }
  };

  const handleSetNickname = () => {
    const name = nicknameInput.trim();
    if (name.length >= 2) {
      setNickname(name);
      localStorage.setItem('ttt_nickname', name);
      setAppState('menu');
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

  const handleCancelFind = async () => {
    setAppState('menu');
  };

  // ===== SCREENS =====

  const renderContent = () => {
    switch (appState) {

      // ── Connecting ──
      case 'connecting':
        return (
          <Loading
            message="Connecting to server"
            submessage="Setting up your game session..."
            variant="primary"
            size="lg"
          />
        );

      // ── Nickname Entry ──
      case 'nickname':
        return (
          <div className="animate-fade-in-up" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 24px',
            gap: '28px',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(45, 212, 168, 0.15), rgba(45, 212, 168, 0.05))',
                border: '1px solid rgba(45, 212, 168, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Icons.Users className="w-7 h-7" style={{ color: '#2dd4a8' }} />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#e8edf2',
                marginBottom: '8px',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Who are you?
              </h2>
              <p style={{ fontSize: '14px', color: '#5b6f80' }}>
                Choose a nickname to get started
              </p>
            </div>

            {/* Input */}
            <div style={{ width: '100%', maxWidth: '280px' }}>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetNickname()}
                placeholder="Nickname"
                maxLength={16}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '2px solid rgba(45, 212, 168, 0.2)',
                  background: '#1a2634',
                  color: '#e8edf2',
                  fontSize: '16px',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.02em',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(45, 212, 168, 0.5)';
                  e.target.style.boxShadow = '0 0 20px rgba(45, 212, 168, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(45, 212, 168, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleSetNickname}
              variant="primary"
              size="lg"
              disabled={nicknameInput.trim().length < 2}
              fullWidth
              className=""
            >
              Continue
            </Button>
          </div>
        );

      // ── Main Menu ──
      case 'menu':
        return (
          <div className="animate-fade-in-up" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '36px 24px',
            gap: '28px',
          }}>
            {/* Logo & Title */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '24px',
              }}>
                {/* Glow behind logo */}
                <div style={{
                  position: 'absolute',
                  inset: '-16px',
                  background: 'radial-gradient(circle, rgba(45, 212, 168, 0.15), transparent 70%)',
                  borderRadius: '50%',
                }} className="animate-glow-pulse" />

                <div style={{
                  position: 'relative',
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #2dd4a8, #1a9e7a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(45, 212, 168, 0.3)',
                }}>
                  <Icons.Grid className="w-10 h-10" style={{ color: '#0f1923' }} />
                </div>
              </div>

              <h1 style={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#e8edf2',
                marginBottom: '6px',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                Tic-Tac-Toe
              </h1>

              <p style={{
                fontSize: '14px',
                color: '#5b6f80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}>
                <Icons.Lightning className="w-4 h-4" style={{ color: '#2dd4a8' }} />
                <span>Real-time Multiplayer</span>
                <Icons.Lightning className="w-4 h-4" style={{ color: '#2dd4a8' }} />
              </p>
            </div>

            {/* Welcome */}
            <div style={{
              padding: '10px 20px',
              borderRadius: '999px',
              background: 'rgba(45, 212, 168, 0.08)',
              border: '1px solid rgba(45, 212, 168, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '13px', color: '#5b6f80' }}>Welcome,</span>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#2dd4a8',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {nickname}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              width: '100%',
            }}>
              <Button
                onClick={handleFindMatch}
                variant="primary"
                size="xl"
                icon={<Icons.Search className="w-5 h-5" />}
                fullWidth
              >
                Find Match
              </Button>

              <Button
                onClick={handleCreateMatch}
                variant="outline"
                size="lg"
                icon={<Icons.Plus className="w-5 h-5" />}
                fullWidth
              >
                Create Private Match
              </Button>
            </div>

            {/* Match ID */}
            {NakamaService.getMatchId() && (
              <div style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <Icons.Shield className="w-4 h-4" style={{ color: '#2dd4a8' }} />
                  <span style={{ fontSize: '12px', color: '#5b6f80', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                    Active Match ID
                  </span>
                </div>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#1a2634',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <code style={{
                    fontSize: '12px',
                    color: '#8899a6',
                    wordBreak: 'break-all' as const,
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                  }}>
                    {NakamaService.getMatchId()}
                  </code>
                </div>
              </div>
            )}

            {/* Feature pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap' as const,
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
            }}>
              {[
                { icon: <Icons.Clock className="w-3.5 h-3.5" />, label: 'Instant Play' },
                { icon: <Icons.Users className="w-3.5 h-3.5" />, label: 'Global Players' },
                { icon: <Icons.Sparkles className="w-3.5 h-3.5" />, label: 'Free Forever' },
              ].map((pill) => (
                <div key={pill.label} style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#5b6f80',
                  fontWeight: 500,
                }}>
                  {pill.icon}
                  {pill.label}
                </div>
              ))}
            </div>
          </div>
        );

      // ── Finding Match ──
      case 'finding':
        return (
          <div className="animate-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 24px',
            gap: '8px',
          }}>
            <Loading
              message="Finding a random player.."
              submessage="It usually takes 30 seconds"
              variant="multi"
              size="lg"
              showCancel
              onCancel={handleCancelFind}
            />
          </div>
        );

      // ── Playing ──
      case 'playing':
        return (
          <div className="animate-fade-in" style={{
            padding: '0',
          }}>
            <GameBoard
              gameState={gameState}
              currentUserId={userId}
              onCellClick={handleCellClick}
            />

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              padding: '20px 24px 8px',
            }}>
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
                Leave
              </Button>
            </div>
          </div>
        );

      // ── Error ──
      case 'error':
        return (
          <div className="animate-fade-in-up" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 24px',
            gap: '24px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icons.Warning className="w-10 h-10" style={{ color: '#ef4444' }} />
            </div>

            <div>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#e8edf2',
                marginBottom: '8px',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Something went wrong
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#5b6f80',
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.1)',
              }}>
                {error}
              </p>
            </div>

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
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0f1923',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45, 212, 168, 0.04), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45, 212, 168, 0.03), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main card container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#162029',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.03)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Subtle top accent line */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #2dd4a8, transparent)',
          opacity: 0.5,
        }} />

        {renderContent()}
      </div>
    </div>
  );
}

export default App;
