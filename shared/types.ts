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
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}