import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Users, Heart, GitMerge, ArrowRight, Quote, Camera, Maximize2 } from 'lucide-react'
import './ConvergenceViewer.css'

export default function ConvergenceViewer({ story, onClose }) {
  const [activeTab, setActiveTab] = useState('unified')
  const [zoomImg, setZoomImg] = useState(null)

  if (!story) return null

  const isConvergence = story.stream === 'convergence' || (story.friendshipPerspective && story.romancePerspective)
  const isCoverGradient = story.coverImage?.startsWith('linear-gradient')

  return (
    <AnimatePresence>
      <motion.div
        className="cv-container"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

          {/* Barra superior / Indicador de Fusión de Hilos */}
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

            <button className="cv-close-btn" onClick={onClose} aria-label="Cerrar visor">
              <X size={18} />
            </button>
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
          </div>

          {/* Galería de Fotografías si contiene fotos adjuntas */}
          {story.images && story.images.length > 0 && (
            <div className="cv-gallery-row">
              <div className="cv-gallery-label">
                <Camera size={14} />
                <span>Fotografías guardadas ({story.images.length}):</span>
              </div>
              <div className="cv-gallery-grid">
                {story.images.map((img, i) => (
                  <div key={i} className="cv-gallery-thumb" onClick={() => setZoomImg(img)}>
                    <img src={img} alt={`Foto ${i + 1}`} />
                    <div className="cv-thumb-hover">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selector de pestañas interactivas si es convergencia */}
          {isConvergence && (
            <div className="cv-tabs">
              <button
                className={`cv-tab ${activeTab === 'unified' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('unified')}
              >
                <Sparkles size={14} />
                <span>Relato Completo</span>
              </button>
              <button
                className={`cv-tab cv-tab--friendship ${activeTab === 'friendship' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('friendship')}
              >
                <Users size={14} />
                <span>Perspectiva Amistad</span>
              </button>
              <button
                className={`cv-tab cv-tab--romance ${activeTab === 'romance' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('romance')}
              >
                <Heart size={14} />
                <span>Perspectiva Vínculos</span>
              </button>
            </div>
          )}

          {/* Cuerpo dinámico con animación fluida */}
          <div className="cv-body">
            <AnimatePresence mode="wait">
              {activeTab === 'unified' && (
                <motion.div
                  key="unified"
                  className="cv-narrative-view"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="cv-lead-text">{story.story || 'Sin texto registrado en esta memoria.'}</p>

                  {/* Caja de resonancia compartida si es cruce */}
                  {isConvergence && (
                    <div className="cv-synthesis-box">
                      <div className="cv-synthesis-header">
                        <Quote size={16} />
                        <span>Cómo se entrelazaron las historias</span>
                      </div>
                      <div className="cv-synthesis-grid">
                        <div className="synth-col synth-col--sage">
                          <span className="synth-role">Línea de Amistad</span>
                          <p>{story.friendshipPerspective || 'Complicidad, risas y códigos de hermandad compartida.'}</p>
                        </div>
                        <div className="synth-connector">
                          <ArrowRight size={16} />
                        </div>
                        <div className="synth-col synth-col--lavender">
                          <span className="synth-role">Línea de Pareja / Vínculos</span>
                          <p>{story.romancePerspective || 'Cercanía emocional, cariño y conexión íntima.'}</p>
                        </div>
                      </div>
                    </div>
                  )}
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
                  <X size={20} />
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
