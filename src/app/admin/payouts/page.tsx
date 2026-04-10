'use client';

import { useState } from 'react';
import { 
  Search, 
  BadgeDollarSign, 
  History, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Download,
  Filter,
  Eye,
  Wallet,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { ConfirmAction } from '@/components/admin/ConfirmAction';

const payoutsData = [
  { id: 'PAYOUT-771', owner: 'Kittisak Sport Complex', amount: '฿142,500', status: 'pending', date: '2026-04-10', bank: 'K-Bank', acc: '***1234' },
  { id: 'PAYOUT-770', owner: 'Green Field Arena', amount: '฿42,200', status: 'paid', date: '2026-04-09', bank: 'SCB', acc: '***5567' },
  { id: 'PAYOUT-769', owner: 'Grand Stadium', amount: '฿280,000', status: 'paid', date: '2026-04-09', bank: 'Bangkok Bank', acc: '***8890' },
  { id: 'PAYOUT-768', owner: 'Pro Field Hub', amount: '฿52,000', status: 'pending', date: '2026-04-08', bank: 'K-Bank', acc: '***2241' },
  { id: 'PAYOUT-767', owner: 'Elite Soccer', amount: '฿12,400', status: 'cancelled', date: '2026-04-08', bank: 'Krungsri', acc: '***9910' },
];

export default function PayoutsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredPayouts = payoutsData.filter(payout => {
    const matchesSearch = payout.owner.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    const matchesBank = bankFilter === 'all' || payout.bank === bankFilter;
    return matchesSearch && matchesStatus && matchesBank;
  });

  const sortedPayouts = [...filteredPayouts].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let valA = a[key];
    let valB = b[key];

    if (key === 'amount') {
      valA = parseFloat(valA.replace(/[฿,]/g, ''));
      valB = parseFloat(valB.replace(/[฿,]/g, ''));
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleMarkAsPaid = (id: string) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Processing payout...',
      success: `Payout ${id} marked as PAID.`,
      error: 'Failed to process payout.',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout Management</h1>
          <p className="text-muted-foreground mt-1 text-lg">Process earnings for venue partners and track payout history.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 font-bold px-6 border-2">
             <History size={18} className="mr-2" /> Global History
          </Button>
          {isAdmin && (
            <Button className="h-11 font-black px-8 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 gap-2">
               <CheckCircle2 size={18} /> Batch Process
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-md overflow-hidden bg-primary text-primary-foreground">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-widest opacity-80">Pending Payouts</p>
              <div className="bg-white/20 p-2 rounded-xl">
                 <BadgeDollarSign size={20} />
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-4xl font-black">฿428,200</h3>
              <p className="text-xs mt-2 font-bold opacity-70">12 batches waiting approval</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Paid MTD</p>
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500">
                 <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-4xl font-black">฿1.2M</h3>
              <p className="text-xs mt-2 font-bold text-emerald-500 flex items-center gap-1">
                 <ArrowUpRight size={12} /> 15% increase from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Internal Reserve</p>
              <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500">
                 <Wallet size={20} />
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-4xl font-black">฿4.5M</h3>
              <p className="text-xs mt-2 font-bold text-muted-foreground">Safe liquidity level</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-2xl border shadow-md overflow-hidden ring-1 ring-border/50">
        <div className="p-5 border-b flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="flex flex-col md:flex-row gap-4 w-full md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search owner or ID..." 
                className="pl-9 h-11 bg-background border-none ring-1 ring-border shadow-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
              <SelectTrigger className="w-full md:w-[150px] h-11 font-bold border-2">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">All Status</SelectItem>
                <SelectItem value="pending" className="font-bold text-amber-600">Pending</SelectItem>
                <SelectItem value="paid" className="font-bold text-emerald-600">Paid</SelectItem>
                <SelectItem value="cancelled" className="font-bold text-rose-600">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={bankFilter} onValueChange={(val) => setBankFilter(val || 'all')}>
              <SelectTrigger className="w-full md:w-[150px] h-11 font-bold border-2">
                <SelectValue placeholder="Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">All Banks</SelectItem>
                <SelectItem value="K-Bank" className="font-bold">K-Bank</SelectItem>
                <SelectItem value="SCB" className="font-bold">SCB</SelectItem>
                <SelectItem value="Bangkok Bank" className="font-bold">Bangkok Bank</SelectItem>
                <SelectItem value="Krungsri" className="font-bold">Krungsri</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" className="h-11 font-bold gap-2 px-6">
            <Download size={16} /> Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead 
                  className="py-5 px-6 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('owner')}
                >
                  <div className="flex items-center gap-2">
                    Owner Name {sortConfig?.key === 'owner' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="py-5 px-6 font-black uppercase tracking-widest text-[10px]">Bank Info</TableHead>
                <TableHead 
                  className="py-5 px-6 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount {sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="py-5 px-6 font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead 
                  className="py-5 px-6 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date {sortConfig?.key === 'date' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="py-5 px-6 text-right font-black uppercase tracking-widest text-[10px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <TableSkeleton columnCount={6} rowCount={5} />
                  </TableCell>
                </TableRow>
              ) : sortedPayouts.map((payout) => (
                <TableRow key={payout.id} className="cursor-pointer hover:bg-muted/40 transition-colors">
                  <TableCell className="py-5 px-6">
                    <div className="space-y-1">
                      <p className="font-black text-sm text-foreground">{payout.owner}</p>
                      <p className="text-[10px] font-mono font-bold text-muted-foreground bg-muted inline-block px-1.5 py-0.5 rounded">{payout.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="space-y-0.5">
                       <p className="font-bold text-xs">{payout.bank}</p>
                       <p className="font-mono text-[10px] text-muted-foreground">{payout.acc}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <p className="font-black text-base text-primary">{payout.amount}</p>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <Badge 
                      variant={payout.status === 'paid' ? 'default' : payout.status === 'pending' ? 'outline' : 'destructive'}
                      className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider
                        ${payout.status === 'paid' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                        ${payout.status === 'pending' ? 'text-amber-600 border-amber-600' : ''}
                      `}
                    >
                      {payout.status === 'pending' && <Clock size={10} className="mr-1.5 animate-pulse" />}
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <p className="text-xs font-bold text-muted-foreground font-mono">{payout.date}</p>
                  </TableCell>
                  <TableCell className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl border-2 hover:bg-primary hover:text-white transition-all">
                          <Eye size={16} />
                       </Button>
                       {isAdmin && payout.status === 'pending' && (
                         <ConfirmAction
                           trigger={
                             <Button 
                               size="sm" 
                               className="h-9 bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] tracking-widest px-4 rounded-xl shadow-md uppercase"
                             >
                               Approve & Pay
                             </Button>
                           }
                           title="Approve Payout?"
                           description={`Confirming payment of ${payout.amount} to ${payout.owner}. This action will mark researchers as paid.`}
                           onConfirm={() => handleMarkAsPaid(payout.id)}
                           variant="success"
                           confirmText="Yes, Send Payment"
                         />
                       )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
