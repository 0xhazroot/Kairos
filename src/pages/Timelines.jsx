import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import './Timelines.css'

export default function Timelines() {
  return (
    <motion.div
      className="timelines-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="tl-header">
        <div>
          <h1 className="tl-title">Línea Sagrada & Ramificaciones</h1>
          <p className="tl-subtitle">Tus vivencias fluyendo como corrientes que se bifurcan y trascienden.</p>
        </div>
        <div className="tl-legend">
          <span className="legend-item"><span className="legend-dot legend-dot--sage"></span> Amistad</span>
          <span className="legend-item"><span className="legend-dot legend-dot--lavender"></span> Vínculos</span>
        </div>
      </header>

      <div className="multiverse-canvas">
        {/* SVG Streams */}
        <svg className="stream-svg" viewBox="0 0 1000 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gSage" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4D926A" />
              <stop offset="100%" stopColor="#99DCB5" />
            </linearGradient>
            <linearGradient id="gLav" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6F5BA7" />
              <stop offset="100%" stopColor="#E5A690" />
            </linearGradient>
          </defs>

          {/* Tronco origen */}
          <path d="M 40,60 Q 160,70 260,130" stroke="#71717A" strokeWidth="3.5" fill="none" opacity="0.5" strokeLinecap="round" />

          {/* Rama Amistad */}
          <motion.path
            d="M 260,130 C 380,60 480,50 680,90 C 820,115 900,70 980,100"
            stroke="url(#gSage)" strokeWidth="3.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          <path d="M 260,130 C 400,100 560,120 760,165 C 880,190 940,155 990,185"
            stroke="url(#gSage)" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" />

          {/* Rama Vínculos */}
          <motion.path
            d="M 260,130 C 320,230 460,340 640,390 C 800,440 870,370 980,400"
            stroke="url(#gLav)" strokeWidth="3.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.3 }}
          />
          <path d="M 260,130 C 360,280 520,380 720,460 C 840,500 910,450 990,480"
            stroke="url(#gLav)" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" />

          {/* Sub-ramas */}
          <motion.path
            d="M 640,390 C 700,510 760,600 860,680"
            stroke="url(#gLav)" strokeWidth="3" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.8 }}
          />
          <motion.path
            d="M 680,90 C 740,220 800,300 900,360"
            stroke="url(#gSage)" strokeWidth="3" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.6 }}
          />

          {/* Conector inter-ramas */}
          <path d="M 760,165 C 790,260 770,370 850,450"
            stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeDasharray="4,6" />
        </svg>

        {/* Nodos Nexus interactivos */}
        <motion.button className="nexus-node" style={{ top: '16%', left: '24%' }}
          whileHover={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 400 }}>
          <Plus size={14} strokeWidth={2.5} />
          <span className="nexus-tip">Origen (2016)</span>
        </motion.button>

        <motion.button className="nexus-node" style={{ top: '10%', left: '65%' }}
          whileHover={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 400 }}>
          <Plus size={14} strokeWidth={2.5} />
          <span className="nexus-tip">Amistad (2018)</span>
        </motion.button>

        <motion.button className="nexus-node" style={{ top: '48%', left: '62%' }}
          whileHover={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 400 }}>
          <Plus size={14} strokeWidth={2.5} />
          <span className="nexus-tip">Vínculos (2022)</span>
        </motion.button>

        <motion.button className="nexus-node" style={{ top: '82%', left: '84%' }}
          whileHover={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 400 }}>
          <Plus size={14} strokeWidth={2.5} />
          <span className="nexus-tip">Presente (2026)</span>
        </motion.button>

        {/* Tarjetas Glassmorphism flotantes */}
        <motion.div className="glass-memory" style={{ top: '2%', left: '35%' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
        >
          <div className="glass-photo">
            <span className="glass-tag badge badge-sage">Barrio</span>
          </div>
          <span className="glass-date">Febrero 2016</span>
          <h3 className="glass-heading">Las tardes de loza en la cuadra</h3>
          <p className="glass-snippet">Donde comenzó la primera corriente de hermandad.</p>
        </motion.div>

        <motion.div className="glass-memory" style={{ top: '28%', left: '2%' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
        >
          <div className="glass-photo">
            <span className="glass-tag badge badge-lavender">Inocencia</span>
          </div>
          <span className="glass-date">Septiembre 2017</span>
          <h3 className="glass-heading">La carta doblada en cuatro</h3>
          <p className="glass-snippet">El primer destello sentimental del salón 2B.</p>
        </motion.div>

        <motion.div className="glass-memory" style={{ top: '6%', left: '70%' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
        >
          <div className="glass-photo">
            <span className="glass-tag badge badge-sage">Promo</span>
          </div>
          <span className="glass-date">Diciembre 2019</span>
          <h3 className="glass-heading">El viaje de promoción</h3>
          <p className="glass-snippet">Promesas al filo de la fogata antes del mundo real.</p>
        </motion.div>

        <motion.div className="glass-memory" style={{ top: '45%', left: '40%' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
        >
          <div className="glass-photo">
            <span className="glass-tag badge badge-peach">Casi Algo</span>
          </div>
          <span className="glass-date">Mayo 2022</span>
          <h3 className="glass-heading">El café de las tardes de mayo</h3>
          <p className="glass-snippet">Química que no necesitó etiquetas para sentirse real.</p>
        </motion.div>

        <motion.div className="glass-memory" style={{ top: '60%', left: '72%' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
        >
          <div className="glass-photo">
            <span className="glass-tag badge badge-sage">Chamba</span>
          </div>
          <span className="glass-date">Noviembre 2023</span>
          <h3 className="glass-heading">El primer equipo de presión</h3>
          <p className="glass-snippet">Colegas que se volvieron amigos incondicionales.</p>
        </motion.div>
      </div>

      {/* Barra de épocas */}
      <div className="epoch-bar">
        <span className="epoch-step epoch-step--active">2016-2018</span>
        <span className="epoch-arrow">&rarr;</span>
        <span className="epoch-step">2019-2021</span>
        <span className="epoch-arrow">&rarr;</span>
        <span className="epoch-step">2022-2024</span>
        <span className="epoch-arrow">&rarr;</span>
        <span className="epoch-step">2025-2026</span>
      </div>
    </motion.div>
  )
}
