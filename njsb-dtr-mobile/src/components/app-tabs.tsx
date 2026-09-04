import { BarChart3, CalendarRange, Clock, ScanLine, UserRound } from 'lucide-react-native';
import { Tabs } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 10,
          height: 68,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 600,
          marginTop: 2,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <ScanLine color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="hours"
        options={{
          title: 'Hours',
          tabBarIcon: ({ color }) => <Clock color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="dtr"
        options={{
          title: 'DTR',
          tabBarIcon: ({ color }) => <CalendarRange color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserRound color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
