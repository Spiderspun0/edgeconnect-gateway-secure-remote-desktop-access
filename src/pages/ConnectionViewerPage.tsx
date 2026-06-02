import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, ShieldCheck, Wifi, XCircle, Clock, Activity } from 'lucide-react';
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
            addLog(`Requesting tunnel handshake for session ${sessionId}...`);
            addLog(`Node authentication verified via edge-token.`);
            addLog(`Establishing encrypted stream...`);
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
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-10));
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
        {/* Animated Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 w-full max-w-4xl px-4 py-12 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-cf-blue-500/20 blur-xl animate-pulse" />
              <div className="relative bg-cf-blue-500/10 border border-cf-blue-500/30 p-6 rounded-full">
                <Wifi className="w-12 h-12 text-cf-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Tunnel <span className="text-cf-blue-500">Active</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Secure stream established to Edge Node {session.machineId.slice(0, 8)}
              </p>
            </div>
            <div className="flex gap-4">
              <Badge variant="outline" className="bg-slate-900/50 text-cf-blue-400 border-cf-blue-900/50 px-4 py-1">
                <Activity className="w-3 h-3 mr-2" /> {session.latency}ms Latency
              </Badge>
              <Badge variant="outline" className="bg-slate-900/50 text-green-400 border-green-900/50 px-4 py-1">
                <ShieldCheck className="w-3 h-3 mr-2" /> AES-256 Encrypted
              </Badge>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Terminal View */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 font-mono text-sm"
            >
              <div className="flex items-center gap-2 mb-4 text-slate-500">
                <Terminal className="w-4 h-4" />
                <span>CONNECTION_LOG</span>
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-slate-300"
                    >
                      <span className="text-cf-blue-500 mr-2">$</span> {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <motion.div 
                  animate={{ opacity: [0, 1] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-cf-blue-500 ml-1 align-middle"
                />
              </div>
            </motion.div>
            {/* Session Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Uptime</span>
                  </div>
                  <span className="text-white font-semibold">Live</span>
                </div>
                <div className="h-px bg-slate-800" />
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Protocol Details</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-slate-400">Handshake</div>
                    <div className="text-slate-200 text-right">TLS 1.3</div>
                    <div className="text-slate-400">Tunnel Port</div>
                    <div className="text-slate-200 text-right">443 (HTTPS)</div>
                  </div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                className="w-full mt-8 h-12 text-lg font-semibold"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                <XCircle className="w-5 h-5 mr-2" />
                {isDisconnecting ? 'Closing...' : 'Close Tunnel'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}