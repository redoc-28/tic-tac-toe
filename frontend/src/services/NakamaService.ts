import { Client, Session, Socket } from '@heroiclabs/nakama-js';
import { GameState, OpCodes } from '../types';

class NakamaService {
  private client: Client | null = null;
  private socket: Socket | null = null;
  private session: Session | null = null;
  private matchId: string | null = null;
  private matchDataCallback: ((state: GameState) => void) | null = null;
  private playerJoinedCallback: ((data: { userId: string; username: string; mark: 'X' | 'O' }) => void) | null = null;
  private playerLeftCallback: ((data: { winner: string }) => void) | null = null;

  async connect(): Promise<void> {
    const host = import.meta.env.VITE_NAKAMA_HOST || 'localhost';
    const port = import.meta.env.VITE_NAKAMA_PORT || '7350';
    const useSSL = import.meta.env.VITE_NAKAMA_USE_SSL === 'true';
    const serverKey = import.meta.env.VITE_NAKAMA_SERVER_KEY || 'defaultkey';

    this.client = new Client(serverKey, host, port, useSSL);

    // Authenticate as a device (anonymous)
    const deviceId = this.getOrCreateDeviceId();
    this.session = await this.client.authenticateDevice(deviceId, true);

    console.log('Authenticated:', this.session);

    // Create socket connection
    this.socket = this.client.createSocket(useSSL, false);
    await this.socket.connect(this.session, true);

    // Set up unified match data handler
    this.setupMatchDataHandler();

    console.log('Socket connected');
  }

  private setupMatchDataHandler(): void {
    if (!this.socket) return;

    this.socket.onmatchdata = (matchData) => {
      console.log('Match data received - OpCode:', matchData.op_code);

      try {
        const decodedData = new TextDecoder().decode(matchData.data);
        console.log('Decoded data:', decodedData);

        if (matchData.op_code === OpCodes.STATE_UPDATE) {
          const state: GameState = JSON.parse(decodedData);
          console.log('Parsed game state:', state);
          if (this.matchDataCallback) {
            this.matchDataCallback(state);
          }
        } else if (matchData.op_code === OpCodes.PLAYER_JOINED) {
          const data = JSON.parse(decodedData);
          console.log('Player joined:', data);
          if (this.playerJoinedCallback) {
            this.playerJoinedCallback(data);
          }
        } else if (matchData.op_code === OpCodes.PLAYER_LEFT) {
          const data = JSON.parse(decodedData);
          console.log('Player left:', data);
          if (this.playerLeftCallback) {
            this.playerLeftCallback(data);
          }
        }
      } catch (error) {
        console.error('Error processing match data:', error);
      }
    };
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = this.generateUUID();
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async findMatch(): Promise<string> {
    if (!this.client || !this.session) {
      throw new Error('Not connected');
    }

    const result = await this.client.rpc(this.session, 'find_match', {});
    const data = typeof result.payload === 'string'
      ? JSON.parse(result.payload)
      : result.payload;
    this.matchId = data.matchId;

    console.log('Match found:', this.matchId);
    if (!this.matchId) {
      throw new Error('Match ID not found in response');
    }
    return this.matchId;
  }

  async createMatch(): Promise<string> {
    if (!this.client || !this.session) {
      throw new Error('Not connected');
    }

    const result = await this.client.rpc(this.session, 'create_match', {});
    const data = typeof result.payload === 'string'
      ? JSON.parse(result.payload)
      : result.payload;
    this.matchId = data.matchId;

    console.log('Match created:', this.matchId);
    if (!this.matchId) {
      throw new Error('Match ID not found in response');
    }
    return this.matchId;
  }

  async joinMatch(matchId: string): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.matchId = matchId;
    await this.socket.joinMatch(matchId);
    console.log('Joined match:', matchId);
  }

  async leaveMatch(): Promise<void> {
    if (!this.socket || !this.matchId) {
      return;
    }

    await this.socket.leaveMatch(this.matchId);
    this.matchId = null;
    console.log('Left match');
  }

  async sendMove(position: number): Promise<void> {
    if (!this.socket || !this.matchId) {
      throw new Error('Not in a match');
    }

    const data = JSON.stringify({ position });
    await this.socket.sendMatchState(this.matchId, OpCodes.MOVE, data);
  }

  onMatchData(
    callback: (state: GameState) => void
  ): void {
    this.matchDataCallback = callback;
  }

  onPlayerJoined(
    callback: (data: { userId: string; username: string; mark: 'X' | 'O' }) => void
  ): void {
    this.playerJoinedCallback = callback;
  }

  onPlayerLeft(callback: (data: { winner: string }) => void): void {
    this.playerLeftCallback = callback;
  }

  getSession(): Session | null {
    return this.session;
  }

  getMatchId(): string | null {
    return this.matchId;
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.disconnect(true);
      this.socket = null;
    }
    this.client = null;
    this.session = null;
    this.matchId = null;
  }
}

export default new NakamaService();
