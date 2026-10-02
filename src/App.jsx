import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Timelines from './pages/Timelines.jsx'
import Analytics from './pages/Analytics.jsx'
import Profile from './pages/Profile.jsx'
import Notes from './pages/Notes.jsx'
import Constellation from './pages/Constellation.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/timelines" element={<Timelines />} />
            <Route path="/constellation" element={<Constellation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
