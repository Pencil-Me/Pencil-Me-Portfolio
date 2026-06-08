# Session-Log (Agent)

Chronik wichtiger Sessions — kurz, für Kontinuität zwischen Chats.

---

## 2026-06-08 — Shared-Hosting Deploy & CORS

### Problem
- Frontend `example.com` → API `api.example.eu`: CORS/Preflight scheiterte
- `curl` mit Header lieferte JSON, Browser blockierte
- `allowed_origins: []` trotz korrekter `.env.prod` (`.env.dev` auf Server + falsche Env-Priorität)
- Shared-Hosting: `.htaccess` mit `Header`/`SetEnv` → HTTP 500

### Umgesetzt
- `EnvLoader`, `CorsHeaders`, `ApiKeyResolver`, schlankes Deploy-Paket
- Frontend: `API_KEY_IN_QUERY` bei Cross-Origin
- Deploy: `Copy-PhpSourceForDeploy`, Assert gegen `.env.dev` in `out/`
- Diagnose: `ping.php`, `test.php`
- IONOS-Hinweise → generisch „Shared Hosting“ umbenannt
- `.agent/` + `AGENTS.md` angelegt

### Verifiziert Production
- `env_file_used=.env.prod`, `.env.dev=no`
- CORS mit Origin: `origin_allowed: true`

### Offen
- Mailer deployen, Diagnose-Dateien löschen, ggf. Frontend neu deployen

---

## 2026-06-08 — `.agent/` erweitert

### Ergänzt
- Skills: Mailer-Deploy, Kontaktformular-Debug, Frontend-Verifikation, lokales Docker
- Memory: `key-files`, `api-endpoints`, `troubleshooting-quickref`
- `TEMPLATE-session-entry.md` für künftige Sessions
- Verlinkung in `README.md`, `AGENTS.md`, Entscheidung D-11

### Hinweis
- `mailerBaseUrl` in deploy.config muss echte Subdomain sein (`mapi.*`, nicht zwingend `mailer.*` aus Example)

---

## 2026-05-29 — Agent-Standards & Ideas-Backlog (IDEA-002 erledigt)

### Umgesetzt (Commit `7cf4228`)
- `AGENTS.md`: harte Regeln (Phasenende, Commits nur vorschlagen, Colocation, FE-Schichten)
- Entscheidungen **D-14–D-21** in `memory/decisions.md`
- Skills: `frontend-architecture`, `spec-driven-plans`, `vue-admin-quality` erweitert
- `docs/ideas/`: eine Datei pro Idee; erledigte Ideen wandern in Doku (nicht im Backlog)

### Verwandte Doku
- [AGENTS.md](../../AGENTS.md)
- [docs/ideas/README.md](../../docs/ideas/README.md)
- [vue-admin-fallow-vitest.md](../../docs/plans/vue-admin-fallow-vitest.md) — Epic Phase 0–2 ✅

---

<!-- Neue Sessions oben eintragen (neueste zuerst) -->
