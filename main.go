package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

// Embebe todo el frontend compilado dentro del binario único
//
//go:embed all:dist
var distFS embed.FS

type Story struct {
	ID                    string   `json:"id"`
	Icon                  string   `json:"icon,omitempty"`
	Title                 string   `json:"title"`
	Date                  string   `json:"date"`
	Epoch                 string   `json:"epoch"`
	Stream                string   `json:"stream"`
	Category              string   `json:"category"`
	BadgeClass            string   `json:"badgeClass"`
	Participants          []string `json:"participants"`
	Tags                  []string `json:"tags,omitempty"`
	Summary               string   `json:"summary"`
	Story                 string   `json:"story"`
	CoverImage            string   `json:"coverImage,omitempty"`
	Images                []string `json:"images,omitempty"`
	EventDate             string   `json:"eventDate,omitempty"`
	FriendshipPerspective string   `json:"friendshipPerspective,omitempty"`
	RomancePerspective    string   `json:"romancePerspective,omitempty"`
	Coords                struct {
		X float64 `json:"x"`
		Y float64 `json:"y"`
	} `json:"coords"`
	CreatedAt string `json:"createdAt"`
}

type Person struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Role        string `json:"role"`
	Stream      string `json:"stream"`
	AvatarColor string `json:"avatarColor"`
	Icon        string `json:"icon"`
	Bio         string `json:"bio"`
	CreatedAt   string `json:"createdAt"`
}

type Profile struct {
	Name          string `json:"name"`
	Nickname      string `json:"nickname"`
	Handle        string `json:"handle"`
	Bio           string `json:"bio"`
	AvatarIcon    string `json:"avatarIcon"`
	AvatarColor   string `json:"avatarColor"`
	StartedAt     string `json:"startedAt"`
	TimelineMotto string `json:"timelineMotto"`
}

type AuditEntry struct {
	ID            string `json:"id"`
	Timestamp     string `json:"timestamp"`
	TimeFormatted string `json:"timeFormatted"`
	DateFormatted string `json:"dateFormatted"`
	Action        string `json:"action"`
	Details       string `json:"details"`
	Type          string `json:"type"`
}

