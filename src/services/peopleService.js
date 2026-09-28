// KAIRÓS — Servicio de Personas 100% Creadas por el Usuario (Sin datos inventados)

const PEOPLE_KEY = 'kairos_multiverse_people_v2'
const GO_PEOPLE_URL = 'http://localhost:8080/api/people'

export const peopleService = {
  // Obtener todas las personas
  async getAll() {
    try {
      const res = await fetch(GO_PEOPLE_URL, { signal: AbortSignal.timeout(500) })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          localStorage.setItem(PEOPLE_KEY, JSON.stringify(data))
          return data
        }
      }
    } catch {
      // Go backend offline
    }

    const local = localStorage.getItem(PEOPLE_KEY)
    if (!local) {
      return []
    }
    try {
      return JSON.parse(local)
    } catch {
      return []
    }
  },

  // Crear una nueva persona con etiqueta totalmente libre
  async create(personData) {
    const list = await this.getAll()
    const colors = ['#4D926A', '#6F5BA7', '#D97706', '#2563EB', '#DB2777', '#059669', '#EA580C', '#475569']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newPerson = {
      id: 'person-' + Date.now(),
      name: personData.name.trim(),
      tag: (personData.tag || 'Amistad').trim(),
      avatarColor: personData.avatarColor || randomColor,
      icon: personData.icon || '👤',
      createdAt: new Date().toISOString()
    }

    const updated = [...list, newPerson]
    localStorage.setItem(PEOPLE_KEY, JSON.stringify(updated))

    try {
      await fetch(GO_PEOPLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerson),
        signal: AbortSignal.timeout(1000)
      })
    } catch {
      // Fallback
    }

    return newPerson
  },

  // Modificar etiqueta o datos de una persona
  async update(id, patch) {
    const list = await this.getAll()
    const updated = list.map((p) => (p.id === id ? { ...p, ...patch } : p))
    localStorage.setItem(PEOPLE_KEY, JSON.stringify(updated))

    const target = updated.find((p) => p.id === id)
    try {
      await fetch(GO_PEOPLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target),
        signal: AbortSignal.timeout(1000)
      })
    } catch {
      // Fallback
    }

    return target
  },

  // Eliminar persona
  async remove(id) {
    const list = await this.getAll()
    const updated = list.filter((p) => p.id !== id)
    localStorage.setItem(PEOPLE_KEY, JSON.stringify(updated))

    try {
      await fetch(`${GO_PEOPLE_URL}/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(1000)
      })
    } catch {
      // Fallback
    }

    return updated
  }
}
