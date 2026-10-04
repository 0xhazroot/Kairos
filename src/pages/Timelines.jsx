import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Sparkles,
  GitMerge,
  Clock,
  Calendar,
  Users,
  Camera,
  ArrowUpDown,
  CalendarDays,
  Plus,
  Music,
  Disc,
  Search,
  X,
  Filter
} from 'lucide-react'
import { storyService } from '../services/storyService.js'
import ConvergenceViewer from '../components/ConvergenceViewer.jsx'
import './Timelines.css'

export default function Timelines() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all') // 'all' | 'friendship' | 'romance' | 'convergence'
  const [selectedPerson, setSelectedPerson] = useState('all')
  const [personSearch, setPersonSearch] = useState('')
  const [sortAscending, setSortAscending] = useState(true) // true: Pasado ➔ Presente

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

  // Lista única de participantes registrados en todas las historias
  const allPeople = Array.from(
    new Set(
      stories.flatMap((s) => s.participants || []).filter((p) => p && p.toLowerCase() !== 'yo')
    )
  )

  // Filtrado compuesto: por corriente, por persona seleccionada, y por búsqueda de texto
  const filteredStories = stories.filter((s) => {
    // Filtro por corriente
    if (selectedFilter === 'friendship' && s.stream !== 'friendship') return false
    if (selectedFilter === 'romance' && s.stream !== 'romance') return false

    // Filtro por persona seleccionada
    if (selectedPerson !== 'all') {
      const hasPerson = (s.participants || []).some(
        (p) => p.toLowerCase().trim() === selectedPerson.toLowerCase().trim()
      )
      if (!hasPerson) return false
    }

    // Filtro por búsqueda de persona o texto
    if (personSearch.trim()) {
      const q = personSearch.toLowerCase().trim()
      const matchPeople = (s.participants || []).some((p) => p.toLowerCase().includes(q))
      const matchTitle = (s.title || '').toLowerCase().includes(q)
      const matchSong = (s.songTitle || '').toLowerCase().includes(q)
      const matchCat = (s.category || '').toLowerCase().includes(q)
      if (!matchPeople && !matchTitle && !matchSong && !matchCat) return false
    }

    return true
  })

  // Orden cronológico estricto: pasado primero (ascendente) o reciente primero (descendente)
  const sortedStories = storyService.sortChronologically(filteredStories, sortAscending)

  // Agrupación por Época / Año
  const groupedByYear = sortedStories.reduce((acc, story) => {
    const year = storyService.getStoryYear(story)
    if (!acc[year]) acc[year] = []
    acc[year].push(story)
    return acc
  }, {})

  const yearKeys = Object.keys(groupedByYear)

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
            Tus vivencias ordenadas cronológicamente, fluyendo como corrientes que se bifurcan y convergen.
          </p>
        </div>

        <div className="tl-actions">
          {/* Alternar orden temporal */}
          <button
            className="tl-sort-toggle"
            onClick={() => setSortAscending(!sortAscending)}
            title="Cambiar dirección temporal"
          >
            <ArrowUpDown size={14} />
            <span>{sortAscending ? 'Pasado ➔ Presente' : 'Más recientes primero'}</span>
          </button>

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
          </div>

          <motion.button
            className="tl-btn-write"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/notes')}
          >
            <Plus size={16} />
            <span>Escribir Recuerdo</span>
          </motion.button>
        </div>
      </header>

      {/* BARRA DE FILTRADO POR PERSONA & BÚSQUEDA DIRECTA */}
      <div className="tl-people-filter-bar">
        <div className="tl-people-search-wrap">
          <Search size={14} className="tl-search-icon" />
          <input
            type="text"
            placeholder="Buscar por persona, canción, título..."
            value={personSearch}
            onChange={(e) => setPersonSearch(e.target.value)}
            className="tl-people-search-input"
          />
          {personSearch && (
            <button className="tl-search-clear" onClick={() => setPersonSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {allPeople.length > 0 && (
          <div className="tl-people-chips-scroll">
            <span className="tl-people-label">
              <Users size={13} />
              <span>Personas:</span>
            </span>

            <button
              className={`tl-person-chip-filter ${selectedPerson === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedPerson('all')}
            >
              Todos los Círculos
            </button>

            {allPeople.map((person) => (
              <button
                key={person}
                className={`tl-person-chip-filter ${selectedPerson === person ? 'is-active' : ''}`}
                onClick={() => setSelectedPerson(selectedPerson === person ? 'all' : person)}
              >
                {person}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Indicador de filtro activo si se seleccionó una persona */}
      {selectedPerson !== 'all' && (
        <div className="tl-active-filter-alert">
          <span>
            Mostrando únicamente recuerdos compartidos con: <strong>{selectedPerson}</strong> ({filteredStories.length})
          </span>
          <button className="tl-active-filter-close" onClick={() => setSelectedPerson('all')}>
            <X size={13} />
            <span>Ver todo el multiverso</span>
          </button>
        </div>
      )}

      {/* LIENZO MULTIVERSO */}
      {stories.length === 0 ? (
        /* ESTADO LIMPIO */
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
            <h2>Tu Línea Temporal está Lista</h2>
            <p>
              No hay memorias ficticias. A medida que vayas escribiendo recuerdos pasados y actuales en tu{' '}
              <strong>Diario</strong>, se ubicarán en su año correspondiente de forma ordenada y limpia.
            </p>
            <button className="btn-primary-multiverse" onClick={() => navigate('/notes')}>
              <Sparkles size={16} />
              <span>Escribir mi primer recuerdo</span>
            </button>
          </motion.div>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="tl-no-results-box">
          <Search size={36} className="text-muted" />
          <h3>No se encontraron recuerdos con estos filtros</h3>
          <p>Prueba buscando con otro nombre o limpia el filtro de persona.</p>
          <button
            className="tl-reset-filter-btn"
            onClick={() => {
              setSelectedPerson('all')
              setPersonSearch('')
              setSelectedFilter('all')
            }}
          >
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        /* VISTA DE LÍNEA MULTIVERSO CRONOLÓGICA Y AGRUPADA POR ÉPOCAS */
        <div className="tl-river-container">
          {/* Eje Troncal de la Corriente */}
          <div className="tl-river-spine">
            <div className="spine-track"></div>
          </div>

          <div className="tl-epochs-wrapper">
            {yearKeys.map((yearKey) => {
              const storiesInYear = groupedByYear[yearKey]

              return (
                <div key={yearKey} className="tl-epoch-block">
                  {/* Marcador de Época / Año */}
                  <div className="tl-epoch-divider">
                    <div className="tl-epoch-pill">
                      <CalendarDays size={13} />
                      <span>Época {yearKey}</span>
                      <span className="tl-epoch-count">({storiesInYear.length})</span>
                    </div>
                  </div>

                  {/* Historias dentro de esta época */}
                  <div className="tl-milestones-flow">
                    {storiesInYear.map((story, idx) => {
                      const isSelected = selectedStory?.id === story.id
                      const isConvergence = story.stream === 'convergence'
                      const isFriend = story.stream === 'friendship'

                      const alignment = isConvergence ? 'center' : idx % 2 === 0 ? 'left' : 'right'

                      const hasCover = Boolean(story.coverImage)
                      const isCoverGradient = story.coverImage?.startsWith('linear-gradient')
                      const photoCount = (story.images || []).length
                      const hasMusic = Boolean(story.songTitle)

                      return (
                        <motion.div
                          key={story.id}
                          className={`tl-milestone-row tl-milestone-row--${alignment}`}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          {/* Nodo conector en la espina central */}
                          <div
                            className={`tl-spine-node ${
                              isConvergence
                                ? 'tl-spine-node--convergence'
                                : isFriend
                                ? 'tl-spine-node--sage'
                                : 'tl-spine-node--lavender'
                            } ${isSelected ? 'is-active' : ''}`}
                            onClick={() => setSelectedStory(story)}
                            title="Seleccionar recuerdo"
                          >
                            {isConvergence ? (
                              <GitMerge size={16} />
                            ) : (
                              <span className="spine-node-dot"></span>
                            )}
                          </div>

                          {/* Tarjeta del Recuerdo */}
                          <motion.div
                            className={`tl-milestone-card ${
                              isConvergence
                                ? 'tl-milestone-card--convergence'
                                : isFriend
                                ? 'tl-milestone-card--sage'
                                : 'tl-milestone-card--lavender'
                            } ${isSelected ? 'is-selected' : ''}`}
                            whileHover={{ y: -3, scale: 1.015 }}
                            onClick={() => setSelectedStory(story)}
                          >
                            {/* Imagen de portada si existe */}
                            {hasCover && (
                              <div className="tl-card-cover-wrap">
                                {isCoverGradient ? (
                                  <div
                                    className="tl-card-cover-banner"
                                    style={{ background: story.coverImage }}
                                  />
                                ) : (
                                  <img
                                    src={story.coverImage}
                                    alt={story.title}
                                    className="tl-card-cover-banner tl-card-cover-banner--img"
                                  />
                                )}
                              </div>
                            )}

                            <div className="tl-card-inner">
                              <div className="card-top-row">
                                <div className="card-date-badge">
                                  <Calendar size={13} />
                                  <span>{story.date || 'Sin fecha'}</span>
                                </div>

                                <div className="card-top-tags">
                                  {story.category && (
                                    <span className="card-cat-badge">
                                      {story.icon || '🏷️'} {story.category}
                                    </span>
                                  )}
                                  <span className="card-stream-tag">
                                    {isConvergence
                                      ? '✦ Cruce'
                                      : isFriend
                                      ? 'Amistad'
                                      : 'Vínculos'}
                                  </span>
                                </div>
                              </div>

                              <h3 className="card-milestone-title">{story.title || 'Sin título'}</h3>

                              <p className="card-milestone-snippet">
                                {story.summary || story.story?.slice(0, 115) + (story.story?.length > 115 ? '...' : '') || 'Sin relato redactado aún...'}
                              </p>

                              {/* Canción Ancla / Música si la tiene */}
                              {hasMusic && (
                                <div className="card-music-pill">
                                  <Disc size={12} className="card-music-icon" />
                                  <span className="card-music-title">{story.songTitle}</span>
                                  {story.songArtist && (
                                    <span className="card-music-artist">• {story.songArtist}</span>
                                  )}
                                </div>
                              )}

                              {/* Footer con Participantes y Fotos */}
                              <div className="card-footer-meta">
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

                                {photoCount > 0 && (
                                  <div className="card-photo-indicator" title={`${photoCount} foto(s) guardadas`}>
                                    <Camera size={12} />
                                    <span>{photoCount}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
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
