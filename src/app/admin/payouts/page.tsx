'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  ArrowUpDown, 
  BadgeDollarSign,
  Wallet,
  Calendar,
  ExternalLink,
  CheckCircle2,
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

const payoutsData = [
  { id: 1, owner: 'คุณวิทวัส เจริญผล', amount: '฿45,000', status: 'pending', date: '2026-04-10', bank: 'KBANK x-4491' },
  { id: 2, owner: 'หจก. สปอร์ตกรุ๊ป', amount: '฿120,500', status: 'paid', date: '2026-04-05', bank: 'SCB x-0029' },
  { id: 3, owner: 'คุณสมหญิง รักสุขภาพ', amount: '฿8,200', status: 'pending', date: '2026-04-09', bank: 'BBL x-8812' },
  { id: 4, owner: 'บจก. กรีนสเตเดี้ยม', amount: '฿32,400', status: 'paid', date: '2026-04-01', bank: 'BAY x-5521' },
];

export default function PayoutsPage() {
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

  const filteredPayouts = payoutsData.filter(payout => {
    const matchesSearch = payout.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  const handleApprovePayout = (id: number) => {
    toast.success(`ทำเครื่องหมายรายการ #${id} ว่า 'จ่ายเงินแล้ว' เรียบร้อยแล้ว`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">การถอนเงิน</h1>
          <p className="text-muted-foreground mt-1 font-bold">จัดการคำขอถอนเงินและประวัติการจ่ายเงินให้เจ้าของสนาม</p>
        </div>
        <Button variant="outline" className="h-11 px-6 font-bold border-2 rounded-xl">
          <BadgeDollarSign size={16} className="mr-2" /> รายงานภาษี ณ ที่จ่าย
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'รอดำเนินการ (ยอดรวม)', value: '฿142,500', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'จ่ายแล้วเดือนนี้', value: '฿2,450,000', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'กำหนดจ่ายรอบถัดไป', value: '15 เม.ย. 2026', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 border-none shadow-lg rounded-2xl p-5 bg-card/50 backdrop-blur-sm">
            <div className={`p-3 ${item.bg} ${item.color} rounded-xl shadow-sm`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-black tracking-tight">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl border shadow-xl overflow-hidden ring-1 ring-border/50">
        <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ค้นหาชื่อเจ้าของสนาม..." 
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
                <SelectItem value="pending" className="font-bold text-amber-600">รอดำเนินการ</SelectItem>
                <SelectItem value="paid" className="font-bold text-emerald-600">จ่ายแล้ว</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead onClick={() => handleSort('owner')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    เจ้าของสนาม {sortConfig?.key === 'owner' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('amount')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    จำนวนเงิน {sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">สถานะ</TableHead>
                <TableHead onClick={() => handleSort('date')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    วันที่รอนิุมัติ {sortConfig?.key === 'date' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="w-[80px] py-5 px-6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <TableSkeleton columnCount={5} rowCount={4} />
                  </TableCell>
                </TableRow>
              ) : sortedPayouts.map((payout) => (
                <TableRow key={payout.id} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-muted">
                  <TableCell className="px-6 py-5">
                    <div>
                      <p className="font-black text-sm text-foreground">{payout.owner}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{payout.bank}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 font-black text-sm text-primary">{payout.amount}</TableCell>
                  <TableCell className="px-6 py-5">
                    <Badge 
                      variant={payout.status === 'paid' ? 'default' : 'outline'}
                      className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest"
                    >
                      {payout.status === 'paid' ? 'จ่ายแล้ว' : 'รอดำเนินการ'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-sm font-medium">{payout.date}</TableCell>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 font-bold text-sm">
                          <ExternalLink size={16} /> ดูรายละเอียด
                        </DropdownMenuItem>
                        {isAdmin && payout.status === 'pending' && (
                          <ConfirmAction
                             trigger={
                               <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 py-3 px-4 font-bold text-sm text-emerald-600">
                                 <CheckCircle2 size={16} /> ทำเครื่องหมายว่า "จ่ายแล้ว"
                               </DropdownMenuItem>
                             }
                             title="ยืนยันการจ่ายเงิน?"
                             description={`คุณยืนยันว่าได้ทำการโอนเงินจำนวน ${payout.amount} ให้กับ ${payout.owner} เรียบร้อยแล้ว`}
                             onConfirm={() => handleApprovePayout(payout.id)}
                             variant="success"
                             confirmText="ยืนยันการจ่ายเงิน"
                          />
                        )}
                      </DropdownMenuContent>
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
