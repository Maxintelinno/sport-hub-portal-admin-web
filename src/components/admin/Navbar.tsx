'use client';

import { 
  Bell, 
  Search, 
  ChevronDown 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/store/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center border-b border-border/50 bg-background/80 backdrop-blur-md px-8 shadow-[0_1px_10px_0_rgba(0,0,0,0.02)]">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            type="search"
            placeholder="ค้นหาข้อมูลในระบบ..."
            className="pl-10 h-11 bg-muted/30 border-2 border-transparent focus-visible:border-primary/20 focus-visible:bg-background focus-visible:ring-offset-0 focus-visible:ring-primary/20 transition-all rounded-xl font-medium"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all duration-300 group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-background animate-pulse"></span>
        </button>
        
        <div className="h-6 w-px bg-border/60 mx-1"></div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-3 rounded-xl hover:bg-muted/50 p-1.5 transition-all duration-300 group">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-primary/10 transition-transform group-hover:scale-105">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'admin'}`} />
                    <AvatarFallback className="font-bold bg-primary/10 text-primary">{user?.username?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background"></div>
                </div>
                <div className="hidden text-left xl:block pr-2">
                  <p className="text-sm font-black leading-tight text-foreground">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-0.5">{(user?.role || 'Super Admin').replace('_', ' ')}</p>
                </div>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-2xl border-2 p-1.5 animate-in slide-in-from-top-2 duration-300">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest px-3 py-3 text-muted-foreground">การจัดการโปรไฟล์</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem className="rounded-xl font-bold py-2.5 px-3">
              ตั้งค่าโปรไฟล์ส่วนตัว
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl font-bold py-2.5 px-3">
              ตรวจสอบความปลอดภัย
            </DropdownMenuItem>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem 
              className="rounded-xl font-black py-2.5 px-3 text-rose-500 focus:text-rose-600 focus:bg-rose-50 uppercase tracking-widest text-[10px]"
              onClick={() => {
                logout();
                window.location.href = '/admin/login';
              }}
            >
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
