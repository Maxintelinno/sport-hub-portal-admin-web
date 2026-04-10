'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulation of API call
      // In real world: const res = await api.post('/auth/login', { username, password });
      await new Promise(resolve => setTimeout(resolve, 1500));

      if ((username === 'admin' || username === 'superadmin' || username === 'support') && password === 'password') {
        const mockUser = {
          id: username === 'admin' ? '1' : username === 'superadmin' ? 's1' : '2',
          username: username,
          role: (username === 'superadmin' ? 'super_admin' : username === 'support' ? 'support' : 'admin') as any,
          name: username.charAt(0).toUpperCase() + username.slice(1),
        };
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Mock JWT

        setAuth(mockUser, mockToken);
        toast.success('Login successful! Redirecting...');
        router.push('/admin/dashboard');
      } else {
        toast.error('Invalid credentials. Try admin / password or support / password');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Trophy size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sport Hub</h1>
          <p className="text-muted-foreground font-medium">Administration Portal</p>
        </div>

        <Card className="border-none shadow-xl ring-1 ring-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials below to access the dashboard.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-11 font-semibold text-base shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground/60">
          &copy; 2026 Sport Hub Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
}
