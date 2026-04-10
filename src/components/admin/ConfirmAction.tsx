'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ConfirmActionProps {
  trigger: React.ReactElement;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export function ConfirmAction({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmActionProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[440px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
             <div className={`p-4 rounded-2xl ${
                variant === 'destructive' ? 'bg-rose-50 text-rose-500' : 
                variant === 'success' ? 'bg-emerald-50 text-emerald-500' : 
                'bg-blue-50 text-blue-500'
             }`}>
                {variant === 'destructive' ? <AlertCircle size={32} /> : 
                 variant === 'success' ? <ShieldCheck size={32} /> : 
                 <AlertTriangle size={32} />}
             </div>
             
             <div className="space-y-2">
                <DialogTitle className="text-2xl font-black">{title}</DialogTitle>
                <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                  {description}
                </DialogDescription>
             </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
               variant={variant === 'destructive' ? 'destructive' : variant === 'success' ? 'default' : 'default'}
               className={`h-12 font-black text-sm uppercase tracking-widest rounded-xl 
                 ${variant === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
               `}
               onClick={handleConfirm}
            >
              {confirmText}
            </Button>
            <Button 
               variant="ghost" 
               className="h-12 font-bold text-sm text-muted-foreground hover:bg-muted/50 rounded-xl"
               onClick={() => setOpen(false)}
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
