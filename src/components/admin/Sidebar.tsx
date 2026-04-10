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
  { name: 'แดชบอร์ด', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'การจอง', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'การชำระเงิน', href: '/admin/payments', icon: CreditCard },
  { name: 'เจ้าของสนาม', href: '/admin/owners', icon: Users },
  { name: 'การถอนเงิน', href: '/admin/payouts', icon: BadgeDollarSign },
  { name: 'โฆษณา', href: '/admin/ads', icon: ImageIcon },
  { name: 'บทความ / เนื้อหา', href: '/admin/content', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuth((state) => state.logout);

  return (
    <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl">
      <div className="flex h-20 items-center border-b border-sidebar-border/50 px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20 ring-4 ring-sidebar-primary/10">
            <Trophy size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-sidebar-primary">Royal Sports</span>
            <span className="text-sm font-bold tracking-tight">Admin Portal</span>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25 scale-[1.02]" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
                )}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border/50 p-6 bg-sidebar-accent/5">
        <button
          onClick={() => {
            logout();
            window.location.href = '/admin/login';
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all duration-300 hover:scale-[1.02]"
        >
          <LogOut size={20} />
          <span className="uppercase tracking-widest text-[10px] font-black">ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
}
