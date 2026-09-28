// KAIRÓS — Servicio de Perfil de Usuario
// Almacena y sincroniza la información personal, biografía y preferencias del creador.

const PROFILE_KEY = 'kairos_user_profile'
const GO_PROFILE_URL = 'http://localhost:8080/api/profile'

const DEFAULT_PROFILE = {
  name: 'Samir Haziel',
  nickname: 'Haziel',
  handle: '@haz_love',
  bio: 'Arquitecto de mis propias líneas temporales y recuerdos. Inmortalizando vivencias, amistades y amores.',
  avatarIcon: '⚡',
  avatarColor: '#6F5BA7',
  startedAt: '2026',
  timelineMotto: 'Cada recuerdo es un punto de anclaje en el multiverso.',
  preferredStream: 'Amistad & Vínculos'
}

export const profileService = {
  async get() {
    try {
      const res = await fetch(GO_PROFILE_URL, { signal: AbortSignal.timeout(500) })
      if (res.ok) {
        const data = await res.json()
        if (data && data.name) {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(data))
          return data
        }
      }
    } catch {
      // Offline fallback
    }

    const local = localStorage.getItem(PROFILE_KEY)
    if (!local) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE))
      return DEFAULT_PROFILE
    }
    try {
      return JSON.parse(local)
    } catch {
      return DEFAULT_PROFILE
    }
  },

  async update(patch) {
    const current = await this.get()
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))

    try {
      await fetch(GO_PROFILE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
        signal: AbortSignal.timeout(1000)
      })
    } catch {
      // Fallback
    }

    return updated
  }
}
