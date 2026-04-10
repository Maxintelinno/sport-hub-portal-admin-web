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
        toast.success('เข้าสู่ระบบสำเร็จ กำลังเข้าสู่แดชบอร์ด...');
        router.push('/admin/dashboard');
      } else {
        toast.error('ข้อมูลไม่ถูกต้อง โปรดลองอีกครั้ง (ใช้ admin / password)');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background px-4">
      <div className="w-full max-w-md space-y-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-sidebar text-sidebar-primary shadow-2xl shadow-primary/30 ring-4 ring-sidebar-primary/20 animate-bounce-slow">
            <Trophy size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">SPORT HUB</h1>
            <p className="text-primary font-black tracking-[0.4em] uppercase text-[10px] ml-1">Royal Sports Administration</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-border/50 rounded-[2.5rem] overflow-hidden bg-card/70 backdrop-blur-xl">
          <CardHeader className="space-y-1 bg-muted/40 pb-10 pt-10">
            <CardTitle className="text-3xl font-black text-center tracking-tight">เข้าสู่ระบบ</CardTitle>
            <CardDescription className="text-center font-bold text-muted-foreground/70 text-sm">
              กรอกข้อมูลเพื่อเริ่มต้นการจัดการระบบ <span className="text-primary">Sport Hub</span>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 pt-10 px-10">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="username">
                  ชื่อผู้ใช้งาน
                </label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-14 border-2 border-muted bg-background/50 font-black text-base focus-visible:ring-primary focus-visible:border-primary/20 rounded-2xl transition-all"
                />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="password">
                    รหัสผ่าน
                  </label>
                  <a href="#" className="text-[10px] font-black text-primary hover:text-emerald-700 uppercase tracking-widest transition-colors">ลืมรหัสผ่าน?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-14 border-2 border-muted bg-background/50 font-black text-base focus-visible:ring-primary focus-visible:border-primary/20 rounded-2xl transition-all"
                />
              </div>
            </CardContent>
            <CardFooter className="pb-10 px-10 pt-4">
              <Button type="submit" className="w-full h-16 font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 rounded-2xl bg-primary hover:bg-emerald-900 transition-all duration-300 active:scale-95 group" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    เข้าสู่ระบบ Portal <Trophy size={16} className="text-secondary" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-relaxed">
            &copy; 2026 Sport Hub Technologies<br/>
            Royal Sports Management System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
