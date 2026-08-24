import Nav from '../navs/navs';
import {
  BarChart3,
  CalendarClock,
  Home,
  Settings,
  Users,
} from 'lucide-react';

function Sidebar() {
  const navItems = [
    { label: 'Dashboard', icon: Home, to: '/' },
    { label: 'Interns', icon: Users, to: '/interns' },
    { label: 'Attendance', icon: CalendarClock, to: '/attendance' },
    { label: 'Report', icon: BarChart3, to: '/report' },
    { label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-20 h-screen w-52 bg-red-800 p-4 text-white">
      <h2 className="text-lg flex justify-center m-auto font-semibold mb-10 border-b-2 p-5 border-zinc-200">NJSB</h2>
      <nav className="mt-4 space-y-2" >
        {navItems.map(({ label, icon, to }) => (
          <Nav key={label} to={to} icon={icon}>
            {label}
          </Nav>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;