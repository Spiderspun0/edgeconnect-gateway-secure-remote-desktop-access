import { DurableObject } from "cloudflare:workers";
import type { RemoteMachine } from '@shared/types';
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
}