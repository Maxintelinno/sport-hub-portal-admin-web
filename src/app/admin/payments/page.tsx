'use client';

import { useState } from 'react';
import { 
  Search, 
  RefreshCw, 
  CircleDollarSign,
  ShieldCheck,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronDown,
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
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { ConfirmAction } from '@/components/admin/ConfirmAction';

const paymentsData = [
  { id: 'PAY-88294', bookingId: 'BK-10294', amount: '฿600', method: 'PromptPay', status: 'completed', provider: 'GBPrime', ref: 'GBP_992102' },
  { id: 'PAY-88293', bookingId: 'BK-10293', amount: '฿850', method: 'Credit Card', status: 'pending', provider: 'Stripe', ref: 'CH_882103' },
  { id: 'PAY-88292', bookingId: 'BK-10292', amount: '฿600', method: 'PromptPay', status: 'completed', provider: 'GBPrime', ref: 'GBP_992104' },
  { id: 'PAY-88291', bookingId: 'BK-10291', amount: '฿1,200', method: 'Credit Card', status: 'failed', provider: 'Stripe', ref: 'CH_882105' },
  { id: 'PAY-88290', bookingId: 'BK-10290', amount: '฿600', method: 'PromptPay', status: 'completed', provider: 'GBPrime', ref: 'GBP_992106' },
  { id: 'PAY-88289', bookingId: 'BK-10289', amount: '฿400', method: 'Wallet', status: 'completed', provider: 'Internal', ref: 'WAL_22107' },
  { id: 'PAY-88288', bookingId: 'BK-10288', amount: '฿1,000', method: 'Credit Card', status: 'refunded', provider: 'Stripe', ref: 'CH_882108' },
];

export default function PaymentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

  const filteredPayments = paymentsData.filter(pay => {
    const matchesSearch = pay.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pay.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pay.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedPayments = [...filteredPayments].sort((a: any, b: any) => {
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

  const handleRetryWebhook = (id: string) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Retrying webhook notification...',
      success: `Webhook for ${id} re-sent successfully.`,
      error: 'Webhook retry failed.',
    });
  };

  const handleMarkAsPaid = (id: string) => {
    toast.success(`Payment ${id} manually marked as PAID.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1 text-lg">Track transactions, verify statuses, and manage payment overrides.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block mr-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Revenue (MTD)</p>
            <p className="text-xl font-black text-primary">฿1,248,500</p>
          </div>
          <Button className="h-11 px-6 font-bold shadow-lg shadow-primary/20">
            Payment Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-none shadow-sm overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <h3 className="text-2xl font-bold mt-1">฿842,400</h3>
                <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1">
                  <RefreshCw size={12} className="animate-spin-slow" /> Updated just now
                </p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold mt-1">฿12,500</h3>
                <p className="text-xs text-amber-500 font-semibold mt-2 flex items-center gap-1">
                  <Clock size={12} /> 14 transactions
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed / Error</p>
                <h3 className="text-2xl font-bold mt-1">฿4,200</h3>
                <p className="text-xs text-rose-500 font-semibold mt-2 flex items-center gap-1">
                  <AlertCircle size={12} /> Needs attention
                </p>
              </div>
              <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500 group-hover:scale-110 transition-transform">
                <AlertCircle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gateway Status</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600">Active</h3>
                <p className="text-xs text-muted-foreground font-semibold mt-2 flex items-center gap-1">
                  GBPrime & Stripe Online
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                <CircleDollarSign size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-2xl border shadow-md overflow-hidden ring-1 ring-border/50">
        <div className="p-5 border-b flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Payment ID, Booking Ref..." 
              className="pl-9 h-11 bg-background border-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
              <SelectTrigger className="w-[180px] h-11 bg-background border-none ring-1 ring-border font-bold">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">All Status</SelectItem>
                <SelectItem value="completed" className="font-bold text-emerald-600">Completed</SelectItem>
                <SelectItem value="pending" className="font-bold text-amber-600">Pending</SelectItem>
                <SelectItem value="failed" className="font-bold text-rose-600">Failed</SelectItem>
                <SelectItem value="refunded" className="font-bold text-blue-600">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead 
                  className="py-5 px-6 font-bold uppercase tracking-wider text-[10px] text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    Payment ID {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-5 px-6 font-bold uppercase tracking-wider text-[10px] text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('bookingId')}
                >
                  <div className="flex items-center gap-2">
                    Booking Ref {sortConfig?.key === 'bookingId' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-5 px-6 font-bold uppercase tracking-wider text-[10px] text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount {sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="py-5 px-6 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Gateway & Ref</TableHead>
                <TableHead className="py-5 px-6 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Status</TableHead>
                <TableHead className="py-5 px-6 text-right font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <TableSkeleton columnCount={6} rowCount={6} />
                  </TableCell>
                </TableRow>
              ) : sortedPayments.map((payment) => (
                <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <TableCell className="py-4 px-6 font-mono text-sm font-semibold">{payment.id}</TableCell>
                  <TableCell className="py-4 px-6 underline text-primary font-medium">{payment.bookingId}</TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="space-y-0.5">
                      <p className="font-black text-foreground">{payment.amount}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">{payment.method}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="bg-background font-bold text-[10px]">
                        {payment.provider}
                       </Badge>
                       <span className="text-xs text-muted-foreground font-mono">{payment.ref}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge 
                      variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'outline' : 'destructive'}
                      className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest
                        ${payment.status === 'completed' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                        ${payment.status === 'refunded' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                      `}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted border border-transparent hover:border-border">
                            <RefreshCw size={16} className="text-muted-foreground" />
                          </Button>
                        }
                      />
                      {isAdmin && (
                        <DropdownMenuContent align="end" className="w-56 font-medium">
                          <ConfirmAction
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="py-3">
                                <RefreshCw size={14} className="mr-2" /> Retry Webhook
                              </DropdownMenuItem>
                            }
                            title="Retry Webhook?"
                            description={`This will re-trigger the payment notification for ${payment.id}. Use this if the initial notification failed.`}
                            onConfirm={() => handleRetryWebhook(payment.id)}
                            variant="default"
                          />
                          <ConfirmAction
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="py-3 text-emerald-600 focus:text-emerald-700">
                                <ShieldCheck size={14} className="mr-2" /> Mark as Paid (Manual)
                              </DropdownMenuItem>
                            }
                            title="Mark as Paid Manually?"
                            description={`Are you sure you want to mark ${payment.id} as PAID? This bypasses the gateway's automatic verification.`}
                            onConfirm={() => handleMarkAsPaid(payment.id)}
                            variant="success"
                            confirmText="Confirm Paid"
                          />
                          <DropdownMenuItem className="py-3">
                            <ExternalLink size={14} className="mr-2" /> View Audit Logs
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
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
