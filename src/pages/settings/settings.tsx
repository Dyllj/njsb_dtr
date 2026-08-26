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
    <div className="flex flex-col gap-4 pt-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage admin access, intern records, reports, and the attendance calendar.
        </p>
      </div>

      <nav
        aria-label="Settings sections"
        className="inline-flex w-fit items-center gap-1 rounded-xl border border-border bg-muted p-1"
      >
        {settingsNav.map((item) => {
          const isActive = item.id === activeTab;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                'relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
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
              <Icon className="relative z-10 size-4" />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Card>
        <CardContent>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
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