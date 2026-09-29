// KAIRÓS — Servicio de Persistencia y Motor de Confluencia en Segundo Plano
// 100% data real del usuario (cero datos inventados o mock pregrabados)

const STORAGE_KEY = 'kairos_multiverse_memories_v2'
const GO_BACKEND_URL = 'http://localhost:8080/api/stories'

const INITIAL_MEMORIES = []

export const storyService = {
  // Obtener todas las historias
  async getAll() {
    try {
      const res = await fetch(GO_BACKEND_URL, { signal: AbortSignal.timeout(600) })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
          return data
        }
      }
    } catch {
      // Go offline
    }

    const local = localStorage.getItem(STORAGE_KEY)
    if (!local) {
      return []
    }
    try {
      return JSON.parse(local)
    } catch {
      return []
    }
  },

  // Guardar nueva historia
  async create(storyData) {
    const memories = await this.getAll()
    const newStory = {
      id: 'mem-' + Date.now(),
      icon: storyData.icon || '📝',
      createdAt: new Date().toISOString(),
      ...storyData
    }

    // Auto-detectar por detrás si tiene participantes de ambos mundos
    const autoStream = this.calculateStream(newStory)
    newStory.stream = autoStream

    const updated = [newStory, ...memories]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    try {
      await fetch(GO_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStory),
        signal: AbortSignal.timeout(1000)
      })
    } catch {
      // guardado local garantizado
    }

    return newStory
  },

  // Actualizar historia existente
  async update(id, patch) {
    const memories = await this.getAll()
    const updated = memories.map((m) => {
      if (m.id === id) {
        const merged = { ...m, ...patch, updatedAt: new Date().toISOString() }
        merged.stream = this.calculateStream(merged)
        return merged
      }
      return m
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    const target = updated.find((m) => m.id === id)
    try {
      await fetch(GO_BACKEND_URL, {
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

  // Eliminar historia
  async remove(id) {
    const memories = await this.getAll()
    const updated = memories.filter((m) => m.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    try {
      await fetch(`${GO_BACKEND_URL}/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(1000)
      })
    } catch {
      // Fallback
    }

    return updated
  },

  // Detección automática en segundo plano ("por detrás")
  calculateStream(story) {
    if (story.stream === 'convergence') return 'convergence'
    const text = `${story.title} ${story.story} ${(story.participants || []).join(' ')} ${(story.tags || []).join(' ')}`.toLowerCase()

    const hasFriend =
      text.includes('amig') ||
      text.includes('pata') ||
      text.includes('barrio') ||
      text.includes('promo') ||
      text.includes('hermano') ||
      text.includes('brother') ||
      text.includes('chupete') ||
      text.includes('johan') ||
      text.includes('salvador')

    const hasRomance =
      text.includes('enamorad') ||
      text.includes('novia') ||
      text.includes('pareja') ||
      text.includes('casi algo') ||
      text.includes('cariñosa') ||
      text.includes('cita') ||
      text.includes('carta') ||
      text.includes('beso') ||
      text.includes('crush')

    if (hasFriend && hasRomance) return 'convergence'
    if (hasFriend) return 'friendship'
    if (hasRomance) return 'romance'
    return 'friendship'
  },

  // Detecta coincidencias y cruces automáticos entre dos historias por detrás
  findConvergences(currentStory, allStories = []) {
    if (!currentStory) return []
    const others = allStories.filter((s) => s.id !== currentStory.id)

    const matches = []
    const currentParts = (currentStory.participants || []).map((p) => p.toLowerCase().trim())
    const currentDate = (currentStory.date || '').toLowerCase().trim()

    for (const other of others) {
      const otherParts = (other.participants || []).map((p) => p.toLowerCase().trim())
      const otherDate = (other.date || '').toLowerCase().trim()

      const sameDate = currentDate && otherDate && (currentDate === otherDate || (currentDate.includes('ayer') && otherDate.includes('ayer')))
      const commonPeople = currentParts.filter((p) => otherParts.includes(p))

      const isCrossWorld =
        ((currentParts.some(p => p.includes('amig') || p.includes('brother') || p.includes('hermano')) &&
          otherParts.some(p => p.includes('novia') || p.includes('enamorad') || p.includes('casi algo') || p.includes('cariñosa'))) ||
         (currentParts.some(p => p.includes('novia') || p.includes('enamorad') || p.includes('casi algo') || p.includes('cariñosa')) &&
          otherParts.some(p => p.includes('amig') || p.includes('brother') || p.includes('hermano'))))

      if (sameDate || commonPeople.length > 0 || isCrossWorld) {
        matches.push({
          story: other,
          reasons: {
            sameDate,
            commonPeople,
            isCrossWorld
          }
        })
      }
    }

    return matches
  },

  // Parseador cronológico inteligente para historias pasadas y presentes
  parseStoryDate(story) {
    if (!story) return 0
    if (story.eventDate) {
      const t = new Date(story.eventDate).getTime()
      if (!isNaN(t)) return t
    }
    if (story.date) {
      const yearMatch = story.date.match(/\b(19\d\d|20\d\d)\b/)
      const monthNames = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
      }
      const strLower = story.date.toLowerCase()
      let foundMonth = -1
      for (const [mName, mIdx] of Object.entries(monthNames)) {
        if (strLower.includes(mName)) {
          foundMonth = mIdx
          break
        }
      }
      const dayMatch = strLower.match(/\b(\d{1,2})\b/)
      const day = dayMatch ? parseInt(dayMatch[1], 10) : 1

      if (yearMatch) {
        const year = parseInt(yearMatch[1], 10)
        const month = foundMonth >= 0 ? foundMonth : 0
        return new Date(year, month, day).getTime()
      }
    }
    if (story.epoch) {
      const epochMatch = story.epoch.match(/\b(19\d\d|20\d\d)\b/)
      if (epochMatch) {
        return new Date(parseInt(epochMatch[1], 10), 0, 1).getTime()
      }
    }
    if (story.createdAt) {
      const t = new Date(story.createdAt).getTime()
      if (!isNaN(t)) return t
    }
    return 0
  },

  getStoryYear(story) {
    if (!story) return 'Sin época'
    const yearMatch = (story.eventDate || story.date || story.epoch || '').match(/\b(19\d\d|20\d\d)\b/)
    if (yearMatch) return yearMatch[1]
    if (story.createdAt) return new Date(story.createdAt).getFullYear().toString()
    return 'Sin época'
  },

  sortChronologically(stories, ascending = true) {
    return [...stories].sort((a, b) => {
      const timeA = this.parseStoryDate(a)
      const timeB = this.parseStoryDate(b)
      return ascending ? timeA - timeB : timeB - timeA
    })
  },

  // Exportar backup JSON completo
  exportJSON() {
    const data = localStorage.getItem(STORAGE_KEY) || '[]'
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kairos-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}
