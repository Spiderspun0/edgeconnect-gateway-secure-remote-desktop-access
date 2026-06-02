import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RemoteMachine } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  host: z.string().min(1, "Host address is required"),
  port: z.coerce.number().int().min(1).max(65535),
  authMethod: z.enum(['token', 'password'] as const),
  authToken: z.string().min(1, "Authentication detail is required"),
});
type FormValues = z.infer<typeof formSchema>;
interface MachineFormProps {
  initialData?: RemoteMachine;
  onSubmit: (data: RemoteMachine) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
export function MachineForm({ initialData, onSubmit, onCancel, isLoading }: MachineFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      host: initialData?.host || '',
      port: initialData?.port || 3389,
      authMethod: initialData?.authMethod || 'token',
      authToken: initialData?.authToken || '',
    },
  });
  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      ...values,
      id: initialData?.id || uuidv4(),
      status: initialData?.status || 'offline',
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Machine Name</FormLabel>
              <FormControl>
                <Input placeholder="Engineering Workstation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host Address</FormLabel>
                <FormControl>
                  <Input placeholder="192.168.1.10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="authMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select auth method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="token">Secure Tunnel Token</SelectItem>
                  <SelectItem value="password">Host Password</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Token is recommended for edge-based tunnels.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{form.watch('authMethod') === 'token' ? 'Access Token' : 'Password'}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" disabled={isLoading}>
            {initialData ? 'Update Machine' : 'Create Machine'}
          </Button>
        </div>
      </form>
    </Form>
  );
}