// Nakama TypeScript Runtime for Tic-Tac-Toe

// Game constants
var moduleName = 'tictactoe';
var OpCodes = {
  MOVE: 1,
  STATE_UPDATE: 2,
  PLAYER_JOINED: 3,
  PLAYER_LEFT: 4,
};

var WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]              // Diagonals
];

// RPC: Create a new match
var rpcCreateMatch = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string) {
  logger.info('Creating new match');

  try {
    var matchId = nk.matchCreate(moduleName, {});
    logger.info('Match created: ' + matchId);

    return JSON.stringify({ matchId: matchId });
  } catch (error) {
    logger.error('Error creating match: ' + error);
    throw error;
  }
};

// RPC: Find an existing open match or create a new one
var rpcFindMatch = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string) {
  logger.info('Finding match');

  try {
    var matches = nk.matchList(10, true, '', 0, 100, '');
    logger.info('Found ' + matches.length + ' matches');

    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      try {
        if (!match.label || !match.label.value) {
          continue;
        }

        var label = JSON.parse(match.label.value);
        if (label.open && match.size < 2) {
          logger.info('Found open match: ' + match.matchId);
          return JSON.stringify({ matchId: match.matchId });
        }
      } catch (err) {
        logger.warn('Skipping match ' + match.matchId + ' with invalid label');
        continue;
      }
    }

    logger.info('No open match found, creating new match');
    var matchId = nk.matchCreate(moduleName, {});

    return JSON.stringify({ matchId: matchId });
  } catch (error) {
    logger.error('Error finding match: ' + error);
    throw error;
  }
};

// Helper: Check for winner
function checkWinner(board: (string | null)[]): { winner: string | null; line: number[] | null } {
  for (var i = 0; i < WINNING_COMBINATIONS.length; i++) {
    var combo = WINNING_COMBINATIONS[i];
    var a = combo[0], b = combo[1], c = combo[2];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  return { winner: null, line: null };
}

// Helper: Broadcast state
function broadcastState(dispatcher: nkruntime.MatchDispatcher, state: any) {
  var playerIds = Object.keys(state.players);
  var playerX = null;
  var playerO = null;

  for (var i = 0; i < playerIds.length; i++) {
    var pid = playerIds[i];
    if (state.players[pid].mark === 'X') playerX = pid;
    if (state.players[pid].mark === 'O') playerO = pid;
  }

  var stateUpdate = {
    board: state.board,
    currentPlayer: state.currentPlayer,
    status: state.status,
    winner: state.winner,
    winningLine: state.winningLine,
    isDraw: state.isDraw,
    playerX: playerX,
    playerO: playerO,
  };

  dispatcher.broadcastMessage(OpCodes.STATE_UPDATE, JSON.stringify(stateUpdate));
}

// Match Init
var matchInit = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, params: { [key: string]: string }) {
  logger.info('Match initialized');

  var state = {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: '',
    players: {},
    status: 'waiting',
    winner: null,
    winningLine: null,
    isDraw: false,
  };

  var label = JSON.stringify({ name: 'Tic-Tac-Toe', open: true });

  return {
    state: state,
    tickRate: 1,
    label: label,
  };
};

// Match Join Attempt
var matchJoinAttempt = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, presence: nkruntime.Presence, metadata: any) {
  logger.info('Join attempt by user: ' + presence.userId);

  if (Object.keys(state.players).length >= 2) {
    return { state: state, accept: false, rejectMessage: 'Match is full' };
  }

  if (state.status === 'finished') {
    return { state: state, accept: false, rejectMessage: 'Game is already finished' };
  }

  return { state: state, accept: true };
};

