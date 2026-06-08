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
