import { motion } from 'framer-motion'
import { Clock, GitBranch, Archive, TrendingUp } from 'lucide-react'
import './Home.css'

const stats = [
  { label: 'Memorias', value: '0', icon: Archive, color: 'sage' },
  { label: 'Ramas activas', value: '2', icon: GitBranch, color: 'lavender' },
  { label: 'Épocas', value: '0', icon: Clock, color: 'sand' },
  { label: 'Conexiones', value: '0', icon: TrendingUp, color: 'blue' },
]

export default function Home() {
  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="home-header">
        <div>
          <h1 className="home-title">Bienvenido a tu Multiverso</h1>
          <p className="home-subtitle">
            Cada momento significativo es un punto en tu línea temporal.
            Registra, bifurca y revive.
          </p>
        </div>
      </header>

      <section className="home-stats">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            className={`stat-card stat-card--${color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="stat-icon-wrap">
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </motion.div>
        ))}
      </section>

      <section className="home-portals">
        <motion.div
          className="portal-card portal-card--sage"
          whileHover={{ y: -4, boxShadow: '0 16px 40px -8px rgba(82,158,114,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span className="portal-overline">Corriente de Amistad</span>
          <h2 className="portal-title">Círculos & Tribu</h2>
          <p className="portal-desc">
            La raíz del barrio, los cómplices del colegio, alianzas de chamba
            y los hermanos de vida que trascienden el tiempo.
          </p>
          <span className="portal-cta">Explorar rama</span>
        </motion.div>

        <motion.div
          className="portal-card portal-card--lavender"
          whileHover={{ y: -4, boxShadow: '0 16px 40px -8px rgba(124,104,184,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span className="portal-overline">Corriente Afectiva</span>
          <h2 className="portal-title">Vínculos del Corazón</h2>
          <p className="portal-desc">
            Destellos de inocencia, conexiones efímeras, historias formales
            y el capítulo que estás escribiendo ahora.
          </p>
          <span className="portal-cta">Explorar rama</span>
        </motion.div>
      </section>

      <section className="home-empty-state">
        <div className="empty-state-card">
          <Clock size={32} strokeWidth={1.5} className="empty-icon" />
          <h3>Tu línea temporal está vacía</h3>
          <p>Dirígete a Timelines para bifurcar tu primera memoria en el multiverso.</p>
        </div>
      </section>
    </motion.div>
  )
}
