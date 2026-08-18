import './App.css'
import Header from './components/header/header'
import Sidebar from './components/sidebar/sidebar'

function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="ml-52 pt-16 p-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </main>
    </>
  )
}

export default App
