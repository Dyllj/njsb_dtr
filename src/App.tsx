import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header/header'
import Sidebar from './components/sidebar/sidebar'
import Dashboard from './pages/dashboard/dashboard'
import Interns from './pages/interns/interns'
import Attendance from './pages/attendance/attendance'
import Schedule from './pages/schedule/schedule'
import Report from './pages/report/report'
import Settings from './pages/settings/settings'

function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="ml-52 pt-16 p-4 flex flex-col gap-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/interns" element={<Interns />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  )
}

export default App