var (
	dataFile    = filepath.Join("data", "stories.json")
	peopleFile  = filepath.Join("data", "people.json")
	profileFile = filepath.Join("data", "profile.json")
	auditFile   = filepath.Join("data", "audit.json")

	mu        sync.RWMutex
	peopleMu  sync.RWMutex
	profileMu sync.RWMutex
	auditMu   sync.RWMutex
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// --- Stories ---
func readStories() ([]Story, error) {
	mu.RLock()
	defer mu.RUnlock()

	if _, err := os.Stat(dataFile); os.IsNotExist(err) {
		return []Story{}, nil
	}

	bytes, err := os.ReadFile(dataFile)
	if err != nil {
		return nil, err
	}

	var stories []Story
	if len(bytes) == 0 {
		return stories, nil
	}

	if err := json.Unmarshal(bytes, &stories); err != nil {
		return nil, err
	}
	return stories, nil
}

func writeStories(stories []Story) error {
	mu.Lock()
	defer mu.Unlock()

	dir := filepath.Dir(dataFile)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	bytes, err := json.MarshalIndent(stories, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(dataFile, bytes, 0644)
}

// --- People ---
func readPeople() ([]Person, error) {
	peopleMu.RLock()
	defer peopleMu.RUnlock()

	if _, err := os.Stat(peopleFile); os.IsNotExist(err) {
		return []Person{}, nil
	}

	bytes, err := os.ReadFile(peopleFile)
	if err != nil {
		return nil, err
	}

	var people []Person
	if len(bytes) == 0 {
		return people, nil
	}

	if err := json.Unmarshal(bytes, &people); err != nil {
		return nil, err
	}
	return people, nil
}

func writePeople(people []Person) error {
	peopleMu.Lock()
	defer peopleMu.Unlock()

	dir := filepath.Dir(peopleFile)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	bytes, err := json.MarshalIndent(people, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(peopleFile, bytes, 0644)
}

// --- Profile ---
func readProfile() (Profile, error) {
	profileMu.RLock()
	defer profileMu.RUnlock()

	defaultProf := Profile{
		Name:          "Samir Haziel",
		Nickname:      "Haziel",
		Handle:        "@haz_love",
		Bio:           "Arquitecto de mis propias líneas temporales y recuerdos.",
		AvatarIcon:    "⚡",
		AvatarColor:   "#6F5BA7",
		StartedAt:     "2026",
		TimelineMotto: "Cada recuerdo es un punto de anclaje en el multiverso.",
	}

	if _, err := os.Stat(profileFile); os.IsNotExist(err) {
		return defaultProf, nil
	}

	bytes, err := os.ReadFile(profileFile)
	if err != nil {
		return defaultProf, err
	}

	if len(bytes) == 0 {
		return defaultProf, nil
	}

	var p Profile
	if err := json.Unmarshal(bytes, &p); err != nil {
		return defaultProf, err
	}
	return p, nil
}

func writeProfile(p Profile) error {
	profileMu.Lock()
	defer profileMu.Unlock()

	dir := filepath.Dir(profileFile)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	bytes, err := json.MarshalIndent(p, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(profileFile, bytes, 0644)
}

// --- Audit ---
func readAudit() ([]AuditEntry, error) {
	auditMu.RLock()
	defer auditMu.RUnlock()

	if _, err := os.Stat(auditFile); os.IsNotExist(err) {
		return []AuditEntry{}, nil
	}

	bytes, err := os.ReadFile(auditFile)
	if err != nil {
		return nil, err
	}

	var entries []AuditEntry
	if len(bytes) == 0 {
		return entries, nil
	}

	if err := json.Unmarshal(bytes, &entries); err != nil {
		return nil, err
	}
	return entries, nil
}

func writeAudit(entries []AuditEntry) error {
	auditMu.Lock()
	defer auditMu.Unlock()

	dir := filepath.Dir(auditFile)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	bytes, err := json.MarshalIndent(entries, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(auditFile, bytes, 0644)
}

// --- Handlers ---
func storiesHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		stories, err := readStories()
		if err != nil {
			http.Error(w, fmt.Sprintf("Error leyendo historias: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stories)

	case http.MethodPost:
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error leyendo cuerpo", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var newStory Story
		if err := json.Unmarshal(body, &newStory); err != nil {
			http.Error(w, "JSON inválido", http.StatusBadRequest)
			return
		}

		stories, err := readStories()
		if err != nil {
			stories = []Story{}
		}

		updated := false
		for i, s := range stories {
			if s.ID == newStory.ID {
				stories[i] = newStory
				updated = true
				break
			}
		}
		if !updated {
			stories = append([]Story{newStory}, stories...)
		}

		if err := writeStories(stories); err != nil {
			http.Error(w, fmt.Sprintf("Error guardando historia: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newStory)

	default:
		http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
	}
}

func storyDetailHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == http.MethodDelete {
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) < 4 {
			http.Error(w, "ID requerido", http.StatusBadRequest)
			return
		}
		id := parts[3]

		stories, err := readStories()
		if err != nil {
			http.Error(w, "Error leyendo historias", http.StatusInternalServerError)
			return
		}

		filtered := make([]Story, 0, len(stories))
		for _, s := range stories {
			if s.ID != id {
				filtered = append(filtered, s)
			}
		}

		if err := writeStories(filtered); err != nil {
			http.Error(w, "Error guardando cambios", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
		return
	}

	http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
}

func peopleHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		people, err := readPeople()
		if err != nil {
			http.Error(w, fmt.Sprintf("Error leyendo personas: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(people)

	case http.MethodPost:
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error leyendo cuerpo", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var newPerson Person
		if err := json.Unmarshal(body, &newPerson); err != nil {
			http.Error(w, "JSON inválido", http.StatusBadRequest)
			return
		}

		people, err := readPeople()
		if err != nil {
			people = []Person{}
		}

		updated := false
		for i, p := range people {
			if p.ID == newPerson.ID {
				people[i] = newPerson
				updated = true
				break
			}
		}
		if !updated {
			people = append(people, newPerson)
		}

		if err := writePeople(people); err != nil {
			http.Error(w, fmt.Sprintf("Error guardando persona: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newPerson)

	default:
		http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
	}
}

func peopleDetailHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == http.MethodDelete {
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) < 4 {
			http.Error(w, "ID requerido", http.StatusBadRequest)
			return
		}
		id := parts[3]

		people, err := readPeople()
		if err != nil {
			http.Error(w, "Error leyendo personas", http.StatusInternalServerError)
			return
		}

		filtered := make([]Person, 0, len(people))
		for _, p := range people {
			if p.ID != id {
				filtered = append(filtered, p)
			}
		}

		if err := writePeople(filtered); err != nil {
			http.Error(w, "Error guardando cambios", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
		return
	}

	http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
}

func profileHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		p, err := readProfile()
		if err != nil {
			http.Error(w, "Error leyendo perfil", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(p)

	case http.MethodPost:
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error leyendo cuerpo", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var newProf Profile
		if err := json.Unmarshal(body, &newProf); err != nil {
			http.Error(w, "JSON inválido", http.StatusBadRequest)
			return
		}

		if err := writeProfile(newProf); err != nil {
			http.Error(w, "Error guardando perfil", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(newProf)

	default:
		http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
	}
}

func auditHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		entries, err := readAudit()
		if err != nil {
			http.Error(w, "Error leyendo bitácora", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(entries)

	case http.MethodPost:
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error leyendo cuerpo", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var entry AuditEntry
		if err := json.Unmarshal(body, &entry); err != nil {
			http.Error(w, "JSON inválido", http.StatusBadRequest)
			return
		}

		entries, err := readAudit()
		if err != nil {
			entries = []AuditEntry{}
		}

		// Insertar al inicio y limitar a 100
		entries = append([]AuditEntry{entry}, entries...)
		if len(entries) > 100 {
			entries = entries[:100]
		}

		if err := writeAudit(entries); err != nil {
			http.Error(w, "Error guardando auditoría", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(entry)

	case http.MethodDelete:
		if err := writeAudit([]AuditEntry{}); err != nil {
			http.Error(w, "Error vaciando bitácora", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"online","engine":"Go/embed","app":"KAIRÓS"}`))
}

func spaHandler(distSub fs.FS) http.HandlerFunc {
	fileServer := http.FileServer(http.FS(distSub))
	return func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}

		path := strings.TrimPrefix(r.URL.Path, "/")
		if path == "" {
			path = "index.html"
		}

		f, err := distSub.Open(path)
		if err == nil {
			f.Close()
			fileServer.ServeHTTP(w, r)
			return
		}

		indexFile, err := distSub.Open("index.html")
		if err != nil {
			http.Error(w, "index.html no encontrado en embed", http.StatusNotFound)
			return
		}
		defer indexFile.Close()
		content, _ := io.ReadAll(indexFile)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(content)
	}
}

func openBrowser(url string) {
	time.Sleep(500 * time.Millisecond)
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	_ = cmd.Start()
}

func main() {
	mux := http.NewServeMux()

	// Endpoints API Stories
	mux.HandleFunc("/api/stories", storiesHandler)
	mux.HandleFunc("/api/stories/", storyDetailHandler)

	// Endpoints API People (Day One Style)
	mux.HandleFunc("/api/people", peopleHandler)
	mux.HandleFunc("/api/people/", peopleDetailHandler)

	// Endpoints API Profile & Audit
	mux.HandleFunc("/api/profile", profileHandler)
	mux.HandleFunc("/api/audit", auditHandler)

	mux.HandleFunc("/api/health", healthHandler)

	// Servir frontend embebido
	distSub, err := fs.Sub(distFS, "dist")
	if err != nil {
		log.Fatalf("Error cargando frontend embebido: %v", err)
	}
	mux.HandleFunc("/", spaHandler(distSub))

	port := 8080
	url := fmt.Sprintf("http://localhost:%d", port)

	fmt.Println("==================================================================")
	fmt.Println("   ✦ KAIRÓS — Motor Multiverso en Go (Autónomo & Privado)")
	fmt.Println("==================================================================")
	fmt.Printf("   ➜ Servidor activo en: %s\n", url)
	fmt.Printf("   ➜ Almacenamiento local: data/ (stories, people, profile, audit)\n")
	fmt.Println("   ➜ Módulo de Auditoría & Perfil: Activo (/api/audit, /api/profile)")
	fmt.Println("   ➜ Frontend embebido en RAM al 100% (Sin dependencias externas)")
	fmt.Println("==================================================================")

	go openBrowser(url)

	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), mux); err != nil {
		log.Fatalf("Error iniciando servidor: %v", err)
	}
}
