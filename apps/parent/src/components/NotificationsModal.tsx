import { CreditCard, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface Notification {
  id: string;
  type: 'payment' | 'info' | 'alert';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const notifications: Notification[] = [
    {
      id: 'notif_1',
      type: 'payment',
      title: 'Paiement reçu',
      message: 'Votre paiement de 50 000 FCFA pour Marc K. Jr a bien été reçu par CS Sainte-Marie.',
      date: 'Aujourd\'hui, 10:45',
      isRead: false
    },
    {
      id: 'notif_2',
      type: 'alert',
      title: 'Tranche à venir',
      message: 'N\'oubliez pas, la prochaine tranche pour Sarah K. est due avant le 15 Décembre.',
      date: 'Hier, 14:20',
      isRead: false
    },
    {
      id: 'notif_3',
      type: 'info',
      title: 'Rentrée Scolaire',
      message: 'Bienvenue sur la plateforme Payskool pour l\'année 2026-2027.',
      date: '01 Sept, 08:00',
      isRead: true
    }
  ];

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emeraude" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div 
      className={clsx(
        "fixed inset-0 z-[110] bg-slate-50 transition-transform duration-300 ease-out flex flex-col",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Header */}
      <div className="pt-safe bg-white border-b border-slate-200 shrink-0">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-extrabold text-slate-navy tracking-tight">Notifications</h1>
          </div>
          <button className="text-xs font-bold text-emeraude hover:bg-emeraude/10 px-3 py-1.5 rounded-full transition-colors">
            Tout marquer lu
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-safe space-y-3">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={clsx(
              "p-4 rounded-2xl flex gap-4 transition-colors relative overflow-hidden",
              notif.isRead ? "bg-white border border-slate-100 shadow-sm" : "bg-white border-2 border-emeraude/30 shadow-md"
            )}
          >
            {/* Unread indicator */}
            {!notif.isRead && (
              <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-emeraude rounded-full"></div>
            )}

            <div className={clsx(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              notif.type === 'payment' ? "bg-emeraude/10" : 
              notif.type === 'alert' ? "bg-amber-50" : "bg-blue-50"
            )}>
              {getIcon(notif.type)}
            </div>

            <div className="pr-4">
              <h3 className="text-sm font-bold text-slate-navy mb-1">{notif.title}</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed mb-2">{notif.message}</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
