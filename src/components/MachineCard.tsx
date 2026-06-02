import React from 'react';
import { Server, Globe, Terminal, ChevronRight, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RemoteMachine } from '@shared/types';
import { useNavigate } from 'react-router-dom';
interface MachineCardProps {
  machine: RemoteMachine;
}
export function MachineCard({ machine }: MachineCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="glass-card group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cf-blue-500/10 text-cf-blue-600">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-none group-hover:text-cf-blue-600 transition-colors">
              {machine.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Globe className="w-3 h-3" /> {machine.host}:{machine.port}
            </p>
          </div>
        </div>
        <Badge 
          variant={machine.status === 'online' ? 'default' : 'secondary'} 
          className={machine.status === 'online' ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20' : ''}
        >
          {machine.status}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            <span>{machine.authMethod === 'token' ? 'Encrypted Tunnel' : 'SSH/Password'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="gradient" 
          className="flex-1"
          onClick={() => console.log('Initiating tunnel to', machine.id)}
        >
          Connect
          <ChevronRight className="ml-1 w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(`/machines/${machine.id}/edit`)}
          title="Manage machine"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}