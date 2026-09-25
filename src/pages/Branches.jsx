import { motion } from 'framer-motion'
import { GitBranch } from 'lucide-react'
import './Branches.css'

const branches = [
  {
    stream: 'Amistad',
    color: 'sage',
    categories: [
      { name: 'La Raíz - Barrio & Vecindad', desc: 'Amistades de calle, lealtad pura sin filtros ni apariencias.' },
      { name: 'Crecimiento - Época Escolar', desc: 'Los cómplices de recreo, travesuras y tareas en grupo.' },
      { name: 'Madurez - Universidad & Chamba', desc: 'Alianzas forjadas en proyectos y madrugadas compartidas.' },
      { name: 'Círculo de Hierro - Incondicionales', desc: 'Los que están ahí sin importar el tiempo o la distancia.' },
      { name: 'Vidas Cruzadas - Viajes & Pasatiempos', desc: 'Conexiones de eventos, viajes y momentos irrepetibles.' },
    ]
  },
  {
    stream: 'Vínculos del Corazón',
    color: 'lavender',
    categories: [
      { name: 'Destellos & Inocencia', desc: 'Primeras cartas, miradas tímidas y amores de infancia.' },
      { name: 'Ilusiones & Amores Platónicos', desc: 'Sentimientos intensos vividos desde la distancia o el silencio.' },
      { name: 'Conexiones Efímeras - Casi Algo', desc: 'Química a destiempo, lo que pudo haber sido.' },
      { name: 'Historias Formales & Significativas', desc: 'Relaciones que marcaron etapas y dejaron aprendizajes.' },
      { name: 'Capítulo Actual - El Presente', desc: 'La historia que estás escribiendo hoy.' },
    ]
  }
]

export default function Branches() {
  return (
    <motion.div
      className="branches-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="br-header">
        <h1 className="br-title">Ramificaciones</h1>
        <p className="br-subtitle">Las dos corrientes principales de tu multiverso y sus derivaciones.</p>
      </header>

      <div className="branches-grid">
        {branches.map((branch) => (
          <div key={branch.stream} className={`branch-column branch-column--${branch.color}`}>
            <div className="branch-column-header">
              <div className={`branch-dot branch-dot--${branch.color}`} />
              <h2 className="branch-stream-name">{branch.stream}</h2>
            </div>

            <div className="branch-list">
              {branch.categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  className="branch-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  whileHover={{ x: 4 }}
                >
                  <GitBranch size={15} strokeWidth={1.8} className="branch-item-icon" />
                  <div>
                    <h3 className="branch-item-name">{cat.name}</h3>
                    <p className="branch-item-desc">{cat.desc}</p>
                  </div>
                  <span className="branch-item-count">0</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
