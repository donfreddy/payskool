import { useState } from 'react';
import { Header } from './components/Header';
import { HeroCard } from './components/HeroCard';
import { InstallmentsTimeline } from './components/InstallmentsTimeline';
import { ReceiptsList } from './components/ReceiptsList';
import { BottomNav } from './components/BottomNav';
import { StudentsView } from './views/StudentsView';
import { ReceiptsView } from './views/ReceiptsView';
import { SupportView } from './views/SupportView';
import { useActiveStudent } from './contexts/ActiveStudentContext';
import { BottomSheet } from './components/BottomSheet';
import { NotificationsModal } from './components/NotificationsModal';
import { PaymentFlowModal } from './components/PaymentFlowModal';
import { Check, ArrowRight } from 'lucide-react';
import { parentProfile } from './mocks/dashboardData';
import type { Installment } from './types/models';
import clsx from 'clsx';

export type TabId = 'home' | 'receipts' | 'students' | 'support';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [paymentContext, setPaymentContext] = useState<{ amount: number; title: string } | null>(null);
  const { activeStudent, students, setActiveStudentId } = useActiveStudent();

  const openPayment = (amount: number, title?: string) => {
    setPaymentContext({ amount, title: title ?? 'Paiement scolarité' });
  };

  return (
    <div className="mx-auto max-w-md min-h-screen bg-slate-50 pb-24 relative shadow-2xl overflow-x-hidden">
      {activeTab === 'home' && (
        <>
          <Header 
            onSwitchStudentClick={() => setIsSwitcherOpen(true)} 
            onNotificationsClick={() => setIsNotifsOpen(true)}
          />
          <main>
            {/* Greeting */}
            <div className="px-4 pt-2 pb-0">
              <p className="text-sm font-medium text-slate-500">
                Bonjour, <span className="font-bold text-slate-navy">{parentProfile.name.split(' ')[0]} 👋</span>
              </p>
            </div>

            <HeroCard 
              school={activeStudent.school} 
              totalRemaining={activeStudent.totalRemaining} 
              onPayClick={() => openPayment(activeStudent.totalRemaining, 'Total scolarité')}
            />
            <InstallmentsTimeline 
              installments={activeStudent.installments} 
              onPayInstallment={(inst: Installment) => openPayment(inst.amount, inst.title)}
            />
            {/* Receipts preview with "See all" link */}
            <div className="px-4 py-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-navy">Derniers reçus</h2>
                <button 
                  onClick={() => setActiveTab('receipts')}
                  className="flex items-center gap-1 text-xs font-bold text-emeraude hover:bg-emeraude/10 px-2 py-1.5 rounded-lg transition-colors"
                >
                  Voir tout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <ReceiptsList receipts={activeStudent.recentReceipts.slice(0, 3)} />
            </div>
          </main>
        </>
      )}

      {activeTab === 'receipts' && <ReceiptsView />}
      {activeTab === 'students' && <StudentsView onSelectStudent={() => setActiveTab('home')} />}
      {activeTab === 'support' && <SupportView />}

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Switcher Bottom Sheet */}
      <BottomSheet 
        isOpen={isSwitcherOpen} 
        onClose={() => setIsSwitcherOpen(false)}
        title="Basculer vers..."
      >
        <div className="space-y-6">
          {Array.from(new Set(students.map(s => s.school.name))).map((schoolName) => {
            const schoolStudents = students.filter(s => s.school.name === schoolName);
            return (
              <div key={schoolName} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">{schoolName}</h3>
                {schoolStudents.map((child) => {
                  const isActive = child.id === activeStudent.id;
                  return (
                    <button
                      key={child.id}
                      onClick={() => {
                        setActiveStudentId(child.id);
                        setIsSwitcherOpen(false);
                      }}
                      className={clsx(
                        "w-full flex items-center justify-between gap-4 p-4 rounded-2xl border text-left transition-all active:scale-[0.98]",
                        isActive 
                          ? "bg-emeraude/5 border-emeraude" 
                          : "bg-white border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={clsx(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                          isActive ? "bg-emeraude text-white" : "bg-slate-100 text-slate-600"
                        )}>
                          {child.initials}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-navy">{child.name}</span>
                          <span className="block text-xs font-medium text-slate-500 mt-0.5">Classe : {child.grade} · Année {child.school.academicYear}</span>
                          <span className="block text-sm font-extrabold text-slate-800 mt-1">{child.totalRemaining.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-emeraude flex items-center justify-center shadow-sm">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </BottomSheet>

      {/* Notifications Full Modal */}
      <NotificationsModal 
        isOpen={isNotifsOpen} 
        onClose={() => setIsNotifsOpen(false)} 
      />

      {/* Payment Flow Modal */}
      <PaymentFlowModal
        isOpen={paymentContext !== null}
        onClose={() => setPaymentContext(null)}
        amount={paymentContext?.amount ?? 0}
        {...(paymentContext?.title ? { installmentTitle: paymentContext.title } : {})}
      />
    </div>
  );
}

export default AppContent;
