import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitBranch } from 'lucide-react'
import { storyService } from '../services/storyService.js'
import './Branches.css'

const branches = [
  {
    stream: 'Amistad',
    color: 'sage',
    categories: [
      { name: 'Barrio & Vecindad', desc: 'Amistades de calle, lealtad pura sin filtros ni apariencias.' },
      { name: 'Época Escolar & Promo', desc: 'Los cómplices de recreo, travesuras y tareas en grupo.' },
      { name: 'Universidad & Chamba', desc: 'Alianzas forjadas en proyectos y madrugadas compartidas.' },
      { name: 'Incondicionales', desc: 'Los que están ahí sin importar el tiempo o la distancia.' },
      { name: 'Viajes & Salidas', desc: 'Conexiones de eventos, salidas y momentos irrepetibles.' },
    ]
  },
  {
    stream: 'Vínculos del Corazón',
    color: 'lavender',
    categories: [
      { name: 'Primeras Ilusiones', desc: 'Primeras cartas, miradas tímidas y amores de infancia.' },
      { name: 'Casi Algo & Conexiones Efímeras', desc: 'Química a destiempo, lo que pudo haber sido.' },
      { name: 'Historias Formales & Enamorada', desc: 'Relaciones que marcaron etapas y dejaron aprendizajes.' },
      { name: 'Cruce Multiverso', desc: 'Salidas compartidas donde confluyen amigos y pareja.' },
      { name: 'Capítulo Actual', desc: 'La historia que estás escribiendo hoy.' },
    ]
  }
]

export default function Branches() {
  const [stories, setStories] = useState([])

  useEffect(() => {
    storyService.getAll().then(setStories)
  }, [])

  const getCountForCat = (catName, stream) => {
    return stories.filter((s) => {
      const matchCat = s.category && s.category.toLowerCase().includes(catName.toLowerCase().split(' ')[0])
      const matchStream = stream === 'Amistad' ? s.stream === 'friendship' : s.stream === 'romance' || s.stream === 'convergence'
      return matchCat || (matchStream && s.category === catName)
    }).length
  }

  return (
    <motion.div
      className="branches-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="br-header">
        <h1 className="br-title">Ramificaciones</h1>
        <p className="br-subtitle">Las corrientes de tu multiverso y la distribución de tus vivencias reales.</p>
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
                  <span className="branch-item-count">{getCountForCat(cat.name, branch.stream)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
