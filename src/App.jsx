import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Timelines from './pages/Timelines.jsx'
import Branches from './pages/Branches.jsx'
import Analytics from './pages/Analytics.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timelines" element={<Timelines />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
