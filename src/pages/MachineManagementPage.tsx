import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MachineForm } from '@/components/MachineForm';
import { ChevronRight, Home, Server } from 'lucide-react';
import type { RemoteMachine, ApiResponse } from '@shared/types';
import { toast } from 'sonner';
export function MachineManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<RemoteMachine | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  useEffect(() => {
    if (id) {
      const fetchMachine = async () => {
        try {
          const res = await fetch('/api/machines');
          const json = await res.json() as ApiResponse<RemoteMachine[]>;
          if (json.success && json.data) {
            const found = json.data.find(m => m.id === id);
            if (found) setInitialData(found);
          }
        } catch (e) {
          toast.error("Failed to load machine data");
        } finally {
          setIsFetching(false);
        }
      };
      fetchMachine();
    }
  }, [id]);
  const handleSubmit = async (machine: RemoteMachine) => {
    setIsLoading(true);
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/machines/${id}` : '/api/machines';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(machine),
      });
      if (res.ok) {
        toast.success(id ? "Machine updated" : "Machine registered", {
          description: `${machine.name} is now ready for secure access.`
        });
        navigate('/');
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      toast.error("Operation failed", { description: "There was an issue saving the machine details." });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-muted-foreground gap-2">
          <Link to="/" className="hover:text-cf-blue-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-foreground">{id ? 'Edit Machine' : 'New Machine'}</span>
        </nav>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-cf-blue-600 font-semibold uppercase tracking-wider text-xs">
            <Server className="w-4 h-4" /> Node Configuration
          </div>
          <h2 className="text-3xl font-bold">
            {id ? `Update ${initialData?.name || 'Machine'}` : 'Register New Machine'}
          </h2>
          <p className="text-muted-foreground">
            Configure the network endpoint and authentication for your remote workstation.
          </p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
          {isFetching ? (
            <div className="space-y-4">
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <MachineForm 
              initialData={initialData} 
              onSubmit={handleSubmit} 
              onCancel={() => navigate('/')} 
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}