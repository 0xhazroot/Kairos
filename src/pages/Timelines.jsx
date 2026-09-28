import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Sparkles, GitMerge, Clock, ArrowRight, Calendar, Users } from 'lucide-react'
import { storyService } from '../services/storyService.js'
import ConvergenceViewer from '../components/ConvergenceViewer.jsx'
import './Timelines.css'

export default function Timelines() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all') // 'all' | 'friendship' | 'romance' | 'convergence'

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    const list = await storyService.getAll()
    setStories(list)
    if (list.length > 0) {
      setSelectedStory(list[0])
    }
  }

  const filteredStories = stories.filter((s) => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'convergence') return s.stream === 'convergence'
    return s.stream === selectedFilter
  })

  const isCurrentConvergence =
    selectedStory &&
    (selectedStory.stream === 'convergence' ||
      (selectedStory.friendshipPerspective && selectedStory.romancePerspective))

  return (
    <motion.div
      className="timelines-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <header className="tl-header">
        <div>
          <h1 className="tl-title">Línea Temporal & Ramificaciones</h1>
          <p className="tl-subtitle">
            Tus vivencias fluyendo como corrientes que se bifurcan, convergen y trascienden.
          </p>
        </div>

        <div className="tl-actions">
          {/* Filtros de corrientes */}
          <div className="tl-filter-group">
            <button
              className={`tl-filter-pill ${selectedFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              Todas ({stories.length})
            </button>
            <button
              className={`tl-filter-pill tl-filter-pill--sage ${selectedFilter === 'friendship' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('friendship')}
            >
              <span className="dot dot--sage"></span> Amistad
            </button>
            <button
              className={`tl-filter-pill tl-filter-pill--lavender ${selectedFilter === 'romance' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('romance')}
            >
              <span className="dot dot--lavender"></span> Vínculos
            </button>
            <button
              className={`tl-filter-pill tl-filter-pill--convergence ${selectedFilter === 'convergence' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('convergence')}
            >
              <span className="dot dot--convergence"></span> Cruces
            </button>
          </div>

          <motion.button
            className="tl-btn-write"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/notes')}
          >
            <BookOpen size={16} />
            <span>Abrir Diario</span>
          </motion.button>
        </div>
      </header>

      {/* LIENZO MULTIVERSO: Se adapta perfectamente si hay o no datos */}
      {stories.length === 0 ? (
        /* ESTADO LIMPIO (Cero data inventada) */
        <div className="tl-empty-multiverse">
          <svg className="tl-empty-svg" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="emptySage" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4D926A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#99DCB5" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="emptyLav" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6F5BA7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#E5A690" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Corrientes cósmicas en reposo (proporcionales y simétricas) */}
            <motion.path
              d="M 50,150 C 250,120 400,100 500,200 C 600,300 750,280 950,250"
              stroke="url(#emptySage)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="6,8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 50,250 C 250,280 400,300 500,200 C 600,100 750,120 950,150"
              stroke="url(#emptyLav)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="6,8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
            />

            {/* Núcleo Central de Encuentro */}
            <circle cx="500" cy="200" r="14" fill="#ffffff" stroke="#6F5BA7" strokeWidth="4" />
          </svg>

          <motion.div
            className="tl-empty-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="empty-core-icon">
              <Clock size={32} strokeWidth={1.5} />
            </div>
            <h2>Tu Línea Temporal está en Blanco</h2>
            <p>
              No hay datos ficticios ni memorias inventadas. Todo lo que redactes en tu{' '}
              <strong>Diario</strong> se dibujará aquí automáticamente, formando tus ramificaciones de
              Amistad y Vínculos.
            </p>
            <button className="btn-primary-multiverse" onClick={() => navigate('/notes')}>
              <Sparkles size={16} />
              <span>Escribir mi primer recuerdo</span>
            </button>
          </motion.div>
        </div>
      ) : (
        /* VISTA DE LÍNEA MULTIVERSO DINÁMICA (Estructurada y perfectamente alineada) */
        <div className="tl-river-container">
          {/* Eje Troncal de la Corriente */}
          <div className="tl-river-spine">
            <div className="spine-track"></div>
          </div>

          <div className="tl-milestones-flow">
            {filteredStories.map((story, index) => {
              const isSelected = selectedStory?.id === story.id
              const isConvergence = story.stream === 'convergence'
              const isFriend = story.stream === 'friendship'
              const isRomance = story.stream === 'romance'

              // Alternar lado izquierdo/derecho o centro si es convergencia
              const alignment = isConvergence ? 'center' : isFriend ? 'left' : 'right'

              return (
                <motion.div
                  key={story.id}
                  className={`tl-milestone-row tl-milestone-row--${alignment}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  {/* Nodo conector en la espina central */}
                  <div
                    className={`tl-spine-node ${isConvergence ? 'tl-spine-node--convergence' : isFriend ? 'tl-spine-node--sage' : 'tl-spine-node--lavender'} ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setSelectedStory(story)}
                  >
                    {isConvergence ? (
                      <GitMerge size={16} />
                    ) : (
                      <span className="spine-node-dot"></span>
                    )}
                  </div>

                  {/* Tarjeta del Recuerdo (Geométricamente amarrada a su nodo) */}
                  <motion.div
                    className={`tl-milestone-card ${isConvergence ? 'tl-milestone-card--convergence' : isFriend ? 'tl-milestone-card--sage' : 'tl-milestone-card--lavender'} ${isSelected ? 'is-selected' : ''}`}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => setSelectedStory(story)}
                  >
                    <div className="card-top-row">
                      <div className="card-date-badge">
                        <Calendar size={13} />
                        <span>{story.date || 'Sin fecha'}</span>
                      </div>
                      <span className="card-stream-tag">
                        {isConvergence
                          ? '✦ Cruce Multiverso'
                          : isFriend
                          ? 'Amistad'
                          : 'Vínculos'}
                      </span>
                    </div>

                    <h3 className="card-milestone-title">{story.title}</h3>
                    <p className="card-milestone-snippet">{story.summary || story.story?.slice(0, 110) + '...'}</p>

                    {/* Personas Involucradas */}
                    {story.participants && story.participants.length > 0 && (
                      <div className="card-people-row">
                        <Users size={12} className="text-muted" />
                        <div className="card-people-chips">
                          {story.participants.slice(0, 3).map((p, i) => (
                            <span key={i} className="card-person-chip">
                              {p}
                            </span>
                          ))}
                          {story.participants.length > 3 && (
                            <span className="card-person-chip-more">
                              +{story.participants.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Visor Inferior de la Historia / Cruce */}
      <AnimatePresence>
        {selectedStory && (
          <ConvergenceViewer
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
