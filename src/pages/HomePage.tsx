import React, { useEffect, useState } from 'react';
import { Plus, LayoutGrid, Monitor, ShieldCheck, Activity, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { MachineCard } from '@/components/MachineCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import type { RemoteMachine, RemoteSession, ApiResponse } from '@shared/types';
import { toast } from 'sonner';
export function HomePage() {
  const [machines, setMachines] = useState<RemoteMachine[]>([]);
  const [sessions, setSessions] = useState<RemoteSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        fetch('/api/machines'),
        fetch('/api/sessions')
      ]);
      const mJson = await mRes.json() as ApiResponse<RemoteMachine[]>;
      const sJson = await sRes.json() as ApiResponse<RemoteSession[]>;
      if (mJson.success && mJson.data) setMachines(mJson.data);
      if (sJson.success && sJson.data) setSessions(sJson.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleConnect = async (machineId: string) => {
    setIsConnecting(machineId);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machineId }),
      });
      const json = await res.json() as ApiResponse<RemoteSession>;
      if (json.success && json.data) {
        toast.success("Tunnel Handshake Initiated");
        navigate(`/sessions/${json.data.id}`);
      }
    } catch (e) {
      toast.error("Failed to start tunnel");
    } finally {
      setIsConnecting(null);
    }
  };
  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-cf-hero p-8 md:p-12 border border-cf-blue-500/10">
          <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cf-blue-500/10 text-cf-blue-600 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Secure Edge Connectivity
            </div>
            <h1 className="text-display tracking-tight text-foreground text-4xl md:text-5xl font-bold">
              Your <span className="text-cf-blue-600">Gateways</span> to Every Machine.
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Securely connect to your remote workstations through Cloudflare's global network.
              Low latency, encrypted by default.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" variant="gradient" onClick={() => navigate('/machines/new')}>
                <Plus className="mr-2 w-5 h-5" /> Add New Machine
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cf-blue-500/5 to-transparent hidden lg:block" />
        </div>
        {/* Status Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Sessions', value: sessions.length.toString(), icon: Activity, color: 'text-cf-blue-600' },
            { label: 'Remote Nodes', value: machines.length.toString(), icon: Monitor, color: 'text-cf-blue-600' },
            { label: 'Total Tunnels', value: machines.filter(m => m.status === 'online').length.toString(), icon: ShieldCheck, color: 'text-green-600' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
              <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Machine Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-cf-blue-600" />
              <h2 className="text-2xl font-bold">Registered Machines</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : machines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {machines.map((machine) => (
                <MachineCard 
                  key={machine.id} 
                  machine={machine} 
                  onConnect={() => handleConnect(machine.id)}
                  isConnecting={isConnecting === machine.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
              <Monitor className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Machines Yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                Connect your first workstation to get started with remote access.
              </p>
              <Button variant="outline" onClick={() => navigate('/machines/new')}>
                <Plus className="mr-2 w-4 h-4" /> Register Node
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}