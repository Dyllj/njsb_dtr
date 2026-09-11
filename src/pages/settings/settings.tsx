import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { BarChart3, CalendarRange, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import EditAdmins from './settingsPages/editAdmins';
import EditInterns from './settingsPages/editInterns';
import CalendarSettings from './settingsPages/calendarSettings';
import GenerateReport from './settingsPages/generateReport';

type SettingsTabId = 'admin' | 'interns' | 'report' | 'calendar';

const settingsNav: { label: string; id: SettingsTabId; icon: LucideIcon }[] = [
  { label: 'Admin', id: 'admin', icon: ShieldCheck },
  { label: 'Interns', id: 'interns', icon: Users },
  { label: 'Report', id: 'report', icon: BarChart3 },
  { label: 'Calendar', id: 'calendar', icon: CalendarRange },
];

function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('admin');
  const [direction, setDirection] = useState(1);

  const handleTabChange = (nextTab: SettingsTabId) => {
    if (nextTab === activeTab) return;

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
    <div className="flex flex-col gap-6 pt-4">
      <header className="pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage admin access, intern records, reports, and the attendance calendar.
        </p>
      </header>

      <nav
        aria-label="Settings sections"
        className="flex w-full overflow-x-auto rounded-xl border border-border bg-muted p-1"
        role="tablist"
      >
        {settingsNav.map((item) => {
          const isActive = item.id === activeTab;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`settings-panel-${item.id}`}
              id={`settings-tab-${item.id}`}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="settings-tab-highlight"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                />
              )}
              <Icon className="relative z-10 size-4" aria-hidden="true" />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              id={`settings-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`settings-tab-${activeTab}`}
              initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;