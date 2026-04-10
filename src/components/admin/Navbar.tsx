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
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-3 rounded-full hover:bg-accent p-1 transition-colors pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'admin'}`} />
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Administrator'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'Super Admin'}</p>
                </div>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Security</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => {
                logout();
                window.location.href = '/admin/login';
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
