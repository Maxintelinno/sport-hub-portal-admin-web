'use client';

import { useState } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  Eye,
  Calendar,
  Layout,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useAuth } from '@/store/useAuth';
import { toast } from 'sonner';
import { ConfirmAction } from '@/components/admin/ConfirmAction';

const adsData = [
  { id: 1, title: 'Summer Promotion', position: 'home_top', image: 'https://images.unsplash.com/photo-1541252260730-0412e3e2107e?q=80&w=600&h=400&fit=crop', startDate: '2026-04-01', endDate: '2026-04-30', status: 'active' },
  { id: 2, title: 'New Shoes Arrival', position: 'mid_list', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&h=400&fit=crop', startDate: '2026-04-05', endDate: '2026-05-05', status: 'active' },
  { id: 3, title: 'Grand Opening - Rayong', position: 'bottom', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&h=400&fit=crop', startDate: '2026-03-15', endDate: '2026-04-15', status: 'inactive' },
];

export default function AdsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [ads, setAds] = useState(adsData);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id: number) => {
    setAds(ads.filter(ad => ad.id !== id));
    toast.error('Banner deleted successfully.');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(false);
    toast.success('New banner created successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Ads</h1>
          <p className="text-muted-foreground mt-1 text-lg">Control the promotional materials visible on the mobile app and website.</p>
        </div>
        {isAdmin && (
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger
              render={
                <Button className="h-11 px-6 font-bold gap-2 shadow-lg shadow-primary/20">
                  <Plus size={18} /> Create New Banner
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black">Promotion Builder</DialogTitle>
                  <DialogDescription>
                    Configure your banner visuals and targeting.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Banner Title</label>
                    <Input placeholder="E.g. Summer Sport Sale" className="font-bold h-11 border-2" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Position</label>
                      <Select defaultValue="home_top">
                        <SelectTrigger className="font-bold h-11 border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home_top">Home Top Slider</SelectItem>
                          <SelectItem value="mid_list">In-List Feed</SelectItem>
                          <SelectItem value="bottom">Footer Banner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</label>
                      <Select defaultValue="active">
                        <SelectTrigger className="font-bold h-11 border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active (Visible)</SelectItem>
                          <SelectItem value="inactive">Inactive (Hidden)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Image URL</label>
                    <div className="flex gap-2">
                      <Input placeholder="https://..." className="font-medium h-11 border-2" required />
                      <Button type="button" variant="outline" className="h-11 shrink-0 font-bold border-2">
                        <UploadCloud size={18} className="mr-2" /> Upload
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Start Date</label>
                      <Input type="date" className="font-bold h-11 border-2" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">End Date</label>
                      <Input type="date" className="font-bold h-11 border-2" required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsAdding(false)} className="h-11 font-bold border-2">Cancel</Button>
                  <Button type="submit" className="h-11 font-black px-8">Launch Banner</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <Card key={ad.id} className="overflow-hidden border-none shadow-lg group hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={ad.image} 
                alt={ad.title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <Badge 
                className={`absolute top-4 right-4 font-black uppercase tracking-widest px-3
                  ${ad.status === 'active' ? 'bg-emerald-500' : 'bg-muted text-muted-foreground'}
                `}
              >
                {ad.status}
              </Badge>
              <div className="absolute bottom-4 left-4">
                <Badge variant="outline" className="bg-white/20 text-white border-white/50 backdrop-blur-md font-bold text-[10px] uppercase tracking-tighter">
                  {ad.position.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-black">{ad.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 font-bold">
                <Calendar size={14} /> {ad.startDate} to {ad.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-dashed border-border">
                <div className="flex items-center gap-2">
                  <Layout size={16} className="text-primary" />
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Placement</p>
                </div>
                <p className="text-sm font-black text-foreground">Mobile App</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
              {isAdmin && (
                <>
                  <Button size="sm" variant="outline" className="flex-1 font-bold h-10 border-2">
                    <Edit3 size={14} className="mr-2" /> Edit
                  </Button>
                  <ConfirmAction
                    trigger={
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-2 border-transparent hover:border-rose-100 rounded-lg shrink-0">
                        <Trash2 size={18} />
                      </Button>
                    }
                    title="Delete this banner?"
                    description={`Are you sure you want to delete "${ad.title}"? This will immediately remove it from the mobile app and website.`}
                    onConfirm={() => handleDelete(ad.id)}
                    variant="destructive"
                    confirmText="Yes, Delete Ad"
                  />
                </>
              )}
            </CardFooter>
          </Card>
        ))}
        
        {/* Placeholder for adding */}
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-all min-h-[300px]"
          >
            <div className="p-4 bg-muted text-muted-foreground rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
               <Plus size={32} />
            </div>
            <div className="text-center">
              <p className="font-black text-lg text-foreground group-hover:text-primary transition-colors">Add New Promotion</p>
              <p className="text-xs font-bold text-muted-foreground">Boost your reach and engagement</p>
            </div>
          </button>
        )}
      </div>

      {/* Analytics Preview */}
      <Card className="border-none shadow-md bg-secondary/30">
        <CardContent className="p-8 flex items-center justify-between">
          <div className="space-y-1">
             <h4 className="text-2xl font-black">Promotion Analytics</h4>
             <p className="text-muted-foreground font-bold">Your ads were seen by 42,500 users this week.</p>
          </div>
          <Button variant="outline" className="h-12 font-black px-8 border-2 gap-2">
             Detailed Insight <ChevronRight size={18} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
