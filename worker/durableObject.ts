import { DurableObject } from "cloudflare:workers";
import type { RemoteMachine, RemoteSession } from '@shared/types';
import { MOCK_REMOTE_MACHINES } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getRemoteMachines(): Promise<RemoteMachine[]> {
      const machines = await this.ctx.storage.get("remote_machines");
      if (machines) {
        return machines as RemoteMachine[];
      }
      await this.ctx.storage.put("remote_machines", MOCK_REMOTE_MACHINES);
      return MOCK_REMOTE_MACHINES;
    }
    async addRemoteMachine(machine: RemoteMachine): Promise<RemoteMachine[]> {
      const machines = await this.getRemoteMachines();
      const updated = [...machines, machine];
      await this.ctx.storage.put("remote_machines", updated);
      return updated;
    }
    async updateRemoteMachine(id: string, updates: Partial<Omit<RemoteMachine, 'id'>>): Promise<RemoteMachine[]> {
      const machines = await this.getRemoteMachines();
      const updated = machines.map(m => m.id === id ? { ...m, ...updates } : m);
      await this.ctx.storage.put("remote_machines", updated);
      return updated;
    }
    async deleteRemoteMachine(id: string): Promise<RemoteMachine[]> {
      const machines = await this.getRemoteMachines();
      const updated = machines.filter(m => m.id !== id);
      await this.ctx.storage.put("remote_machines", updated);
      return updated;
    }
    // Session Management
    async getActiveSessions(): Promise<RemoteSession[]> {
      const sessions = await this.ctx.storage.get("active_sessions");
      return (sessions as RemoteSession[]) || [];
    }
    async startSession(machineId: string): Promise<RemoteSession> {
      const sessions = await this.getActiveSessions();
      const newSession: RemoteSession = {
        id: crypto.randomUUID(),
        machineId,
        startTime: new Date().toISOString(),
        status: 'connecting',
        latency: Math.floor(Math.random() * 50) + 10,
      };
      await this.ctx.storage.put("active_sessions", [...sessions, newSession]);
      // Update machine status
      await this.updateRemoteMachine(machineId, { status: 'connecting' });
      // Simulate connection progress
      setTimeout(async () => {
        const currentSessions = await this.getActiveSessions();
        const updatedSessions = currentSessions.map(s => 
          s.id === newSession.id ? { ...s, status: 'active' as const } : s
        );
        await this.ctx.storage.put("active_sessions", updatedSessions);
        await this.updateRemoteMachine(machineId, { status: 'online' });
      }, 2000);
      return newSession;
    }
    async endSession(sessionId: string): Promise<void> {
      const sessions = await this.getActiveSessions();
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        await this.ctx.storage.put("active_sessions", updatedSessions);
        await this.updateRemoteMachine(session.machineId, { status: 'offline' });
      }
    }
}