// Match Join
var matchJoin = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, presences: nkruntime.Presence[]) {
  for (var i = 0; i < presences.length; i++) {
    var presence = presences[i];
    logger.info('Player joined: ' + presence.userId);

    var playerCount = Object.keys(state.players).length;
    var mark = playerCount === 0 ? 'X' : 'O';

    state.players[presence.userId] = {
      presence: presence,
      mark: mark,
    };

    var message = JSON.stringify({
      type: 'player_joined',
      userId: presence.userId,
      username: presence.username,
      mark: mark,
    });
    dispatcher.broadcastMessage(OpCodes.PLAYER_JOINED, message);
  }

  if (Object.keys(state.players).length === 2) {
    state.status = 'active';
    var playerIds = Object.keys(state.players);
    for (var i = 0; i < playerIds.length; i++) {
      if (state.players[playerIds[i]].mark === 'X') {
        state.currentPlayer = playerIds[i];
        break;
      }
    }
    logger.info('Game started');
    broadcastState(dispatcher, state);
  }

  return { state: state };
};

// Match Leave
var matchLeave = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, presences: nkruntime.Presence[]) {
  for (var i = 0; i < presences.length; i++) {
    var presence = presences[i];
    logger.info('Player left: ' + presence.userId);

    delete state.players[presence.userId];

    if (state.status === 'active' && Object.keys(state.players).length === 1) {
      var remainingPlayer = Object.keys(state.players)[0];
      state.winner = remainingPlayer;
      state.status = 'finished';

      var message = JSON.stringify({
        type: 'player_left',
        winner: remainingPlayer,
      });
      dispatcher.broadcastMessage(OpCodes.PLAYER_LEFT, message);
      broadcastState(dispatcher, state);
    }
  }

  return { state: state };
};

// Match Loop
var matchLoop = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, messages: nkruntime.MatchMessage[]) {
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];

    if (message.opCode === OpCodes.MOVE) {
      var sender = message.sender;

      if (state.status !== 'active') continue;
      if (sender.userId !== state.currentPlayer) continue;

      var moveData = JSON.parse(nk.binaryToString(message.data));
      var position = moveData.position;

      if (position < 0 || position > 8) continue;
      if (state.board[position] !== null) continue;

      var playerMark = state.players[sender.userId].mark;
      state.board[position] = playerMark;

      logger.info('Player ' + sender.userId + ' (' + playerMark + ') moved to position ' + position);

      var winResult = checkWinner(state.board);
      if (winResult.winner) {
        state.winner = sender.userId;
        state.winningLine = winResult.line;
        state.status = 'finished';
        logger.info('Game over! Winner: ' + sender.userId);
      } else {
        var allFilled = true;
        for (var j = 0; j < state.board.length; j++) {
          if (state.board[j] === null) {
            allFilled = false;
            break;
          }
        }

        if (allFilled) {
          state.isDraw = true;
          state.status = 'finished';
          logger.info('Game over! Draw');
        } else {
          var playerIds = Object.keys(state.players);
          for (var j = 0; j < playerIds.length; j++) {
            if (playerIds[j] !== state.currentPlayer) {
              state.currentPlayer = playerIds[j];
              break;
            }
          }
        }
      }

      broadcastState(dispatcher, state);
    }
  }

  return { state: state };
};

// Match Terminate
var matchTerminate = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, graceSeconds: number) {
  logger.info('Match terminated');
  return { state: state };
};

// Match Signal
var matchSignal = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, data: string) {
  logger.info('Match signal received: ' + data);
  return { state: state };
};

// Module initialization
function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
  logger.info('TicTacToe module loaded');

  initializer.registerMatch(moduleName, {
    matchInit: matchInit,
    matchJoinAttempt: matchJoinAttempt,
    matchJoin: matchJoin,
    matchLeave: matchLeave,
    matchLoop: matchLoop,
    matchTerminate: matchTerminate,
    matchSignal: matchSignal,
  });

  initializer.registerRpc('create_match', rpcCreateMatch);
  initializer.registerRpc('find_match', rpcFindMatch);

  logger.info('TicTacToe RPCs registered');
}
