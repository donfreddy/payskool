import { X } from 'lucide-react';
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={clsx(
          "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-[32px] z-[101] transition-transform duration-300 ease-out shadow-2xl flex flex-col max-h-[85vh]",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2 shrink-0">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="px-6 pb-4 flex items-center justify-between shrink-0 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-navy">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto overscroll-contain pb-safe">
          {children}
        </div>
      </div>
    </>
  );
}
