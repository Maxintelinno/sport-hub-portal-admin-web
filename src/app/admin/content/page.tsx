'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Edit,
  Eye,
  Search,
  BookOpen,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Tag,
  Trophy
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
  SelectValue 
} from '@/components/ui/select';
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { ConfirmAction } from '@/components/admin/ConfirmAction';
import { Textarea } from '@/components/ui/textarea';

const contentData = [
  { id: 1, title: '5 วิธีดูแลเข่าสำหรับนักฟุตบอล', category: 'สาระน่ารู้', author: 'Admin', date: '2026-04-05', status: 'published', views: '1,240' },
  { id: 2, title: 'รีวิวรองเท้าแบดมินตันรุ่นใหม่ 2026', category: 'แนะนำอุปกรณ์', author: 'Admin', date: '2026-04-08', status: 'published', views: '850' },
  { id: 3, title: 'การเลือกแร็กเก็ตเทนนิสให้เหมาะกับมือใหม่', category: 'แนะนำอุปกรณ์', author: 'Support', date: '2026-04-10', status: 'draft', views: '0' },
];

export default function ContentPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredContent = contentData.filter(item => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (id: number) => {
    toast.error(`ลบบทความ #${id} เรียบร้อยแล้ว`);
  };

  const handleToggleStatus = (id: number, current: string) => {
    const newStatus = current === 'published' ? 'แบบร่าง' : 'เผยแพร่';
    toast.success(`เปลี่ยนสถานะบทความ #${id} เป็น ${newStatus}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">บทความ / เนื้อหา</h1>
          <p className="text-muted-foreground mt-1 font-bold">จัดการเนื้อหาสาระและข่าวสารต่างๆ บนแอปพลิเคชัน</p>
        </div>
        {isAdmin && (
           <Dialog>
              <DialogTrigger
                render={
                  <Button className="h-11 px-6 font-black gap-2 shadow-xl shadow-primary/20 rounded-xl">
                    <Plus size={18} /> เพิ่มบทความใหม่
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[700px] rounded-3xl border-2">
                 <DialogHeader>
                    <DialogTitle className="text-2xl font-black">สร้างบทความใหม่</DialogTitle>
                    <DialogDescription className="font-bold">
                      เขียนเนื้อหาเพื่อแบ่งปันข้อมูลดีๆ ให้กับสมาชิก Sport Hub
                    </DialogDescription>
                 </DialogHeader>
                 <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                       <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">หัวข้อบทความ</label>
                       <Input placeholder="ระบุหัวข้อที่น่าสนใจ..." className="h-11 border-2 font-bold rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="grid gap-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">หมวดหมู่</label>
                          <Select>
                             <SelectTrigger className="h-11 border-2 font-bold rounded-xl">
                                <SelectValue placeholder="เลือกหมวดหมู่" />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="info" className="font-bold">สาระน่ารู้</SelectItem>
                                <SelectItem value="equip" className="font-bold">แนะนำอุปกรณ์</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="grid gap-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">รูปภาพหน้าปก (URL)</label>
                          <Input placeholder="https://..." className="h-11 border-2 font-bold rounded-xl" />
                       </div>
                    </div>
                    <div className="grid gap-2">
                       <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">เนื้อหาบทความ</label>
                       <Textarea 
                        placeholder="เริ่มเขียนเนื้อหาที่นี่..." 
                        className="min-h-[200px] border-2 font-medium rounded-xl p-4" 
                       />
                    </div>
                 </div>
                 <DialogFooter>
                    <div className="flex gap-2 w-full">
                        <Button variant="outline" className="flex-1 h-11 border-2 font-black rounded-xl">บันทึกเป็นแบบร่าง</Button>
                        <Button className="flex-1 h-11 font-black shadow-lg shadow-primary/20 rounded-xl">เผยแพร่ทันที</Button>
                    </div>
                 </DialogFooter>
              </DialogContent>
           </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:gap-6">
        {[
          { label: 'บทความทั้งหมด', value: '42', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'ยอดเข้าชมเดือนนี้', value: '14.2k', icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'หมวดหมู่สาระ', value: '28', icon: Tag, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'หมวดหมู่อุปกรณ์', value: '14', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
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
              placeholder="ค้นหาบทความ หรือหมวดหมู่..." 
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
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">หัวข้อบทความ</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6 text-center">หมวดหมู่</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6">ผู้เขียน / วันที่</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6 text-center">สถานะ</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 px-6 text-right">ยอดเข้าชม</TableHead>
                <TableHead className="w-[80px] py-5 px-6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <TableSkeleton columnCount={6} rowCount={3} />
                  </TableCell>
                </TableRow>
              ) : filteredContent.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-muted">
                  <TableCell className="px-6 py-5 min-w-[300px]">
                    <p className="font-black text-sm text-foreground hover:text-primary transition-colors cursor-pointer">{item.title}</p>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center">
                    <Badge variant="outline" className="rounded-xl border-2 font-bold text-[10px] px-3 py-1 text-primary bg-primary/5">
                        {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div>
                        <p className="font-bold text-xs">{item.author}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/60">{item.date}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center">
                    <Badge 
                      variant={item.status === 'published' ? 'default' : 'outline'}
                      className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest"
                    >
                      {item.status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right font-black text-sm text-muted-foreground">{item.views}</TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                        <Edit size={16} />
                      </Button>
                      {isAdmin && (
                        <ConfirmAction
                           trigger={
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50">
                                 <Trash2 size={16} />
                              </Button>
                           }
                           title="ลบบทความนี้?"
                           description="เนื้อหาจะถูกลบออกอย่างถาวรและไม่สามารถเรียกคืนได้"
                           onConfirm={() => handleDelete(item.id)}
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
