import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  Sparkles,
  Users,
  Compass,
  RotateCcw,
  Maximize2,
  Calendar,
  Music,
  BookOpen,
  ArrowRight,
  X,
  Info,
  Layers,
  Heart,
  Zap,
  Sun,
  Moon,
  Palette
} from 'lucide-react'
import { peopleService } from '../services/peopleService.js'
import { storyService } from '../services/storyService.js'
import { profileService } from '../services/profileService.js'
import './Constellation.css'

// Paletas de Temas Visuales
const THEME_CONFIGS = {
  cyan: {
    id: 'cyan',
    name: 'Celeste Radiante',
    icon: '🌊',
    clearColor: 0x071b2c,
    clearAlpha: 0.92,
    fogColor: 0x0a2236,
    ambientColor: 0xbae6fd,
    ambientIntensity: 2.8,
    dirColor: 0xe0f2fe,
    linesConvergence: 0x38bdf8,
    linesCore: 0x7dd3fc,
    linesFriendship: 0x34d399,
    dustColorA: '#7dd3fc',
    dustColorB: '#38bdf8',
    coreColor: '#e0f2fe',
    coreGlow: '#38bdf8'
  },
  ivory: {
    id: 'ivory',
    name: 'Blanco Astral (Marfil)',
    icon: '✨',
    clearColor: 0xf3f4f6,
    clearAlpha: 0.95,
    fogColor: 0xe5e7eb,
    ambientColor: 0xffffff,
    ambientIntensity: 3.2,
    dirColor: 0xfef3c7,
    linesConvergence: 0xd97706,
    linesCore: 0x6366f1,
    linesFriendship: 0x059669,
    dustColorA: '#d97706',
    dustColorB: '#4338ca',
    coreColor: '#f59e0b',
    coreGlow: '#d97706'
  },
  twilight: {
    id: 'twilight',
    name: 'Crepúsculo Aurora',
    icon: '🌌',
    clearColor: 0x14122e,
    clearAlpha: 0.9,
    fogColor: 0x1a163b,
    ambientColor: 0xe0e7ff,
    ambientIntensity: 2.5,
    dirColor: 0xfbcfe8,
    linesConvergence: 0xf472b6,
    linesCore: 0xc4b5fd,
    linesFriendship: 0xa7f3d0,
    dustColorA: '#c4b5fd',
    dustColorB: '#fbcfe8',
    coreColor: '#c4b5fd',
    coreGlow: '#a78bfa'
  }
}

