'use client';

import { 
  Users, 
  CalendarCheck, 
  CreditCard, 
  BadgeDollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DashboardCharts } from '@/components/admin/DashboardCharts';

const stats = [
  {
    title: 'จำนวนการจองวันนี้',
    value: '142',
    change: '+12.5%',
    trend: 'up',
    icon: CalendarCheck,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'รายได้วันนี้',
    value: '฿42,500',
    change: '+8.2%',
    trend: 'up',
    icon: CreditCard,
    color: 'text-emerald-600',
    bg: 'bg-emerald-600/10',
  },
  {
    title: 'รายการที่รอชำระเงิน',
    value: '23',
    change: '-3.1%',
    trend: 'down',
    icon: Users,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'รายการที่รอถอนเงิน',
    value: '฿128,400',
    change: '+22.4%',
    trend: 'up',
    icon: BadgeDollarSign,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];

const latestBookings = [
  { id: 'BK-10294', user: 'สมชาย ร.', field: 'Green Field - A1', date: '2026-04-10', time: '18:00', status: 'confirmed', amount: '฿600' },
  { id: 'BK-10293', user: 'อนุชา พ.', field: 'Indoor Sport 1', date: '2026-04-10', time: '19:00', status: 'pending', amount: '฿850' },
  { id: 'BK-10292', user: 'วิชัย ต.', field: 'Green Field - B2', date: '2026-04-10', time: '20:00', status: 'confirmed', amount: '฿600' },
  { id: 'BK-10291', user: 'สมศักดิ์ ก.', field: 'Grand Stadium', date: '2026-04-10', time: '17:00', status: 'cancelled', amount: '฿1,200' },
  { id: 'BK-10290', user: 'มาลี ส.', field: 'Green Field - A1', date: '2026-04-10', time: '21:00', status: 'confirmed', amount: '฿600' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 px-2 lg:px-4 py-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">ภาพรวมแดชบอร์ด</h1>
          <p className="text-muted-foreground mt-2 text-lg font-bold">เจาะลึกข้อมูลและประสิทธิภาพการดำเนินงานของ <span className="text-primary">Sport Hub</span></p>
        </div>
        <div className="flex gap-3">
            <Badge variant="outline" className="px-5 py-2 rounded-2xl border-2 font-black text-xs uppercase tracking-widest text-primary bg-primary/5 shadow-sm">
                Royal Sports Panel
            </Badge>
        </div>
      </div>

      <DashboardCharts />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-card/60 backdrop-blur-xl group cursor-pointer hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-8">
              <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-3.5 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
              <div className="flex items-center mt-3">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                    {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {stat.change}
                </div>
                <span className="ml-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">จากเมื่อวาน</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 pb-10">
        {/* Latest Bookings Table */}
        <Card className="lg:col-span-4 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/20 p-8">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black tracking-tight">การจองล่าสุด</CardTitle>
              <CardDescription className="font-bold text-muted-foreground/70">รายการจอง 10 รายการล่าสุดจากผู้ใช้งาน</CardDescription>
            </div>
            <Button variant="ghost" size="sm" nativeButton={false}
              render={
                <Link href="/admin/bookings" className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-primary hover:gap-3 transition-all">
                  ดูทั้งหมด <ChevronRight size={14} />
                </Link>
              }
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-black text-[10px] uppercase tracking-[0.1em] px-8 py-5">เลขที่การจอง</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-[0.1em] px-8 py-5">ผู้ใช้งาน</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-[0.1em] px-8 py-5">สถานะ</TableHead>
                  <TableHead className="text-right font-black text-[10px] uppercase tracking-[0.1em] px-8 py-5">จำนวนเงิน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestBookings.map((booking, idx) => (
                  <TableRow key={booking.id} className={`cursor-pointer hover:bg-muted/40 transition-colors border-muted ${idx === latestBookings.length - 1 ? 'border-none' : ''}`}>
                    <TableCell className="font-mono font-bold text-xs px-8 py-6">{booking.id}</TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                        <p className="font-black text-sm text-foreground">{booking.user}</p>
                        <p className="text-[10px] font-black text-muted-foreground/60 tracking-widest uppercase mt-0.5">{booking.field}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'outline' : 'destructive'}
                        className="rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest"
                      >
                        {booking.status === 'confirmed' ? 'ยืนยันแล้ว' : booking.status === 'pending' ? 'รอดำเนินการ' : 'ยกเลิก'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8 py-6 font-black text-sm text-primary">{booking.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="lg:col-span-3 border-none shadow-2xl bg-primary text-primary-foreground overflow-hidden relative rounded-[2.5rem]">
          <div className="absolute -right-12 -bottom-12 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Trophy size={280} />
          </div>
          <CardHeader className="pt-10 px-10">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Premium Analytics</span>
            </div>
            <CardTitle className="text-4xl font-black tracking-tighter mb-1">ROYAL SPORTS</CardTitle>
            <CardDescription className="text-primary-foreground/70 font-bold text-lg leading-snug">สรุปผลการดำเนินงานและแนวโน้มการเติบโตสำหรับเดือนนี้</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 relative z-10 px-10 pb-10 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest opacity-80">
                <span>ความคืบหน้าเป้าหมาย</span>
                <span className="text-secondary">85%</span>
              </div>
              <div className="h-3.5 w-full bg-primary-foreground/15 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div className="h-full bg-secondary rounded-full w-[85%] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-1000 ease-out"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-3xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-default">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">สนามยอดนิยม</p>
                <p className="text-xl font-black group-hover:text-secondary transition-colors">Green Field</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-default">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Active Users</p>
                <p className="text-xl font-black group-hover:text-secondary transition-colors">1,204</p>
              </div>
            </div>
            
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-white hover:text-primary font-black text-xs uppercase tracking-widest h-16 rounded-[1.5rem] shadow-xl shadow-black/20 transition-all duration-300 active:scale-95 group" variant="secondary">
              <ArrowUpRight size={18} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
              สร้างรายงานภาพรวมรายเดือน
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
