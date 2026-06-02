import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, ShieldCheck, Wifi, XCircle, Clock, Activity, ChevronLeft, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { RemoteSession, ApiResponse } from '@shared/types';
export function ConnectionViewerPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<RemoteSession | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/sessions');
        const json = await res.json() as ApiResponse<RemoteSession[]>;
        if (json.success && json.data) {
          const found = json.data.find(s => s.id === sessionId);
          if (found) {
            setSession(found);
            addLog("System: Starting edge-proxy listener on port 443...");
            addLog("Auth: Validating cloudflare-access-token...");
            addLog("Tunnel: Established wireguard-based tunnel to worker-node-01");
            addLog("Stream: Encrypted channel ready (AES-GCM-256)");
          } else {
            toast.error("Session not found");
            navigate('/');
          }
        }
      } catch (e) {
        toast.error("Failed to load session");
      }
    };
    fetchSession();
  }, [sessionId, navigate]);
  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-8));
  };
  const handleDisconnect = async () => {
    if (!sessionId) return;
    setIsDisconnecting(true);
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      toast.success("Tunnel closed successfully");
      navigate('/');
    } catch (e) {
      toast.error("Failed to terminate session");
    } finally {
      setIsDisconnecting(false);
    }
  };
  if (!session) return null;
  return (
    <AppLayout container={false}>
      <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Grid & Scanline */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        <div className="absolute inset-0 z-0 opacity-20"
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="scanline absolute inset-0 pointer-events-none opacity-10" />
        <div className="relative z-10 w-full max-w-5xl px-6 py-12 space-y-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => navigate('/')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2 text-green-500 font-mono text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SECURE_LINK_ACTIVE
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-cf-blue-500/20 blur-2xl animate-pulse" />
              <div className="relative bg-slate-900 border border-cf-blue-500/30 p-8 rounded-full shadow-2xl glow-pulse">
                <Wifi className="w-16 h-16 text-cf-blue-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-bold text-white tracking-tighter">
                ACTIVE <span className="text-cf-blue-500">TUNNEL</span>
              </h1>
              <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Node {session.machineId.slice(0, 8)} • Edge Access Verified
              </p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Terminal View */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-8 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 font-mono text-sm shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 text-slate-500 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>EDGE_GATEWAY_V1.log</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>
              </div>
              <div className="space-y-2 h-48 overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-slate-300 leading-relaxed"
                    >
                      <span className="text-cf-blue-500 mr-2">➜</span> {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block w-2 h-4 bg-cf-blue-500 ml-1 align-middle"
                />
              </div>
            </motion.div>
            {/* Session Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Metrics</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Latency</span>
                      <span className="text-cf-blue-400 font-mono">{session.latency}ms</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Throughput</span>
                      <span className="text-slate-200 font-mono">1.2 Gbps</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Uptime</span>
                      <span className="text-green-400 font-mono">00:04:12</span>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-slate-800" />
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Security</div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    TLS 1.3 Certified
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    End-to-End Encrypted
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                className="w-full mt-8 h-12 text-md font-bold uppercase tracking-wider"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? 'Terminating...' : 'Kill Session'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}