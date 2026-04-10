'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  ArrowUpDown, 
  Building2,
  Users2,
  Trophy,
  ExternalLink,
  Ban,
  CheckCircle,
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
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { ConfirmAction } from '@/components/admin/ConfirmAction';

const ownersData = [
  { id: 1, name: 'คุณวิทวัส เจริญผล', venues: 5, totalRevenue: '฿1,240,000', status: 'active', email: 'vittawat@hub.com' },
  { id: 2, name: 'หจก. สปอร์ตกรุ๊ป', venues: 12, totalRevenue: '฿3,450,000', status: 'active', email: 'support@sportgroup.com' },
  { id: 3, name: 'คุณสมหญิง รักสุขภาพ', venues: 2, totalRevenue: '฿158,000', status: 'disabled', email: 'somying@health.co.th' },
  { id: 4, name: 'บจก. กรีนสเตเดี้ยม', venues: 8, totalRevenue: '฿920,000', status: 'active', email: 'admin@green.com' },
];

export default function OwnersPage() {
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

  const filteredOwners = ownersData.filter(owner => {
    return owner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           owner.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedOwners = [...filteredOwners].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let valA = a[key];
    let valB = b[key];
    if (key === 'totalRevenue') {
      valA = parseFloat(valA.replace(/[฿,]/g, ''));
      valB = parseFloat(valB.replace(/[฿,]/g, ''));
    }
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleStatus = (id: number, current: string) => {
    const action = current === 'active' ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน';
    toast.success(`${action}บัญชีเจ้าของสนามเรียบร้อยแล้ว`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">เจ้าของสนาม</h1>
          <p className="text-muted-foreground mt-1 font-bold">จัดการข้อมูลพาร์ทเนอร์และสถิติรายได้ของเจ้าของสนาม</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <div className="bg-primary shadow-xl shadow-primary/20 rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-20">
              <Users2 size={120} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">จำนวนเจ้าของสนามทั้งหมด</p>
            <p className="text-4xl font-black">128</p>
            <p className="text-[10px] font-bold mt-2 bg-white/20 w-fit px-2 py-0.5 rounded-full uppercase">เพิ่มขึ้น 5 รายเดือนนี้</p>
         </div>
         <div className="bg-white border-2 border-muted shadow-lg rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-5 text-primary">
              <Building2 size={120} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">รวมจำนวนสนาม</p>
            <p className="text-4xl font-black text-foreground">412</p>
            <p className="text-[10px] font-bold mt-2 text-primary font-black uppercase">เฉลี่ย 3.2 สนาม/ราย</p>
         </div>
         <div className="bg-white border-2 border-muted shadow-lg rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-5 text-emerald-600">
              <Trophy size={120} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">พาร์ทเนอร์ระดับ Gold</p>
            <p className="text-4xl font-black text-foreground">15</p>
            <p className="text-[10px] font-bold mt-2 text-emerald-600 font-black uppercase">รายได้มากกว่า 1M/เดือน</p>
         </div>
      </div>

      <div className="bg-card rounded-3xl border shadow-xl overflow-hidden ring-1 ring-border/50">
        <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ค้นหาชื่อเจ้าของสนาม หรืออีเมล..." 
              className="pl-10 h-11 border-2 font-bold bg-background focus-visible:ring-primary rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead onClick={() => handleSort('name')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    ชื่อเจ้าของ {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('venues')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors text-center">
                  <div className="flex items-center justify-center gap-2">
                    จำนวนสนาม {sortConfig?.key === 'venues' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('totalRevenue')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors text-right">
                  <div className="flex items-center justify-end gap-2">
                    รายได้รวม {sortConfig?.key === 'totalRevenue' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6 text-center">สถานะ</TableHead>
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
              ) : sortedOwners.map((owner) => (
                <TableRow key={owner.id} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-muted">
                  <TableCell className="px-6 py-5">
                    <div>
                      <p className="font-black text-sm text-foreground">{owner.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{owner.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center font-black text-sm">{owner.venues}</TableCell>
                  <TableCell className="px-6 py-5 text-right font-black text-sm text-primary">{owner.totalRevenue}</TableCell>
                  <TableCell className="px-6 py-5 text-center">
                    <Badge 
                      variant={owner.status === 'active' ? 'default' : 'destructive'}
                      className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest"
                    >
                      {owner.status === 'active' ? 'ปกติ' : 'ปิดใช้งาน'}
                    </Badge>
                  </TableCell>
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
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className={`flex items-center gap-3 py-3 px-4 font-bold text-sm ${owner.status === 'active' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                  {owner.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                  {owner.status === 'active' ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'}
                                </DropdownMenuItem>
                              }
                              title={owner.status === 'active' ? "ยืนยันการปิดใช้งาน?" : "ยืนยันการเปิดใช้งาน?"}
                              description={owner.status === 'active' 
                                ? `บัญชีของ ${owner.name} จะไม่สามารถเข้าสู่ระบบและสนามทั้งหมดจะถูกซ่อนจากหน้าแอป`
                                : `บัญชีของ ${owner.name} จะกลับมาใช้งานได้ปกติและแสดงสนามบนแอปอัติโนมัติ`
                              }
                              onConfirm={() => toggleStatus(owner.id, owner.status)}
                              variant={owner.status === 'active' ? 'destructive' : 'success'}
                              confirmText={owner.status === 'active' ? "ใช่, ปิดการใช้งาน" : "ใช่, เปิดใช้งาน"}
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
