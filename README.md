<div align="center">

# ✦ KAIRÓS ✦
### *Personal Multiverse & Timeline Convergence Engine*

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org)
[![React Version](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite Tooling](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local--First-22c55e?style=for-the-badge&logo=adguard&logoColor=white)](#-privacidad-y-filosof%C3%ADa-local-first)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](#-licencia)

<p align="center">
  <b>Un museo personal y diario de memorias multidimensional.</b><br>
  Registra tus vivencias, bifurcaciones de realidad, relaciones y convergencias en un entorno privado, autónomo y sin dependencias en la nube.
</p>

[✨ Características](#-características-principales) •
[🏛️ Arquitectura](#-arquitectura-del-sistema) •
[🚀 Inicio Rápido](#-inicio-rápido) •
[🌿 Estrategia de Ramas & Commits](#-estrategia-de-git--ramas) •
[🔒 Privacidad](#-privacidad-y-filosofía-local-first)

---

</div>

## 🌌 El Concepto: *Chronos vs. Kairós*

En la filosofía griega clásica existen dos conceptos fundamentales para comprender el tiempo:
* **Chronos (χρόνος):** El tiempo cuantitativo, mecánico y secuencial que mide el reloj.
* **Kairós (καιρός):** El momento oportuno, el instante supremo, la vivencia que transforma el destino o marca un antes y un después en nuestras relaciones.

**KAIRÓS** trasciende los diarios cronológicos tradicionales. Permite cartografiar tu vida como un **multiverso interactivo**: corrientes paralelas de amistad, romance y proyectos personales que conviven, se bifurcan y convergen en instantes irrepetibles.

---

## ✨ Características Principales

### 1. 🌊 Línea Temporal Multiverso (Canvas de Corrientes)
* Visualización fluida de corrientes temporales mediante curvas Bézier cúbicas con física orgánica.
* **Detección de Convergencias:** Cuando una vivencia cruza a personas de círculos distintos (ej. amigos y pareja en el mismo suceso), KAIRÓS genera un nodo de convergencia con animación de entrelazamiento cuántico.
* Tarjetas de recuerdos interactivas con estados vacíos poéticos y sin datos ficticios precargados.

### 2. ✍️ Diario de Vivencias (Inspirado en Day One & Notion)
* Editor minimalista enfocado en la escritura reflexiva sin distracciones.
* **Perspectivas Múltiples:** Guarda reflexiones desde la perspectiva de la amistad, del vínculo o de la decisión personal.
* Marcadores temporales por épocas, fecha estelar, estados de ánimo y categorías.

### 3. 👥 Gestión de Personas & Círculos Relacionales
* Selector y creador dinámico de contactos con **etiquetas personalizadas y fluidas** (*"Brother"*, *"Casi algo"*, *"Amiga del colegio"*, *"Mentor"*).
* Auras de color personalizadas y avatares simbólicos.
* Trazabilidad de cada persona vinculada a tus historias.

### 4. 🛡️ Bitácora de Auditoría en Tiempo Real (`Analytics`)
* Registro inmutable de cada cambio: creaciones de memorias, ajustes de etiquetas, incorporaciones de personas y eliminaciones de seguridad.
* Métricas en tiempo real con buscador interactivo y filtrado por categoría de evento.
* Acciones protegidas contra accidentes mediante confirmación en dos pasos.

### 5. 🎨 Experiencia Visual Glassmorphic & Notificaciones Nativas
* **Cero alertas genéricas del navegador:** Se sustituyeron todos los diálogos estándar (`localhost dice...`) por modales de confirmación con diseño Glassmorphism pulido y microinteracciones de Framer Motion.
* Banners flotantes tipo **Toast** para confirmaciones inmediatas y fluidas.

---

## 🏛️ Arquitectura del Sistema

KAIRÓS está diseñado bajo una **arquitectura híbrida de alta resiliencia**:

```
 ┌────────────────────────────────────────────────────────┐
 │                      KAIRÓS UI                         │
 │     React 19 + Framer Motion + Glassmorphic Design     │
 └──────────────────────────┬─────────────────────────────┘
                            │  HTTP / Localhost
 ┌──────────────────────────▼─────────────────────────────┐
 │                MOTOR AUTÓNOMO EN GO                    │
 │               (Compilado: kairos.exe)                  │
 │                                                        │
 │  • Servidor HTTP Nativo (:8080)                        │
 │  • Frontend embebido al 100% en RAM (embed.FS)         │
 │  • Endpoints REST: /api/stories, /api/people,          │
 │                    /api/profile, /api/audit            │
 │  • Bloqueos concurrentes con sync.RWMutex              │
 └──────────────────────────┬─────────────────────────────┘
                            │  I/O Atómico
 ┌──────────────────────────▼─────────────────────────────┐
 │               BASE DE DATOS LOCAL (data/)              │
 │   stories.json │ people.json │ profile.json │ audit.json│
 └────────────────────────────────────────────────────────┘
```

* **Frontend Embebido:** El código web compilado (`dist/`) se empaqueta directamente en el binario ejecutable (`kairos.exe`).
* **Zero-Setup:** Un usuario final no necesita tener instalado Node.js, NPM ni Go para usar la app; basta con ejecutar `kairos.exe`.
* **Doble Modo:** Modo desarrollo ultrarrápido con Vite HMR (`:3000`) o modo ejecutable final con Go (`:8080`).

---

## 🚀 Inicio Rápido

### Opción A: Modo Ejecutable Autónomo (Recomendado para Usuario)
No requiere Node.js ni instalaciones adicionales.

1. Haz doble clic en **`kairos.exe`** (o ejecútalo por consola):
   ```powershell
   .\kairos.exe
   ```
2. KAIRÓS abrirá automáticamente tu navegador en **`http://localhost:8080`**.
3. Todos tus recuerdos se guardarán de forma local en la carpeta `data/`.

---

### Opción B: Modo Desarrollo Web (Para Programar)
Requiere [Node.js](https://nodejs.org/) v18+ instalado.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/0xhazroot/Kairos.git
   cd Kairos
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo en caliente:**
   ```bash
   npm run dev
   ```
   Accede en: `http://localhost:3000`.

---

### Opción C: Compilar el Binario Go desde Código
Si realizaste modificaciones al frontend y deseas actualizar el archivo `kairos.exe`:

* **En Windows (un clic):**
  Ejecuta el script incluido:
  ```powershell
  .\build-go.bat
  ```

* **Manualmente por terminal:**
  ```powershell
  npm run build
  go build -o kairos.exe .
  ```

---

## 📂 Estructura del Proyecto

```text
kairos/
├── data/                    # Almacenamiento local privado en JSON
│   ├── .gitkeep             # Preserva la carpeta en Git sin filtrar datos privados
│   ├── stories.json         # Historias y memorias
│   ├── people.json          # Personas y etiquetas
│   ├── profile.json         # Identidad del usuario
│   └── audit.json           # Registro de auditoría
├── src/
│   ├── components/          # Componentes modulares y reutilizables
│   │   ├── ConfirmModal.jsx # Modal glassmorphic para reemplazo de confirm()
│   │   ├── Toast.jsx        # Notificaciones flotantes
│   │   ├── PeopleSelector.jsx # Selector y gestor de etiquetas de contactos
│   │   ├── ConvergenceViewer.jsx # Visor de cruces cuánticos
│   │   ├── StoryModal.jsx   # Detalle de historia
│   │   └── Sidebar.jsx      # Navegación lateral animada
│   ├── pages/               # Vistas principales de la aplicación
│   │   ├── Home.jsx         # Resumen y métricas de entrada
│   │   ├── Timelines.jsx    # Lienzo multidimensional del multiverso
│   │   ├── Notes.jsx        # Diario y bloc de vivencias
│   │   ├── Branches.jsx     # Explorador de ramificaciones alternativas
│   │   ├── Analytics.jsx    # Bitácora de auditoría y eventos en tiempo real
│   │   └── Profile.jsx      # Perfil de usuario, avatar y aura cósmica
│   ├── services/            # Capa de servicios (Stories, People, Profile, Audit)
│   ├── styles/              # Tokens CSS globales, temas y glassmorphism
│   ├── App.jsx              # Enrutador principal y layout
│   └── main.jsx             # Punto de entrada de React
├── build-go.bat             # Automatización de build (Frontend + Go)
├── main.go                  # Servidor de alto rendimiento en Go con embed
├── go.mod                   # Definición de módulo Go
├── package.json             # Manifiesto de paquetes frontend
└── README.md                # Documentación del proyecto
```

---

## 🌿 Estrategia de Git & Ramas

Para garantizar orden, escalabilidad y un historial limpio conforme el proyecto evolucione hacia versión web y aplicación móvil (**Mobile App**), seguimos el modelo estructurado de desarrollo:

### 1. Jerarquía de Ramas

```
 main (Producción / Versiones estables listas para distribución)
  │
  ├── develop (Integración de features en curso para Web)
  │    ├── feature/nombre-de-la-mejora
  │    └── fix/nombre-del-bug
  │
  └── mobile (Rama base para el desarrollo de la App Móvil)
       ├── mobile/screens
       └── mobile/offline-sync
```

| Rama | Propósito | Regla de Oro |
| :--- | :--- | :--- |
| **`main`** | Código en producción, estable y testeado. | Todo commit aquí debe compilar y funcionar sin errores. |
| **`develop`** | Rama activa para el desarrollo continuo de la web app. | Aquí se integran los nuevos módulos antes de pasar a `main`. |
| **`mobile`** | Rama especializada para la aplicación móvil (React Native / Capacitor / Flutter). | Se mantiene sincronizada con la lógica del core. |
| **`feature/*`** | Ramas temporales para construir una funcionalidad específica. | Nacen de `develop` y se fusionan mediante Pull Request. |
| **`fix/*`** | Correcciones rápidas de bugs detectados. | Se enfocan en resolver un problema puntual. |

### 2. Formato de Commits Convencionales (Conventional Commits)

Cada commit debe utilizar un prefijo semántico que comunique la naturaleza exacta del cambio:

* `feat:` Nueva funcionalidad para el usuario *(ej. `feat: implementa selector de personas con etiquetas dinámicas`)*.
* `fix:` Corrección de un fallo o comportamiento erróneo *(ej. `fix: resuelve desborde visual en nodo de convergencia`)*.
* `docs:` Cambios exclusivos en documentación *(ej. `docs: actualiza especificación de arquitectura en README`)*.
* `style:` Ajustes visuales, diseño CSS, espaciados o formateo que no modifican lógica *(ej. `style: mejora diseño glassmorphism del modal de confirmación`)*.
* `refactor:` Reestructuración interna de código que ni añade feature ni corrige bug *(ej. `refactor: desacopla servicio de auditoría a módulo independiente`)*.
* `chore:` Actualización de scripts de build, dependencias o herramientas *(ej. `chore: añade build-go.bat y soporte para embed en Go`)*.

---

## 🔒 Privacidad y Filosofía Local-First

* **Tus recuerdos son exclusivamente tuyos:** KAIRÓS no envía datos a servidores externos, ni incluye librerías de analítica, cookies de rastreo ni servicios de terceros.
* **Tus archivos se quedan en tu máquina:** La carpeta `data/` almacena tus memorias en archivos JSON planos y legibles que tú controlas y puedes respaldar, cifrar o mover con total libertad.
* El archivo `.gitignore` protege automáticamente tus archivos `data/*.json` para que nunca se suban por accidente a repositorios públicos de GitHub.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Eres libre de usarlo, modificarlo y adaptarlo a tu propio multiverso personal.

---

<div align="center">
  <sub>Construido con dedicación para preservar momentos que trascienden el tiempo.</sub>
</div>
