export interface GameState {
  board: (string | null)[];
  currentPlayer: string;
  status: 'waiting' | 'active' | 'finished';
  winner: string | null;
  winningLine: number[] | null;
  isDraw: boolean;
  playerX: string | null;
  playerO: string | null;
}

export interface PlayerInfo {
  userId: string;
  username: string;
  mark: 'X' | 'O';
}

export const OpCodes = {
  MOVE: 1,
  STATE_UPDATE: 2,
  PLAYER_JOINED: 3,
  PLAYER_LEFT: 4,
  GAME_OVER: 5,
};
