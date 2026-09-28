import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Activity,
  PlusCircle,
  Trash2,
  Edit3,
  UserCheck,
  GitMerge,
  Clock,
  RotateCcw,
  Sparkles,
  Search,
  Filter
} from 'lucide-react'
import { auditService } from '../services/auditService.js'
import ConfirmModal from '../components/ConfirmModal.jsx'
import Toast from '../components/Toast.jsx'
import './Analytics.css'

export default function Analytics() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    const data = await auditService.getAll()
    setLogs(data || [])
  }

  const handleClear = async () => {
    await auditService.clear()
    setLogs([])
    setConfirmClearOpen(false)
    setToast({
      type: 'info',
      title: 'Bitácora limpiada',
      message: 'Se ha reiniciado el historial de auditoría del multiverso.'
    })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredLogs = logs.filter((log) => {
    if (filter === 'create' && log.type !== 'create') return false
    if (filter === 'delete' && log.type !== 'delete') return false
    if (filter === 'update' && log.type !== 'update') return false
    if (filter === 'person' && log.type !== 'person') return false
    if (filter === 'convergence' && log.type !== 'convergence') return false

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const matchAction = log.action?.toLowerCase().includes(q)
      const matchDetails = log.details?.toLowerCase().includes(q)
      return matchAction || matchDetails
    }
    return true
  })

  const countCreate = logs.filter((l) => l.type === 'create').length
  const countDelete = logs.filter((l) => l.type === 'delete').length
  const countUpdate = logs.filter((l) => l.type === 'update' || l.type === 'person').length

  const getBadgeInfo = (log) => {
    switch (log.type) {
      case 'create':
        return {
          label: 'CREACIÓN',
          icon: <PlusCircle size={13} />,
          className: 'audit-badge--create'
        }
      case 'delete':
        return {
          label: 'ELIMINACIÓN',
          icon: <Trash2 size={13} />,
          className: 'audit-badge--delete'
        }
      case 'person':
        return {
          label: 'PERSONA / TAGS',
          icon: <UserCheck size={13} />,
          className: 'audit-badge--person'
        }
      case 'update':
        return {
          label: 'ACTUALIZACIÓN',
          icon: <Edit3 size={13} />,
          className: 'audit-badge--update'
        }
      case 'convergence':
        return {
          label: 'CONVERGENCIA',
          icon: <GitMerge size={13} />,
          className: 'audit-badge--convergence'
        }
      default:
        return {
          label: 'REGISTRO',
          icon: <Activity size={13} />,
          className: 'audit-badge--info'
        }
    }
  }

  return (
    <motion.div
      className="analytics-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="an-header">
        <div className="an-header-content">
          <div>
            <h1 className="an-title">Analytics</h1>
            <p className="an-subtitle">
              Bitácora de auditoría en tiempo real y registro cronológico de todos los eventos del multiverso.
            </p>
          </div>
          {logs.length > 0 && (
            <button
              className="an-clear-btn"
              onClick={() => setConfirmClearOpen(true)}
              title="Limpiar registro de auditoría"
            >
              <RotateCcw size={14} />
              <span>Limpiar Bitácora</span>
            </button>
          )}
        </div>
      </header>

      {/* Métricas de Auditoría */}
      <div className="an-metrics-grid">
        <div className="an-metric-card">
          <div className="an-metric-icon an-metric-icon--primary">
            <Activity size={20} />
          </div>
          <div className="an-metric-info">
            <span className="an-metric-value">{logs.length}</span>
            <span className="an-metric-label">Total de Eventos Auditados</span>
          </div>
        </div>

        <div className="an-metric-card">
          <div className="an-metric-icon an-metric-icon--success">
            <PlusCircle size={20} />
          </div>
          <div className="an-metric-info">
            <span className="an-metric-value">{countCreate}</span>
            <span className="an-metric-label">Creaciones Registradas</span>
          </div>
        </div>

        <div className="an-metric-card">
          <div className="an-metric-icon an-metric-icon--purple">
            <Edit3 size={20} />
          </div>
          <div className="an-metric-info">
            <span className="an-metric-value">{countUpdate}</span>
            <span className="an-metric-label">Modificaciones / Vínculos</span>
          </div>
        </div>

        <div className="an-metric-card">
          <div className="an-metric-icon an-metric-icon--danger">
            <Trash2 size={20} />
          </div>
          <div className="an-metric-info">
            <span className="an-metric-value">{countDelete}</span>
            <span className="an-metric-label">Eliminaciones de Seguridad</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="an-controls">
        <div className="an-search-wrapper">
          <Search size={15} className="an-search-icon" />
          <input
            type="text"
            placeholder="Buscar por memoria, persona o acción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="an-search-input"
          />
        </div>

        <div className="an-filter-tabs">
          <button
            className={`an-tab ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos ({logs.length})
          </button>
          <button
            className={`an-tab ${filter === 'create' ? 'is-active' : ''}`}
            onClick={() => setFilter('create')}
          >
            Creaciones ({countCreate})
          </button>
          <button
            className={`an-tab ${filter === 'update' ? 'is-active' : ''}`}
            onClick={() => setFilter('update')}
          >
            Modificaciones
          </button>
          <button
            className={`an-tab ${filter === 'person' ? 'is-active' : ''}`}
            onClick={() => setFilter('person')}
          >
            Personas
          </button>
          <button
            className={`an-tab ${filter === 'delete' ? 'is-active' : ''}`}
            onClick={() => setFilter('delete')}
          >
            Eliminaciones ({countDelete})
          </button>
        </div>
      </div>

      {/* Feed de Auditoría / Ledger */}
      <div className="an-ledger-container">
        {filteredLogs.length === 0 ? (
          <div className="an-empty-state">
            <ShieldCheck size={44} strokeWidth={1.3} className="an-empty-icon" />
            <h3 className="an-empty-title">
              {logs.length === 0
                ? 'Bitácora de auditoría sin eventos'
                : 'No hay eventos que coincidan con el filtro'}
            </h3>
            <p className="an-empty-desc">
              {logs.length === 0
                ? 'Cada creación, ajuste de etiquetas o eliminación en tus memorias quedará registrado con fecha y hora exacta como un registro inmutable.'
                : 'Intenta cambiar el término de búsqueda o selecciona otra categoría arriba.'}
            </p>
          </div>
        ) : (
          <div className="an-ledger-list">
            <AnimatePresence>
              {filteredLogs.map((log, index) => {
                const badge = getBadgeInfo(log)
                return (
                  <motion.div
                    key={log.id || index}
                    className="an-ledger-item"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="an-ledger-time">
                      <span className="an-time-clock">{log.timeFormatted || 'Ahora'}</span>
                      <span className="an-time-date">{log.dateFormatted || 'Hoy'}</span>
                    </div>

                    <div className="an-ledger-indicator">
                      <div className="an-dot" />
                      <div className="an-line" />
                    </div>

                    <div className="an-ledger-body">
                      <div className="an-ledger-top">
                        <span className={`an-badge ${badge.className}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                        <span className="an-action-code">{log.action}</span>
                      </div>
                      <p className="an-ledger-details">{log.details}</p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de confirmación para limpiar la auditoría */}
      <ConfirmModal
        isOpen={confirmClearOpen}
        title="¿Limpiar toda la Bitácora de Auditoría?"
        message="Esta acción vaciará el historial de auditoría de eventos. Las memorias y personas de tu multiverso permanecerán intactas."
        confirmText="Sí, limpiar bitácora"
        cancelText="Conservar historial"
        isDanger={true}
        onConfirm={handleClear}
        onCancel={() => setConfirmClearOpen(false)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </motion.div>
  )
}
