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
  Camera,
  Music,
  Disc,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Layers
} from 'lucide-react'
import { storyService } from '../services/storyService.js'
import { auditService } from '../services/auditService.js'
import PeopleSelector from '../components/PeopleSelector.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import Toast from '../components/Toast.jsx'
import './Notes.css'

const EMOJI_LIST = ['📝', '⚡', '🎵', '✈️', '🎓', '💭', '☕', '✨', '🌿', '💌', '🔥', '⚽', '🎬', '🚀', '❤️', '🫂', '🌙', '🎉', '📸']

const COVER_GRADIENTS = [
  { name: 'Cosmos Púrpura', value: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)' },
  { name: 'Niebla Esmeralda', value: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' },
  { name: 'Atardecer Dorado', value: 'linear-gradient(135deg, #451a03 0%, #d97706 100%)' },
  { name: 'Rosa Terciopelo', value: 'linear-gradient(135deg, #4c0519 0%, #be123c 100%)' },
  { name: 'Amatista Mágica', value: 'linear-gradient(135deg, #2e1065 0%, #9333ea 100%)' },
  { name: 'Pizarra Profunda', value: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }
]

// Lista de años desde 2026 descendiendo hasta 2003 (24 años)
export const YEARS_LIST = Array.from({ length: 2026 - 2003 + 1 }, (_, i) => 2026 - i)

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export default function Notes() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [saveStatus, setSaveStatus] = useState('saved')
  const [sidebarMode, setSidebarMode] = useState('epochs') // 'epochs' (2003-2026) | 'flat' (Lista Rápida)
  const [expandedYears, setExpandedYears] = useState({ 2026: true })
  const [expandedMonths, setExpandedMonths] = useState({})
  const [dayModalTarget, setDayModalTarget] = useState(null)
  const [chosenDayInput, setChosenDayInput] = useState(1)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showCoverMenu, setShowCoverMenu] = useState(false)
  const [showMusicInput, setShowMusicInput] = useState(false)
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
      category: '',
      badgeClass: 'badge-sage',
      participants: ['Yo'],
      tags: ['Diario'],
      coverImage: '',
      images: [],
      songTitle: '',
      songArtist: '',
      songUrl: '',
      summary: '',
      story: ''
    }
    const created = await storyService.create(fresh)
    await auditService.log('STORY_CREATE', `Se creó la nota: "${created.title}"`, 'create')
    const list = await storyService.getAll()
    const sorted = [...list].sort((a, b) => storyService.parseStoryDate(b) - storyService.parseStoryDate(a))
    setStories(sorted)
    setSelectedId(created.id)
    showToast('Nueva nota creada', 'Tu recuerdo está listo para redactar')
  }

  // Crear memoria en año, mes y día específico
  const handleCreateNoteWithDate = async (year, month, day = 1) => {
    const yyyy = year
    const mm = String(month).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    const isoDate = `${yyyy}-${mm}-${dd}`
    const dateObj = new Date(year, month - 1, day)
    const formatted = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

    const fresh = {
      title: `Recuerdo del ${day} de ${MONTH_NAMES[month - 1]} ${yyyy}`,
      eventDate: isoDate,
      date: formatted,
      epoch: `${yyyy}`,
      icon: '📝',
      category: '',
      badgeClass: 'badge-sage',
      participants: ['Yo'],
      tags: ['Diario', `${yyyy}`],
      coverImage: '',
      images: [],
      songTitle: '',
      songArtist: '',
      songUrl: '',
      summary: '',
      story: ''
    }
    const created = await storyService.create(fresh)
    await auditService.log('STORY_CREATE', `Se creó el recuerdo del ${formatted}`, 'create')
    const list = await storyService.getAll()
    const sorted = [...list].sort((a, b) => storyService.parseStoryDate(b) - storyService.parseStoryDate(a))
    setStories(sorted)
    setSelectedId(created.id)
    setDayModalTarget(null)
    showToast('Recuerdo creado', `Fecha asignada: ${formatted}`)
  }

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year]
    }))
  }

  const toggleMonth = (year, month) => {
    const key = `${year}-${month}`
    setExpandedMonths((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getStoryYearMonthDay = (story) => {
    if (story?.eventDate && story.eventDate.includes('-')) {
      const parts = story.eventDate.split('-')
      if (parts.length >= 3) {
        const y = parseInt(parts[0], 10)
        const m = parseInt(parts[1], 10)
        const d = parseInt(parts[2], 10)
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return { year: y, month: m, day: d }
        }
      }
    }
    if (story?.epoch && !isNaN(parseInt(story.epoch, 10)) && parseInt(story.epoch, 10) >= 1900) {
      return {
        year: parseInt(story.epoch, 10),
        month: 1,
        day: 1
      }
    }
    return { year: 2026, month: 1, day: 1 }
  }

  // Generador de cuadrícula del calendario mensual
  const getMonthCalendarDays = (year, month) => {
    const totalDays = new Date(year, month, 0).getDate()
    const firstDay = new Date(year, month - 1, 1).getDay()
    const offset = (firstDay + 6) % 7 // Lunes = 0, Domingo = 6

    const cells = []
    for (let i = 0; i < offset; i++) {
      cells.push({ day: null, key: `empty-${year}-${month}-${i}` })
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ day: d, key: `d-${year}-${month}-${d}` })
    }
    return cells
  }

  // Obtener partes de fecha para el editor
  const getNoteDateParts = (note) => {
    if (note?.eventDate && note.eventDate.includes('-')) {
      const parts = note.eventDate.split('-')
      if (parts.length >= 3) {
        const y = parseInt(parts[0], 10)
        const m = parseInt(parts[1], 10)
        const d = parseInt(parts[2], 10)
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return { year: y, month: m, day: d }
        }
      }
    }
    if (note?.epoch && !isNaN(parseInt(note.epoch, 10)) && parseInt(note.epoch, 10) >= 1900) {
      return { year: parseInt(note.epoch, 10), month: 1, day: 1 }
    }
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }
  }

  // Estructura del árbol cronológico de 2003 a 2026
  const timelineTree = useMemo(() => {
    const tree = {}
    YEARS_LIST.forEach((year) => {
      tree[year] = {
        count: 0,
        months: {}
      }
      for (let m = 1; m <= 12; m++) {
        tree[year].months[m] = []
      }
    })

    stories.forEach((story) => {
      const { year, month } = getStoryYearMonthDay(story)
      if (tree[year]) {
        tree[year].count++
        if (tree[year].months[month]) {
          tree[year].months[month].push(story)
        } else {
          tree[year].months[month] = [story]
        }
      }
    })

    return tree
  }, [stories])

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

  // Auto-clasificación en segundo plano mientras el usuario escribe
  const handleStoryTextChange = (text) => {
    handleUpdate('story', text)
    if (!selectedNote.summary) {
      handleUpdate('summary', text.slice(0, 95))
    }

  }

  const handleTitleChange = (title) => {
    handleUpdate('title', title)
  }

  const handleDatePartChange = (part, val) => {
    if (!selectedNote) return
    const current = getNoteDateParts(selectedNote)
    let y = current.year
    let m = current.month
    let d = current.day

    if (part === 'year') {
      const parsed = parseInt(val, 10)
      if (!isNaN(parsed)) y = parsed
    } else if (part === 'month') {
      const parsed = parseInt(val, 10)
      if (!isNaN(parsed)) m = parsed
    } else if (part === 'day') {
      const parsed = parseInt(val, 10)
      if (!isNaN(parsed)) d = parsed
    }

    const maxDays = new Date(y, m, 0).getDate()
    d = Math.min(Math.max(1, d), maxDays)

    const mm = String(m).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const iso = `${y}-${mm}-${dd}`
    const formatted = `${d} de ${MONTH_NAMES[m - 1]} de ${y}`

    handleUpdateMultiple({
      eventDate: iso,
      date: formatted,
      epoch: String(y)
    })
  }

  // --- Subida y Manejo de Portada ---
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
    (s.title + ' ' + (s.story || '') + ' ' + (s.category || '') + ' ' + (s.participants || []).join(' ')).toLowerCase().includes(search.toLowerCase())
  )

  const isCoverGradient = selectedNote?.coverImage?.startsWith('linear-gradient')

  return (
    <div className="notion-workspace">
      {/* Barra Lateral Izquierda: Árbol Cronológico 2003-2026 & Lista de Notas */}
      <aside className="notion-sidebar">
        <div className="ns-header">
          <div className="ns-title-row">
            <div className="ns-title">
              <BookOpen size={17} />
              <span>Diario & Memorias</span>
            </div>
            <button className="ns-add-btn" onClick={handleCreateNote} title="Nueva nota hoy">
              <Plus size={16} />
            </button>
          </div>

          {/* Selector de Modo: Por Años (2003-2026) vs Lista Reciente */}
          <div className="ns-mode-tabs">
            <button
              className={`ns-mode-tab ${sidebarMode === 'epochs' ? 'active' : ''}`}
              onClick={() => setSidebarMode('epochs')}
            >
              <Calendar size={13} />
              <span>Años (2003-2026)</span>
            </button>
            <button
              className={`ns-mode-tab ${sidebarMode === 'flat' ? 'active' : ''}`}
              onClick={() => setSidebarMode('flat')}
            >
              <Clock size={13} />
              <span>Recientes ({stories.length})</span>
            </button>
          </div>

          {sidebarMode === 'flat' && (
            <div className="ns-search-box">
              <Search size={14} className="ns-search-icon" />
              <input
                type="text"
                placeholder="Buscar por título, persona, categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ns-search-input"
              />
            </div>
          )}
        </div>

        {/* MODO 1: ÁRBOL CRONOLÓGICO DE AÑOS (2003 - 2026) -> MESES -> DÍAS */}
        {sidebarMode === 'epochs' ? (
          <div className="ns-epochs-tree">
            {YEARS_LIST.map((year) => {
              const yearData = timelineTree[year]
              const isYearExpanded = Boolean(expandedYears[year])

              return (
                <div key={year} className="ns-tree-year-block">
                  <div
                    className={`ns-tree-year-header ${isYearExpanded ? 'is-open' : ''}`}
                    onClick={() => toggleYear(year)}
                  >
                    <div className="year-title-left">
                      {isYearExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <Calendar size={14} className="year-icon" />
                      <span className="year-label">{year}</span>
                    </div>
                    <span className={`year-count-pill ${yearData.count > 0 ? 'has-stories' : ''}`}>
                      {yearData.count > 0 ? `${yearData.count}` : '0'}
                    </span>
                  </div>

                  <AnimatePresence>
                    {isYearExpanded && (
                      <motion.div
                        className="ns-tree-months-list"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        {MONTH_NAMES.map((monthName, mIdx) => {
                          const mNum = mIdx + 1
                          const mKey = `${year}-${mNum}`
                          const isMonthExpanded = Boolean(expandedMonths[mKey])
                          const storiesInMonth = yearData.months[mNum] || []

                          return (
                            <div key={mNum} className="ns-tree-month-block">
                              <div
                                className={`ns-tree-month-header ${isMonthExpanded ? 'is-open' : ''}`}
                                onClick={() => toggleMonth(year, mNum)}
                              >
                                <div className="month-title-left">
                                  {isMonthExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                  <span className="month-label">{monthName}</span>
                                </div>
                                {storiesInMonth.length > 0 && (
                                  <span className="month-count-tag">{storiesInMonth.length}</span>
                                )}
                              </div>

                              <AnimatePresence>
                                {isMonthExpanded && (
                                  <motion.div
                                    className="ns-tree-stories-container"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    {/* Calendario Mensual con Días */}
                                    <div className="ns-month-calendar">
                                      <div className="cal-weekday-labels">
                                        <span>Lu</span>
                                        <span>Ma</span>
                                        <span>Mi</span>
                                        <span>Ju</span>
                                        <span>Vi</span>
                                        <span>Sá</span>
                                        <span>Do</span>
                                      </div>
                                      <div className="cal-days-grid">
                                        {getMonthCalendarDays(year, mNum).map((cell) => {
                                          if (!cell.day) {
                                            return <div key={cell.key} className="cal-cell is-empty" />
                                          }
                                          const dayNum = cell.day
                                          const storiesOnDay = storiesInMonth.filter((st) => getStoryYearMonthDay(st).day === dayNum)
                                          const hasStory = storiesOnDay.length > 0
                                          const isSelectedDay = selectedNote &&
                                            getStoryYearMonthDay(selectedNote).year === year &&
                                            getStoryYearMonthDay(selectedNote).month === mNum &&
                                            getStoryYearMonthDay(selectedNote).day === dayNum

                                          return (
                                            <button
                                              key={cell.key}
                                              type="button"
                                              className={`cal-cell ${hasStory ? 'has-memory' : ''} ${isSelectedDay ? 'is-selected' : ''}`}
                                              onClick={() => {
                                                if (hasStory) {
                                                  setSelectedId(storiesOnDay[0].id)
                                                } else {
                                                  handleCreateNoteWithDate(year, mNum, dayNum)
                                                }
                                              }}
                                              title={hasStory ? `${dayNum} ${monthName}: ${storiesOnDay[0].title || 'Recuerdo'}` : `Clic para escribir recuerdo del ${dayNum} de ${monthName} ${year}`}
                                            >
                                              <span className="cal-num">{dayNum}</span>
                                              {hasStory && <span className="cal-dot" />}
                                            </button>
                                          )
                                        })}
                                      </div>
                                      <div className="cal-hint-bar">
                                        <Sparkles size={11} />
                                        <span>Toca un día para abrir o escribir</span>
                                      </div>
                                    </div>

                                    {/* Lista de recuerdos en este mes si existen */}
                                    {storiesInMonth.length > 0 && (
                                      <div className="ns-month-stories-list">
                                        {storiesInMonth.map((st) => {
                                          const isActive = st.id === selectedId
                                          const dayNum = getStoryYearMonthDay(st).day
                                          return (
                                            <div
                                              key={st.id}
                                              className={`ns-tree-story-item ${isActive ? 'is-active' : ''}`}
                                              onClick={() => setSelectedId(st.id)}
                                            >
                                              <span className="story-day-tag">Día {dayNum}</span>
                                              <span className="story-tree-icon">{st.icon || '📝'}</span>
                                              <span className="story-tree-title">{st.title || 'Sin título'}</span>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}

                                    {/* Botón directo para crear recuerdo en este Mes & Año */}
                                    <button
                                      className="btn-add-in-month"
                                      onClick={() => {
                                        setDayModalTarget({ year, month: mNum, monthName })
                                        setChosenDayInput(1)
                                      }}
                                    >
                                      <Plus size={13} />
                                      <span>+ Crear en {monthName} {year}</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        ) : (
          /* MODO 2: LISTA PLANA RÁPIDA */
          <div className="ns-list">
            {filteredNotes.length === 0 ? (
              <div className="ns-empty">No hay notas que coincidan con la búsqueda</div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === selectedId
                const isConvergence = note.stream === 'convergence'
                const hasPhotos = (note.images && note.images.length > 0) || Boolean(note.coverImage)
                const hasMusic = Boolean(note.songTitle)
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
                      {hasMusic && (
                        <span className="ns-music-dot" title="Tiene música vinculada">
                          <Music size={11} />
                        </span>
                      )}
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
        )}
      </aside>

      {/* Editor Central: Lienzo Estilo Notion con Imágenes, Portada, Categorías & Música */}
      <main className="notion-editor">
        {selectedNote ? (
          <div className="notion-doc">
            {/* PORTADA SUPERIOR */}
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

            {/* MENÚ DE PORTADA */}
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

            {/* Título Estilo Notion con auto-clasificación */}
            <input
              type="text"
              className="notion-title-input"
              placeholder="Sin título..."
              value={selectedNote.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
            />

            {/* Tabla de Propiedades Estilo Notion */}
            <div className="notion-properties">
              {/* Categoría / Lugar Personalizado */}
              <div className="notion-prop-row">
                <div className="notion-prop-label">
                  <Tag size={14} />
                  <span>Categoría / Lugar</span>
                </div>
                <div className="notion-prop-value">
                  <input
                    type="text"
                    className="notion-custom-category-input"
                    placeholder="Escribe una categoría, lugar o evento (ej. Discoteca X, Viaje, Bar...)"
                    value={selectedNote.category || ''}
                    onChange={(e) => handleUpdate('category', e.target.value)}
                  />
                </div>
              </div>

              {/* Fecha Cronológica Exacta */}
              <div className="notion-prop-row">
                <div className="notion-prop-label">
                  <CalendarDays size={14} />
                  <span>Fecha Cronológica</span>
                </div>
                <div className="notion-prop-value date-picker-control-group">
                  {/* Selector de Día */}
                  <div className="date-field-cell">
                    <span className="date-field-sub">Día:</span>
                    <select
                      className="notion-date-select"
                      value={getNoteDateParts(selectedNote).day}
                      onChange={(e) => handleDatePartChange('day', e.target.value)}
                    >
                      {Array.from(
                        { length: new Date(getNoteDateParts(selectedNote).year, getNoteDateParts(selectedNote).month, 0).getDate() },
                        (_, i) => i + 1
                      ).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Selector de Mes */}
                  <div className="date-field-cell">
                    <span className="date-field-sub">Mes:</span>
                    <select
                      className="notion-date-select"
                      value={getNoteDateParts(selectedNote).month}
                      onChange={(e) => handleDatePartChange('month', e.target.value)}
                    >
                      {MONTH_NAMES.map((name, idx) => (
                        <option key={idx + 1} value={idx + 1}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Input de Año: 4 dígitos completos */}
                  <div className="date-field-cell">
                    <span className="date-field-sub">Año:</span>
                    <input
                      type="number"
                      className="notion-year-input"
                      min="1900"
                      max="2099"
                      step="1"
                      value={getNoteDateParts(selectedNote).year}
                      onChange={(e) => handleDatePartChange('year', e.target.value)}
                    />
                  </div>

                  {/* Badge con fecha formateada */}
                  <span className="notion-date-formatted-badge">
                    {getNoteDateParts(selectedNote).day} de {MONTH_NAMES[getNoteDateParts(selectedNote).month - 1]} de {getNoteDateParts(selectedNote).year}
                  </span>
                </div>
              </div>

              {/* Banda Sonora / Canción Ancla del Recuerdo */}
              <div className="notion-prop-row">
                <div className="notion-prop-label">
                  <Music size={14} />
                  <span>Banda Sonora</span>
                </div>
                <div className="notion-prop-value music-prop-cell">
                  {selectedNote.songTitle ? (
                    <div className="notion-music-card">
                      <div className="music-card-icon">
                        <Disc size={16} className="spinning-disc" />
                      </div>
                      <div className="music-card-info">
                        <span className="music-title">{selectedNote.songTitle}</span>
                        {selectedNote.songArtist && (
                          <span className="music-artist">{selectedNote.songArtist}</span>
                        )}
                      </div>
                      {selectedNote.songUrl && (
                        <a
                          href={selectedNote.songUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="music-card-link"
                          title="Escuchar canción"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <button
                        className="music-card-edit"
                        onClick={() => setShowMusicInput(!showMusicInput)}
                        title="Modificar canción"
                      >
                        Editar
                      </button>
                      <button
                        className="music-card-remove"
                        onClick={() => handleUpdateMultiple({ songTitle: '', songArtist: '', songUrl: '' })}
                        title="Quitar canción"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-add-music"
                      onClick={() => setShowMusicInput(!showMusicInput)}
                    >
                      <Plus size={13} />
                      <span>Vincular Canción del Momento</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Formulario desplegable para añadir música */}
              {showMusicInput && (
                <div className="music-input-form">
                  <div className="music-form-grid">
                    <input
                      type="text"
                      placeholder="Título de la canción (ej. Yonaguni, Pepas, One More Time...)"
                      value={selectedNote.songTitle || ''}
                      onChange={(e) => handleUpdate('songTitle', e.target.value)}
                      className="music-field-input"
                    />
                    <input
                      type="text"
                      placeholder="Artista (ej. Bad Bunny, Farruko, Daft Punk...)"
                      value={selectedNote.songArtist || ''}
                      onChange={(e) => handleUpdate('songArtist', e.target.value)}
                      className="music-field-input"
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Enlace opcional de Spotify / YouTube..."
                    value={selectedNote.songUrl || ''}
                    onChange={(e) => handleUpdate('songUrl', e.target.value)}
                    className="music-field-input"
                  />
                  <div className="music-form-actions">
                    <button
                      className="btn-music-save"
                      onClick={() => {
                        setShowMusicInput(false)
                        showToast('Música vinculada', 'Canción asociada a esta memoria')
                      }}
                    >
                      Listo
                    </button>
                  </div>
                </div>
              )}

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

            {/* SUBSECCIÓN DE FOTOGRAFÍAS & MOMENTOS */}
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

            {/* Cuerpo del Documento con auto-clasificación en vivo */}
            <div className="notion-body-area">
              <textarea
                className="notion-textarea"
                placeholder="Escribe aquí tu relato con total libertad... ¿Qué pasó? ¿Quién dijo qué? ¿Cómo fue el ambiente? (Al escribir sobre discotecas, viajes, cambios de vida o universidad, KAIRÓS clasificará tu memoria automáticamente)..."
                value={selectedNote.story || ''}
                onChange={(e) => handleStoryTextChange(e.target.value)}
                rows={12}
              />
            </div>

            {/* CALLOUT AUTOMÁTICO EN SEGUNDO PLANO */}
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

      {/* LIGHTBOX MODAL */}
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

      {/* Modal / Diálogo para elegir el Día exacto dentro del Mes & Año seleccionado */}
      <AnimatePresence>
        {dayModalTarget && (
          <motion.div
            className="day-picker-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDayModalTarget(null)}
          >
            <motion.div
              className="day-picker-modal"
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dpm-header">
                <div className="dpm-badge">
                  <CalendarDays size={15} />
                  <span>Crear Memoria Cronológica</span>
                </div>
                <button className="dpm-close-btn" onClick={() => setDayModalTarget(null)}>
                  <X size={16} />
                </button>
              </div>

              <h4 className="dpm-title">
                ¿Qué día de {dayModalTarget.monthName} de {dayModalTarget.year}?
              </h4>
              <p className="dpm-desc">
                Elige el número de día en que ocurrió esta vivencia para anclarla en tu línea temporal:
              </p>

              <div className="dpm-input-row">
                <label className="dpm-label">Día del Mes:</label>
                <div className="dpm-input-wrap">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={chosenDayInput}
                    onChange={(e) => setChosenDayInput(Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                    className="dpm-number-input"
                    autoFocus
                  />
                  <span className="dpm-day-preview">
                    {chosenDayInput} de {dayModalTarget.monthName} {dayModalTarget.year}
                  </span>
                </div>
              </div>

              <div className="dpm-actions">
                <button className="dpm-btn-cancel" onClick={() => setDayModalTarget(null)}>
                  Cancelar
                </button>
                <button
                  className="dpm-btn-create"
                  onClick={() => handleCreateNoteWithDate(dayModalTarget.year, dayModalTarget.month, chosenDayInput)}
                >
                  <Plus size={15} />
                  <span>Crear en este Día</span>
                </button>
              </div>
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
