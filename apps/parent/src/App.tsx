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
import { Check } from 'lucide-react';
import clsx from 'clsx';

export type TabId = 'home' | 'receipts' | 'students' | 'support';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { activeStudent, students, setActiveStudentId } = useActiveStudent();

  return (
    <div className="mx-auto max-w-md min-h-screen bg-slate-50 pb-24 relative shadow-2xl overflow-x-hidden">
      {/* Header is only shown on Home page, or always? Let's show it only on home to match the immersive views, or always on top? The original Header is fixed. Let's show it only on home. */}
      {activeTab === 'home' && (
        <>
          <Header 
            onSwitchStudentClick={() => setIsSwitcherOpen(true)} 
            onNotificationsClick={() => setIsNotifsOpen(true)}
          />
          <main>
            <HeroCard 
              school={activeStudent.school} 
              totalRemaining={activeStudent.totalRemaining} 
              onPayClick={() => setIsPaymentOpen(true)}
            />
            <InstallmentsTimeline installments={activeStudent.installments} />
            {/* Limit receipts to 3 on home */}
            <ReceiptsList receipts={activeStudent.recentReceipts.slice(0, 3)} />
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
                          <span className="block text-xs font-medium text-slate-500 mt-0.5">Classe : {child.grade}</span>
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
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={activeStudent.totalRemaining}
      />
    </div>
  );
}

export default AppContent;
