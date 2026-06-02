import type { RemoteMachine } from './types';
export const MOCK_REMOTE_MACHINES: RemoteMachine[] = [
  { 
    id: '1', 
    name: 'Primary Build Node', 
    host: 'build-01.edgeconnect.internal', 
    port: 3389, 
    authMethod: 'token', 
    authToken: 'node_token_alpha_77',
    status: 'online',
    lastConnected: new Date(Date.now() - 3600000).toISOString()
  },
  { 
    id: '2', 
    name: 'GPU Render Rig', 
    host: 'render-gpu.local', 
    port: 5900, 
    authMethod: 'password', 
    authToken: '********',
    status: 'offline'
  },
  { 
    id: '3', 
    name: 'Edge Gateway West', 
    host: 'gw-west.cloudflare.com', 
    port: 22, 
    authMethod: 'token', 
    authToken: 'gw_secret_992',
    status: 'online',
    lastConnected: new Date(Date.now() - 86400000).toISOString()
  }
];