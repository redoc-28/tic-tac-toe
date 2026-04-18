import { GameState } from '../types';
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

  const getStatusMessage = (): string => {
    if (status === 'waiting') return 'Waiting for opponent...';
    if (status === 'finished') {
      if (isDraw) return "It's a draw!";
      if (winner === currentUserId) return 'You won!';
      return 'You lost!';
    }
    if (isMyTurn) return 'Your turn';
    return "Opponent's turn";
  };

  const isWinningCell = (index: number) => winningLine?.includes(index);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0',
      width: '100%',
      maxWidth: '420px',
      margin: '0 auto',
    }}>

      {/* ===== SCOREBOARD HEADER ===== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '16px 20px',
        background: '#1a2634',
        borderRadius: '16px 16px 0 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Player X */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: 1,
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: playerX === currentUserId
              ? 'linear-gradient(135deg, rgba(45, 212, 168, 0.2), rgba(45, 212, 168, 0.05))'
              : 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: playerX === currentUserId ? '1px solid rgba(45, 212, 168, 0.3)' : '1px solid transparent',
          }}>
            <Icons.XMark className="w-5 h-5" style={{ color: '#2dd4a8' } as React.CSSProperties} />
          </div>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: playerX === currentUserId ? '#2dd4a8' : '#e8edf2',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.02em',
            }}>
              {playerX === currentUserId ? 'You' : 'Opponent'}
            </div>
            <div style={{ fontSize: '11px', color: '#5b6f80' }}>Player X</div>
          </div>
        </div>

        {/* Turn indicator */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}>
          {status === 'active' && (
            <>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isMyTurn
                  ? 'rgba(45, 212, 168, 0.15)'
                  : 'rgba(255,255,255,0.05)',
                border: isMyTurn
                  ? '1px solid rgba(45, 212, 168, 0.3)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}>
                {myMark === 'X'
                  ? <Icons.XMark className="w-3.5 h-3.5" style={{ color: '#2dd4a8' } as React.CSSProperties} />
                  : <Icons.OMark className="w-3.5 h-3.5" style={{ color: '#ef4444' } as React.CSSProperties} />
                }
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                color: isMyTurn ? '#2dd4a8' : '#5b6f80',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Turn
              </span>
            </>
          )}
          {status === 'finished' && (
            <div style={{
              padding: '4px 14px',
              borderRadius: '8px',
              background: isDraw
                ? 'rgba(136, 153, 166, 0.15)'
                : winner === currentUserId
                  ? 'rgba(45, 212, 168, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
              color: isDraw
                ? '#8899a6'
                : winner === currentUserId
                  ? '#2dd4a8'
                  : '#ef4444',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {isDraw ? 'DRAW' : winner === currentUserId ? 'WIN' : 'LOSS'}
            </div>
          )}
        </div>

        {/* Player O */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: 1,
          justifyContent: 'flex-end',
          textAlign: 'right',
        }}>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: playerO === currentUserId ? '#ef4444' : '#e8edf2',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.02em',
            }}>
              {playerO === currentUserId ? 'You' : 'Opponent'}
            </div>
            <div style={{ fontSize: '11px', color: '#5b6f80' }}>Player O</div>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: playerO === currentUserId
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))'
              : 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: playerO === currentUserId ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
          }}>
            <Icons.OMark className="w-5 h-5" style={{ color: '#ef4444' } as React.CSSProperties} />
          </div>
        </div>
      </div>

      {/* ===== STATUS BAR ===== */}
      <div style={{
        width: '100%',
        padding: '12px 20px',
        background: isMyTurn
          ? 'linear-gradient(135deg, rgba(45, 212, 168, 0.08), rgba(45, 212, 168, 0.03))'
          : 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}>
        {status === 'active' && isMyTurn && (
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#2dd4a8',
            boxShadow: '0 0 8px rgba(45, 212, 168, 0.5)',
          }} className="animate-pulse" />
        )}
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: status === 'finished'
            ? (isDraw ? '#8899a6' : winner === currentUserId ? '#2dd4a8' : '#ef4444')
            : (isMyTurn ? '#2dd4a8' : '#5b6f80'),
          letterSpacing: '0.04em',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {getStatusMessage()}
        </span>
      </div>

      {/* ===== GAME BOARD ===== */}
      <div style={{
        width: '100%',
        padding: '24px',
        background: 'linear-gradient(180deg, #20b08c 0%, #1a9e7a 50%, #179068 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.1), transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          position: 'relative',
          zIndex: 1,
        }}>
          {board.map((cell, index) => {
            const isWin = isWinningCell(index);
            const isClickable = isMyTurn && !cell && status === 'active';

            return (
              <button
                key={index}
                onClick={() => onCellClick(index)}
                disabled={!isClickable}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isWin
                    ? 'rgba(255, 255, 255, 0.3)'
                    : cell
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: isWin
                    ? '0 0 20px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.1)'
                    : isClickable
                      ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)'
                      : '0 1px 4px rgba(0,0,0,0.1)',
                  transform: isWin ? 'scale(1.03)' : 'scale(1)',
                  padding: 0,
                  fontSize: 0, // Reset button font
                }}
                onMouseEnter={(e) => {
                  if (isClickable) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isClickable) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)';
                  }
                }}
              >
                {cell && (
                  <div className="animate-scale-in" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}>
                    {cell === 'X' ? (
                      <Icons.XMark
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                        style={{
                          color: '#0a1015',
                          strokeWidth: '4',
                          filter: isWin ? 'drop-shadow(0 0 12px rgba(10, 16, 21, 0.6))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                        } as React.CSSProperties}
                      />
                    ) : (
                      <Icons.OMark
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                        style={{
                          color: '#ffffff',
                          strokeWidth: '4',
                          filter: isWin ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                        } as React.CSSProperties}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== WINNER OVERLAY (shows within the card when game is finished) ===== */}
      {status === 'finished' && !isDraw && (
        <div style={{
          width: '100%',
          padding: '24px 20px',
          background: winner === currentUserId
            ? 'linear-gradient(135deg, rgba(45, 212, 168, 0.08), rgba(45, 212, 168, 0.02))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.02))',
          borderTop: winner === currentUserId
            ? '1px solid rgba(45, 212, 168, 0.2)'
            : '1px solid rgba(239, 68, 68, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div className="animate-winner" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {winner === currentUserId ? (
              <>
                <Icons.Crown className="w-8 h-8" style={{ color: '#fbbf24' } as React.CSSProperties} />
                <span style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#2dd4a8',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.02em',
                }}>
                  WINNER!
                </span>
              </>
            ) : (
              <span style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#ef4444',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Better luck next time!
              </span>
            )}
          </div>
          {winner === currentUserId && (
            <span style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#fbbf24',
              background: 'rgba(251, 191, 36, 0.12)',
              padding: '4px 16px',
              borderRadius: '999px',
              border: '1px solid rgba(251, 191, 36, 0.2)',
            }}>
              +200 pts
            </span>
          )}
        </div>
      )}

      {status === 'finished' && isDraw && (
        <div style={{
          width: '100%',
          padding: '20px',
          background: 'rgba(136, 153, 166, 0.05)',
          borderTop: '1px solid rgba(136, 153, 166, 0.1)',
          textAlign: 'center',
        }}>
          <div className="animate-winner" style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#8899a6',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            It's a draw!
          </div>
        </div>
      )}

      {/* ===== BOTTOM ROUNDED ===== */}
      <div style={{
        width: '100%',
        height: '12px',
        background: status === 'finished'
          ? (isDraw
            ? 'rgba(136, 153, 166, 0.05)'
            : winner === currentUserId
              ? 'linear-gradient(135deg, rgba(45, 212, 168, 0.08), rgba(45, 212, 168, 0.02))'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.02))')
          : 'linear-gradient(180deg, #179068, #14825c)',
        borderRadius: '0 0 16px 16px',
      }} />
    </div>
  );
}
