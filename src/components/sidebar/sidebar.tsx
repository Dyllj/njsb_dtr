import Nav from '../navs/navs';

function Sidebar() {
  const navItems = ['Dashboard', 'Attendance', 'Reports', 'Settings'];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-52 bg-gray-800 p-4 text-white">
      <h2 className="text-lg font-semibold">Sidebar</h2>
      <nav className="mt-4 space-y-2">
        {navItems.map((item) => (
          <Nav
            key={item}
            href="#"
            onClick={(event) => event.preventDefault()}
            className="text-white hover:text-amber-400"
          >
            {item}
          </Nav>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;