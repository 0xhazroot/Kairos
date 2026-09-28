import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, GitBranch, Archive, TrendingUp, Sparkles, ArrowRight, GitMerge, BookOpen } from 'lucide-react'
import { storyService } from '../services/storyService.js'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const list = await storyService.getAll()
    setStories(list)
  }

  const convergenceCount = stories.filter(s => s.stream === 'convergence').length
  const epochsCount = stories.length === 0 ? 0 : new Set(stories.map(s => s.epoch)).size

  const stats = [
    { label: 'Memorias Registradas', value: String(stories.length), icon: Archive, color: 'sage' },
    { label: 'Corrientes Activas', value: stories.length === 0 ? '0' : '2', icon: GitBranch, color: 'lavender' },
    { label: 'Cruces Multiverso', value: String(convergenceCount), icon: GitMerge, color: 'sand' },
    { label: 'Épocas Vividas', value: String(epochsCount), icon: Clock, color: 'blue' },
  ]

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
            Registra, bifurca, entrelaza y revive tus vivencias.
          </p>
        </div>

        <motion.button
          className="tl-btn-write"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/notes')}
        >
          <BookOpen size={16} />
          <span>Escribir en Diario</span>
        </motion.button>
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
          onClick={() => navigate('/timelines')}
          style={{ cursor: 'pointer' }}
        >
          <span className="portal-overline">Corriente de Amistad</span>
          <h2 className="portal-title">Círculos & Hermandad</h2>
          <p className="portal-desc">
            La raíz del barrio, los cómplices del colegio, alianzas de vida
            y los hermanos incondicionales que trascienden el tiempo.
          </p>
          <span className="portal-cta">
            Explorar en Timelines <ArrowRight size={14} style={{ display: 'inline', marginLeft: 4 }} />
          </span>
        </motion.div>

        <motion.div
          className="portal-card portal-card--lavender"
          whileHover={{ y: -4, boxShadow: '0 16px 40px -8px rgba(124,104,184,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={() => navigate('/timelines')}
          style={{ cursor: 'pointer' }}
        >
          <span className="portal-overline">Corriente Afectiva</span>
          <h2 className="portal-title">Vínculos del Corazón</h2>
          <p className="portal-desc">
            Destellos de inocencia, conexiones profundas, citas inolvidables
            y los momentos compartidos con tu enamorada.
          </p>
          <span className="portal-cta">
            Explorar en Timelines <ArrowRight size={14} style={{ display: 'inline', marginLeft: 4 }} />
          </span>
        </motion.div>
      </section>

      {/* Sección de Memorias Recientes */}
      {stories.length > 0 ? (
        <section className="home-recent-section" style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', marginBottom: 16 }}>
            Últimas Memorias del Multiverso
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {stories.slice(0, 3).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate('/timelines')}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  padding: 20,
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className={`badge ${item.badgeClass || 'badge-sage'}`}>{item.category}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
                <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: 16, marginBottom: 6 }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.summary}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <section className="home-empty-state" style={{ marginTop: 32 }}>
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '40px 24px', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-xl)', border: '1px dashed #cbd5e1' }}>
            <Clock size={36} strokeWidth={1.4} style={{ color: '#94a3b8', marginBottom: 12 }} />
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.3rem', marginBottom: 6 }}>
              Tu línea temporal está esperando tus vivencias
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: 440, margin: '0 auto 16px' }}>
              No hay data inventada. Escribe tu primera memoria en el Diario y verás nacer aquí tus estadísticas y corrientes.
            </p>
            <button
              onClick={() => navigate('/notes')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <BookOpen size={15} />
              <span>Abrir Diario y Escribir</span>
            </button>
          </div>
        </section>
      )}

    </motion.div>
  )
}
