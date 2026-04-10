'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { Navbar } from '@/components/admin/Navbar';
import { useAuth } from '@/store/useAuth';
import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
    // Protect routes (only if not on login page)
    if (!isLoginPage && !isAuthenticated()) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router, isLoginPage]);

  if (!mounted) {
    return null;
  }

  // If we are on the login page, just render the form without the sidebar/navbar
  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // If not authenticated, we return null while redirection is happening
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
