'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data for Bookings (Pie Chart) - Translated
const bookingsData = {
  day: [
    { name: 'ฟุตบอล', value: 45, color: '#14532d' },
    { name: 'แบดมินตัน', value: 32, color: '#4d7c0f' },
    { name: 'เทนนิส', value: 18, color: '#c5a059' },
    { name: 'อื่นๆ', value: 5, color: '#94a3b8' },
  ],
  week: [
    { name: 'ฟุตบอล', value: 280, color: '#14532d' },
    { name: 'แบดมินตัน', value: 210, color: '#4d7c0f' },
    { name: 'เทนนิส', value: 120, color: '#c5a059' },
    { name: 'อื่นๆ', value: 45, color: '#94a3b8' },
  ],
  month: [
    { name: 'ฟุตบอล', value: 1200, color: '#14532d' },
    { name: 'แบดมินตัน', value: 850, color: '#4d7c0f' },
    { name: 'เทนนิส', value: 450, color: '#c5a059' },
    { name: 'อื่นๆ', value: 180, color: '#94a3b8' },
  ],
  year: [
    { name: 'ฟุตบอล', value: 14500, color: '#14532d' },
    { name: 'แบดมินตัน', value: 10200, color: '#4d7c0f' },
    { name: 'เทนนิส', value: 5400, color: '#c5a059' },
    { name: 'อื่นๆ', value: 2100, color: '#94a3b8' },
  ]
};

// Mock Data for Revenue (Bar Chart) - Translated
const revenueData = {
  day: [
    { name: '06:00', amount: 2400 },
    { name: '09:00', amount: 4800 },
    { name: '12:00', amount: 3600 },
    { name: '15:00', amount: 5900 },
    { name: '18:00', amount: 9800 },
    { name: '21:00', amount: 4200 },
  ],
  week: [
    { name: 'จ.', amount: 32000 },
    { name: 'อ.', amount: 28000 },
    { name: 'พ.', amount: 35000 },
    { name: 'พฤ.', amount: 42000 },
    { name: 'ศ.', amount: 58000 },
    { name: 'ส.', amount: 82000 },
    { name: 'อา.', amount: 75000 },
  ],
  month: [
    { name: 'สัปดาห์ 1', amount: 240000 },
    { name: 'สัปดาห์ 2', amount: 280000 },
    { name: 'สัปดาห์ 3', amount: 310000 },
    { name: 'สัปดาห์ 4', amount: 295000 },
  ],
  year: [
    { name: 'ม.ค.', amount: 1200000 },
    { name: 'ก.พ.', amount: 1100000 },
    { name: 'มี.ค.', amount: 1450000 },
    { name: 'เม.ย.', amount: 1300000 },
    { name: 'พ.ค.', amount: 1600000 },
    { name: 'มิ.ย.', amount: 1800000 },
    { name: 'ก.ค.', amount: 1950000 },
    { name: 'ส.ค.', amount: 2100000 },
    { name: 'ก.ย.', amount: 1850000 },
    { name: 'ต.ค.', amount: 1700000 },
    { name: 'พ.ย.', amount: 1900000 },
    { name: 'ธ.ค.', amount: 2300000 },
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-xl border-2 rounded-2xl p-4 shadow-2xl ring-1 ring-border/50 animate-in zoom-in-95 duration-200">
        <p className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{label || payload[0].name}</p>
        <p className="font-black text-primary text-base">
          {payload[0].dataKey === 'amount' 
            ? `฿${payload[0].value?.toLocaleString()}` 
            : `${payload[0].value} รายการ`}
        </p>
      </div>
    );
  }
  return null;
};

export function DashboardCharts() {
  const [bookingsPeriod, setBookingsPeriod] = useState<keyof typeof bookingsData>('day');
  const [revenuePeriod, setRevenuePeriod] = useState<keyof typeof revenueData>('day');

  // Translation mapping
  const titles = {
    bookings: 'สถิติการจองแยกตามกีฬา',
    revenue: 'แนวโน้มรายได้',
    bookingsDesc: 'ความนิยมของแต่ละประเภทกีฬา',
    revenueDesc: 'สรุปรายรับตามช่วงเวลาที่กำหนด'
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Bookings Pie Chart */}
      <Card className="border-none shadow-2xl overflow-hidden bg-card/60 backdrop-blur-xl rounded-[2.5rem]">
        <CardHeader className="flex flex-row items-center justify-between p-10 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">{titles.bookings}</CardTitle>
            <CardDescription className="font-bold text-muted-foreground/70">{titles.bookingsDesc}</CardDescription>
          </div>
          <Tabs value={bookingsPeriod} onValueChange={(val) => setBookingsPeriod(val as any)}>
            <TabsList className="h-10 bg-muted/40 p-1 rounded-xl">
              <TabsTrigger value="day" className="font-black text-[10px] uppercase tracking-widest px-4 rounded-lg">วันนี้</TabsTrigger>
              <TabsTrigger value="week" className="font-black text-[10px] uppercase tracking-widest px-4 rounded-lg">สัปดาห์</TabsTrigger>
              <TabsTrigger value="month" className="font-black text-[10px] uppercase tracking-widest px-4 rounded-lg">เดือน</TabsTrigger>
              <TabsTrigger value="year" className="font-black text-[10px] uppercase tracking-widest px-4 rounded-lg">ปี</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-[380px] min-h-[380px] p-10 pt-0">
          <ResponsiveContainer width="99%" height="100%">
            <PieChart>
              <Pie
                data={bookingsData[bookingsPeriod]}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {bookingsData[bookingsPeriod].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="middle" 
                align="right" 
                layout="vertical"
                iconType="circle"
                wrapperStyle={{ paddingLeft: '20px' }}
                formatter={(value) => <span className="text-[11px] font-black text-muted-foreground/80 uppercase tracking-widest">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Bar Chart */}
      <Card className="border-none shadow-2xl overflow-hidden bg-card/60 backdrop-blur-xl rounded-[2.5rem]">
        <CardHeader className="flex flex-row items-center justify-between p-10 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">{titles.revenue}</CardTitle>
            <CardDescription className="font-bold text-muted-foreground/70">{titles.revenueDesc}</CardDescription>
          </div>
          <Tabs value={revenuePeriod} onValueChange={(val) => setRevenuePeriod(val as any)}>
            <TabsList className="h-10 bg-muted/40 p-1 rounded-xl">
              <TabsTrigger value="day" className="font-black text-[10px] uppercase tracking-widest px-4 rounded-lg">วันนี้</TabsTrigger>
              <TabsTrigger value="week" className="font-black text-[10px] uppercase tracking-widest px-4 rounded-lg">สัปดาห์</TabsTrigger>
              <TabsTrigger value="month" className="font-black text-[10px] uppercase tracking-widest px-4 rounded-lg">เดือน</TabsTrigger>
              <TabsTrigger value="year" className="font-black text-[10px] uppercase tracking-widest px-4 rounded-lg">ปี</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-[380px] min-h-[380px] p-10 pt-0">
          <ResponsiveContainer width="99%" height="100%">
            <BarChart data={revenueData[revenuePeriod]} margin={{ top: 20, right: 0, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 10, fontWeight: 900 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 10, fontWeight: 900 }}
                tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26, 77, 46, 0.05)', radius: 12 }} />
              <Bar 
                dataKey="amount" 
                fill="#1a4d2e" 
                radius={[10, 10, 0, 0]} 
                barSize={revenuePeriod === 'year' ? 14 : 35}
                className="hover:fill-emerald-800 transition-colors shadow-lg"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
