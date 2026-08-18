function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-52 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-semibold">Sidebar</h2>
      <ul className="mt-4 space-y-2">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </aside>
  );
}

export default Sidebar;