import Nav from '../navs/navs';
import {
  BarChart3,
  CalendarClock,
  Home,
  QrCode,
  Settings,
  Users,
} from 'lucide-react';

function Sidebar() {
  const navItems = [
    { label: 'Dashboard', icon: Home, to: '/' },
    { label: 'Interns', icon: Users, to: '/interns' },
    { label: 'Attendance', icon: CalendarClock, to: '/attendance' },
    { label: 'Report', icon: BarChart3, to: '/report' },
    { label: 'QR Code', icon: QrCode, to: '/qrcode' },
    { label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <aside className="h-full w-full bg-red-800 p-4 text-white" aria-label="Sidebar navigation">
      <div className="flex flex-col h-full">
        <header className="mb-10">
          <h2 className="text-lg flex justify-center m-auto font-semibold border-b-2 p-5 border-zinc-200">NJSB</h2>
        </header>
        <nav className="mt-4 space-y-2 flex-1" aria-label="Main menu">
          <ul className="space-y-2" role="list">
            {navItems.map(({ label, icon, to }) => (
              <li key={label}>
                <Nav to={to} icon={icon}>
                  {label}
                </Nav>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;