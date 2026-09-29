import { useState, useEffect, useRef } from 'react'
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
  BookOpen,
  Image as ImageIcon,
  Upload,
  Link2,
  X,
  Maximize2,
  CalendarDays,
  Camera
} from 'lucide-react'
import { storyService } from '../services/storyService.js'
import { auditService } from '../services/auditService.js'
import PeopleSelector from '../components/PeopleSelector.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import Toast from '../components/Toast.jsx'
import './Notes.css'

const EMOJI_LIST = ['📝', '✨', '☕', '🌿', '💌', '🔥', '⚽', '🎬', '🚀', '❤️', '🫂', '🌙', '🍕', '🎉', '📸', '🌅']

const COVER_GRADIENTS = [
  { name: 'Cosmos Púrpura', value: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)' },
  { name: 'Niebla Esmeralda', value: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' },
  { name: 'Atardecer Dorado', value: 'linear-gradient(135deg, #451a03 0%, #d97706 100%)' },
  { name: 'Rosa Terciopelo', value: 'linear-gradient(135deg, #4c0519 0%, #be123c 100%)' },
  { name: 'Amatista Mágica', value: 'linear-gradient(135deg, #2e1065 0%, #9333ea 100%)' },
  { name: 'Pizarra Profunda', value: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }
]

export default function Notes() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [saveStatus, setSaveStatus] = useState('saved')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showCoverMenu, setShowCoverMenu] = useState(false)
  const [coverUrlInput, setCoverUrlInput] = useState('')
  const [showUrlCoverInput, setShowUrlCoverInput] = useState(false)
  const [newTagInput, setNewTagInput] = useState('')
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [toast, setToast] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [showUrlGalleryInput, setShowUrlGalleryInput] = useState(false)
  const [galleryUrlInput, setGalleryUrlInput] = useState('')

  const coverFileRef = useRef(null)
  const galleryFileRef = useRef(null)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    const list = await storyService.getAll()
    // Ordenar de más reciente creación o fecha para la barra lateral
    const sorted = [...list].sort((a, b) => storyService.parseStoryDate(b) - storyService.parseStoryDate(a))
    setStories(sorted)
    if (sorted.length > 0 && !selectedId) {
      setSelectedId(sorted[0].id)
    }
  }

  const selectedNote = stories.find((s) => s.id === selectedId) || stories[0]

  const handleCreateNote = async () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const isoDate = `${yyyy}-${mm}-${dd}`

    const fresh = {
      title: 'Recuerdo sin título',
      eventDate: isoDate,
      date: today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      epoch: `${yyyy}`,
      icon: '📝',
      category: 'Memoria',
      badgeClass: 'badge-sage',
      participants: ['Yo'],
      tags: ['Diario'],
      coverImage: '',
      images: [],
      summary: '',
      story: ''
    }
    const created = await storyService.create(fresh)
    await auditService.log('STORY_CREATE', `Se creó la nota: "${created.title}"`, 'create')
    const list = await storyService.getAll()
    const sorted = [...list].sort((a, b) => storyService.parseStoryDate(b) - storyService.parseStoryDate(a))
    setStories(sorted)
    setSelectedId(created.id)
    showToast('Nueva nota creada', 'Tu recuerdo está listo para redactar y adjuntar fotos')
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
    setTimeout(() => setSaveStatus('saved'), 350)
  }

  const handleUpdateMultiple = async (patch) => {
    if (!selectedNote) return
    setSaveStatus('saving')
    const updated = await storyService.update(selectedNote.id, patch)
    setStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setTimeout(() => setSaveStatus('saved'), 350)
  }

  const handleDateChange = (isoValue) => {
    if (!isoValue) return
    const parts = isoValue.split('-')
    if (parts.length === 3) {
      const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      const formatted = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      handleUpdateMultiple({
        eventDate: isoValue,
        date: formatted,
        epoch: parts[0]
      })
    } else {
      handleUpdate('eventDate', isoValue)
    }
  }

  // --- Subida y Manejo de Portada (Cover) ---
  const handleCoverFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      handleUpdate('coverImage', dataUrl)
      setShowCoverMenu(false)
      showToast('Portada actualizada', 'Imagen de portada cargada desde tu equipo')
    }
    reader.readAsDataURL(file)
  }

  const handleSetCoverGradient = (gradientValue) => {
    handleUpdate('coverImage', gradientValue)
    setShowCoverMenu(false)
  }

  const handleSetCoverUrl = () => {
    if (coverUrlInput.trim()) {
      handleUpdate('coverImage', coverUrlInput.trim())
      setCoverUrlInput('')
      setShowUrlCoverInput(false)
      setShowCoverMenu(false)
      showToast('Portada actualizada', 'Imagen vinculada con éxito')
    }
  }

  const handleRemoveCover = () => {
    handleUpdate('coverImage', '')
    setShowCoverMenu(false)
  }

  // --- Subida y Manejo de Fotos en Galería ---
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const currentImages = selectedNote.images || []
    let processed = 0
    const newImages = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        newImages.push(event.target.result)
        processed++
        if (processed === files.length) {
          const combined = [...currentImages, ...newImages]
          handleUpdate('images', combined)
          showToast('Fotos agregadas', `Se han añadido ${files.length} foto(s) a este recuerdo`)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAddGalleryUrl = () => {
    if (galleryUrlInput.trim()) {
      const currentImages = selectedNote.images || []
      handleUpdate('images', [...currentImages, galleryUrlInput.trim()])
      setGalleryUrlInput('')
      setShowUrlGalleryInput(false)
      showToast('Foto agregada', 'Imagen vinculada a la galería')
    }
  }

  const handleRemoveGalleryImage = (indexToRemove) => {
    const currentImages = selectedNote.images || []
    const filtered = currentImages.filter((_, idx) => idx !== indexToRemove)
    handleUpdate('images', filtered)
    showToast('Foto removida', 'Se eliminó la imagen de la galería', 'info')
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
    const sorted = [...updated].sort((a, b) => storyService.parseStoryDate(b) - storyService.parseStoryDate(a))
    setStories(sorted)
    if (selectedId === id) {
      setSelectedId(sorted[0]?.id || null)
    }
    setNoteToDelete(null)
    showToast('Recuerdo eliminado', `"${title}" fue removido de tu diario`, 'info')
  }

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

  const autoConvergences = selectedNote
    ? storyService.findConvergences(selectedNote, stories)
    : []

  const isCrossMemoryInternal =
    selectedNote &&
    ((selectedNote.stream === 'convergence') ||
      ((selectedNote.participants || []).some(p => p.toLowerCase().includes('amig') || p.toLowerCase().includes('brother') || p.toLowerCase().includes('chupete')) &&
       (selectedNote.participants || []).some(p => p.toLowerCase().includes('novia') || p.toLowerCase().includes('enamorad') || p.toLowerCase().includes('casi algo'))))

  const filteredNotes = stories.filter((s) =>
    (s.title + ' ' + (s.story || '') + ' ' + (s.participants || []).join(' ')).toLowerCase().includes(search.toLowerCase())
  )

  const isCoverGradient = selectedNote?.coverImage?.startsWith('linear-gradient')

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
              const hasPhotos = (note.images && note.images.length > 0) || Boolean(note.coverImage)
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
                  <div className="ns-item-badges">
                    {hasPhotos && (
                      <span className="ns-photo-dot" title="Contiene fotos">
                        <Camera size={11} />
                      </span>
                    )}
                    {isConvergence && (
                      <span className="ns-convergence-dot" title="Cruce de historias">
                        <GitMerge size={12} />
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>

      {/* Editor Central: Lienzo Estilo Notion con Imágenes & Portada */}
      <main className="notion-editor">
        {selectedNote ? (
          <div className="notion-doc">
            {/* PORTADA SUPERIOR (Cover Banner) */}
            {selectedNote.coverImage ? (
              <div className="notion-cover-wrapper">
                {isCoverGradient ? (
                  <div
                    className="notion-cover-banner"
                    style={{ background: selectedNote.coverImage }}
                  />
                ) : (
                  <img
                    src={selectedNote.coverImage}
                    alt="Portada del recuerdo"
                    className="notion-cover-banner notion-cover-banner--img"
                  />
                )}

                <div className="notion-cover-actions">
                  <button
                    className="cover-action-btn"
                    onClick={() => setShowCoverMenu(!showCoverMenu)}
                  >
                    <ImageIcon size={13} />
                    <span>Cambiar Portada</span>
                  </button>
                  <button
                    className="cover-action-btn cover-action-btn--danger"
                    onClick={handleRemoveCover}
                  >
                    <X size={13} />
                    <span>Quitar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="notion-add-cover-bar">
                <button
                  className="btn-add-cover"
                  onClick={() => setShowCoverMenu(!showCoverMenu)}
                >
                  <ImageIcon size={14} />
                  <span>Añadir Portada</span>
                </button>
              </div>
            )}

            {/* MENÚ DE PORTADA (Dropdown / Popover) */}
            <AnimatePresence>
              {showCoverMenu && (
                <motion.div
                  className="cover-menu-popover"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                >
                  <div className="cover-menu-header">
                    <h4>Elegir Portada</h4>
                    <button
                      className="cover-menu-close"
                      onClick={() => setShowCoverMenu(false)}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="cover-menu-tabs">
                    <button
                      className="cover-tab-btn"
                      onClick={() => coverFileRef.current?.click()}
                    >
                      <Upload size={14} />
                      <span>Subir desde mi PC</span>
                    </button>
                    <input
                      type="file"
                      ref={coverFileRef}
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      hidden
                    />

                    <button
                      className="cover-tab-btn"
                      onClick={() => setShowUrlCoverInput(!showUrlCoverInput)}
                    >
                      <Link2 size={14} />
                      <span>Enlace Web</span>
                    </button>
                  </div>

                  {showUrlCoverInput && (
                    <div className="cover-url-form">
                      <input
                        type="url"
                        placeholder="Pega la URL de una imagen..."
                        value={coverUrlInput}
                        onChange={(e) => setCoverUrlInput(e.target.value)}
                        className="cover-url-input"
                      />
                      <button className="cover-url-submit" onClick={handleSetCoverUrl}>
                        Aplicar
                      </button>
                    </div>
                  )}

                  <div className="cover-presets-section">
                    <span className="cover-presets-title">Gradientes y Auras Estéticas:</span>
                    <div className="cover-presets-grid">
                      {COVER_GRADIENTS.map((grad, i) => (
                        <button
                          key={i}
                          className="cover-preset-btn"
                          style={{ background: grad.value }}
                          onClick={() => handleSetCoverGradient(grad.value)}
                          title={grad.name}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
              {/* Fecha Cronológica (Exacta para orden de multiverso) */}
              <div className="notion-prop-row">
                <div className="notion-prop-label">
                  <CalendarDays size={14} />
                  <span>Fecha Cronológica</span>
                </div>
                <div className="notion-prop-value flex-date-row">
                  <input
                    type="date"
                    className="notion-date-picker"
                    value={selectedNote.eventDate || ''}
                    onChange={(e) => handleDateChange(e.target.value)}
                    title="Selecciona la fecha exacta en que ocurrió este recuerdo"
                  />
                  <input
                    type="text"
                    className="notion-inline-input"
                    placeholder="Texto libre (ej. 14 de Mayo 2023, Ayer...)"
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

            {/* MÓDULO DAY ONE: Personas & Círculos Involucrados */}
            <PeopleSelector
              selectedNames={selectedNote.participants || []}
              onChange={(newNames) => handleUpdate('participants', newNames)}
            />

            {/* SUBSECCIÓN DE FOTOGRAFÍAS & MOMENTOS (Requerimiento del usuario) */}
            <div className="notion-gallery-section">
              <div className="gallery-header">
                <div className="gallery-title-wrap">
                  <Camera size={16} />
                  <span className="gallery-title">Fotografías & Momentos</span>
                  <span className="gallery-badge">
                    {(selectedNote.images || []).length} { (selectedNote.images || []).length === 1 ? 'foto' : 'fotos' }
                  </span>
                </div>

                <div className="gallery-actions">
                  <button
                    className="gallery-btn-action"
                    onClick={() => galleryFileRef.current?.click()}
                    title="Subir fotos desde tu computadora"
                  >
                    <Upload size={13} />
                    <span>Subir Foto(s)</span>
                  </button>
                  <input
                    type="file"
                    multiple
                    ref={galleryFileRef}
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    hidden
                  />

                  <button
                    className="gallery-btn-action gallery-btn-action--secondary"
                    onClick={() => setShowUrlGalleryInput(!showUrlGalleryInput)}
                    title="Adjuntar imagen mediante URL"
                  >
                    <Link2 size={13} />
                    <span>Por URL</span>
                  </button>
                </div>
              </div>

              {showUrlGalleryInput && (
                <div className="gallery-url-form">
                  <input
                    type="url"
                    placeholder="URL directa de la fotografía (https://...)"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    className="gallery-url-input"
                  />
                  <button className="gallery-url-submit" onClick={handleAddGalleryUrl}>
                    Añadir a Galería
                  </button>
                </div>
              )}

              {/* Cuadrícula de Fotos */}
              {selectedNote.images && selectedNote.images.length > 0 ? (
                <div className="gallery-grid">
                  {selectedNote.images.map((imgSrc, idx) => (
                    <motion.div
                      key={idx}
                      className="gallery-item-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img src={imgSrc} alt={`Foto ${idx + 1}`} className="gallery-thumb-img" />
                      <div className="gallery-item-overlay">
                        <button
                          className="gallery-tool-btn"
                          onClick={() => setLightboxImage(imgSrc)}
                          title="Ver en pantalla completa"
                        >
                          <Maximize2 size={15} />
                        </button>
                        <button
                          className="gallery-tool-btn gallery-tool-btn--danger"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          title="Eliminar foto"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div
                  className="gallery-dropzone-hint"
                  onClick={() => galleryFileRef.current?.click()}
                >
                  <Camera size={22} className="text-muted" />
                  <p>
                    Haz clic aquí o en <strong>Subir Foto(s)</strong> para adjuntar imágenes de esta vivencia (se guardan de forma privada en tu equipo).
                  </p>
                </div>
              )}
            </div>

            <div className="notion-divider"></div>

            {/* Cuerpo del Documento (Área de redacción limpia) */}
            <div className="notion-body-area">
              <textarea
                className="notion-textarea"
                placeholder="Escribe aquí tu relato con total libertad... ¿Qué pasó? ¿Quién dijo qué? ¿Cómo fue el ambiente?..."
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

            {/* CALLOUT AUTOMÁTICO EN SEGUNDO PLANO: Cruce de realidades */}
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
                        Al coincidir personas de tu círculo de <strong>Amistad</strong> y de tu círculo de{' '}
                        <strong>Vínculos</strong>, este recuerdo se proyecta en la línea temporal como una convergencia donde dos realidades se entrelazan.
                      </>
                    ) : (
                      <>
                        Este recuerdo coincide en fecha o participantes con otras historias de tu diario:{' '}
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

      {/* LIGHTBOX MODAL: Ver imágenes en alta resolución */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              className="lightbox-modal"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setLightboxImage(null)}
              >
                <X size={20} />
              </button>
              <img src={lightboxImage} alt="Foto ampliada" className="lightbox-img" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmación Estilo Kairós */}
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
