import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users,
  Heart,
  GitMerge,
  ArrowRight,
  Quote,
  Camera,
  Maximize2,
  Disc,
  ExternalLink,
  BookOpen,
  Edit3
} from 'lucide-react'
import './ConvergenceViewer.css'

export default function ConvergenceViewer({ story, onClose }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('unified')
  const [zoomImg, setZoomImg] = useState(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!story) return null

  const isConvergence = story.stream === 'convergence' || (story.friendshipPerspective && story.romancePerspective)
  const isCoverGradient = story.coverImage?.startsWith('linear-gradient')

  const handleGoToEdit = () => {
    navigate('/notes')
  }

  // Si está minimizado, mostrar una barra flotante compacta y elegante sin bloquear
  if (isCollapsed) {
    return (
      <motion.div
        className="cv-collapsed-bar"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.25 }}
      >
        <div className="cv-collapsed-info" onClick={() => setIsCollapsed(false)}>
          <span className="cv-collapsed-badge">
            <Sparkles size={13} />
            <span>Memoria:</span>
          </span>
          <span className="cv-collapsed-title">{story.title}</span>
          <span className="cv-collapsed-date">• {story.date}</span>
        </div>

        <div className="cv-collapsed-actions">
          <button className="cv-collapsed-edit-btn" onClick={handleGoToEdit} title="Editar este recuerdo en el Diario">
            <Edit3 size={14} />
            <span>Editar en Diario</span>
          </button>

          <button
            className="cv-collapsed-expand-btn"
            onClick={() => setIsCollapsed(false)}
            title="Desplegar detalle completo"
          >
            <span>Desplegar</span>
            <ChevronUp size={16} />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="cv-container"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="cv-card">
          {/* Portada Superior si existe */}
          {story.coverImage && (
            <div className="cv-cover-wrapper">
              {isCoverGradient ? (
                <div className="cv-cover-banner" style={{ background: story.coverImage }} />
              ) : (
                <img src={story.coverImage} alt="Portada" className="cv-cover-banner cv-cover-banner--img" />
              )}
            </div>
          )}

          {/* Barra superior / Indicador de Fusión y Controles Desplegables */}
          <div className="cv-top-bar">
            <div className="cv-convergence-badge-wrap">
              <span className="cv-pulse-dot cv-pulse-dot--sage"></span>
              <span className="cv-beam-line"></span>
              <div className="cv-core-icon">
                <GitMerge size={16} />
              </div>
              <span className="cv-beam-line"></span>
              <span className="cv-pulse-dot cv-pulse-dot--lavender"></span>
              <span className="cv-stream-label">
                {isConvergence ? 'Cruce de Realidades: Amistad × Pareja' : 'Memoria Temporal'}
              </span>
            </div>

            <div className="cv-top-actions">
              <button className="cv-action-edit-btn" onClick={handleGoToEdit} title="Abrir y editar en el diario">
                <BookOpen size={14} />
                <span>Editar en Diario</span>
              </button>

              <button
                className="cv-collapse-btn"
                onClick={() => setIsCollapsed(true)}
                title="Minimizar panel a la barra inferior"
              >
                <ChevronDown size={17} />
                <span>Minimizar</span>
              </button>
            </div>
          </div>

          {/* Header de la memoria */}
          <div className="cv-header">
            <div>
              <div className="cv-meta-row">
                <span className="cv-date">{story.date}</span>
                <span className="cv-epoch-tag">{story.epoch || '2026'}</span>
                <span className="cv-category-pill">{story.category || 'Memoria'}</span>
              </div>
              <h2 className="cv-title">{story.title}</h2>
            </div>

            {/* Participantes presentes */}
            {story.participants && story.participants.length > 0 && (
              <div className="cv-participants">
                <span className="cv-part-label">Presentes en este momento:</span>
                <div className="cv-part-chips">
                  {story.participants.map((person, idx) => (
                    <span
                      key={idx}
                      className={`part-chip ${
                        (person.toLowerCase().includes('amig') || person.toLowerCase().includes('chupete') || person.toLowerCase().includes('pata') || person.toLowerCase().includes('brother')) &&
                        !person.toLowerCase().includes('novia') &&
                        !person.toLowerCase().includes('enamorad')
                          ? 'part-chip--sage'
                          : person.toLowerCase().includes('enamorad') || person.toLowerCase().includes('novia') || person.toLowerCase().includes('casi algo')
                          ? 'part-chip--lavender'
                          : 'part-chip--neutral'
                      }`}
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Canción Ancla / Banda Sonora */}
            {story.songTitle && (
              <div className="cv-music-row">
                <Disc size={15} className="cv-music-disc" />
                <span className="cv-music-label">Canción del Momento:</span>
                <span className="cv-music-title">{story.songTitle}</span>
                {story.songArtist && <span className="cv-music-artist">• {story.songArtist}</span>}
                {story.songUrl && (
                  <a
                    href={story.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-music-link"
                    title="Escuchar"
                  >
                    <ExternalLink size={13} />
                    <span>Reproducir</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Galería de Fotos Asociadas */}
          {story.images && story.images.length > 0 && (
            <div className="cv-gallery-section">
              <span className="cv-gallery-label">
                <Camera size={14} /> Recuerdos visuales de esta vivencia:
              </span>
              <div className="cv-gallery-grid">
                {story.images.map((imgUrl, i) => (
                  <div key={i} className="cv-photo-card" onClick={() => setZoomImg(imgUrl)}>
                    <img src={imgUrl} alt={`Foto ${i + 1}`} className="cv-photo-thumb" />
                    <div className="cv-photo-hover">
                      <Maximize2 size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navegación de Perspectivas (Tabs) si es convergencia */}
          {isConvergence && (
            <div className="cv-tabs">
              <button
                className={`cv-tab ${activeTab === 'unified' ? 'active' : ''}`}
                onClick={() => setActiveTab('unified')}
              >
                <Sparkles size={15} /> Vivencia Unificada
              </button>
              <button
                className={`cv-tab cv-tab--sage ${activeTab === 'friendship' ? 'active' : ''}`}
                onClick={() => setActiveTab('friendship')}
              >
                <Users size={15} /> Perspectiva Amistad
              </button>
              <button
                className={`cv-tab cv-tab--lavender ${activeTab === 'romance' ? 'active' : ''}`}
                onClick={() => setActiveTab('romance')}
              >
                <Heart size={15} /> Perspectiva Vínculo
              </button>
            </div>
          )}

          {/* Contenido Narrativo */}
          <div className="cv-body">
            <AnimatePresence mode="wait">
              {activeTab === 'unified' && (
                <motion.div
                  key="unified"
                  className="cv-narrative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="cv-narrative-p">{story.story || story.summary || 'Sin narrativa redactada.'}</p>
                </motion.div>
              )}

              {activeTab === 'friendship' && (
                <motion.div
                  key="friendship"
                  className="cv-perspective-view cv-perspective-view--sage"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="perspective-badge-inline sage">
                    <Users size={14} /> Corriente de Hermandad & Código de Amigos
                  </div>
                  <p className="cv-narrative-p">
                    {story.friendshipPerspective ||
                      'La presencia de tu amigo aportó la soltura y la naturalidad de años de hermandad compartida.'}
                  </p>
                </motion.div>
              )}

              {activeTab === 'romance' && (
                <motion.div
                  key="romance"
                  className="cv-perspective-view cv-perspective-view--lavender"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="perspective-badge-inline lavender">
                    <Heart size={14} /> Corriente Afectiva & Miradas de Complicidad
                  </div>
                  <p className="cv-narrative-p">
                    {story.romancePerspective ||
                      'La cercanía con tu enamorada y la tranquilidad de verla feliz compartiendo con sus personas queridas.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modal de Zoom para fotos en visor */}
        <AnimatePresence>
          {zoomImg && (
            <motion.div
              className="cv-zoom-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomImg(null)}
            >
              <div className="cv-zoom-modal" onClick={(e) => e.stopPropagation()}>
                <button className="cv-zoom-close" onClick={() => setZoomImg(null)}>
                  <ChevronDown size={20} />
                </button>
                <img src={zoomImg} alt="Foto ampliada" className="cv-zoom-img" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
