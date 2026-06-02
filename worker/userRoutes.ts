import { Hono } from "hono";
import { Env } from './core-utils';
import type { RemoteMachine, ApiResponse } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Machine CRUD
    app.get('/api/machines', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getRemoteMachines();
        return c.json({ success: true, data } satisfies ApiResponse<RemoteMachine[]>);
    });
    app.post('/api/machines', async (c) => {
        const body = await c.req.json() as RemoteMachine;
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.addRemoteMachine(body);
        return c.json({ success: true, data } satisfies ApiResponse<RemoteMachine[]>);
    });
    app.put('/api/machines/:id', async (c) => {
        const id = c.req.param('id');
        const body = await c.req.json() as Partial<Omit<RemoteMachine, 'id'>>;
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.updateRemoteMachine(id, body);
        return c.json({ success: true, data } satisfies ApiResponse<RemoteMachine[]>);
    });
    app.delete('/api/machines/:id', async (c) => {
        const id = c.req.param('id');
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.deleteRemoteMachine(id);
        return c.json({ success: true, data } satisfies ApiResponse<RemoteMachine[]>);
    });
}