import { motion } from 'framer-motion'
import { BarChart3, GitBranch, Calendar, Heart } from 'lucide-react'
import './Analytics.css'

export default function Analytics() {
  return (
    <motion.div
      className="analytics-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="an-header">
        <h1 className="an-title">Analytics</h1>
        <p className="an-subtitle">Métricas y patrones de tu línea temporal.</p>
      </header>

      <div className="an-grid">
        <div className="an-card">
          <div className="an-card-icon an-card-icon--sage">
            <GitBranch size={20} strokeWidth={1.8} />
          </div>
          <div className="an-card-info">
            <span className="an-card-value">0</span>
            <span className="an-card-label">Memorias en Rama Amistad</span>
          </div>
        </div>

        <div className="an-card">
          <div className="an-card-icon an-card-icon--lavender">
            <Heart size={20} strokeWidth={1.8} />
          </div>
          <div className="an-card-info">
            <span className="an-card-value">0</span>
            <span className="an-card-label">Memorias en Rama Vínculos</span>
          </div>
        </div>

        <div className="an-card">
          <div className="an-card-icon an-card-icon--sand">
            <Calendar size={20} strokeWidth={1.8} />
          </div>
          <div className="an-card-info">
            <span className="an-card-value">0</span>
            <span className="an-card-label">Épocas registradas</span>
          </div>
        </div>

        <div className="an-card">
          <div className="an-card-icon an-card-icon--blue">
            <BarChart3 size={20} strokeWidth={1.8} />
          </div>
          <div className="an-card-info">
            <span className="an-card-value">--</span>
            <span className="an-card-label">Año con más momentos</span>
          </div>
        </div>
      </div>

      <div className="an-chart-placeholder">
        <BarChart3 size={40} strokeWidth={1.2} className="an-chart-icon" />
        <h3>Distribución temporal en construcción</h3>
        <p>A medida que registres memorias, aquí verás la distribución cronológica de tus vivencias.</p>
      </div>
    </motion.div>
  )
}
