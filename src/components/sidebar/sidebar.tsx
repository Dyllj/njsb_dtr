import Nav from '../navs/navs';
import { Home, Calendar, BarChart2, Settings } from 'lucide-react';

function Sidebar() {
  const navItems = [
    { label: 'Dashboard', icon: Home },
    { label: 'Attendance', icon: Calendar },
    { label: 'Reports', icon: BarChart2 },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-52 bg-gray-800 p-4 text-white">
      <h2 className="text-lg font-semibold">Sidebar</h2>
      <nav className="mt-4 space-y-2">
        {navItems.map(({ label, icon }) => (
          <Nav
            key={label}
            href="#"
            onClick={(event) => event.preventDefault()}
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