import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Sparkles, Check, Save, Heart, Shield, Clock, Smile, Download, Camera, Upload, Link2, X } from 'lucide-react'
import { profileService } from '../services/profileService.js'
import { storyService } from '../services/storyService.js'
import { auditService } from '../services/auditService.js'
import Toast from '../components/Toast.jsx'
import './Profile.css'

const AVATAR_ICONS = ['⚡', '👑', '🚀', '🌿', '🌟', '☕', '❤️', '🌙', '🌊', '🔥']
const AURA_COLORS = ['#6F5BA7', '#4D926A', '#2563EB', '#D97706', '#DB2777', '#059669', '#111827']

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Samir Haziel',
    nickname: 'Haziel',
    handle: '@haz_love',
    bio: 'Arquitecto de mis propias líneas temporales y recuerdos. Inmortalizando vivencias, amistades y amores.',
    avatarIcon: '⚡',
    avatarColor: '#6F5BA7',
    avatarImage: '',
    startedAt: '2026',
    timelineMotto: 'Cada recuerdo es un punto de anclaje en el multiverso.'
  })

  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [showUrlPhotoInput, setShowUrlPhotoInput] = useState(false)
  const [photoUrlInput, setPhotoUrlInput] = useState('')
  const avatarFileRef = useRef(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const data = await profileService.get()
    if (data) setProfile(data)
  }

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      handleChange('avatarImage', event.target.result)
      setToast({
        type: 'success',
        title: 'Foto cargada',
        message: 'Tu foto de perfil ha sido seleccionada. Guarda los cambios para confirmar.'
      })
    }
    reader.readAsDataURL(file)
  }

  const handleApplyUrlPhoto = () => {
    if (!photoUrlInput.trim()) return
    handleChange('avatarImage', photoUrlInput.trim())
    setShowUrlPhotoInput(false)
    setPhotoUrlInput('')
  }

  const handleRemovePhoto = () => {
    handleChange('avatarImage', '')
  }

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    const updated = await profileService.update(profile)
    await auditService.log(
      'PROFILE_UPDATE',
      `Se actualizaron los datos del creador: ${updated.name} (${updated.nickname})`,
      'update'
    )
    setIsSaving(false)
    setToast({
      type: 'success',
      title: 'Perfil guardado',
      message: 'Tus datos e identidad en el multiverso se actualizaron con éxito'
    })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="pf-header">
        <div>
          <h1 className="pf-title">Perfil & Identidad</h1>
          <p className="pf-subtitle">Tus datos personales como protagonista y creador de este multiverso.</p>
        </div>
      </header>

      <div className="pf-container">
        {/* Banner de Presentación Visual */}
        <div className="pf-card pf-hero-card">
          <div className="pf-avatar-section">
            <div
              className={`pf-avatar-large ${profile.avatarImage ? 'has-custom-img' : ''}`}
              style={{
                backgroundColor: profile.avatarColor || '#6F5BA7',
                boxShadow: `0 12px 30px -8px ${profile.avatarColor || '#6F5BA7'}60`
              }}
            >
              {profile.avatarImage ? (
                <img src={profile.avatarImage} alt={profile.name} className="pf-avatar-img" />
              ) : (
                <span>{profile.avatarIcon || '⚡'}</span>
              )}
            </div>

            <div className="pf-hero-meta">
              <div className="pf-hero-badge">
                <Sparkles size={13} />
                <span>Protagonista de la Línea Sagrada</span>
              </div>
              <h2 className="pf-hero-name">{profile.name || 'Sin nombre'}</h2>
              <span className="pf-hero-handle">{profile.handle || '@usuario'}</span>
            </div>
          </div>

          <p className="pf-hero-bio">
            "{profile.bio || 'Escribiendo mis propias realidades...'}"
          </p>

          <div className="pf-hero-motto">
            <Clock size={14} className="text-muted" />
            <span>Línea temporal iniciada en: <strong>{profile.startedAt || '2026'}</strong></span>
          </div>
        </div>

        {/* Formulario de Edición de Datos */}
        <form onSubmit={handleSubmit} className="pf-card pf-form-card">
          <h3 className="pf-form-title">
            <User size={18} />
            <span>Datos Personales</span>
          </h3>

          {/* Selector de Foto Personalizada */}
          <div className="pf-field">
            <label className="pf-label">Foto de Perfil Personalizada</label>
            <div className="pf-photo-upload-row">
              <button
                type="button"
                className="pf-btn-upload-photo"
                onClick={() => avatarFileRef.current?.click()}
              >
                <Upload size={14} />
                <span>Subir foto desde mi equipo</span>
              </button>
              <input
                type="file"
                ref={avatarFileRef}
                accept="image/*"
                onChange={handleAvatarFileUpload}
                hidden
              />

              <button
                type="button"
                className="pf-btn-subtle"
                onClick={() => setShowUrlPhotoInput(!showUrlPhotoInput)}
              >
                <Link2 size={14} />
                <span>Enlace Web</span>
              </button>

              {profile.avatarImage && (
                <button
                  type="button"
                  className="pf-btn-danger-subtle"
                  onClick={handleRemovePhoto}
                  title="Quitar foto y usar ícono"
                >
                  <X size={14} />
                  <span>Quitar foto</span>
                </button>
              )}
            </div>

            {showUrlPhotoInput && (
              <div className="pf-url-row">
                <input
                  type="url"
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="pf-input pf-url-input"
                />
                <button type="button" className="pf-btn-url-apply" onClick={handleApplyUrlPhoto}>
                  Aplicar
                </button>
              </div>
            )}
          </div>

          {/* Selector de Avatar e Ícono / Aura */}
          <div className="pf-field">
            <label className="pf-label">Ícono Alternativo y Aura de Color</label>
            <div className="pf-avatar-picker-row">
              <div className="pf-icons-row">
                {AVATAR_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`pf-icon-btn ${profile.avatarIcon === icon ? 'is-selected' : ''}`}
                    onClick={() => handleChange('avatarIcon', icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <div className="pf-colors-row">
                {AURA_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    className={`pf-color-btn ${profile.avatarColor === col ? 'is-selected' : ''}`}
                    style={{ backgroundColor: col }}
                    onClick={() => handleChange('avatarColor', col)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pf-grid-2">
            <div className="pf-field">
              <label className="pf-label">Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Samir Haziel"
                value={profile.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="pf-input"
              />
            </div>

            <div className="pf-field">
              <label className="pf-label">Apodo / Cómo te dicen tus amigos</label>
              <input
                type="text"
                placeholder="Ej. Haziel, Sami..."
                value={profile.nickname || ''}
                onChange={(e) => handleChange('nickname', e.target.value)}
                className="pf-input"
              />
            </div>
          </div>

          <div className="pf-grid-2">
            <div className="pf-field">
              <label className="pf-label">Usuario / Identificador</label>
              <input
                type="text"
                placeholder="Ej. @haz_love"
                value={profile.handle || ''}
                onChange={(e) => handleChange('handle', e.target.value)}
                className="pf-input"
              />
            </div>

            <div className="pf-field">
              <label className="pf-label">Año o Época de Inicio</label>
              <input
                type="text"
                placeholder="Ej. 2026, Mayo 2022..."
                value={profile.startedAt || ''}
                onChange={(e) => handleChange('startedAt', e.target.value)}
                className="pf-input"
              />
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">Biografía / Acerca de ti</label>
            <textarea
              rows={3}
              placeholder="Escribe unas líneas sobre quién eres, lo que valoras y lo que significa este espacio para ti..."
              value={profile.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="pf-textarea"
            />
          </div>

          <div className="pf-field">
            <label className="pf-label">Lema o Frase de tu Multiverso</label>
            <input
              type="text"
              placeholder="Ej. Cada recuerdo es un punto de anclaje que trasciende el tiempo..."
              value={profile.timelineMotto || ''}
              onChange={(e) => handleChange('timelineMotto', e.target.value)}
              className="pf-input"
            />
          </div>

          <div className="pf-form-footer">
            <button
              type="submit"
              disabled={isSaving}
              className="pf-btn-save"
            >
              <Save size={16} />
              <span>{isSaving ? 'Guardando en tu equipo...' : 'Guardar Datos de Perfil'}</span>
            </button>
          </div>
        </form>

        {/* Sección Inferior: 100% Local & Privado + Exportar Backup */}
        <div className="pf-card pf-security-bottom-card">
          <div className="pf-sec-badge-row">
            <div className="pf-sec-icon-wrap">
              <Shield size={24} className="text-emerald-500" />
            </div>
            <div className="pf-sec-info">
              <h4>100% Local & Privado</h4>
              <p>
                Tus notas, audios, fotos y memorias se procesan y almacenan única y exclusivamente en tu ordenador
                (en la carpeta local <code>data/</code>). Ningún dato sale a la nube ni a servidores externos.
              </p>
            </div>
          </div>

          <div className="pf-sec-export-wrap">
            <button
              type="button"
              className="pf-btn-export-full"
              onClick={() => storyService.exportJSON()}
            >
              <Download size={16} />
              <span>Exportar Copia de Seguridad Completa (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </motion.div>
  )
}
