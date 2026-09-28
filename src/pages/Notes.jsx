import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Calendar,
  Users,
  Tag,
  Trash2,
  Clock,
  Sparkles,
  GitMerge,
  ArrowRight,
  Check,
  BookOpen
} from 'lucide-react'
import { storyService } from '../services/storyService.js'
import { auditService } from '../services/auditService.js'
import PeopleSelector from '../components/PeopleSelector.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import Toast from '../components/Toast.jsx'
import './Notes.css'

const EMOJI_LIST = ['📝', '✨', '☕', '🌿', '💌', '🔥', '⚽', '🎬', '🚀', '❤️', '🫂', '🌙', '🍕', '🎉']

export default function Notes() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving' | 'saved'
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [newTagInput, setNewTagInput] = useState('')
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    const list = await storyService.getAll()
    setStories(list)
    if (list.length > 0 && !selectedId) {
      setSelectedId(list[0].id)
    }
  }

  const selectedNote = stories.find((s) => s.id === selectedId) || stories[0]

  const handleCreateNote = async () => {
    const fresh = {
      title: 'Recuerdo sin título',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      epoch: '2025-2026',
      icon: '📝',
      category: 'Memoria',
      badgeClass: 'badge-sage',
      participants: ['Yo'],
      tags: ['Diario'],
      summary: '',
      story: ''
    }
    const created = await storyService.create(fresh)
    await auditService.log('STORY_CREATE', `Se creó la nota: "${created.title}"`, 'create')
    const list = await storyService.getAll()
    setStories(list)
    setSelectedId(created.id)
    showToast('Nueva nota creada', 'Tu recuerdo está listo para redactar')
  }

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleUpdate = async (field, value) => {
    if (!selectedNote) return
    setSaveStatus('saving')
    const updated = await storyService.update(selectedNote.id, { [field]: value })
    setStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setTimeout(() => setSaveStatus('saved'), 400)
  }

  const handleDelete = (note) => {
    setNoteToDelete(note)
  }

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return
    const id = noteToDelete.id
    const title = noteToDelete.title || 'Recuerdo'
    const updated = await storyService.remove(id)
    await auditService.log('STORY_DELETE', `Se eliminó el recuerdo: "${title}"`, 'delete')
    setStories(updated)
    if (selectedId === id) {
      setSelectedId(updated[0]?.id || null)
    }
    setNoteToDelete(null)
    showToast('Recuerdo eliminado', `"${title}" fue removido de tu diario`, 'info')
  }

  const handleRemovePerson = (person) => {
    const filtered = (selectedNote.participants || []).filter((p) => p !== person)
    handleUpdate('participants', filtered)
  }

  // Agregar etiqueta
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault()
      const current = selectedNote.tags || []
      if (!current.includes(newTagInput.trim())) {
        handleUpdate('tags', [...current, newTagInput.trim()])
      }
      setNewTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    const filtered = (selectedNote.tags || []).filter((t) => t !== tag)
    handleUpdate('tags', filtered)
  }

  // Coincidencias detectadas automáticamente en segundo plano ("por detrás")
  const autoConvergences = selectedNote
    ? storyService.findConvergences(selectedNote, stories)
    : []

  const isCrossMemoryInternal =
    selectedNote &&
    ((selectedNote.stream === 'convergence') ||
      (selectedNote.participants || []).some(p => p.toLowerCase().includes('amig')) &&
      (selectedNote.participants || []).some(p => p.toLowerCase().includes('novia') || p.toLowerCase().includes('enamorad')))

  const filteredNotes = stories.filter((s) =>
    (s.title + ' ' + (s.story || '') + ' ' + (s.participants || []).join(' ')).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="notion-workspace">
      {/* Barra Lateral Izquierda: Lista de Notas */}
      <aside className="notion-sidebar">
        <div className="ns-header">
          <div className="ns-title-row">
            <div className="ns-title">
              <BookOpen size={17} />
              <span>Diario de Recuerdos</span>
            </div>
            <button className="ns-add-btn" onClick={handleCreateNote} title="Nueva nota">
              <Plus size={16} />
            </button>
          </div>

          <div className="ns-search-box">
            <Search size={14} className="ns-search-icon" />
            <input
              type="text"
              placeholder="Buscar recuerdos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ns-search-input"
            />
          </div>
        </div>

        <div className="ns-list">
          {filteredNotes.length === 0 ? (
            <div className="ns-empty">No hay notas que coincidan</div>
          ) : (
            filteredNotes.map((note) => {
              const isActive = note.id === selectedId
              const isConvergence = note.stream === 'convergence'
              return (
                <div
                  key={note.id}
                  className={`ns-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setSelectedId(note.id)}
                >
                  <span className="ns-item-icon">{note.icon || '📝'}</span>
                  <div className="ns-item-info">
                    <span className="ns-item-title">{note.title || 'Sin título'}</span>
                    <span className="ns-item-date">{note.date || 'Sin fecha'}</span>
                  </div>
                  {isConvergence && (
                    <span className="ns-convergence-dot" title="Cruce de historias">
                      <GitMerge size={12} />
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </aside>

      {/* Editor Central: Lienzo Estilo Notion */}
      <main className="notion-editor">
        {selectedNote ? (
          <div className="notion-doc">
            {/* Barra superior de estado */}
            <div className="notion-doc-topbar">
              <div className="doc-status-indicator">
                <Check size={13} className="text-muted" />
                <span>{saveStatus === 'saving' ? 'Guardando en segundo plano...' : 'Guardado en tu equipo'}</span>
              </div>
              <div className="doc-top-actions">
                <button
                  className="btn-text-action"
                  onClick={() => navigate('/timelines')}
                  title="Ver en la línea del multiverso"
                >
                  <Clock size={14} />
                  <span>Ver en Línea Temporal</span>
                </button>
                <button
                  className="btn-icon-danger"
                  onClick={() => handleDelete(selectedNote)}
                  title="Eliminar memoria"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Ícono de la página (Emoji picker) */}
            <div className="notion-icon-wrap">
              <button
                className="notion-page-icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Cambiar emoji"
              >
                {selectedNote.icon || '📝'}
              </button>

              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    className="emoji-popover"
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  >
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        className="emoji-btn"
                        onClick={() => {
                          handleUpdate('icon', emoji)
                          setShowEmojiPicker(false)
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Título Estilo Notion (H1 editable limpio) */}
            <input
              type="text"
              className="notion-title-input"
              placeholder="Sin título..."
              value={selectedNote.title || ''}
              onChange={(e) => handleUpdate('title', e.target.value)}
            />

            {/* Tabla de Propiedades Estilo Notion */}
            <div className="notion-properties">
              {/* Fecha */}
              <div className="notion-prop-row">
                <div className="notion-prop-label">
                  <Calendar size={14} />
                  <span>Fecha</span>
                </div>
                <div className="notion-prop-value">
                  <input
                    type="text"
                    className="notion-inline-input"
                    placeholder="Ej. Ayer, 27 de Septiembre 2026..."
                    value={selectedNote.date || ''}
                    onChange={(e) => handleUpdate('date', e.target.value)}
                  />
                </div>
              </div>

              {/* Etiquetas */}
              <div className="notion-prop-row">
                <div className="notion-prop-label">
                  <Tag size={14} />
                  <span>Etiquetas</span>
                </div>
                <div className="notion-prop-value flex-chips">
                  {(selectedNote.tags || []).map((tag) => (
                    <span key={tag} className="notion-chip notion-chip--tag">
                      #{tag}
                      <button
                        className="chip-remove"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="+ Etiqueta (Enter)..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="notion-chip-input"
                  />
                </div>
              </div>
            </div>

            {/* MÓDULO DAY ONE: ¿Quiénes están involucrados? */}
            <PeopleSelector
              selectedNames={selectedNote.participants || []}
              onChange={(newNames) => handleUpdate('participants', newNames)}
            />

            <div className="notion-divider"></div>

            {/* Cuerpo del Documento (Área de redacción limpia) */}
            <div className="notion-body-area">
              <textarea
                className="notion-textarea"
                placeholder="Escribe aquí tu recuerdo con total libertad... ¿Qué pasó? ¿Quién dijo qué? ¿Cómo fue el ambiente?..."
                value={selectedNote.story || ''}
                onChange={(e) => {
                  handleUpdate('story', e.target.value)
                  if (!selectedNote.summary) {
                    handleUpdate('summary', e.target.value.slice(0, 95))
                  }
                }}
                rows={12}
              />
            </div>

            {/* MAGIA EN SEGUNDO PLANO ("POR DETRÁS"): Callout automático si se detecta cruce */}
            {(isCrossMemoryInternal || autoConvergences.length > 0) && (
              <motion.div
                className="notion-callout-convergence"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="callout-icon-col">
                  <div className="callout-sparkle-badge">
                    <GitMerge size={18} />
                  </div>
                </div>

                <div className="callout-content-col">
                  <div className="callout-header">
                    <h4>Cruce Temporal Detectado en Segundo Plano</h4>
                    <span className="callout-badge">Conexión Multiverso</span>
                  </div>

                  <p className="callout-desc">
                    {isCrossMemoryInternal ? (
                      <>
                        Detectamos automáticamente que en este momento conviven personas clave:{' '}
                        <strong>{(selectedNote.participants || []).join(', ')}</strong>.
                        Al coincidir tu círculo de <strong>Amistad</strong> (como <em>Chupete</em>) y tu círculo de{' '}
                        <strong>Pareja</strong> (<em>tu enamorada</em>), este recuerdo se convierte en un punto de confluencia donde dos realidades se entrelazan.
                      </>
                    ) : (
                      <>
                        Este recuerdo coincide en fecha o personas con otras historias de tu diario:{' '}
                        <strong>{autoConvergences.map(c => c.story.title).join(', ')}</strong>.
                      </>
                    )}
                  </p>

                  <button
                    className="callout-cta-btn"
                    onClick={() => navigate('/timelines')}
                  >
                    <span>Ver entrelazado en Líneas Temporales</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="notion-empty-state">
            <BookOpen size={48} strokeWidth={1.2} className="text-faint" />
            <h3>No tienes recuerdos seleccionados</h3>
            <p>Crea una nueva nota para empezar a escribir tu historia.</p>
            <button className="btn-primary-clean" onClick={handleCreateNote}>
              <Plus size={15} />
              <span>Nueva Nota</span>
            </button>
          </div>
        )}
      </main>

      {/* Modal de Confirmación Estilo Kairós (Reemplaza confirm nativo) */}
      <ConfirmModal
        isOpen={Boolean(noteToDelete)}
        title="¿Eliminar este recuerdo?"
        message={noteToDelete ? `¿Estás seguro de que deseas eliminar "${noteToDelete.title || 'esta memoria'}"? Se borrará de tu diario y tu línea temporal.` : ''}
        confirmText="Sí, eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setNoteToDelete(null)}
      />

      {/* Notificación Toast Flotante */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
