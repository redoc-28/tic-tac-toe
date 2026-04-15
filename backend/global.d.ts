// Nakama runtime type definitions
// These types are available globally in Nakama's JavaScript runtime

declare namespace nkruntime {
  interface Context {
    env: { [key: string]: string };
    executionMode: string;
    headers: { [key: string]: string };
    queryParams: { [key: string]: string };
    userId: string;
    username: string;
    vars: { [key: string]: string };
    userSessionExp: number;
    sessionId: string;
    clientIp: string;
    clientPort: string;
    lang: string;
  }

  interface Logger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
  }

  interface Nakama {
    matchCreate(module: string, params?: { [key: string]: any }): string;
    matchList(
      limit: number,
      authoritative: boolean,
      label: string,
      minSize: number,
      maxSize: number,
      query: string
    ): Match[];
    binaryToString(data: ArrayBuffer): string;
  }

  interface Initializer {
    registerMatch(
      name: string,
      handlers: {
        matchInit: MatchInitFunction<any>;
        matchJoinAttempt: MatchJoinAttemptFunction<any>;
        matchJoin: MatchJoinFunction<any>;
        matchLeave: MatchLeaveFunction<any>;
        matchLoop: MatchLoopFunction<any>;
        matchTerminate: MatchTerminateFunction<any>;
        matchSignal: MatchSignalFunction<any>;
      }
    ): void;
    registerRpc(id: string, fn: RpcFunction): void;
  }

  interface Presence {
    userId: string;
    sessionId: string;
    username: string;
    node: string;
  }

  interface MatchDispatcher {
    broadcastMessage(opCode: number, data: string | ArrayBuffer, presences?: Presence[], sender?: Presence): void;
    matchKick(presences: Presence[]): void;
    matchLabelUpdate(label: string): void;
  }

  interface MatchMessage {
    sender: Presence;
    opCode: number;
    data: ArrayBuffer;
    reliable: boolean;
    receiveTime: number;
  }

  interface Match {
    matchId: string;
    authoritative: boolean;
    label: {
      open: number;
      value: string;
    };
    size: number;
    tickRate: number;
    handlerName: string;
  }

  type MatchInitFunction<T> = (
    ctx: Context,
    logger: Logger,
    nk: Nakama,
    params: { [key: string]: string }
  ) => { state: T; tickRate: number; label: string };

  type MatchJoinAttemptFunction<T> = (
    ctx: Context,
    logger: Logger,
    nk: Nakama,
    dispatcher: MatchDispatcher,
    tick: number,
    state: T,
    presence: Presence,
    metadata: { [key: string]: any }
  ) => { state: T; accept: boolean; rejectMessage?: string } | null;

  type MatchJoinFunction<T> = (
    ctx: Context,
    logger: Logger,
    nk: Nakama,
    dispatcher: MatchDispatcher,
    tick: number,
    state: T,
    presences: Presence[]
  ) => { state: T } | null;

  type MatchLeaveFunction<T> = (
    ctx: Context,
    logger: Logger,
    nk: Nakama,
    dispatcher: MatchDispatcher,
    tick: number,
    state: T,
    presences: Presence[]
  ) => { state: T } | null;

  type MatchLoopFunction<T> = (
    ctx: Context,
    logger: Logger,
    nk: Nakama,
    dispatcher: MatchDispatcher,
    tick: number,
    state: T,
    messages: MatchMessage[]
  ) => { state: T } | null;

  type MatchTerminateFunction<T> = (
    ctx: Context,
    logger: Logger,
    nk: Nakama,
    dispatcher: MatchDispatcher,
    tick: number,
    state: T,
    graceSeconds: number
  ) => { state: T } | null;

  type MatchSignalFunction<T> = (
    ctx: Context,
    logger: Logger,
    nk: Nakama,
    dispatcher: MatchDispatcher,
    tick: number,
    state: T,
    data: string
  ) => { state: T; data?: string } | null;

  type RpcFunction = (
    ctx: Context,
    logger: Logger,
    nk: Nakama,
    payload: string
  ) => string;
}