export default function Constellation() {
  const navigate = useNavigate()
  const mountRef = useRef(null)
  const labelsOverlayRef = useRef(null)

  // Estados de datos
  const [people, setPeople] = useState([])
  const [stories, setStories] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Estados de interacción
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [filterGalaxy, setFilterGalaxy] = useState('all') // 'all', 'friendship', 'romance', 'convergences'
  const [themeMode, setThemeMode] = useState('cyan') // 'cyan' (Celeste radiante), 'ivory' (Blanco Astral), 'twilight' (Crepúsculo)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  // Refs de Three.js
  const threeStateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    ambientLight: null,
    dirLight: null,
    nodesMap: new Map(), // id -> { mesh, data, basePos, satellites: [], phase }
    linesGroup: null,
    pulsesGroup: null,
    pulsesData: [],
    starField: null,
    animatingFlyTo: false,
    flyStartPos: null,
    flyEndPos: null,
    flyStartTarget: null,
    flyEndTarget: null,
    flyProgress: 0,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    width: 0,
    height: 0
  })

  // 1. Cargar datos
  useEffect(() => {
    async function loadData() {
      try {
        const [peopleData, storiesData, profileData] = await Promise.all([
          peopleService.getAll(),
          storyService.getAll(),
          profileService.get()
        ])
        setPeople(peopleData || [])
        setStories(storiesData || [])
        setProfile(profileData || null)
      } catch (err) {
        console.error('Error cargando datos para Constelación:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // 2. Calcular topología estelar
  const graphData = useMemo(() => {
    const nodes = []
    const currentTheme = THEME_CONFIGS[themeMode]

    // Nodo central: Tú
    const coreNode = {
      id: 'core-you',
      name: profile?.name || 'Tú',
      role: 'Centro del Multiverso',
      tag: 'Núcleo',
      galaxy: 'core',
      color: currentTheme.coreColor,
      glowColor: currentTheme.coreGlow,
      isCore: true,
      avatarColor: currentTheme.coreColor,
      icon: profile?.avatarIcon || '⚡',
      pos: new THREE.Vector3(0, 0, 0),
      sharedCount: stories.length
    }
    nodes.push(coreNode)

    // Centros orbitales de galaxias
    const clusterCenters = {
      friendship: new THREE.Vector3(-68, 16, -18),
      romance: new THREE.Vector3(70, -12, 22),
      projects: new THREE.Vector3(0, -48, 32)
    }

    const clusterCounters = { friendship: 0, romance: 0, projects: 0 }

    people.forEach((person) => {
      const tagLower = (person.tag || '').toLowerCase()
      const nameLower = (person.name || '').toLowerCase()

      let galaxy = 'friendship'
      let pastelColor = '#a7f3d0' // Menta
      let glowColor = '#34d399'

      if (
        tagLower.includes('casi algo') ||
        tagLower.includes('pareja') ||
        tagLower.includes('novi') ||
        tagLower.includes('romance') ||
        tagLower.includes('crush') ||
        tagLower.includes('amor') ||
        tagLower.includes('especial')
      ) {
        galaxy = 'romance'
        pastelColor = '#fbcfe8' // Rosa pastel
        glowColor = '#f472b6'
      } else if (
        tagLower.includes('proyecto') ||
        tagLower.includes('chamba') ||
        tagLower.includes('socio') ||
        tagLower.includes('mentor') ||
        tagLower.includes('familia')
      ) {
        galaxy = 'projects'
        pastelColor = '#fed7aa' // Melocotón
        glowColor = '#fb923c'
      }

      if (themeMode === 'cyan') {
        if (galaxy === 'friendship') {
          pastelColor = '#67e8f9'
          glowColor = '#06b6d4'
        }
      }

      const idx = clusterCounters[galaxy]++
      const center = clusterCenters[galaxy]

      // Distribución armónica áurea
      const goldenAngle = idx * 2.399963229728653
      const radius = 18 + (idx % 3) * 11
      const elevation = ((idx % 3) - 1) * 9

      const pos = new THREE.Vector3(
        center.x + Math.cos(goldenAngle) * radius,
        center.y + elevation + Math.sin(goldenAngle * 2) * 3,
        center.z + Math.sin(goldenAngle) * radius
      )

      const sharedStories = stories.filter((s) =>
        (s.participants || []).some(
          (p) => p.toLowerCase().trim() === nameLower.trim()
        )
      )

      nodes.push({
        id: person.id,
        name: person.name,
        role: person.tag || 'Vínculo',
        tag: person.tag,
        galaxy,
        color: pastelColor,
        glowColor,
        avatarColor: person.avatarColor || pastelColor,
        icon: person.icon || '👤',
        isCore: false,
        pos,
        sharedStories,
        sharedCount: sharedStories.length
      })
    })

    // Construir aristas
    const links = []

    nodes.forEach((node) => {
      if (!node.isCore) {
        links.push({
          source: coreNode,
          target: node,
          weight: Math.max(1, node.sharedCount),
          isCoreLink: true
        })
      }
    })

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nA = nodes[i]
        const nB = nodes[j]
        if (nA.isCore || nB.isCore) continue

        const commonStories = stories.filter((s) => {
          const parts = (s.participants || []).map((p) => p.toLowerCase().trim())
          return parts.includes(nA.name.toLowerCase().trim()) && parts.includes(nB.name.toLowerCase().trim())
        })

        if (commonStories.length > 0) {
          const hasCanon = commonStories.some(
            (s) => s.category?.toLowerCase().includes('canón') || s.stream === 'convergence'
          )
          links.push({
            source: nA,
            target: nB,
            weight: commonStories.length,
            isCoreLink: false,
            isConvergence: hasCanon || commonStories.length >= 2,
            commonStories
          })
        }
      }
    }

    return { nodes, links, clusterCenters }
  }, [people, stories, profile, themeMode])

  // 3. Montar Escena Three.js
  useEffect(() => {
    if (!mountRef.current || loading) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const state = threeStateRef.current
    state.width = width
    state.height = height

    const currentTheme = THEME_CONFIGS[themeMode]

    // Escena con niebla suave según el tema
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(currentTheme.fogColor, 0.0013)
    state.scene = scene

    // Cámara
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 3000)
    camera.position.set(0, 40, 155)
    state.camera = camera

    // Renderizador con fondo luminoso
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(currentTheme.clearColor, currentTheme.clearAlpha)
    container.innerHTML = ''
    container.appendChild(renderer.domElement)
    state.renderer = renderer

    // Controles orbitales con amortiguación
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxDistance = 550
    controls.minDistance = 25
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.5
    state.controls = controls

    // Iluminación
    const ambientLight = new THREE.AmbientLight(currentTheme.ambientColor, currentTheme.ambientIntensity)
    scene.add(ambientLight)
    state.ambientLight = ambientLight

    const dirLight = new THREE.DirectionalLight(currentTheme.dirColor, 1.4)
    dirLight.position.set(70, 130, 90)
    scene.add(dirLight)
    state.dirLight = dirLight

    // Luces de Galaxias
    const friendshipLight = new THREE.PointLight(
      themeMode === 'cyan' ? 0x38bdf8 : 0x6ee7b7,
      3.2,
      220
    )
    friendshipLight.position.set(-68, 16, -18)
    scene.add(friendshipLight)

    const romanceLight = new THREE.PointLight(
      themeMode === 'ivory' ? 0xf59e0b : 0xfbcfe8,
      3.6,
      220
    )
    romanceLight.position.set(70, -12, 22)
    scene.add(romanceLight)

    const coreLight = new THREE.PointLight(currentTheme.coreColor, 4.2, 190)
    coreLight.position.set(0, 0, 0)
    scene.add(coreLight)

    // A. Polvo Estelar / Partículas Cósmicas
    const starCount = 1200
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)

    const palette = [
      new THREE.Color(currentTheme.dustColorA),
      new THREE.Color(currentTheme.dustColorB),
      new THREE.Color('#ffffff'),
      new THREE.Color('#a7f3d0')
    ]

    for (let i = 0; i < starCount; i++) {
      const r = 130 + Math.random() * 400
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPos[i * 3 + 2] = r * Math.cos(phi)

      const col = palette[Math.floor(Math.random() * palette.length)]
      starColors[i * 3] = col.r
      starColors[i * 3 + 1] = col.g
      starColors[i * 3 + 2] = col.b
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

    const starMat = new THREE.PointsMaterial({
      size: 2.6,
      vertexColors: true,
      transparent: true,
      opacity: themeMode === 'ivory' ? 0.65 : 0.85,
      blending: themeMode === 'ivory' ? THREE.NormalBlending : THREE.AdditiveBlending
    })
    const starField = new THREE.Points(starGeo, starMat)
    scene.add(starField)
    state.starField = starField

    // B. Nebulosas orbitales etéreas
    const createNebula = (pos, radius, colorHex) => {
      const ringGeo = new THREE.RingGeometry(radius * 0.7, radius * 1.3, 64)
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: themeMode === 'ivory' ? 0.05 : 0.08,
        blending: THREE.AdditiveBlending
      })
      const mesh = new THREE.Mesh(ringGeo, ringMat)
      mesh.position.copy(pos)
      mesh.rotation.x = Math.PI / 2.3
      scene.add(mesh)
      return mesh
    }

    const nebFriendship = createNebula(new THREE.Vector3(-68, 16, -18), 46, currentTheme.linesFriendship)
    const nebRomance = createNebula(new THREE.Vector3(70, -12, 22), 46, currentTheme.linesConvergence)
    const nebCore = createNebula(new THREE.Vector3(0, 0, 0), 34, currentTheme.linesCore)

    // C. Construir Nodos
    state.nodesMap.clear()
    const nodeGroup = new THREE.Group()
    scene.add(nodeGroup)

    graphData.nodes.forEach((n, nodeIdx) => {
      const baseRadius = n.isCore ? 4.2 : 2.4 + Math.min(n.sharedCount * 0.35, 1.8)

      const geo = new THREE.SphereGeometry(baseRadius, 32, 32)
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(n.color),
        emissive: new THREE.Color(n.glowColor),
        emissiveIntensity: n.isCore ? 0.75 : 0.45,
        roughness: 0.25,
        metalness: 0.25
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(n.pos)
      mesh.userData = {
        id: n.id,
        data: n,
        baseRadius,
        basePos: n.pos.clone(),
        phase: nodeIdx * 0.75
      }

      // Halo de resplandor
      const glowGeo = new THREE.SphereGeometry(baseRadius * 1.55, 24, 24)
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(n.color),
        transparent: true,
        opacity: n.isCore ? 0.35 : 0.22,
        blending: THREE.AdditiveBlending
      })
      const glowMesh = new THREE.Mesh(glowGeo, glowMat)
      mesh.add(glowMesh)

      // Satélites y Astrolabio
      const satellites = []

      if (n.isCore) {
        const makeRing = (rotX, rotY, colorHex) => {
          const ringGeo = new THREE.TorusGeometry(baseRadius * 2.3, 0.12, 16, 64)
          const ringMat = new THREE.MeshBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
          })
          const rMesh = new THREE.Mesh(ringGeo, ringMat)
          rMesh.rotation.x = rotX
          rMesh.rotation.y = rotY
          mesh.add(rMesh)
          return rMesh
        }

        const r1 = makeRing(Math.PI / 3, 0, currentTheme.coreColor)
        const r2 = makeRing(0, Math.PI / 3, currentTheme.coreGlow)
        const r3 = makeRing(Math.PI / 4, Math.PI / 4, 0xffffff)
        mesh.userData.rings = [r1, r2, r3]
      } else {
        const satGeo = new THREE.SphereGeometry(0.65, 12, 12)
        const satMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(n.glowColor),
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending
        })
        const satMesh = new THREE.Mesh(satGeo, satMat)
        mesh.add(satMesh)

        satellites.push({
          mesh: satMesh,
          dist: baseRadius * 2.2,
          speed: 1.2 + (nodeIdx % 3) * 0.4,
          angleOffset: nodeIdx * 1.2
        })
      }

      nodeGroup.add(mesh)
      state.nodesMap.set(n.id, {
        mesh,
        data: n,
        basePos: n.pos.clone(),
        phase: nodeIdx * 0.75,
        satellites
      })
    })

    // D. Líneas de Constelación
    const linesGroup = new THREE.Group()
    scene.add(linesGroup)
    state.linesGroup = linesGroup

    const pulsesGroup = new THREE.Group()
    scene.add(pulsesGroup)
    state.pulsesGroup = pulsesGroup
    state.pulsesData = []

    graphData.links.forEach((link, idx) => {
      const srcPos = link.source.pos
      const dstPos = link.target.pos

      const points = [srcPos, dstPos]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)

      let lineColor = link.isConvergence
        ? currentTheme.linesConvergence
        : link.isCoreLink
        ? currentTheme.linesCore
        : currentTheme.linesFriendship

      const lineMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: link.isConvergence ? 0.85 : link.isCoreLink ? 0.35 : 0.55,
        blending: THREE.AdditiveBlending
      })

      const lineMesh = new THREE.Line(lineGeo, lineMat)
      lineMesh.userData = {
        sourceId: link.source.id,
        targetId: link.target.id,
        baseOpacity: lineMat.opacity,
        baseColor: lineColor
      }
      linesGroup.add(lineMesh)

      if (idx % 2 === 0 || link.isConvergence) {
        const pulseGeo = new THREE.SphereGeometry(0.85, 10, 10)
        const pulseMat = new THREE.MeshBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending
        })
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat)
        pulsesGroup.add(pulseMesh)

        state.pulsesData.push({
          mesh: pulseMesh,
          srcId: link.source.id,
          dstId: link.target.id,
          progress: Math.random(),
          speed: 0.0035 + Math.random() * 0.003
        })
      }
    })

    // E. Ciclo de Animación (60 FPS)
    let animationFrameId
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      controls.update()

      starField.rotation.y = elapsedTime * 0.012
      nebFriendship.rotation.z = elapsedTime * 0.02
      nebRomance.rotation.z = -elapsedTime * 0.02
      nebCore.rotation.z = elapsedTime * 0.015

      // Flotación suave y rotación de satélites
      state.nodesMap.forEach(({ mesh, basePos, phase, satellites, data }) => {
        // En el Núcleo (Tú), mantenemos el movimiento suave sin oscilaciones excesivas
        if (data.isCore) {
          mesh.position.y = basePos.y + Math.sin(elapsedTime * 1.0) * 0.6
          if (mesh.userData.rings) {
            mesh.userData.rings[0].rotation.z = elapsedTime * 0.7
            mesh.userData.rings[1].rotation.x = elapsedTime * 0.5
            mesh.userData.rings[2].rotation.y = elapsedTime * 0.6
          }
        } else {
          mesh.position.y = basePos.y + Math.sin(elapsedTime * 1.5 + phase) * 2.0
          mesh.position.x = basePos.x + Math.cos(elapsedTime * 0.8 + phase) * 0.6
        }

        satellites.forEach((sat) => {
          const a = elapsedTime * sat.speed + sat.angleOffset
          sat.mesh.position.set(
            Math.cos(a) * sat.dist,
            Math.sin(a * 1.8) * (sat.dist * 0.35),
            Math.sin(a) * sat.dist
          )
        })
      })

      // Actualizar líneas
      if (state.linesGroup) {
        state.linesGroup.children.forEach((l) => {
          const srcNode = state.nodesMap.get(l.userData.sourceId)
          const dstNode = state.nodesMap.get(l.userData.targetId)
          if (srcNode && dstNode) {
            const posAttr = l.geometry.attributes.position
            posAttr.setXYZ(0, srcNode.mesh.position.x, srcNode.mesh.position.y, srcNode.mesh.position.z)
            posAttr.setXYZ(1, dstNode.mesh.position.x, dstNode.mesh.position.y, dstNode.mesh.position.z)
            posAttr.needsUpdate = true
          }
        })
      }

      // Animación de fotones
      state.pulsesData.forEach((p) => {
        p.progress += p.speed
        if (p.progress > 1) p.progress = 0

        const srcNode = state.nodesMap.get(p.srcId)
        const dstNode = state.nodesMap.get(p.dstId)
        if (srcNode && dstNode) {
          p.mesh.position.lerpVectors(srcNode.mesh.position, dstNode.mesh.position, p.progress)
        }
      })

      // Sincronizar etiquetas flotantes SIN JITTER / SIN BUG DE HOVER
      if (labelsOverlayRef.current) {
        const overlay = labelsOverlayRef.current
        state.nodesMap.forEach(({ mesh, data }) => {
          const wrapperEl = overlay.querySelector(`[data-wrapper-id="${data.id}"]`)
          if (wrapperEl) {
            const worldPos = mesh.position.clone()
            worldPos.y += mesh.userData.baseRadius + (data.isCore ? 3.4 : 2.6)
            worldPos.project(camera)

            const isBehind = worldPos.z > 1
            if (isBehind) {
              wrapperEl.style.display = 'none'
            } else {
              wrapperEl.style.display = 'block'
              const screenX = (worldPos.x * 0.5 + 0.5) * state.width
              const screenY = (-(worldPos.y * 0.5) + 0.5) * state.height
              wrapperEl.style.left = `${screenX}px`
              wrapperEl.style.top = `${screenY}px`
            }
          }
        })
      }

      // Animación de cámara Fly-To
      if (state.animatingFlyTo) {
        state.flyProgress += 0.035
        if (state.flyProgress >= 1) {
          state.flyProgress = 1
          state.animatingFlyTo = false
        }

        const t = state.flyProgress
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

        camera.position.lerpVectors(state.flyStartPos, state.flyEndPos, ease)
        controls.target.lerpVectors(state.flyStartTarget, state.flyEndTarget, ease)
      }

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      const w = mountRef.current.clientWidth
      const h = mountRef.current.clientHeight
      state.width = w
      state.height = h
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [graphData, loading, themeMode])

  // 4. Sincronizar auto-rotación
  useEffect(() => {
    if (threeStateRef.current.controls) {
      threeStateRef.current.controls.autoRotate = autoRotate
    }
  }, [autoRotate])

  // 5. Interacción Raycaster (Hover)
  const handlePointerMove = (e) => {
    const state = threeStateRef.current
    if (!state.renderer || !state.camera || !mountRef.current) return

    const rect = mountRef.current.getBoundingClientRect()
    state.mouse.x = ((e.clientX - rect.left) / state.width) * 2 - 1
    state.mouse.y = -((e.clientY - rect.top) / state.height) * 2 + 1

    state.raycaster.setFromCamera(state.mouse, state.camera)

    const meshes = Array.from(state.nodesMap.values()).map((v) => v.mesh)
    const intersects = state.raycaster.intersectObjects(meshes, false)

    if (intersects.length > 0) {
      const hit = intersects[0].object
      const nodeData = hit.userData.data
      setHoveredNode(nodeData)
      mountRef.current.style.cursor = 'pointer'

      hit.scale.set(1.25, 1.25, 1.25)

      if (state.linesGroup) {
        state.linesGroup.children.forEach((l) => {
          const isConnected = l.userData.sourceId === nodeData.id || l.userData.targetId === nodeData.id
          l.material.opacity = isConnected ? 0.98 : 0.12
        })
      }
    } else {
      if (hoveredNode) {
        state.nodesMap.forEach(({ mesh }) => {
          mesh.scale.set(1, 1, 1)
        })
        if (state.linesGroup) {
          state.linesGroup.children.forEach((l) => {
            l.material.opacity = l.userData.baseOpacity
          })
        }
      }
      setHoveredNode(null)
      if (mountRef.current) mountRef.current.style.cursor = 'grab'
    }
  }

  // 6. Clic en Estrella -> Fly-To
  const handlePointerDown = (e) => {
    const state = threeStateRef.current
    if (!state.renderer || !state.camera || !mountRef.current) return

    const rect = mountRef.current.getBoundingClientRect()
    state.mouse.x = ((e.clientX - rect.left) / state.width) * 2 - 1
    state.mouse.y = -((e.clientY - rect.top) / state.height) * 2 + 1

    state.raycaster.setFromCamera(state.mouse, state.camera)
    const meshes = Array.from(state.nodesMap.values()).map((v) => v.mesh)
    const intersects = state.raycaster.intersectObjects(meshes, false)

    if (intersects.length > 0) {
      const hit = intersects[0].object
      const nodeData = hit.userData.data
      flyToNode(nodeData)
    }
  }

  const flyToNode = (nodeData) => {
    const state = threeStateRef.current
    if (!state.camera || !state.controls) return

    setSelectedPerson(nodeData)

    const targetPos = nodeData.pos.clone()
    const offset = new THREE.Vector3(0, 8, 30)
    const endCameraPos = targetPos.clone().add(offset)

    state.flyStartPos = state.camera.position.clone()
    state.flyEndPos = endCameraPos
    state.flyStartTarget = state.controls.target.clone()
    state.flyEndTarget = targetPos
    state.flyProgress = 0
    state.animatingFlyTo = true
  }

  const resetCamera = () => {
    const state = threeStateRef.current
    if (!state.camera || !state.controls) return

    setSelectedPerson(null)

    state.flyStartPos = state.camera.position.clone()
    state.flyEndPos = new THREE.Vector3(0, 40, 155)
    state.flyStartTarget = state.controls.target.clone()
    state.flyEndTarget = new THREE.Vector3(0, 0, 0)
    state.flyProgress = 0
    state.animatingFlyTo = true
  }

  const handleFilterChange = (filter) => {
    setFilterGalaxy(filter)
    const state = threeStateRef.current
    if (!state.nodesMap) return

    state.nodesMap.forEach(({ mesh, data }) => {
      let visible = true
      if (filter === 'friendship') visible = data.galaxy === 'friendship' || data.isCore
      if (filter === 'romance') visible = data.galaxy === 'romance' || data.isCore
      if (filter === 'convergences') visible = data.sharedCount >= 2 || data.isCore

      mesh.visible = visible
    })

    if (state.linesGroup) {
      state.linesGroup.children.forEach((line) => {
        const srcNode = state.nodesMap.get(line.userData.sourceId)
        const dstNode = state.nodesMap.get(line.userData.targetId)
        line.visible = !!(srcNode?.mesh.visible && dstNode?.mesh.visible)
      })
    }
  }

  return (
    <div className={`constellation-viewport theme-${themeMode}`}>
      {/* Canvas 3D */}
      <div
        ref={mountRef}
        className="constellation-canvas-container"
        onMouseMove={handlePointerMove}
        onPointerDown={handlePointerDown}
      />

      {/* Capa de Etiquetas Flotantes en 3D (Desacopladas para CERO JITTER) */}
      <div ref={labelsOverlayRef} className="constellation-labels-overlay">
        {graphData.nodes.map((node) => (
          <div
            key={node.id}
            data-wrapper-id={node.id}
            className="floating-badge-wrapper"
          >
            <div
              className={`floating-star-badge ${node.isCore ? 'core-badge' : ''} ${hoveredNode?.id === node.id ? 'is-hovered' : ''}`}
              onClick={() => flyToNode(node)}
              style={{
                borderColor: node.color,
                boxShadow: `0 4px 16px ${node.color}44`
              }}
            >
              <span className="badge-avatar" style={{ backgroundColor: node.color }}>
                {node.icon}
              </span>
              <div className="badge-text">
                <span className="badge-name">{node.name}</span>
                <span className="badge-role" style={{ color: node.color }}>
                  {node.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de Controles Superiores (HUD Cósmico con Tipografía Aristocrática & Elegante) */}
      <header className="constellation-hud">
        <div className="hud-brand">
          <div className="hud-badge">
            <Sparkles size={15} />
            <span>COSMOS DE VÍNCULOS</span>
          </div>
          <h1 className="hud-title">Constelación del Multiverso</h1>
          <p className="hud-subtitle">
            {people.length} estrellas vinculadas • {graphData.links.length} lazos de realidad
          </p>
        </div>

        {/* Filtros de Galaxias */}
        <div className="hud-filters">
          <button
            className={`hud-chip ${filterGalaxy === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <Compass size={14} />
            <span>Todo el Cosmos</span>
          </button>
          <button
            className={`hud-chip hud-chip--mint ${filterGalaxy === 'friendship' ? 'active' : ''}`}
            onClick={() => handleFilterChange('friendship')}
          >
            <Users size={14} />
            <span>Galaxia Amistades</span>
          </button>
          <button
            className={`hud-chip hud-chip--rose ${filterGalaxy === 'romance' ? 'active' : ''}`}
            onClick={() => handleFilterChange('romance')}
          >
            <Heart size={14} />
            <span>Vínculos & Romance</span>
          </button>
          <button
            className={`hud-chip hud-chip--vanilla ${filterGalaxy === 'convergences' ? 'active' : ''}`}
            onClick={() => handleFilterChange('convergences')}
          >
            <Zap size={14} />
            <span>Convergencias</span>
          </button>
        </div>

        {/* Acciones Rápidas & Selector de Tema de Color */}
        <div className="hud-actions">
          {/* Selector de Tema */}
          <div className="theme-selector-container">
            <button
              className="hud-btn theme-toggle-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Cambiar Color de Fondo & Atmósfera"
            >
              <Palette size={16} />
              <span>{THEME_CONFIGS[themeMode].name}</span>
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  className="theme-dropdown-menu"
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                >
                  {Object.values(THEME_CONFIGS).map((t) => (
                    <button
                      key={t.id}
                      className={`theme-menu-item ${themeMode === t.id ? 'selected' : ''}`}
                      onClick={() => {
                        setThemeMode(t.id)
                        setShowThemeMenu(false)
                      }}
                    >
                      <span className="theme-item-icon">{t.icon}</span>
                      <div className="theme-item-info">
                        <span className="theme-item-name">{t.name}</span>
                        <span className="theme-item-desc">
                          {t.id === 'cyan'
                            ? 'Celeste radiante oceánico (Recomendado)'
                            : t.id === 'ivory'
                            ? 'Fondo blanco astral marfil y oro'
                            : 'Crepúsculo violeta y aurora boreal'}
                        </span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className={`hud-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pausar giro orbital' : 'Activar giro orbital suave'}
          >
            <Layers size={16} />
            <span>{autoRotate ? 'Órbita Activa' : 'Órbita Libre'}</span>
          </button>

          <button className="hud-btn" onClick={resetCamera} title="Reencuadrar Cosmos">
            <RotateCcw size={16} />
            <span>Centrar</span>
          </button>

          <button
            className={`hud-btn ${showGuide ? 'active' : ''}`}
            onClick={() => setShowGuide(!showGuide)}
            title="Guía de Interacción"
          >
            <Info size={16} />
          </button>
        </div>
      </header>

      {/* Popover de Guía de Navegación */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            className="hud-guide-popover"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="guide-header">
              <Sparkles size={16} />
              <h4>Guía de Exploración 3D</h4>
              <button onClick={() => setShowGuide(false)}>
                <X size={14} />
              </button>
            </div>
            <ul>
              <li>
                <strong>Arrastrar con el ratón:</strong> Rota y viaja alrededor de las galaxias.
              </li>
              <li>
                <strong>Rueda del ratón (Scroll):</strong> Zoom profundo hacia el interior de cualquier cúmulo.
              </li>
              <li>
                <strong>Clic en cualquier Estrella o Etiqueta:</strong> Transición suave <em>Fly-To</em> cinemática hacia esa persona.
              </li>
              <li>
                <strong>Paleta de Colores:</strong> Puedes alternar entre <em>Celeste Radiante</em>, <em>Blanco Astral (Marfil)</em> o <em>Crepúsculo</em> en el botón superior.
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Holográfico Lateral (Línea de Vida Compartida) */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.aside
            className="constellation-drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header del Inspector */}
            <div className="drawer-header">
              <div className="drawer-star-badge" style={{ borderColor: selectedPerson.color }}>
                <span className="drawer-star-icon" style={{ backgroundColor: selectedPerson.color }}>
                  {selectedPerson.icon}
                </span>
                <div>
                  <h3 className="drawer-name">{selectedPerson.name}</h3>
                  <span className="drawer-tag" style={{ color: selectedPerson.color }}>
                    ✦ {selectedPerson.role}
                  </span>
                </div>
              </div>

              <div className="drawer-actions">
                <button className="drawer-close-btn" onClick={resetCamera} title="Cerrar y Reencuadrar">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Métricas de Conexión Cuántica */}
            <div className="drawer-stats">
              <div className="stat-card">
                <span className="stat-num">{selectedPerson.isCore ? stories.length : selectedPerson.sharedCount}</span>
                <span className="stat-label">Vivencias Juntos</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">
                  {selectedPerson.isCore
                    ? people.length
                    : selectedPerson.sharedStories?.filter((s) => s.category?.includes('Canón')).length || 0}
                </span>
                <span className="stat-label">
                  {selectedPerson.isCore ? 'Personas en Órbita' : 'Puntos Canónicos'}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-num" style={{ textTransform: 'capitalize' }}>
                  {selectedPerson.galaxy === 'friendship' ? 'Amistad' : selectedPerson.galaxy === 'romance' ? 'Romance' : 'Núcleo'}
                </span>
                <span className="stat-label">Galaxia Orbital</span>
              </div>
            </div>

            {/* Contenido / Memorias Compartidas */}
            <div className="drawer-body">
              {selectedPerson.isCore ? (
                <div className="drawer-core-summary">
                  <p className="core-bio">
                    {profile?.bio || 'Tú eres el punto de origen y confluencia de todas las historias registradas en KAIRÓS.'}
                  </p>
                  <div className="core-motto-box">
                    <span className="motto-label">Lema del Multiverso</span>
                    <p className="motto-text">
                      "{profile?.timelineMotto || 'Cada recuerdo es un punto de anclaje en el multiverso.'}"
                    </p>
                  </div>
                  <div className="drawer-empty-actions">
                    <button className="btn-go-notes" onClick={() => navigate('/notes')}>
                      <BookOpen size={16} />
                      <span>Escribir en el Diario</span>
                    </button>
                  </div>
                </div>
              ) : selectedPerson.sharedStories?.length > 0 ? (
                <div className="drawer-stories-list">
                  <h4 className="drawer-section-title">
                    <Calendar size={15} />
                    <span>Línea de Vida Compartida ({selectedPerson.sharedStories.length})</span>
                  </h4>

                  {selectedPerson.sharedStories.map((story) => (
                    <div key={story.id} className="drawer-story-card">
                      <div className="card-top">
                        <span className="story-cat-badge">
                          {story.icon || '📝'} {story.category || 'Salida Casual'}
                        </span>
                        <span className="story-date">
                          {story.eventDate ? new Date(story.eventDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Sin fecha'}
                        </span>
                      </div>

                      <h5 className="story-title">{story.title}</h5>
                      {story.story && (
                        <p className="story-snippet">
                          {story.story.length > 120 ? story.story.slice(0, 120) + '...' : story.story}
                        </p>
                      )}

                      {story.images && story.images.length > 0 && (
                        <div className="story-photos-row">
                          {story.images.slice(0, 3).map((img, idx) => (
                            <img key={idx} src={img} alt="Memoria" className="story-photo-thumb" />
                          ))}
                          {story.images.length > 3 && (
                            <span className="more-photos-badge">+{story.images.length - 3}</span>
                          )}
                        </div>
                      )}

                      {story.songTitle && (
                        <div className="story-song-chip">
                          <Music size={12} />
                          <span>{story.songTitle}</span>
                        </div>
                      )}

                      <button
                        className="btn-card-inspect"
                        onClick={() => navigate('/notes')}
                      >
                        <span>Abrir en Diario</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="drawer-empty-stories">
                  <p>Aún no has registrado una vivencia vinculando a <strong>{selectedPerson.name}</strong>.</p>
                  <button className="btn-go-notes" onClick={() => navigate('/notes')}>
                    <BookOpen size={16} />
                    <span>Crear Primera Memoria con {selectedPerson.name}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer del Drawer */}
            <div className="drawer-footer">
              <button className="drawer-recenter-btn" onClick={resetCamera}>
                <Maximize2 size={15} />
                <span>Alejar Cámara y Explorar el Multiverso</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
