import { Client, Session, Socket } from '@heroiclabs/nakama-js';
import { GameState, OpCodes } from '../types';

class NakamaService {
  private client: Client | null = null;
  private socket: Socket | null = null;
  private session: Session | null = null;
  private matchId: string | null = null;

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
    await this.socket.connect(this.session);

    console.log('Socket connected');
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

    const result = await this.client.rpc(this.session, 'find_match', '{}');
    const data = typeof result.payload === 'string'
      ? JSON.parse(result.payload)
      : result.payload;
    this.matchId = data.matchId;

    console.log('Match found:', this.matchId);
    return this.matchId;
  }

  async createMatch(): Promise<string> {
    if (!this.client || !this.session) {
      throw new Error('Not connected');
    }

    const result = await this.client.rpc(this.session, 'create_match', '{}');
    const data = typeof result.payload === 'string'
      ? JSON.parse(result.payload)
      : result.payload;
    this.matchId = data.matchId;

    console.log('Match created:', this.matchId);
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
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.onmatchdata = (matchData) => {
      if (matchData.op_code === OpCodes.STATE_UPDATE) {
        const state: GameState = JSON.parse(
          new TextDecoder().decode(matchData.data)
        );
        callback(state);
      }
    };
  }

  onPlayerJoined(
    callback: (data: { userId: string; username: string; mark: 'X' | 'O' }) => void
  ): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.onmatchdata = (matchData) => {
      if (matchData.op_code === OpCodes.PLAYER_JOINED) {
        const data = JSON.parse(new TextDecoder().decode(matchData.data));
        callback(data);
      }
    };
  }

  onPlayerLeft(callback: (data: { winner: string }) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.onmatchdata = (matchData) => {
      if (matchData.op_code === OpCodes.PLAYER_LEFT) {
        const data = JSON.parse(new TextDecoder().decode(matchData.data));
        callback(data);
      }
    };
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
