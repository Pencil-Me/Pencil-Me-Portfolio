# Architektur-Entscheidungen (Agent-relevant)

Kurzform. Ausführlicher: [docs/adr/](../docs/adr/), [docs/refactoring/](../docs/refactoring/).

## D-01 — Shared Hosting ohne schwere PHP-Deps

**Entscheidung:** REST API ohne Guzzle, Monolog, vlucas/phpdotenv im Deploy-Paket.  
**Grund:** Dateilimit auf Shared Hosting (~1280 → ~41 Dateien).  
**Umsetzung:** `EnvLoader`, `AppLogger`, `HttpClient` in `src/Inc/`.

## D-02 — `.env.prod` hat immer Vorrang

**Entscheidung:** `EnvLoader::resolveEnvFilePath()` wählt `.env.prod`, wenn vorhanden — unabhängig von `.env.dev`.  
**Grund:** Alte `.env.dev` auf dem Server hat CORS mit leeren Origins verursacht.

## D-03 — API-Key als Query statt Header (Cross-Origin)

**Entscheidung:** Bei absoluter `API_BASE_URL` → `API_KEY_IN_QUERY: true`; Key in URL/Form, nicht `API-Key`-Header.  
**Grund:** Custom-Header erzwingt OPTIONS-Preflight; OPTIONS erreicht auf manchen Hostern PHP nicht.

## D-04 — CORS in PHP, nicht in `.htaccess`

**Entscheidung:** `CorsHeaders.php` setzt Header in PHP (`index.php`, `BaseController`, `Router`).  
**Grund:** `Header`-Direktiven in `.htaccess` → HTTP 500 auf vielen Shared-Hosting-Anbietern.

## D-05 — API `.htaccess` nur Rewrite

**Entscheidung:** Deploy-Template enthält ausschließlich `RewriteEngine` + `RewriteRule` → `index.php`.  
**Alternative verworfen:** CORS/SetEnv in Apache.

## D-06 — Deploy: `.env.dev` nie nach `deploy/out`

**Entscheidung:** `Copy-PhpSourceForDeploy` + `Assert-DeployPackageHasNoEnvDev`.  
**Grund:** Versehentlicher Upload von Dev-Env in Production verhindern.

## D-07 — Optionaler Same-Origin-Proxy `/api2`

**Entscheidung:** Frontend-`.htaccess` kann API auf Subdomain proxen (`apiBackendUrl` in deploy.config).  
**Grund:** Kein Browser-CORS nötig auf Hauptdomain.

## D-08 — Generische Terminologie

**Entscheidung:** Keine Hoster-Namen im Code/Kommentaren; „Shared Hosting“.  
**Ausnahme:** Echte SMTP-Hostnamen in `.env.prod` (z. B. `smtp.ionos.de`) — Konfiguration, kein Code-Hinweis.

## D-09 — Diagnose-Endpunkte getrennt

**Entscheidung:** `ping.php` (kurz) + `test.php` (voll) statt `__diag` in `index.php`.  
**Grund:** Production-Entry sauber halten; Diagnose explizit temporär.

## D-10 — Docker Shared-Hosting-Simulation

**Entscheidung:** `docker-compose.shared-hosting-sim.yml` — getrennte Ports/Origins ohne Nginx-Gateway.  
**Grund:** Lokales Cross-Origin-Verhalten wie Production testen.

## D-11 — Persistenter Agent-Kontext (`.agent/`)

**Entscheidung:** Wissen aus Deploy-/CORS-Sessions in `.agent/memory/` und `.agent/skills/` — nicht nur Chat-Historie.  
**Grund:** Kontinuität zwischen Agent-Sessions; `AGENTS.md` als Kurzindex.

## D-12 — Zweischichtiges AI-Wissenssystem

**Entscheidung:**
- **Portable:** `~/.ai-brain/` + Symlink `.ai-brain/` im Repo
- **Project:** `.agent/` gitignored; `.agent.example/` committet
- **Bootstrap:** `AGENTS.md`, `docs/adr/` committet; `docs/refactoring/` gitignored

**Grund:** Wiederverwendbarkeit zwischen Projekten/AI-Tools; klare Trennung generisch vs. projektspezifisch.

## D-13 — Spec-driven Code Quality mit Fallow

**Entscheidung:**
- Quality-Epics als committeter Plan unter `docs/plans/`
- Fallow (`dead-code`, `dupes`, `health`) als Frontend-Quality-Gate
- Kleine Phasen (Quick Wins → Coverage → Docs), kein Big-Bang-Refactor

**Grund:** Messbare Akzeptanzkriterien; Fallow findet toten Code/Exports; Scope bleibt kontrolliert.

## D-14 — Agent-Antwort am Plan-Phasenende

**Entscheidung:** Nach jeder Epic-Phase muss der Agent (1) Verification-Befehle ausführen und tabellarisch melden, (2) Plan-Checkboxen/Baseline aktualisieren, (3) **3–5 nächste Schritte** hierarchisiert (P0–P2) mit Impact + Risk liefern.

**Grund:** Reproduzierbare Abschlüsse; User sieht sofort CI-Risiko und Prioritäten ohne Nachfragen.

