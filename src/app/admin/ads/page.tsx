'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  ImageIcon, 
  Trash2, 
  ExternalLink,
  Calendar,
  Monitor,
  Layout,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { ConfirmAction } from '@/components/admin/ConfirmAction';

const adsData = [
  { id: 1, title: 'Summer Sale 2026', position: 'หน้าแรก (บน)', startDate: '2026-04-01', endDate: '2026-04-30', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80' },
  { id: 2, title: 'New Badminton Courts', position: 'กลาง', startDate: '2026-03-15', endDate: '2026-05-15', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1626224580175-340ad0e3a76b?w=800&q=80' },
  { id: 3, title: 'Member Special Offer', position: 'ล่าง', startDate: '2026-04-10', endDate: '2026-06-10', status: 'draft', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64230d3?w=800&q=80' },
];

export default function AdsPage() {
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

  const filteredAds = adsData.filter(ad => {
    return ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           ad.position.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedAds = [...filteredAds].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let valA = a[key];
    let valB = b[key];
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = (id: number) => {
    toast.error(`ลบแบนเนอร์ #${id} เรียบร้อยแล้ว`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">การจัดการโฆษณา</h1>
          <p className="text-muted-foreground mt-1 font-bold">จัดการแบนเนอร์และตำแหน่งโฆษณาบนแอปพลิเคชัน</p>
        </div>
        {isAdmin && (
           <Dialog>
              <DialogTrigger
                render={
                  <Button className="h-11 px-6 font-black gap-2 shadow-xl shadow-primary/20 rounded-xl">
                    <Plus size={18} /> เพิ่มแบนเนอร์ใหม่
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[500px] rounded-3xl border-2">
                 <DialogHeader>
                    <DialogTitle className="text-2xl font-black">เพิ่มแบนเนอร์</DialogTitle>
                    <DialogDescription className="font-bold">
                      กรอกข้อมูลแบนเนอร์ที่ต้องการแสดงบนหน้าแอป
                    </DialogDescription>
                 </DialogHeader>
                 <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                       <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">หัวข้อโฆษณา</label>
                       <Input placeholder="เช่น โปรโมชั่นฤดูร้อน" className="h-11 border-2 font-bold rounded-xl" />
                    </div>
                    <div className="grid gap-2">
                       <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">ตำแหน่ง</label>
                       <Select>
                          <SelectTrigger className="h-11 border-2 font-bold rounded-xl">
                             <SelectValue placeholder="เลือกตำแหน่ง" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="top" className="font-bold">หน้าแรก (บน)</SelectItem>
                             <SelectItem value="middle" className="font-bold">กลาง</SelectItem>
                             <SelectItem value="bottom" className="font-bold">ล่าง</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="grid gap-2">
                       <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Image URL</label>
                       <Input placeholder="https://..." className="h-11 border-2 font-bold rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="grid gap-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">วันที่เริ่ม</label>
                          <Input type="date" className="h-11 border-2 font-bold rounded-xl" />
                       </div>
                       <div className="grid gap-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">วันที่สิ้นสุด</label>
                          <Input type="date" className="h-11 border-2 font-bold rounded-xl" />
                       </div>
                    </div>
                 </div>
                 <DialogFooter>
                    <Button className="h-11 font-black uppercase tracking-widest w-full rounded-xl shadow-lg shadow-primary/20">บันทึกข้อมูล</Button>
                 </DialogFooter>
              </DialogContent>
           </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
         {[
           { label: 'โฆษณาที่ใช้งานอยู่', value: '12', icon: Monitor, color: 'text-emerald-500', bg: 'bg-emerald-50' },
           { label: 'กำลังรอคิว', value: '4', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
           { label: 'สไลด์ที่ว่าง', value: '2', icon: Layout, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'ยอดคลิกรวม', value: '2.5k', icon: Plus, color: 'text-purple-500', bg: 'bg-purple-50' },
         ].map((item, idx) => (
           <div key={idx} className="flex flex-col gap-1 border-none shadow-lg rounded-2xl p-5 bg-card/50 backdrop-blur-sm">
             <div className={`w-fit p-2 ${item.bg} ${item.color} rounded-xl mb-2 shadow-sm`}>
               <item.icon size={18} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
             <p className="text-2xl font-black">{item.value}</p>
           </div>
         ))}
      </div>

      <div className="bg-card rounded-3xl border shadow-xl overflow-hidden ring-1 ring-border/50">
        <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ค้นหาโฆษณา..." 
              className="pl-10 h-11 border-2 font-bold bg-background rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead onClick={() => handleSort('title')} className="font-black text-[10px] uppercase tracking-widest py-5 px-6 cursor-pointer hover:text-primary transition-colors">
                   <div className="flex items-center gap-2">
                    หัวข้อโฆษณา {sortConfig?.key === 'title' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">ตำแหน่ง</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">วันที่เริ่ม - สิ้นสุด</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6 text-center">สถานะ</TableHead>
                <TableHead className="w-[80px] py-5 px-6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <TableSkeleton columnCount={5} rowCount={3} />
                  </TableCell>
                </TableRow>
              ) : sortedAds.map((ad) => (
                <TableRow key={ad.id} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-muted">
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 shadow-inner border">
                          <img src={ad.imageUrl} alt={ad.title} className="h-full w-full object-cover" />
                       </div>
                       <p className="font-black text-sm">{ad.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 font-bold text-xs uppercase text-primary bg-primary/5 w-fit rounded-lg inline-block m-5 h-8 leading-8 px-3">
                    {ad.position}
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <p className="text-sm font-bold text-muted-foreground">{ad.startDate} ถึง {ad.endDate}</p>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center">
                    <Badge 
                      variant={ad.status === 'active' ? 'default' : 'outline'}
                      className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest"
                    >
                      {ad.status === 'active' ? 'ใช้งานอยู่' : 'ร่าง'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted">
                        <ExternalLink size={16} />
                      </Button>
                      {isAdmin && (
                         <ConfirmAction
                            trigger={
                               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50">
                                  <Trash2 size={16} />
                               </Button>
                            }
                            title="ลบแบนเนอร์นี้?"
                            description="แบนเนอร์จะถูกลบออกจากระบบและหยุดแสดงผลทันที"
                            onConfirm={() => handleDelete(ad.id)}
                            variant="destructive"
                            confirmText="ใช่, ลบออก"
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
