import { useState } from 'react';
import EditAdmins from './settingsPages/editAdmins';
import EditInterns from './settingsPages/editInterns';
import CalendarSettings from './settingsPages/calendarSettings';
import GenerateReport from './settingsPages/generateReport';

const settingsNav = [
  { label: 'Admin', id: 'admin' },
  { label: 'Interns', id: 'interns' },
  { label: 'Report', id: 'report' },
  { label: 'Calendar', id: 'calendar' },
] as const;

function Settings() {
  const [activeTab, setActiveTab] = useState<(typeof settingsNav)[number]['id']>('admin');

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'admin':
        return <EditAdmins />;
      case 'interns':
        return <EditInterns />;
      case 'report':
        return <GenerateReport />;
      case 'calendar':
        return <CalendarSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      <nav className="border-b border-slate-200">
        <div className="flex flex-wrap gap-2 pb-2">
          {settingsNav.map((item) => {
            const isActive = item.id === activeTab;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="w-full">{renderActiveSection()}</div>
    </div>
  );
}

export default Settings;
