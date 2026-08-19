import type { MouseEvent } from 'react';
import Nav from '../navs/navs';
import {
  BarChart3,
  CalendarClock,
  CalendarRange,
  Home,
  Settings,
  Users,
} from 'lucide-react';

function Sidebar() {
  const navItems = [
    { label: 'Dashboard', icon: Home },
    { label: 'Interns', icon: Users },
    { label: 'Attendance', icon: CalendarClock },
    { label: 'Schedule', icon: CalendarRange },
    { label: 'Report', icon: BarChart3 },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-20 h-screen w-52 bg-gray-800 p-4 text-white">
      <h2 className="text-lg justify-center m-auto font-semibold">NJSB</h2>
      <nav className="mt-4 space-y-2">
        {navItems.map(({ label, icon }) => (
          <Nav
            key={label}
            href="#"
            onClick={(event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()}
            className="text-white hover:text-amber-400"
            icon={icon}
          >
            {label}
          </Nav>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;