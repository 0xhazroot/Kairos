import { motion } from 'framer-motion'
import { Shield, Download, Upload, Lock, Key } from 'lucide-react'
import './Profile.css'

export default function Profile() {
  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="pf-header">
        <h1 className="pf-title">Profile & Bóveda</h1>
        <p className="pf-subtitle">Seguridad, privacidad y respaldo de tus recuerdos.</p>
      </header>

      <div className="pf-grid">
        {/* Bloqueo PIN */}
        <div className="pf-card">
          <div className="pf-card-header">
            <div className="pf-card-icon pf-card-icon--lavender">
              <Lock size={20} strokeWidth={1.8} />
            </div>
            <h2 className="pf-card-title">Bloqueo con PIN</h2>
          </div>
          <p className="pf-card-desc">
            Protege el acceso a tu museo personal con un PIN de 4 dígitos.
            Nadie podrá ver tus recuerdos sin tu código.
          </p>
          <div className="pf-pin-display">
            <span className="pin-dot"></span>
            <span className="pin-dot"></span>
            <span className="pin-dot"></span>
            <span className="pin-dot"></span>
          </div>
          <button className="pf-btn">
            <Key size={15} strokeWidth={1.8} />
            Configurar PIN
          </button>
        </div>

        {/* Backup */}
        <div className="pf-card">
          <div className="pf-card-header">
            <div className="pf-card-icon pf-card-icon--sage">
              <Shield size={20} strokeWidth={1.8} />
            </div>
            <h2 className="pf-card-title">Respaldo & Restauración</h2>
          </div>
          <p className="pf-card-desc">
            Exporta todas tus memorias, fotos y configuraciones en un archivo JSON cifrado.
            Impórtalas en cualquier máquina con KAIRÓS.
          </p>
          <div className="pf-backup-actions">
            <button className="pf-btn pf-btn--primary">
              <Download size={15} strokeWidth={1.8} />
              Exportar Backup
            </button>
            <button className="pf-btn">
              <Upload size={15} strokeWidth={1.8} />
              Importar Backup
            </button>
          </div>
        </div>
      </div>

      <div className="pf-privacy-note">
        <Shield size={16} strokeWidth={1.8} />
        <span>Todos tus datos se almacenan exclusivamente en tu navegador. Ningún dato viaja a servidores externos.</span>
      </div>
    </motion.div>
  )
}
