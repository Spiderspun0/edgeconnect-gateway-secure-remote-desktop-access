import React, { useEffect, useState } from 'react';
import { Plus, LayoutGrid, Monitor, ShieldCheck, Activity, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { MachineCard } from '@/components/MachineCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import type { RemoteMachine, RemoteSession, ApiResponse } from '@shared/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
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
    // Poll for status updates while connecting
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
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
        toast.success("Tunnel Handshake Initiated", {
          description: "Establishing secure edge connection..."
        });
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-cf-hero p-8 md:p-16 border border-cf-blue-500/10 shadow-sm"
        >
          <div className="relative z-10 space-y-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-cf-blue-500/20 text-cf-blue-600 text-sm font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              Enterprise-Grade Edge Proxy
            </div>
            <h1 className="text-display tracking-tight text-foreground text-5xl md:text-7xl font-black leading-[1.05]">
              Seamless. Secure. <br />
              <span className="text-cf-blue-600">Always Connected.</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-xl font-medium">
              Bridge the gap between your local environment and remote infrastructure with zero-latency tunnels powered by Cloudflare.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" variant="gradient" className="h-14 px-8 text-lg rounded-2xl" onClick={() => navigate('/machines/new')}>
                <Plus className="mr-2 w-6 h-6" /> Add New Node
              </Button>
            </div>
          </div>
          <div className="absolute right-[-10%] top-[-20%] h-[140%] w-[50%] bg-gradient-to-l from-cf-blue-500/10 to-transparent blur-3xl rounded-full hidden lg:block pointer-events-none" />
        </motion.div>
        {/* Status Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Sessions', value: sessions.length.toString(), icon: Activity, color: 'text-cf-blue-600', pulse: sessions.length > 0 },
            { label: 'Remote Nodes', value: machines.length.toString(), icon: Monitor, color: 'text-cf-blue-600', pulse: false },
            { label: 'Total Tunnels', value: machines.filter(m => m.status === 'online').length.toString(), icon: ShieldCheck, color: 'text-green-600', pulse: false },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-center gap-5 p-6 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all cursor-default"
            >
              <div className={`p-4 rounded-2xl bg-muted group-hover:scale-110 transition-transform ${stat.color} relative`}>
                {stat.pulse && <span className="absolute inset-0 rounded-2xl bg-current opacity-20 animate-ping" />}
                <stat.icon className="w-6 h-6 relative z-10" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Machine Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cf-blue-500 rounded-lg">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Your Network</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-3xl" />
              ))}
            </div>
          ) : machines.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {machines.map((machine) => (
                <MachineCard
                  key={machine.id}
                  machine={machine}
                  onConnect={() => handleConnect(machine.id)}
                  isConnecting={isConnecting === machine.id}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border"
            >
              <Monitor className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
              <h3 className="text-2xl font-black mb-3">Gateway Ready</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
                Your edge network is empty. Connect your first remote workstation to start the tunnel.
              </p>
              <Button variant="outline" className="h-12 px-8 rounded-xl border-cf-blue-500/50 text-cf-blue-600 hover:bg-cf-blue-50" onClick={() => navigate('/machines/new')}>
                <Plus className="mr-2 w-5 h-5" /> Register Edge Node
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}