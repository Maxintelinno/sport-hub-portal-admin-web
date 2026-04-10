'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpDown, 
  Download,
  Calendar,
  XCircle,
  CheckCircle2,
  ExternalLink,
  ArrowUp,
  ArrowDown
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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

const bookingsData = [
  { id: 'BK-10294', user: 'Somchai R.', field: 'Green Field - A1', date: '2026-04-10', status: 'confirmed', amount: '฿600', method: 'QR PromptPay' },
  { id: 'BK-10293', user: 'Anucha P.', field: 'Indoor Sport 1', date: '2026-04-10', status: 'pending', amount: '฿850', method: 'Credit Card' },
  { id: 'BK-10292', user: 'Wichai T.', field: 'Green Field - B2', date: '2026-04-10', status: 'confirmed', amount: '฿600', method: 'QR PromptPay' },
  { id: 'BK-10291', user: 'Somsak K.', field: 'Grand Stadium', date: '2026-04-09', status: 'cancelled', amount: '฿1,200', method: 'Credit Card' },
  { id: 'BK-10290', user: 'Malee S.', field: 'Green Field - A1', date: '2026-04-09', status: 'confirmed', amount: '฿600', method: 'QR PromptPay' },
  { id: 'BK-10289', user: 'Kanya P.', field: 'Badminton Court 3', date: '2026-04-09', status: 'confirmed', amount: '฿400', method: 'Wallet' },
  { id: 'BK-10288', user: 'Thana W.', field: 'Tennis Court 1', date: '2026-04-08', status: 'cancelled', amount: '฿1,000', method: 'Credit Card' },
  { id: 'BK-10287', user: 'Preecha J.', field: 'Grand Stadium', date: '2026-04-08', status: 'confirmed', amount: '฿1,200', method: 'QR PromptPay' },
  { id: 'BK-10286', user: 'Naree B.', field: 'Indoor Sport 2', date: '2026-04-08', status: 'pending', amount: '฿850', method: 'Credit Card' },
  { id: 'BK-10285', user: 'Surachai M.', field: 'Green Field - A1', date: '2026-04-07', status: 'confirmed', amount: '฿600', method: 'QR PromptPay' },
];

export default function BookingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
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

  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         booking.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || booking.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const sortedBookings = [...filteredBookings].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let valA = a[key];
    let valB = b[key];

    // Numeric sorting for amount
    if (key === 'amount') {
      valA = parseFloat(valA.replace(/[฿,]/g, ''));
      valB = parseFloat(valB.replace(/[฿,]/g, ''));
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleCancelBooking = (id: string) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: 'Cancelling booking...',
      success: `Booking ${id} has been cancelled.`,
      error: 'Failed to cancel booking.',
    });
  };

  const handleConfirmBooking = (id: string) => {
    toast.success(`Booking ${id} force confirmed.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage and track all user field bookings from here.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button className="h-10 font-semibold">
            <Filter size={16} className="mr-2" />
            Advanced Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <div className="flex items-center gap-2 border rounded-xl p-4 bg-card shadow-sm">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Bookings</p>
            <p className="text-xl font-bold">1,482</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border rounded-xl p-4 bg-card shadow-sm">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Confirmed</p>
            <p className="text-xl font-bold">1,204</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border rounded-xl p-4 bg-card shadow-sm">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
            <ArrowUpDown size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-xl font-bold">156</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border rounded-xl p-4 bg-card shadow-sm">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
            <p className="text-xl font-bold">122</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden ring-1 ring-border/50">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Booking ID or User..." 
              className="pl-9 h-10 bg-muted/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
              <SelectTrigger className="w-full md:w-[150px] h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={(val) => setMethodFilter(val || 'all')}>
              <SelectTrigger className="w-full md:w-[150px] h-10">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="QR PromptPay">PromptPay</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead 
                  className="w-[120px] font-bold py-4 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    Booking ID {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-bold py-4 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('user')}
                >
                  <div className="flex items-center gap-2">
                    Customer {sortConfig?.key === 'user' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="font-bold py-4 text-muted-foreground/50">Venue & Field</TableHead>
                <TableHead 
                  className="font-bold py-4 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date {sortConfig?.key === 'date' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="font-bold py-4">Status</TableHead>
                <TableHead 
                  className="text-right font-bold py-4 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Amount {sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="w-[80px] py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <TableSkeleton columnCount={7} rowCount={8} />
                  </TableCell>
                </TableRow>
              ) : sortedBookings.length > 0 ? (
                sortedBookings.map((booking) => (
                  <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/40 transition-colors border-b">
                    <TableCell className="font-mono font-medium py-4">{booking.id}</TableCell>
                    <TableCell className="py-4 font-semibold">{booking.user}</TableCell>
                    <TableCell className="py-4 text-muted-foreground">{booking.field}</TableCell>
                    <TableCell className="py-4">{booking.date}</TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'outline' : 'destructive'}
                        className="rounded-full px-3 py-0.5 capitalize font-bold text-[11px]"
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div>
                        <p className="font-bold text-primary">{booking.amount}</p>
                        <p className="text-[10px] text-muted-foreground">{booking.method}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                              <MoreVertical size={16} />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuItem className="flex items-center gap-2 py-2">
                            <ExternalLink size={14} /> View Detail
                          </DropdownMenuItem>
                           {isAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <ConfirmAction
                                trigger={
                                  <DropdownMenuItem 
                                    className="text-emerald-600 focus:text-emerald-700 font-medium py-2"
                                    onSelect={(e) => e.preventDefault()}
                                    disabled={booking.status === 'confirmed'}
                                  >
                                    <CheckCircle2 size={14} className="mr-2" /> Force Confirm
                                  </DropdownMenuItem>
                                }
                                title="Force Confirm Booking?"
                                description={`Are you sure you want to force confirm booking ${booking.id}? This will bypass standard verification.`}
                                onConfirm={() => handleConfirmBooking(booking.id)}
                                variant="success"
                                confirmText="Confirm Now"
                              />

                              <ConfirmAction
                                trigger={
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive font-medium py-2"
                                    onSelect={(e) => e.preventDefault()}
                                    disabled={booking.status === 'cancelled'}
                                  >
                                    <XCircle size={14} className="mr-2" /> Cancel Booking
                                  </DropdownMenuItem>
                                }
                                title="Cancel this booking?"
                                description={`This will permanently cancel booking ${booking.id} and notify the user. This action cannot be undone.`}
                                onConfirm={() => handleCancelBooking(booking.id)}
                                variant="destructive"
                                confirmText="Yes, Cancel"
                              />
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                    No bookings found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground font-medium">
          <p>Showing {sortedBookings.length} of {bookingsData.length} bookings</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="h-9 px-4">Previous</Button>
            <Button variant="outline" size="sm" className="h-9 px-4">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
