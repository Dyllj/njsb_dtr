import './App.css'
import Header from './components/header/header'
import Sidebar from './components/sidebar/sidebar'
import DisplayCards from './components/dashboardDisplay/displayCards'

function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="ml-52 pt-16 p-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <DisplayCards />
      </main>
    </>
  )
}

export default App
