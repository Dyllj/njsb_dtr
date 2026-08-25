import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import Sidebar from './components/sidebar/sidebar';
import Dashboard from './pages/dashboard/dashboard';
import Interns from './pages/interns/interns';
import Attendance from './pages/attendance/attendance';
import Schedule from './pages/schedule/schedule';
import Report from './pages/report/report';
import Settings from './pages/settings/settings';
import LoginPage from './pages/loginPage/loginPage';

const AUTH_KEY = 'njsb_dtr_admin_logged_in';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      <Header />
      <Sidebar />
      <main className="ml-52 pt-16 p-4 flex flex-col gap-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/interns" element={<Interns />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  );
}

export default App