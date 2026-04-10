'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  ArrowUpDown, 
  Download,
  CheckCircle2,
  RefreshCcw,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  ShieldCheck
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
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
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { ConfirmAction } from '@/components/admin/ConfirmAction';

const paymentsData = [
  { id: 'PAY-88291', bookingId: 'BK-10294', amount: '฿600', method: 'PromptPay', status: 'completed', reference: 'ch_8y2H9k1l' },
  { id: 'PAY-88290', bookingId: 'BK-10293', amount: '฿850', method: 'Credit Card', status: 'pending', reference: 'ch_1n9L4m0p' },
  { id: 'PAY-88289', bookingId: 'BK-10292', amount: '฿600', method: 'PromptPay', status: 'completed', reference: 'ch_3v8X6z5q' },
  { id: 'PAY-88288', bookingId: 'BK-10291', amount: '฿1,200', method: 'Credit Card', status: 'failed', reference: 'ch_9k1M0n2r' },
  { id: 'PAY-88287', bookingId: 'BK-10290', amount: '฿600', method: 'PromptPay', status: 'completed', reference: 'ch_5t4Y8u7s' },
];

export default function PaymentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredPayments = paymentsData.filter(payment => {
    return payment.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
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
      loading: 'กำลังเรียก Webhook อีกครั้ง...',
      success: `Webhook สำหรับรายการ ${id} ถูกส่งเรียบร้อยแล้ว`,
      error: 'เกิดข้อผิดพลาดในการส่ง Webhook',
    });
  };

  const handleMarkAsPaid = (id: string) => {
    toast.success(`อัปเดตสถานะรายการ ${id} เป็น 'ชำระเงินแล้ว' (Manual)`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">การชำระเงิน</h1>
          <p className="text-muted-foreground mt-1 font-bold">ตรวจสอบและจัดการประวัติการชำระเงินทั้งหมด</p>
        </div>
        <Button variant="outline" className="h-11 px-6 font-bold border-2 rounded-xl">
          <Download size={16} className="mr-2" /> ส่งออกรายงาน
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'ยอดชำระสำเร็จวันนี้', value: '฿12,400', color: 'text-emerald-600', desc: 'เพิ่มขึ้น 12% จากเมื่อวาน' },
          { label: 'รายการรอดำเนินการ', value: '18 รายการ', color: 'text-amber-600', desc: 'เฉลี่ย 15 นาที/รายการ' },
          { label: 'อัตราจ่ายไม่สำเร็จ', value: '2.4%', color: 'text-rose-600', desc: 'ลดลง 0.5% สัปดาห์นี้' },
        ].map((item, idx) => (
          <Card key={idx} className="border-none shadow-lg rounded-2xl bg-card/50 backdrop-blur-sm p-6 overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-5">
                <ShieldCheck size={120} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-wider">{item.desc}</p>
          </Card>
        ))}
      </div>

      <div className="bg-card rounded-3xl border shadow-xl overflow-hidden ring-1 ring-border/50">
        <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ค้นหาด้วยเลขที่รายการ หรือชุดการจอง..." 
              className="pl-10 h-11 border-2 font-bold bg-background focus-visible:ring-primary rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead onClick={() => handleSort('id')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    เลขที่รายการ {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">เลขที่การจอง</TableHead>
                <TableHead onClick={() => handleSort('amount')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    จำนวนเงิน {sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">วิธีชำระเงิน</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">สถานะ</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">Reference (Omise)</TableHead>
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
              ) : sortedPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-muted">
                  <TableCell className="font-mono font-bold text-[13px] px-6 py-5 text-muted-foreground">{payment.id}</TableCell>
                  <TableCell className="px-6 py-5 font-black text-sm">{payment.bookingId}</TableCell>
                  <TableCell className="px-6 py-5 font-black text-sm text-primary">{payment.amount}</TableCell>
                  <TableCell className="px-6 py-5 font-bold text-xs uppercase tracking-tight">{payment.method}</TableCell>
                  <TableCell className="px-6 py-5">
                    <Badge 
                      variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'outline' : 'destructive'}
                      className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest"
                    >
                      {payment.status === 'completed' ? 'สำเร็จ' : payment.status === 'pending' ? 'รอดำเนินการ' : 'ล้มเหลว'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5 font-mono text-[11px] text-muted-foreground/80">{payment.reference}</TableCell>
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
                        <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest px-4 py-3">ตัวเลือก</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 font-bold text-sm">
                          <ExternalLink size={16} /> ดูรายละเอียด
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <ConfirmAction
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 py-3 px-4 font-bold text-sm">
                                  <RefreshCcw size={16} /> Retry Webhook
                                </DropdownMenuItem>
                              }
                              title="เรียก Webhook อีกครั้ง?"
                              description="ระบบจะทำการส่งสถานะการชำระเงินไปยังเซิร์ฟเวอร์ปลายทางอีกครั้ง"
                              onConfirm={() => handleRetryWebhook(payment.id)}
                              variant="default"
                              confirmText="ส่งตอนนี้"
                            />
                            <ConfirmAction
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 py-3 px-4 font-bold text-sm text-emerald-600">
                                  <CheckCircle2 size={16} /> Mark Paid (Manual)
                                </DropdownMenuItem>
                              }
                              title="ยืนยันสถานะชำระเงิน?"
                              description="ปรับสถานะเป็นชำระเงินแล้วด้วยตนเอง (ใช้ในกรณีตรวจสอบยอดเงินนอกระบบแล้วเท่านั้น)"
                              onConfirm={() => handleMarkAsPaid(payment.id)}
                              variant="success"
                              confirmText="ยืนยัน"
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
      </div>
    </div>
  );
}