**Portable:** `.ai-brain/sops/spec-driven-plans.md`, `.ai-brain/core/ai-workflows.md`

## D-15 — Commit-Messages (Repo-Konvention)

**Entscheidung:** Commit-Messages **Englisch**, Body **stichpunktartig** (`type(scope): summary` + `-` bullets). Vorlage aus Epic-Commits: `feat(backend)`, `test(backend)`, `chore(backend)`, `docs`.

**Grund:** Einheitliche Git-Historie; Agent **schlägt nur Text vor**, führt **keine** Git-Commit-Befehle aus (User committet selbst).

**Portable:** `.ai-brain/sops/commits.md`

## D-16 — Vue Admin Fallow + Vitest

**Entscheidung:** `applications/backend` mit Fallow + Vitest-Coverage in `quality:ci`; Health-Gate `--min-score 90`; TDD auf utils/mappers; interne Mapper-Helfer nicht exportieren.

**Grund:** Parität zum Frontend-Quality-Gate; Vitest-v8-Coverage JSON inkompatibel mit striktem Fallow-CRAP-Gate.

**Plan:** `docs/plans/vue-admin-fallow-vitest.md` · Skill: `.agent/skills/vue-admin-quality.md`

## D-17 — Lesbarkeit und kognitive Last (enforced)

**Entscheidung:** Code muss **human-readable** sein mit **geringer kognitiver Last**. Self-documenting durch **klare Funktions- und Variablennamen**; JSDoc/Kommentare nur wenn Namen+Types die Absicht nicht tragen (nicht jede Funktion dokumentieren).

**Enforcement:** Agent und Review prüfen Namen, Funktionsgröße, Verschachtelung, Konsistenz mit Repo — Lint allein reicht nicht.

**Portable:** `.ai-brain/core/coding-standards.md`, `.ai-brain/sops/code-review.md`

**Ergänzungen (enforced):**
- **Guard functions / guard clauses** statt tiefer Verschachtelung
- **Keine Magic Numbers** — Konstanten, Enums, Design-Tokens
- **CSS/SCSS:** Frontend `sass/helpers/`, `--pm-*`; Vue Admin `tailwind.config.js` — nicht hardcoded in Komponenten

## D-18 — Discover-first, Colocation, SOLID/DRY

**Entscheidung:**
1. **Immer zuerst suchen** — bestehende Funktionen/Typen/Mapper erweitern, nicht parallel neu schreiben
2. **Colocation** — ausgelagerte Logik so nah wie möglich an der Einsatzstelle (Feature-Service neben Feature)
3. **Mehrfach genutzt** → `utils/`, `shared/` (Angular: `shared/constants/`, Vue: `src/utils/`)
4. **SOLID + OCP + DRY** — erweitern statt monolithische Module aufblähen; DRY erst ab zweitem Call-Site

**Portfolio-Beispiele:**
- Frontend: `shared/constants/user-messages.ts`, Feature-Services unter `modules/<feature>/`
- Vue Admin: `src/utils/mappers/`, `src/services/` — feature-spezifisch erst lokal, dann Mapper-Layer
- Cross-App: `applications/shared/domain/portfolio-domain.json`

**Portable:** `.ai-brain/core/architecture.md`, `.ai-brain/core/coding-standards.md`

## D-19 — Frontend: layout · view · feature · core · shared

**Entscheidung:** Angular-Portfolio trennt fünf Schichten:

| Schicht | Inhalt |
|---------|--------|
| **layout** | Shell (Nav, Footer, Outlet) |
| **view** | Route-Seite, dünn (`modules/` = Ist, Ziel `views/`) |
| **feature** | Domänen-UI-Slices, colocated oder `features/` |
| **core** | API, Guards, Routing |
| **shared** | Utils, Constants, generische UI |

Views komponieren Features; Layout kennt keine Feature-Fachlogik. Details: `.agent/skills/frontend-architecture.md`, `.ai-brain/skills/angular.md`

## D-20 — Third-party facade pattern

**Entscheidung:** Drittparty-Komponenten und -Libs werden **wenn möglich** von App-eigenen Facades umschlossen (`shared/components/pm-*`, `core/services/*`), damit Vendor jederzeit austauschbar ist.

**Regeln:** Views/Features importieren nur Facades — nicht `ng-bootstrap`, Chart-Libs etc. direkt. Ausnahme: Framework-Core (Angular/Vue/Router).

**Portable:** `.ai-brain/core/coding-standards.md#third-party-facade-swap-friendly`

## D-21 — Ideas in `docs/ideas/` (nur offen)

**Entscheidung:** Agent-Ideen landen in **`docs/ideas/IDEA-NNN-<slug>.md`** (eine Datei pro Idee; Index in `index.md`) — nicht monolithisch, nicht nur im Chat.

**Lifecycle:** `open` → `in-plan` → bei Abschluss Inhalt in Ziel-Doku (`plans/`, `decisions.md`, `session-log.md`, Skills) → **IDEA-Datei löschen**, Index bereinigen. `ideas/` enthält **keine** erledigten Einträge.

**Portable:** `.ai-brain/sops/ideas-backlog.md`
