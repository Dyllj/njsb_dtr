import { AnimatePresence, motion } from 'motion/react';
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
  const [direction, setDirection] = useState(1);

  const handleTabChange = (nextTab: (typeof settingsNav)[number]['id']) => {
    const currentIndex = settingsNav.findIndex((item) => item.id === activeTab);
    const nextIndex = settingsNav.findIndex((item) => item.id === nextTab);
    setDirection(nextIndex >= currentIndex ? 1 : -1);
    setActiveTab(nextTab);
  };

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
                onClick={() => handleTabChange(item.id)}
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

      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Settings;
