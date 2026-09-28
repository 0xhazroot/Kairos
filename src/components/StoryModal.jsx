import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Users, Heart, Users2, Calendar, Bookmark, Send } from 'lucide-react'
import './StoryModal.css'

export default function StoryModal({ isOpen, onClose, onSave }) {
  const [stream, setStream] = useState('convergence') // 'friendship' | 'romance' | 'convergence'
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('Ayer')
  const [epoch, setEpoch] = useState('2025-2026')
  const [category, setCategory] = useState('Cruce Multiverso')
  const [participantsText, setParticipantsText] = useState('Mi Amigo, Mi Enamorada, Amiga de mi Novia, Yo')
  const [summary, setSummary] = useState('')
  const [story, setStory] = useState('')
  const [friendshipPerspective, setFriendshipPerspective] = useState('')
  const [romancePerspective, setRomancePerspective] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !story.trim()) return

    setIsSubmitting(true)
    const participants = participantsText
      .split(',')
      .map(p => p.trim())
      .filter(Boolean)

    const badgeClass =
      stream === 'convergence'
        ? 'badge-convergence'
        : stream === 'friendship'
        ? 'badge-sage'
        : 'badge-lavender'

    // Generar coordenadas orgánicas para situarlo en el canvas
    const coords =
      stream === 'convergence'
        ? { x: 74, y: 34 }
        : stream === 'friendship'
        ? { x: 50 + Math.random() * 30, y: 15 + Math.random() * 20 }
        : { x: 50 + Math.random() * 30, y: 55 + Math.random() * 20 }

    const newMemory = {
      title,
      date,
      epoch,
      stream,
      category: category || (stream === 'convergence' ? 'Cruce Multiverso' : 'Memoria'),
      badgeClass,
      participants,
      summary: summary || story.slice(0, 95) + '...',
      story,
      friendshipPerspective: stream === 'convergence' ? friendshipPerspective : '',
      romancePerspective: stream === 'convergence' ? romancePerspective : '',
      coords
    }

    await onSave(newMemory)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          className="story-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="sm-header">
            <div className="sm-title-group">
              <span className="sm-badge">
                <Sparkles size={13} />
                Nuevo Registro Temporal
              </span>
              <h2>Escribir en el Multiverso</h2>
            </div>
            <button className="sm-close-btn" onClick={onClose} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="sm-form">
            {/* Selector de Corriente */}
            <div className="sm-stream-selector">
              <label className="sm-field-label">Corriente de la historia</label>
              <div className="sm-stream-options">
                <button
                  type="button"
                  className={`stream-pill stream-pill--convergence ${stream === 'convergence' ? 'is-active' : ''}`}
                  onClick={() => {
                    setStream('convergence')
                    setCategory('Cruce Multiverso')
                  }}
                >
                  <Sparkles size={15} />
                  <span>Cruce de Realidades (2 pa 2 / Convergencia)</span>
                </button>
                <button
                  type="button"
                  className={`stream-pill stream-pill--friendship ${stream === 'friendship' ? 'is-active' : ''}`}
                  onClick={() => {
                    setStream('friendship')
                    setCategory('Amistad')
                  }}
                >
                  <Users size={15} />
                  <span>Amistad</span>
                </button>
                <button
                  type="button"
                  className={`stream-pill stream-pill--romance ${stream === 'romance' ? 'is-active' : ''}`}
                  onClick={() => {
                    setStream('romance')
                    setCategory('Vínculos')
                  }}
                >
                  <Heart size={15} />
                  <span>Vínculos / Pareja</span>
                </button>
              </div>
            </div>

            {/* Fila: Título y Categoría */}
            <div className="sm-grid-2">
              <div className="sm-field">
                <label className="sm-field-label">Título del Momento</label>
                <input
                  type="text"
                  placeholder="Ej. Salida 2 pa 2 con mi enamorada y mi amigo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="sm-input"
                />
              </div>
              <div className="sm-field">
                <label className="sm-field-label">
                  <Bookmark size={13} /> Etiqueta / Categoría
                </label>
                <input
                  type="text"
                  placeholder="Ej. Salida 2 pa 2, Barrio, Primera Cita..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="sm-input"
                />
              </div>
            </div>

            {/* Fila: Fecha y Participantes */}
            <div className="sm-grid-2">
              <div className="sm-field">
                <label className="sm-field-label">
                  <Calendar size={13} /> Fecha / Época
                </label>
                <div className="sm-date-row">
                  <input
                    type="text"
                    placeholder="Ej. Ayer, Mayo 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="sm-input"
                  />
                  <select
                    value={epoch}
                    onChange={(e) => setEpoch(e.target.value)}
                    className="sm-select"
                  >
                    <option value="2025-2026">2025-2026</option>
                    <option value="2022-2024">2022-2024</option>
                    <option value="2019-2021">2019-2021</option>
                    <option value="2016-2018">2016-2018</option>
                  </select>
                </div>
              </div>

              <div className="sm-field">
                <label className="sm-field-label">
                  <Users2 size={13} /> Participantes (separados por coma)
                </label>
                <input
                  type="text"
                  placeholder="Mi Amigo, Mi Enamorada, Su Amiga, Yo"
                  value={participantsText}
                  onChange={(e) => setParticipantsText(e.target.value)}
                  className="sm-input"
                />
              </div>
            </div>

            {/* Relato Principal */}
            <div className="sm-field">
              <label className="sm-field-label">
                Relato Principal de la Historia
              </label>
              <textarea
                placeholder="Cuenta lo que vivieron... los detalles, la atmósfera, cómo se dio la salida..."
                rows={4}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                required
                className="sm-textarea"
              />
            </div>

            {/* Si es Cruce de Realidades: Mostrar las Perspectivas Dobles */}
            {stream === 'convergence' && (
              <motion.div
                className="sm-convergence-perspectives"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="perspective-banner">
                  <Sparkles size={16} />
                  <span>
                    <strong>Cruce de Hilos Temporales:</strong> Registra cómo se sintió desde ambos ángulos.
                  </span>
                </div>

                <div className="sm-grid-2">
                  <div className="sm-field perspective-card perspective-card--friendship">
                    <label className="sm-field-label text-sage">
                      <Users size={14} /> Perspectiva: Amigo & Hermandad
                    </label>
                    <textarea
                      placeholder="¿Qué significó para la amistad? ¿Cómo viste a tu pata interactuar, bromear o romper el hielo?"
                      rows={3}
                      value={friendshipPerspective}
                      onChange={(e) => setFriendshipPerspective(e.target.value)}
                      className="sm-textarea sm-textarea--subtle"
                    />
                  </div>

                  <div className="sm-field perspective-card perspective-card--romance">
                    <label className="sm-field-label text-lavender">
                      <Heart size={14} /> Perspectiva: Pareja & Complicidad
                    </label>
                    <textarea
                      placeholder="¿Qué miradas hubo con tu novia? ¿Cómo se sintió presentarle tu gente o verla compartir con su amiga?"
                      rows={3}
                      value={romancePerspective}
                      onChange={(e) => setRomancePerspective(e.target.value)}
                      className="sm-textarea sm-textarea--subtle"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer de Acciones */}
            <div className="sm-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-gradient"
              >
                <Send size={15} />
                <span>{isSubmitting ? 'Materializando...' : 'Guardar en la Línea Temporal'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
