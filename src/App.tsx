// src/App.tsx
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import Sidebar from './components/sidebar/sidebar';
import Dashboard from './pages/dashboard/dashboard';
import Interns from './pages/interns/interns';
import Attendance from './pages/attendance/attendance';
import Schedule from './pages/schedule/schedule';
import Report from './pages/report/report';
import QrCodePage from './pages/qrCode/qrCode';
import ScanPage from './pages/scan/scan';
import Settings from './pages/settings/settings';
import AcceptInvite from '@/components/acceptInvite';
import { useAuth } from '@/context/AuthContext';

function App() {
  const { session, loading, login, logout } = useAuth();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Reset the mobile drawer whenever the route changes. Doing this during
  // render (rather than in a useEffect) avoids the extra render pass that
  // react-hooks/set-state-in-effect warns about.
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setIsMobileNavOpen(false);
  }

  if (loading) {
    return null;
  }

  if (!session) {
    return <AcceptInvite onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed left-0 top-0 right-0 z-30 h-16" role="banner">
        <Header
          onLogout={logout}
          onMenuToggle={() => setIsMobileNavOpen((open) => !open)}
          isMobileNavOpen={isMobileNavOpen}
        />
      </header>

      {/*
        The sidebar stays `fixed` at every breakpoint so it always sits
        beside `main` (via main's md:ml-52), never in normal document flow.
        Only translate-x changes between breakpoints: off-screen drawer on
        mobile, permanently visible on desktop.
      */}
      <nav
        aria-label="Main navigation"
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl transition-transform duration-200 md:z-20 md:w-52 md:shadow-none md:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
      >
        <Sidebar />
      </nav>

      {isMobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 top-16 z-30 bg-black/40 md:hidden"
          aria-label="Close navigation"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      <main id="main-content" className="mt-10 ml-0 pt-16 min-h-[calc(100vh-4rem)] p-4 sm:p-6 flex flex-col gap-4 md:ml-52" role="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/interns" element={<Interns />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/report" element={<Report />} />
          <Route path="/qrcode" element={<QrCodePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scan/:code" element={<ScanPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;