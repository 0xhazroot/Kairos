// KAIRÓS — Servicio de Auditoría y Bitácora del Multiverso
// Registra cada cambio, creación, edición, cruce y eliminación con fecha y hora exacta.

const AUDIT_KEY = 'kairos_multiverse_audit_log'
const GO_AUDIT_URL = 'http://localhost:8080/api/audit'

export const auditService = {
  async getAll() {
    try {
      const res = await fetch(GO_AUDIT_URL, { signal: AbortSignal.timeout(500) })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          localStorage.setItem(AUDIT_KEY, JSON.stringify(data))
          return data
        }
      }
    } catch {
      // Offline fallback
    }

    const local = localStorage.getItem(AUDIT_KEY)
    if (!local) return []
    try {
      return JSON.parse(local)
    } catch {
      return []
    }
  },

  async log(action, details, type = 'info') {
    const list = await this.getAll()
    const now = new Date()
    const entry = {
      id: 'audit-' + Date.now(),
      timestamp: now.toISOString(),
      timeFormatted: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dateFormatted: now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      action,
      details,
      type // 'create' | 'update' | 'delete' | 'convergence' | 'person' | 'info'
    }

    const updated = [entry, ...list].slice(0, 100) // Mantener los últimos 100 eventos
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updated))

    try {
      await fetch(GO_AUDIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        signal: AbortSignal.timeout(1000)
      })
    } catch {
      // Fallback
    }

    return entry
  },

  async clear() {
    localStorage.setItem(AUDIT_KEY, JSON.stringify([]))
    try {
      await fetch(GO_AUDIT_URL, { method: 'DELETE', signal: AbortSignal.timeout(1000) })
    } catch {
      // Fallback
    }
    return []
  }
}
