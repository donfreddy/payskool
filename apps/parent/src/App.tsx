import { Header } from './components/Header';
import { HeroCard } from './components/HeroCard';
import { InstallmentsTimeline } from './components/InstallmentsTimeline';
import { ReceiptsList } from './components/ReceiptsList';
import { BottomNav } from './components/BottomNav';
import { mockDashboardData } from './mocks/dashboardData';

function App() {
  const { activeStudent, school, totalRemaining, installments, recentReceipts } = mockDashboardData;

  return (
    <div className="mx-auto max-w-md min-h-screen bg-slate-50 pb-24 relative shadow-2xl overflow-x-hidden">
      <Header activeStudent={activeStudent} />
      
      <main>
        <HeroCard school={school} totalRemaining={totalRemaining} />
        <InstallmentsTimeline installments={installments} />
        <ReceiptsList receipts={recentReceipts} />
      </main>

      <BottomNav />
    </div>
  );
}

export default App;
