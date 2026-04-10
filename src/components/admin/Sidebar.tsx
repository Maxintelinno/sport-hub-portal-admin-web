'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CreditCard, 
  Users, 
  BadgeDollarSign, 
  Image as ImageIcon, 
  FileText,
  LogOut,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/useAuth';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Owners', href: '/admin/owners', icon: Users },
  { name: 'Payouts', href: '/admin/payouts', icon: BadgeDollarSign },
  { name: 'Ads', href: '/admin/ads', icon: ImageIcon },
  { name: 'Content', href: '/admin/content', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuth((state) => state.logout);

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy size={18} />
          </div>
          <span>Sport Hub Admin</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <button
          onClick={() => {
            logout();
            window.location.href = '/admin/login';
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
