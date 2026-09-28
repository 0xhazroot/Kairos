import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import './Toast.css'

export default function Toast({ toast, onClose }) {
  if (!toast) return null

  const icons = {
    success: <CheckCircle2 size={16} className="toast-icon--success" />,
    error: <AlertCircle size={16} className="toast-icon--error" />,
    info: <Info size={16} className="toast-icon--info" />
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`kairos-toast kairos-toast--${toast.type || 'success'}`}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        <div className="toast-icon-wrap">
          {icons[toast.type || 'success']}
        </div>
        <div className="toast-message-wrap">
          <span className="toast-title">{toast.title || 'Notificación'}</span>
          {toast.message && <span className="toast-body">{toast.message}</span>}
        </div>
        <button className="toast-dismiss" onClick={onClose} aria-label="Cerrar aviso">
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
