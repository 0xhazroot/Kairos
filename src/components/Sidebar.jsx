import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Clock, Sparkles, BarChart3, User, Shield, Download, BookOpen } from 'lucide-react'
import { storyService } from '../services/storyService.js'
import './Sidebar.css'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/notes', label: 'Diario & Notas', icon: BookOpen },
  { path: '/timelines', label: 'Timelines', icon: Clock },
  { path: '/constellation', label: 'Constelación', icon: Sparkles },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1 className="brand-title">KAIRÓS</h1>
        <span className="brand-tag">Multiverso Temporal</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navegación</span>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path
          return (
            <NavLink key={path} to={path} className={`nav-item ${isActive ? 'nav-item--active' : ''}`}>
              {isActive && (
                <motion.div
                  className="nav-item-highlight"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon size={18} strokeWidth={1.8} className="nav-icon" />
              <span className="nav-label">{label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-security-badge">
          <Shield size={14} strokeWidth={1.8} />
          <span>100% Local & Privado</span>
        </div>
        <button className="sidebar-export-btn" onClick={() => storyService.exportJSON()}>
          <Download size={15} strokeWidth={1.8} />
          <span>Exportar Backup</span>
        </button>
      </div>
    </aside>
  )
}
