import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { TimesheetPage } from './pages/TimesheetPage';
import { SchedulePage } from './pages/SchedulePage';
import { PayrollPage } from './pages/PayrollPage';
import { TaxesPage } from './pages/TaxesPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { ManualPunchModal } from './components/ManualPunchModal';
import { TimeOffModal } from './components/TimeOffModal';
import { PayStubModal } from './components/PayStubModal';
import { ToastContainer } from './components/Toast';

const Dashboard: React.FC = () => {
  const { activeTab } = useApp();
  const [isManualPunchOpen, setIsManualPunchOpen] = useState(false);
  const [isTimeOffOpen, setIsTimeOffOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main
        style={{
          flex: 1,
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '1.5rem 1.25rem 3rem 1.25rem'
        }}
      >
        {/* Navigation Tabs for Timesheet, Schedule, Payroll, Taxes, Profile */}
        <NavigationTabs />

        {/* Dynamic Pages */}
        {activeTab === 'timesheet' && (
          <TimesheetPage onOpenManualPunch={() => setIsManualPunchOpen(true)} />
        )}

        {activeTab === 'schedule' && (
          <SchedulePage onOpenTimeOff={() => setIsTimeOffOpen(true)} />
        )}

        {activeTab === 'payroll' && <PayrollPage />}

        {activeTab === 'taxes' && <TaxesPage />}

        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Global Modals & Overlays */}
      <ManualPunchModal
        isOpen={isManualPunchOpen}
        onClose={() => setIsManualPunchOpen(false)}
      />

      <TimeOffModal
        isOpen={isTimeOffOpen}
        onClose={() => setIsTimeOffOpen(false)}
      />

      <PayStubModal />

      <ToastContainer />
    </div>
  );
};

const MainContent: React.FC = () => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
