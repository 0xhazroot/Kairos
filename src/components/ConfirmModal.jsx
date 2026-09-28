import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import './ConfirmModal.css'

export default function ConfirmModal({
  isOpen,
  title = '¿Confirmar eliminación?',
  message = 'Esta acción no se puede deshacer. Se removerá de tu línea temporal.',
  confirmText = 'Sí, eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="cm-backdrop" onClick={onCancel}>
        <motion.div
          className="cm-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="cm-close-btn" onClick={onCancel} aria-label="Cerrar">
            <X size={16} />
          </button>

          <div className="cm-icon-wrap">
            <div className="cm-icon-bubble">
              <Trash2 size={24} strokeWidth={2} />
            </div>
          </div>

          <div className="cm-content">
            <h3 className="cm-title">{title}</h3>
            <p className="cm-message">{message}</p>
          </div>

          <div className="cm-actions">
            <button type="button" className="cm-btn cm-btn--cancel" onClick={onCancel}>
              {cancelText}
            </button>
            <button type="button" className="cm-btn cm-btn--danger" onClick={onConfirm}>
              <Trash2 size={14} />
              <span>{confirmText}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
