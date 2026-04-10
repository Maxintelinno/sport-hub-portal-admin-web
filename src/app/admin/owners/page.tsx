'use client';

import { useState } from 'react';
import { 
  Search, 
  Users, 
  MapPin, 
  Phone,
  BarChart3,
  SwitchCamera,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { ConfirmAction } from '@/components/admin/ConfirmAction';

const ownersData = [
  { id: 'OWN-001', name: 'Kittisak Sport Complex', owner: 'Kittisak W.', fields: 5, revenue: '฿245,000', status: 'active', location: 'Bangkok' },
  { id: 'OWN-002', name: 'Green Field Arena', owner: 'Somsak P.', fields: 3, revenue: '฿128,000', status: 'active', location: 'Nonthaburi' },
  { id: 'OWN-003', name: 'Grand Stadium', owner: 'Chaiwat T.', fields: 8, revenue: '฿560,000', status: 'active', location: 'Pathum Thani' },
  { id: 'OWN-004', name: 'Indoor Plaza', owner: 'Malee S.', fields: 2, revenue: '฿45,000', status: 'inactive', location: 'Bangkok' },
  { id: 'OWN-005', name: 'Pro Field Hub', owner: 'Anucha K.', fields: 4, revenue: '฿182,000', status: 'active', location: 'Samut Prakan' },
];

export default function OwnersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
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

  const filteredOwners = ownersData.filter(owner => {
    const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         owner.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || owner.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const sortedOwners = [...filteredOwners].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let valA = a[key];
    let valB = b[key];

    if (key === 'revenue') {
      valA = parseFloat(valA.replace(/[฿,]/g, ''));
      valB = parseFloat(valB.replace(/[฿,]/g, ''));
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast.success(`Owner ${id} is now ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Venue Owners</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage facility partners, track performance, and control platform access.</p>
        </div>
        {isAdmin && (
          <Button className="h-11 px-8 font-bold shadow-lg shadow-primary/20 gap-2">
            <Building2 size={18} /> Add New Partner
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-lg shadow-primary/20 relative overflow-hidden">
           <Users className="absolute -right-4 -bottom-4 h-24 w-24 opacity-20" />
           <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Total Partners</p>
           <h3 className="text-4xl font-black mt-1">128</h3>
           <p className="text-xs mt-4 font-bold bg-white/20 inline-block px-2 py-1 rounded">+5 this month</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border shadow-sm flex items-center justify-between group">
           <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Venues</p>
              <h3 className="text-4xl font-black mt-1">342</h3>
           </div>
           <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:rotate-12 transition-transform">
              <MapPin size={32} />
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm flex items-center justify-between group">
           <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Global Commission</p>
              <h3 className="text-4xl font-black mt-1">฿82.4K</h3>
           </div>
           <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:rotate-12 transition-transform">
              <BarChart3 size={32} />
           </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-md overflow-hidden ring-1 ring-border/50">
        <div className="p-5 border-b flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by venue name or owner..." 
              className="pl-9 h-11 bg-background border-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={locationFilter} onValueChange={(val) => setLocationFilter(val || 'all')}>
              <SelectTrigger className="w-[180px] h-11 bg-background border-none ring-1 ring-border font-bold">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">All Locations</SelectItem>
                <SelectItem value="Bangkok" className="font-bold">Bangkok</SelectItem>
                <SelectItem value="Nonthaburi" className="font-bold">Nonthaburi</SelectItem>
                <SelectItem value="Pathum Thani" className="font-bold">Pathum Thani</SelectItem>
                <SelectItem value="Samut Prakan" className="font-bold">Samut Prakan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead 
                  className="py-5 px-6 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Owner & Venue {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="py-5 px-6 font-black uppercase tracking-widest text-[10px]">Location</TableHead>
                <TableHead 
                  className="py-5 px-6 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('fields')}
                >
                  <div className="flex items-center gap-2">
                    Fields {sortConfig?.key === 'fields' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-5 px-6 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center gap-2">
                    Total Revenue {sortConfig?.key === 'revenue' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="py-5 px-6 font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="py-5 px-6 text-right font-black uppercase tracking-widest text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <TableSkeleton columnCount={6} rowCount={5} />
                  </TableCell>
                </TableRow>
              ) : sortedOwners.map((owner) => (
                <TableRow key={owner.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${owner.name}`} />
                        <AvatarFallback>{owner.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-black text-sm text-foreground leading-tight">{owner.name}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Owner: {owner.owner}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase">
                      <MapPin size={12} className="text-primary" /> {owner.location}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="secondary" className="rounded-lg font-black bg-muted text-muted-foreground px-3">
                       {owner.fields} Fields
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <p className="font-black text-primary">{owner.revenue}</p>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${owner.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${owner.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {owner.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <MoreVertical size={16} />
                          </Button>
                        }
                      />
                      {isAdmin && (
                        <DropdownMenuContent align="end" className="w-56 font-bold">
                          <DropdownMenuItem className="py-3">
                            <Trophy size={14} className="mr-2" /> View Performance
                          </DropdownMenuItem>
                          <DropdownMenuItem className="py-3">
                            <Phone size={14} className="mr-2" /> Contact Partner
                          </DropdownMenuItem>
                          <ConfirmAction
                            trigger={
                              <DropdownMenuItem 
                                className={`py-3 ${owner.status === 'active' ? 'text-rose-600' : 'text-emerald-600'}`}
                                onSelect={(e) => e.preventDefault()}
                              >
                                {owner.status === 'active' ? (
                                  <><ShieldAlert size={14} className="mr-2" /> Disable Account</>
                                ) : (
                                  <><ShieldCheck size={14} className="mr-2" /> Enable Account</>
                                )}
                              </DropdownMenuItem>
                            }
                            title={owner.status === 'active' ? "Disable Partner Account?" : "Enable Partner Account?"}
                            description={owner.status === 'active' 
                              ? `Are you sure you want to disable ${owner.name}? They will no longer be able to accept bookings.` 
                              : `Are you sure you want to enable ${owner.name}? They will be able to accept bookings immediately.`
                            }
                            onConfirm={() => toggleStatus(owner.id, owner.status)}
                            variant={owner.status === 'active' ? 'destructive' : 'success'}
                            confirmText={owner.status === 'active' ? 'Disable Now' : 'Enable Now'}
                          />
                        </DropdownMenuContent>
                      )}
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
