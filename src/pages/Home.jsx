import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  GitBranch,
  Archive,
  TrendingUp,
  Sparkles,
  ArrowRight,
  GitMerge,
  BookOpen,
  Users,
  Compass,
  Zap,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react'
import { storyService } from '../services/storyService.js'
import { peopleService } from '../services/peopleService.js'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [people, setPeople] = useState([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const [storyList, peopleList] = await Promise.all([
      storyService.getAll(),
      peopleService.getAll()
    ])
    setStories(storyList || [])
    setPeople(peopleList || [])
  }

  const convergenceCount = stories.filter((s) => s.stream === 'convergence').length
  const epochsCount = stories.length === 0 ? 0 : new Set(stories.map((s) => s.epoch || (s.eventDate ? s.eventDate.slice(0, 4) : ''))).size

  const stats = [
    { label: 'Memorias Registradas', value: String(stories.length), icon: Archive, color: 'sage' },
    { label: 'Personas en Órbita', value: String(people.length), icon: Users, color: 'lavender' },
    { label: 'Cruces Multiverso', value: String(convergenceCount), icon: GitMerge, color: 'sand' },
    { label: 'Años con Memorias', value: String(epochsCount), icon: Calendar, color: 'blue' }
  ]

  // Contar categorías personalizadas para el widget
  const categoryCounts = stories.reduce((acc, s) => {
    const cat = (s.category && s.category.trim()) || ''
    if (cat) {
      acc[cat] = (acc[cat] || 0) + 1
    }
    return acc
  }, {})

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header Principal */}
      <header className="home-header">
        <div className="home-header-info">
          <div className="home-brand-tag">
            <Sparkles size={14} />
            <span>Centro de Control Temporal</span>
          </div>
          <h1 className="home-title">Bienvenido a tu Multiverso</h1>
          <p className="home-subtitle">
            Cada momento significativo es un punto de anclaje en el tiempo.
            Registra, bifurca y revive tus vivencias personales, amistades y amores.
          </p>
        </div>

        <div className="home-header-actions">
          <motion.button
            className="home-btn-primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/notes')}
          >
            <BookOpen size={16} />
            <span>Escribir en el Diario</span>
          </motion.button>

          <motion.button
            className="home-btn-secondary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/constellation')}
          >
            <Compass size={16} />
            <span>Ver Constelación 3D</span>
          </motion.button>
        </div>
      </header>

      {/* Grid de 4 Estadísticas Principales */}
      <section className="home-stats-grid">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            className={`stat-card stat-card--${color}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <div className="stat-icon-wrap">
              <Icon size={18} strokeWidth={2} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Layout Principal Balanceado de Dos Columnas */}
      <div className="home-dual-layout">
        {/* Columna Izquierda: Portales de Corrientes & Memorias Recientes (~65%) */}
        <div className="home-main-col">
          {/* Portales de Corrientes */}
          <div className="home-portals">
            <motion.div
              className="portal-card portal-card--sage"
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => navigate('/timelines')}
            >
              <div className="portal-top">
                <span className="portal-overline">Corriente de Amistad</span>
                <Users size={16} className="portal-icon-hint text-emerald-600" />
              </div>
              <h2 className="portal-title">Círculos & Hermandad</h2>
              <p className="portal-desc">
                La raíz del barrio, los cómplices del colegio y la universidad,
                salidas, noches y hermanos incondicionales.
              </p>
              <span className="portal-cta">
                Explorar en Timelines <ArrowRight size={14} className="portal-arrow" />
              </span>
            </motion.div>

            <motion.div
              className="portal-card portal-card--lavender"
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => navigate('/timelines')}
            >
              <div className="portal-top">
                <span className="portal-overline">Corriente Afectiva</span>
                <Sparkles size={16} className="portal-icon-hint text-rose-500" />
              </div>
              <h2 className="portal-title">Vínculos del Corazón</h2>
              <p className="portal-desc">
                Conexiones profundas, citas inolvidables, reflexiones a solas
                y momentos compartidos con personas especiales.
              </p>
              <span className="portal-cta">
                Explorar en Timelines <ArrowRight size={14} className="portal-arrow" />
              </span>
            </motion.div>
          </div>

          {/* Sección de Memorias Recientes */}
          <section className="home-recent-section">
            <div className="section-title-row">
              <h3 className="section-heading">Últimas Vivencias del Multiverso</h3>
              <button className="section-view-all" onClick={() => navigate('/notes')}>
                <span>Ver todas ({stories.length})</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {stories.length > 0 ? (
              <div className="recent-stories-grid">
                {stories.slice(0, 4).map((item) => (
                  <motion.div
                    key={item.id}
                    className="recent-story-card"
                    whileHover={{ y: -3 }}
                    onClick={() => navigate('/notes')}
                  >
                    <div className="r-card-header">
                      <span className={`r-badge ${item.badgeClass || 'badge-sage'}`}>
                        {item.icon || '📝'} {item.category || 'Salida'}
                      </span>
                      <span className="r-date">{item.date}</span>
                    </div>
                    <h4 className="r-title">{item.title}</h4>
                    <p className="r-summary">
                      {item.summary || item.story?.slice(0, 95) || 'Sin relato redactado...'}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="home-empty-card">
                <Clock size={32} className="empty-icon" />
                <h4>Tu línea temporal está esperando tus historias</h4>
                <p>Escribe tu primer recuerdo en el Diario para empezar a trazar tu multiverso.</p>
                <button className="empty-cta-btn" onClick={() => navigate('/notes')}>
                  <BookOpen size={14} />
                  <span>Escribir Primera Nota</span>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Columna Derecha: Hub de Widgets & Acceso Directo (~35%) */}
        <aside className="home-sidebar-col">
          {/* Widget 1: Acceso a Constelación 3D */}
          <div className="home-widget-card widget-cosmos" onClick={() => navigate('/constellation')}>
            <div className="widget-cosmos-header">
              <span className="cosmos-badge">✦ COSMOS 3D</span>
              <Compass size={18} className="text-sky-400" />
            </div>
            <h3 className="cosmos-title">Constelación de Vínculos</h3>
            <p className="cosmos-desc">
              Explora tus personas y vivencias en un espacio 3D interactivo con órbitas, galaxias y lazos cuánticos.
            </p>
            <div className="cosmos-btn-row">
              <span>Abrir Navegador 3D</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Widget 2: Personas en Órbita */}
          <div className="home-widget-card">
            <div className="widget-header-row">
              <div className="widget-title-group">
                <Users size={16} />
                <h4 className="widget-heading">Personas en Órbita ({people.length})</h4>
              </div>
              <button className="widget-link-btn" onClick={() => navigate('/notes')}>
                Ver en Diario
              </button>
            </div>

            {people.length > 0 ? (
              <div className="people-preview-list">
                {people.slice(0, 6).map((person) => (
                  <div key={person.id} className="person-row-item">
                    <span
                      className="person-avatar-circle"
                      style={{ backgroundColor: person.avatarColor || '#6ee7b7' }}
                    >
                      {person.icon || '👤'}
                    </span>
                    <div className="person-row-info">
                      <span className="person-row-name">{person.name}</span>
                      <span className="person-row-tag">{person.tag || 'Amistad'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="widget-empty-hint">
                Aún no has agregado contactos. Puedes vincular personas a cada nota en el diario.
              </p>
            )}
          </div>

          {/* Widget 3: Categorías y Lugares */}
          <div className="home-widget-card">
            <div className="widget-header-row">
              <div className="widget-title-group">
                <Layers size={16} />
                <h4 className="widget-heading">Tus Categorías & Lugares</h4>
              </div>
            </div>

            <div className="categories-breakdown">
              {Object.entries(categoryCounts).length > 0 ? (
                Object.entries(categoryCounts).map(([cat, count]) => (
                  <div key={cat} className="cat-stat-row">
                    <span className="cat-stat-name">{cat}</span>
                    <span className="cat-stat-pill">{count}</span>
                  </div>
                ))
              ) : (
                <p className="widget-empty-hint">Aún no has asignado categorías o lugares a tus notas.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  )
}
