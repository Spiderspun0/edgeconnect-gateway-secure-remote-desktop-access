export interface RemoteMachine {
  id: string;
  name: string;
  host: string;
  port: number;
  authMethod: 'token' | 'password';
  authToken: string;
  status: 'online' | 'offline' | 'connecting';
  lastConnected?: string;
}
export interface RemoteSession {
  id: string;
  machineId: string;
  startTime: string;
  status: 'connecting' | 'active' | 'closed';
  latency: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}