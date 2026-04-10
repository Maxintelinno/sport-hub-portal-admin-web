'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Edit3, 
  Eye,
  Settings2,
  Trophy,
  Dumbbell,
  ShoppingBag,
  CheckCircle2,
  XCircle,
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
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

const articlesData = [
  { id: 1, title: 'How to Choose the Right Football Boots', category: 'equipment', author: 'Coach Mike', date: '2026-04-05', status: 'published' },
  { id: 2, title: 'Top 10 Badminton Courts in Bangkok', category: 'sports_tips', author: 'Traveler J.', date: '2026-03-28', status: 'published' },
  { id: 3, title: 'Beginner Guide to Tennis Service', category: 'sports_tips', author: 'Pro Player S.', date: '2026-04-02', status: 'draft' },
  { id: 4, title: 'Best Racket Strings for Power', category: 'equipment', author: 'Coach Mike', date: '2026-03-15', status: 'published' },
];

export default function ContentPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('all');
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

  const filteredArticles = articlesData.filter(article => {
    const matchesTab = activeTab === 'all' || article.category === activeTab;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuthor = authorFilter === 'all' || article.author === authorFilter;
    return matchesTab && matchesSearch && matchesAuthor;
  });

  const sortedArticles = [...filteredArticles].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let valA = a[key];
    let valB = b[key];

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = (id: number) => {
    toast.error('Article deleted successfully.');
  };

  const toggleStatus = (id: number, current: string) => {
    toast.success(`Article #${id} is now ${current === 'published' ? 'DRAFT' : 'PUBLISHED'}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content CMS</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage articles, guides, and sports news for the discovery section.</p>
        </div>
        {isAdmin && (
          <Button className="h-11 px-8 font-black gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} /> New Article
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 relative items-start">
        <aside className="w-full md:w-64 space-y-4 sticky top-24">
           <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Discovery Stats</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><Trophy size={16} /></div>
                      <span className="text-sm font-bold">Total Reads</span>
                   </div>
                   <span className="font-black text-primary">12.5K</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><CheckCircle2 size={16} /></div>
                      <span className="text-sm font-bold">Published</span>
                   </div>
                   <span className="font-black text-emerald-600">82</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><FileText size={16} /></div>
                      <span className="text-sm font-bold">Drafts</span>
                   </div>
                   <span className="font-black text-amber-600">14</span>
                </div>
              </div>
           </div>

           <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Editor's Tip</p>
              <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                Articles with at least 2 images and a summary perform 40% better on engagement. 
              </p>
           </div>
        </aside>

        <main className="flex-1 space-y-6 overflow-hidden">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="bg-card rounded-2xl border shadow-md p-6 ring-1 ring-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
               <TabsList className="bg-muted p-1 rounded-xl h-12 border shadow-inner">
                  <TabsTrigger value="all" className="rounded-lg px-6 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-md">All Posts</TabsTrigger>
                  <TabsTrigger value="sports_tips" className="rounded-lg px-6 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-md gap-2">
                    <Dumbbell size={14} /> Tips
                  </TabsTrigger>
                  <TabsTrigger value="equipment" className="rounded-lg px-6 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-md gap-2">
                    <ShoppingBag size={14} /> Gear
                  </TabsTrigger>
               </TabsList>

               <div className="flex items-center gap-3 w-full md:max-w-md">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input 
                    className="pl-9 h-11 border-2 font-medium" 
                    placeholder="Search articles..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                 </div>
                 <Select value={authorFilter} onValueChange={(val) => setAuthorFilter(val || 'all')}>
                   <SelectTrigger className="w-[140px] h-11 font-bold border-2">
                     <SelectValue placeholder="Author" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all" className="font-bold">All Authors</SelectItem>
                     <SelectItem value="Coach Mike" className="font-bold">Coach Mike</SelectItem>
                     <SelectItem value="Traveler J." className="font-bold">Traveler J.</SelectItem>
                     <SelectItem value="Pro Player S." className="font-bold">Pro Player S.</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
               <div className="overflow-x-auto">
                 <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                        <TableRow className="hover:bg-transparent border-b">
                           <TableHead 
                            className="py-4 px-4 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleSort('title')}
                           >
                              <div className="flex items-center gap-2">
                                Article Title {sortConfig?.key === 'title' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                              </div>
                           </TableHead>
                           <TableHead className="py-4 px-4 font-black text-[10px] uppercase tracking-widest text-center">Category</TableHead>
                           <TableHead 
                            className="py-4 px-4 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleSort('author')}
                           >
                              <div className="flex items-center gap-2">
                                Author {sortConfig?.key === 'author' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-50" />}
                              </div>
                           </TableHead>
                           <TableHead className="py-4 px-4 font-black text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                           <TableHead className="py-4 px-4 font-black text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="p-0">
                              <TableSkeleton columnCount={5} rowCount={4} />
                            </TableCell>
                          </TableRow>
                        ) : sortedArticles.map((article) => (
                          <TableRow key={article.id} className="hover:bg-muted/20 transition-colors">
                             <TableCell className="py-5 px-4">
                                <p className="font-black text-sm text-foreground line-clamp-1">{article.title}</p>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tight">Last updated: {article.date}</p>
                             </TableCell>
                             <TableCell className="py-5 px-4 text-center">
                                <Badge variant="outline" className="rounded-lg font-black text-[10px] uppercase tracking-widest border-2">
                                   {article.category === 'equipment' ? 'Equipment' : 'Sports Tips'}
                                </Badge>
                             </TableCell>
                             <TableCell className="py-5 px-4 font-bold text-xs text-muted-foreground uppercase">{article.author}</TableCell>
                             <TableCell className="py-5 px-4 text-center">
                                <div className="flex flex-col items-center gap-1">
                                   {article.status === 'published' ? (
                                     <Badge className="bg-emerald-500 hover:bg-emerald-600 rounded-full h-2 w-2 p-0 border-none shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                   ) : (
                                     <Badge className="bg-amber-500 hover:bg-amber-600 rounded-full h-2 w-2 p-0 border-none" />
                                   )}
                                   <span className="text-[9px] font-black uppercase tracking-wider">{article.status}</span>
                                </div>
                             </TableCell>
                             <TableCell className="py-5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                   <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-muted border border-transparent hover:border-border">
                                      <Eye size={16} />
                                   </Button>
                                   {isAdmin && (
                                     <>
                                       <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-muted border border-transparent hover:border-border">
                                          <Edit3 size={16} />
                                       </Button>
                                       <ConfirmAction
                                          trigger={
                                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100">
                                              <Trash2 size={16} />
                                            </Button>
                                          }
                                          title="Delete Article?"
                                          description={`Are you sure you want to delete "${article.title}"? This will remove it from the Discovery feed.`}
                                          onConfirm={() => handleDelete(article.id)}
                                          variant="destructive"
                                          confirmText="Yes, Delete"
                                       />
                                       <ConfirmAction
                                          trigger={
                                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-muted border border-transparent hover:border-border">
                                              <Settings2 size={16} />
                                            </Button>
                                          }
                                          title={article.status === 'published' ? "Move to Draft?" : "Publish Article?"}
                                          description={article.status === 'published' 
                                            ? `This will remove the article from public view.` 
                                            : `This will make the article visible to all users.`
                                          }
                                          onConfirm={() => toggleStatus(article.id, article.status)}
                                          variant="default"
                                          confirmText={article.status === 'published' ? 'Keep as Draft' : 'Publish Now'}
                                       />
                                     </>
                                   )}
                                </div>
                             </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                 </Table>
               </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
