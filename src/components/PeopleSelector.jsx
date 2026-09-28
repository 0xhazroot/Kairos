import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Check, X, Sparkles, ChevronDown, Edit2, Tag } from 'lucide-react'
import { peopleService } from '../services/peopleService.js'
import { auditService } from '../services/auditService.js'
import ConfirmModal from './ConfirmModal.jsx'
import './PeopleSelector.css'

const QUICK_TAG_SUGGESTIONS = [
  'Brother',
  'Hermano',
  'Casi algo',
  'Amiga cariñosa',
  'Enamorada',
  'Amigo',
  'Pata de barrio',
  'Cómplice'
]

export default function PeopleSelector({ selectedNames = [], onChange }) {
  const [allPeople, setAllPeople] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newTag, setNewTag] = useState('')
  const [editingPersonId, setEditingPersonId] = useState(null)
  const [editTagValue, setEditTagValue] = useState('')
  const [personToDelete, setPersonToDelete] = useState(null)

  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = async () => {
    const list = await peopleService.getAll()
    setAllPeople(list)
  }

  const togglePerson = (name) => {
    if (selectedNames.includes(name)) {
      onChange(selectedNames.filter((n) => n !== name))
    } else {
      onChange([...selectedNames, name])
    }
  }

  const handleCreateNew = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return

    const tagToSave = newTag.trim() || 'Amigo'
    const isRomance =
      tagToSave.toLowerCase().includes('enamorad') ||
      tagToSave.toLowerCase().includes('novia') ||
      tagToSave.toLowerCase().includes('casi algo') ||
      tagToSave.toLowerCase().includes('cariñosa') ||
      tagToSave.toLowerCase().includes('amor')

    const icon = isRomance ? '❤️' : '👤'

    const created = await peopleService.create({
      name: newName.trim(),
      tag: tagToSave,
      icon
    })

    const updated = await peopleService.getAll()
    setAllPeople(updated)
    onChange([...selectedNames, created.name])
    setNewName('')
    setNewTag('')
    setIsCreating(false)
  }

  const handleStartEditTag = (person, e) => {
    e.stopPropagation()
    setEditingPersonId(person.id)
    setEditTagValue(person.tag || '')
  }

  const handleSaveEditTag = async (personId, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!editTagValue.trim()) return

    await auditService.log('PERSON_TAG_UPDATE', `Se actualizó la etiqueta de persona a "${editTagValue.trim()}"`, 'update')
    await peopleService.update(personId, { tag: editTagValue.trim() })
    await loadPeople()
    setEditingPersonId(null)
  }

  const handleDeletePerson = (personId, personName, e) => {
    e.stopPropagation()
    setPersonToDelete({ id: personId, name: personName })
  }

  const handleConfirmDeletePerson = async () => {
    if (!personToDelete) return
    await peopleService.remove(personToDelete.id)
    await auditService.log('PERSON_DELETE', `Se eliminó a ${personToDelete.name} del círculo personal`, 'delete')
    await loadPeople()
    onChange(selectedNames.filter((n) => n !== personToDelete.name))
    setPersonToDelete(null)
  }

  // Obtener info visual de la persona por nombre
  const getPersonInfo = (name) => {
    const found = allPeople.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    )
    if (found) return found

    // Fallback si no está en la lista guardada
    return {
      name,
      tag: 'Involucrado',
      avatarColor: '#64748B',
      icon: '👤'
    }
  }

  return (
    <div className="ps-section">
      <div className="ps-header">
        <div className="ps-title-group">
          <Users size={16} className="ps-icon-main" />
          <span className="ps-title">¿Quiénes están involucrados?</span>
          <span className="ps-count-badge">
            {selectedNames.length} {selectedNames.length === 1 ? 'persona' : 'personas'}
          </span>
        </div>

        <button
          type="button"
          className="ps-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{isOpen ? 'Ocultar círculo' : 'Elegir personas'}</span>
          <ChevronDown
            size={14}
            style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>
      </div>

      {/* Chips de personas en esta nota con sus etiquetas libres */}
      <div className="ps-selected-chips">
        {selectedNames.length === 0 ? (
          <span className="ps-empty-tip">
            No has añadido a nadie todavía. Selecciona quiénes compartieron este recuerdo contigo.
          </span>
        ) : (
          selectedNames.map((name) => {
            const info = getPersonInfo(name)
            return (
              <motion.span
                key={name}
                className="ps-person-chip"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                  borderColor: `${info.avatarColor}40`,
                  backgroundColor: `${info.avatarColor}10`
                }}
              >
                <span
                  className="ps-avatar-dot"
                  style={{ backgroundColor: info.avatarColor }}
                >
                  {info.icon || info.name.slice(0, 1)}
                </span>
                <span className="ps-chip-name">{info.name}</span>
                {info.tag && (
                  <span className="ps-chip-tag-pill" style={{ color: info.avatarColor }}>
                    • {info.tag}
                  </span>
                )}
                <button
                  type="button"
                  className="ps-chip-remove"
                  onClick={() => togglePerson(name)}
                  title="Quitar de esta nota"
                >
                  <X size={12} />
                </button>
              </motion.span>
            )
          })
        )}
      </div>

      {/* Menú Desplegable: Personas con Etiquetas Personalizadas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ps-dropdown"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="ps-dropdown-header">
              <span>Personas de tu vida (haz clic para involucrar o edita sus etiquetas):</span>
            </div>

            <div className="ps-options-grid">
              {allPeople.map((person) => {
                const isSelected = selectedNames.includes(person.name)
                const isEditingThis = editingPersonId === person.id

                return (
                  <div
                    key={person.id}
                    className={`ps-option-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => togglePerson(person.name)}
                  >
                    <div
                      className="ps-opt-avatar"
                      style={{ backgroundColor: person.avatarColor }}
                    >
                      {person.icon || person.name.slice(0, 1)}
                    </div>

                    <div className="ps-opt-info">
                      <span className="ps-opt-name">{person.name}</span>

                      {/* Etiqueta editable personalizada por el usuario */}
                      {isEditingThis ? (
                        <form
                          onSubmit={(e) => handleSaveEditTag(person.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="ps-inline-edit-form"
                        >
                          <input
                            type="text"
                            value={editTagValue}
                            onChange={(e) => setEditTagValue(e.target.value)}
                            placeholder="Ej. Casi algo, Brother..."
                            className="ps-inline-input"
                            autoFocus
                          />
                          <button type="submit" className="ps-inline-check-btn">
                            <Check size={12} />
                          </button>
                        </form>
                      ) : (
                        <div className="ps-opt-tag-row">
                          <span className="ps-opt-custom-tag">{person.tag || 'Sin etiqueta'}</span>
                          <button
                            type="button"
                            className="ps-edit-tag-btn"
                            onClick={(e) => handleStartEditTag(person, e)}
                            title="Cambiar etiqueta"
                          >
                            <Edit2 size={11} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="ps-opt-actions">
                      <div className="ps-opt-check">
                        {isSelected ? <Check size={14} /> : null}
                      </div>
                      <button
                        type="button"
                        className="ps-opt-delete-btn"
                        onClick={(e) => handleDeletePerson(person.id, person.name, e)}
                        title="Eliminar de mi círculo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Formulario Libre para Agregar Nueva Persona con Etiqueta Libre */}
            {!isCreating ? (
              <button
                type="button"
                className="ps-btn-create-trigger"
                onClick={() => setIsCreating(true)}
              >
                <UserPlus size={14} />
                <span>+ Agregar persona con mi propia etiqueta</span>
              </button>
            ) : (
              <form onSubmit={handleCreateNew} className="ps-create-form">
                <div className="ps-form-heading">
                  <Tag size={13} />
                  <span>Define quién es y ponle la etiqueta que tú quieras:</span>
                </div>

                <div className="ps-form-fields">
                  <div className="ps-field-col">
                    <label className="ps-field-label">Nombre o Apodo</label>
                    <input
                      type="text"
                      placeholder="Ej. Johan, Chupete, Salvador, Lucía..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="ps-input"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="ps-field-col">
                    <label className="ps-field-label">¿Qué es para ti? (Tu etiqueta libre)</label>
                    <input
                      type="text"
                      placeholder="Ej. Brother, Casi algo, Amiga cariñosa, Hermano, Enamorada..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="ps-input"
                      required
                    />
                  </div>
                </div>

                {/* Sugerencias Rápidas Opcionales para no escribir de más */}
                <div className="ps-suggestions-row">
                  <span className="ps-sugg-label">Sugerencias rápidas:</span>
                  <div className="ps-sugg-chips">
                    {QUICK_TAG_SUGGESTIONS.map((sugg) => (
                      <button
                        key={sugg}
                        type="button"
                        className="ps-sugg-chip"
                        onClick={() => setNewTag(sugg)}
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ps-form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save-person">
                    <UserPlus size={13} />
                    <span>Guardar e involucrar</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={Boolean(personToDelete)}
        title="¿Eliminar persona del círculo?"
        message={personToDelete ? `¿Deseas remover a "${personToDelete.name}" de tus personas guardadas?` : ''}
        confirmText="Sí, eliminar"
        onConfirm={handleConfirmDeletePerson}
        onCancel={() => setPersonToDelete(null)}
      />
    </div>
  )
}
