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

const stats = [
  {
    title: 'Total Bookings Today',
    value: '142',
    change: '+12.5%',
    trend: 'up',
    icon: CalendarCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Total Revenue Today',
    value: '฿42,500',
    change: '+8.2%',
    trend: 'up',
    icon: CreditCard,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Pending Payments',
    value: '23',
    change: '-3.1%',
    trend: 'down',
    icon: Users,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Pending Payouts',
    value: '฿128,400',
    change: '+22.4%',
    trend: 'up',
    icon: BadgeDollarSign,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

const latestBookings = [
  { id: 'BK-10294', user: 'Somchai R.', field: 'Green Field - A1', date: '2026-04-10', time: '18:00', status: 'confirmed', amount: '฿600' },
  { id: 'BK-10293', user: 'Anucha P.', field: 'Indoor Sport 1', date: '2026-04-10', time: '19:00', status: 'pending', amount: '฿850' },
  { id: 'BK-10292', user: 'Wichai T.', field: 'Green Field - B2', date: '2026-04-10', time: '20:00', status: 'confirmed', amount: '฿600' },
  { id: 'BK-10291', user: 'Somsak K.', field: 'Grand Stadium', date: '2026-04-10', time: '17:00', status: 'cancelled', amount: '฿1,200' },
  { id: 'BK-10290', user: 'Malee S.', field: 'Green Field - A1', date: '2026-04-10', time: '21:00', status: 'confirmed', amount: '฿600' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1 text-lg">Detailed insights and performance metrics for Sport Hub.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />
                )}
                <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.change}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">from yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Latest Bookings Table */}
        <Card className="lg:col-span-4 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Latest Bookings</CardTitle>
              <CardDescription>Most recent actions from users.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" 
              render={
                <Link href="/admin/bookings" className="flex items-center gap-1.5">
                  View All <ChevronRight size={14} />
                </Link>
              }
            />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-semibold px-4 py-3">Booking ID</TableHead>
                  <TableHead className="font-semibold px-4 py-3">Customer</TableHead>
                  <TableHead className="font-semibold px-4 py-3">Status</TableHead>
                  <TableHead className="text-right font-semibold px-4 py-3">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestBookings.map((booking) => (
                  <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium px-4 py-3">{booking.id}</TableCell>
                    <TableCell className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm leading-tight">{booking.user}</p>
                        <p className="text-xs text-muted-foreground leading-tight">{booking.field}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'outline' : 'destructive'}
                        className="rounded-full px-3 capitalize font-semibold tracking-wide"
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-4 py-3 font-semibold text-primary">{booking.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions or Other Insights */}
        <Card className="lg:col-span-3 border-none shadow-md bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-20">
            <Trophy size={200} />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sport Hub Performance</CardTitle>
            <CardDescription className="text-primary-foreground/70">Performance summary for this month.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Monthly Target</span>
                <span>85%</span>
              </div>
              <div className="h-2 w-full bg-primary-foreground/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full w-[85%]"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 border border-primary-foreground/20">
                <p className="text-xs text-primary-foreground/70">Top Venue</p>
                <p className="text-lg font-bold">Green Field</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 border border-primary-foreground/20">
                <p className="text-xs text-primary-foreground/70">Active Users</p>
                <p className="text-lg font-bold">1,204</p>
              </div>
            </div>
            
            <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-11" variant="secondary">
              Generate Monthly Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
