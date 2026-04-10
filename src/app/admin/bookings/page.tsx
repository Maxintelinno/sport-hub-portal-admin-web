'use client';

import { useState, useEffect } from 'react';
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
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { ConfirmAction } from '@/components/admin/ConfirmAction';

const bookingsData = [
  { id: 'BK-10294', user: 'สมชาย ร.', field: 'Green Field - A1', date: '2026-04-10', status: 'confirmed', amount: '฿600', method: 'PromptPay' },
  { id: 'BK-10293', user: 'อนุชา พ.', field: 'Indoor Sport 1', date: '2026-04-10', status: 'pending', amount: '฿850', method: 'Credit Card' },
  { id: 'BK-10292', user: 'วิชัย ต.', field: 'Green Field - B2', date: '2026-04-10', status: 'confirmed', amount: '฿600', method: 'PromptPay' },
  { id: 'BK-10291', user: 'สมศักดิ์ ก.', field: 'Grand Stadium', date: '2026-04-09', status: 'cancelled', amount: '฿1,200', method: 'Credit Card' },
  { id: 'BK-10290', user: 'มาลี ส.', field: 'Green Field - A1', date: '2026-04-09', status: 'confirmed', amount: '฿600', method: 'PromptPay' },
  { id: 'BK-10289', user: 'กัญญา พ.', field: 'Badminton Court 3', date: '2026-04-09', status: 'confirmed', amount: '฿400', method: 'Wallet' },
  { id: 'BK-10288', user: 'ธนา ว.', field: 'Tennis Court 1', date: '2026-04-08', status: 'cancelled', amount: '฿1,000', method: 'Credit Card' },
  { id: 'BK-10287', user: 'ปรีชา จ.', field: 'Grand Stadium', date: '2026-04-08', status: 'confirmed', amount: '฿1,200', method: 'PromptPay' },
];

export default function BookingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
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
    return matchesSearch && matchesStatus;
  });

  const sortedBookings = [...filteredBookings].sort((a: any, b: any) => {
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

  const handleCancelBooking = (id: string) => {
    toast.error(`ยกเลิกการจอง ${id} เรียบร้อยแล้ว`);
  };

  const handleConfirmBooking = (id: string) => {
    toast.success(`ยืนยันการจอง ${id} เรียบร้อยแล้ว`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">การจอง</h1>
          <p className="text-muted-foreground mt-1 font-bold">จัดการและติดตามรายการจองสนามทั้งหมดในระบบ</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 px-6 font-bold border-2 rounded-xl">
            <Download size={16} className="mr-2" /> ส่งออก CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 lg:gap-8">
        {[
          { label: 'การจองทั้งหมด', value: '1,482', icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'ยืนยันแล้ว', value: '1,204', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
          { label: 'รอดำเนินการ', value: '156', icon: ArrowUpDown, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'ยกเลิกแล้ว', value: '122', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col gap-4 border-none shadow-xl rounded-[2rem] p-8 bg-card/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className={`w-fit p-4 ${item.bg} ${item.color} rounded-2xl shadow-sm`}>
              <item.icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
              <p className="text-3xl font-black tracking-tight mt-1">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl border shadow-xl overflow-hidden ring-1 ring-border/50">
        <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ค้นหาด้วยรหัสการจอง หรือชื่อผู้ใช้งาน..." 
              className="pl-10 h-11 border-2 font-bold bg-background focus-visible:ring-primary rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
              <SelectTrigger className="w-full md:w-[180px] h-11 border-2 font-bold rounded-xl">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">ทุกสถานะ</SelectItem>
                <SelectItem value="confirmed" className="font-bold text-emerald-600">ยืนยันแล้ว</SelectItem>
                <SelectItem value="pending" className="font-bold text-amber-600">รอดำเนินการ</SelectItem>
                <SelectItem value="cancelled" className="font-bold text-rose-600">ยกเลิกแล้ว</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead onClick={() => handleSort('id')} className="w-[140px] font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    เลขที่การจอง {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('user')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    ผู้ใช้งาน {sortConfig?.key === 'user' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">สนาม / สถานที่</TableHead>
                <TableHead onClick={() => handleSort('date')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    วันที่ {sortConfig?.key === 'date' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">สถานะ</TableHead>
                <TableHead onClick={() => handleSort('amount')} className="text-right font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center justify-end gap-2">
                    จำนวนเงิน {sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="w-[80px] py-5 px-6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <TableSkeleton columnCount={7} rowCount={6} />
                  </TableCell>
                </TableRow>
              ) : sortedBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-muted">
                  <TableCell className="font-mono font-bold text-sm px-6 py-5 text-muted-foreground">{booking.id}</TableCell>
                  <TableCell className="px-6 py-5 font-black text-sm">{booking.user}</TableCell>
                  <TableCell className="px-6 py-5">
                    <p className="font-bold text-sm">{booking.field}</p>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-sm font-medium">{booking.date}</TableCell>
                  <TableCell className="px-6 py-5">
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'outline' : 'destructive'}
                      className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest"
                    >
                      {booking.status === 'confirmed' ? 'ยืนยันแล้ว' : booking.status === 'pending' ? 'รอดำเนินการ' : 'ยกเลิกแล้ว'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6 py-5 font-black text-primary">{booking.amount}</TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-muted rounded-xl">
                            <MoreVertical size={16} />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-[200px] rounded-2xl shadow-xl border-2">
                        <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest px-4 py-3">การดำเนินการ</DropdownMenuLabel>
                        <DropdownSeparator />
                        <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 font-bold text-sm">
                          <ExternalLink size={16} /> ดูรายละเอียด
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <ConfirmAction
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 py-3 px-4 font-bold text-sm text-emerald-600 focus:text-emerald-700">
                                  <CheckCircle2 size={16} /> ยืนยันการจอง (Force)
                                </DropdownMenuItem>
                              }
                              title="ยืนยันการจองสนาม?"
                              description="การยืนยันนี้จะทำให้สถานะการจองเปลี่ยนเป็น 'ยืนยันแล้ว' ทันทีโดยไม่รอการตรวจสอบปกติ"
                              onConfirm={() => handleConfirmBooking(booking.id)}
                              variant="success"
                              confirmText="ยืนยันตอนนี้"
                            />
                            <ConfirmAction
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 py-3 px-4 font-bold text-sm text-rose-600 focus:text-rose-700">
                                  <XCircle size={16} /> ยกเลิกการจอง
                                </DropdownMenuItem>
                              }
                              title="ยกเลิกการจองนี้?"
                              description={`คุณต้องการยกเลิกการจอง ${booking.id} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
                              onConfirm={() => handleCancelBooking(booking.id)}
                              variant="destructive"
                              confirmText="ใช่, ยกเลิก"
                            />
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-6 border-t bg-muted/10 flex items-center justify-between text-sm font-bold text-muted-foreground">
          <p>แสดง {sortedBookings.length} จาก {bookingsData.length} รายการ</p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" disabled className="h-10 px-6 font-bold rounded-xl border-2">ก่อนหน้า</Button>
            <Button variant="outline" size="sm" className="h-10 px-6 font-bold rounded-xl border-2">ถัดไป</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal helper components for cleaner code
function DropdownSeparator() {
  return <div className="h-px bg-muted mx-1 my-1" />;
}
