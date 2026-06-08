# Pencil-Me-Portfolio — Agent-Kontext (Template)

**Committet als `.agent.example/`** — kopieren nach `.agent/` (gitignored).  
Setup: [SETUP.md](SETUP.md)  
Lesereihenfolge: `AGENTS.md` → `.ai-brain/` (portable) → `.agent/README.md`

Persistenter **projektspezifischer** Kontext. Vor Deploy, CORS oder Architektur-Änderungen lesen.

## Struktur

| Pfad | Zweck |
|------|--------|
| [memory/architecture.md](memory/architecture.md) | Monorepo, API-Rollen, ADR-Verweis |
| [memory/domain-model.md](memory/domain-model.md) | DB-Entitäten, API-Mapping |
| [memory/project-context.md](memory/project-context.md) | Stack, Domains, Repo-Layout |
| [memory/shared-hosting.md](memory/shared-hosting.md) | Deploy, CORS, Env, `.htaccess`, Fallstricke |
| [memory/tech-debt.md](memory/tech-debt.md) | Technische Schulden (kompakt) |
| [memory/roadmap.md](memory/roadmap.md) | Offene Meilensteine |
| [memory/production-state.md](memory/production-state.md) | Ist-Zustand Production, Smoke-Tests, offene Punkte |
| [memory/decisions.md](memory/decisions.md) | Getroffene Architektur-Entscheidungen (kurz) |
| [memory/session-log.md](memory/session-log.md) | Chronik wichtiger Agent-/Deploy-Sessions |
| [memory/key-files.md](memory/key-files.md) | Schlüsseldateien nach Bereich |
| [memory/api-endpoints.md](memory/api-endpoints.md) | REST/Mailer-Endpunkte |
| [memory/troubleshooting-quickref.md](memory/troubleshooting-quickref.md) | Symptom → Skill (1 Seite) |
| [skills/deploy-shared-hosting.md](skills/deploy-shared-hosting.md) | Workflow: Build + Upload |
| [skills/deploy-mailer.md](skills/deploy-mailer.md) | Workflow: Mailer deployen |
| [skills/verify-frontend-deploy.md](skills/verify-frontend-deploy.md) | Workflow: Frontend nach Upload prüfen |
| [skills/debug-rest-api-cors.md](skills/debug-rest-api-cors.md) | Workflow: CORS/API diagnostizieren |
| [skills/debug-contact-form.md](skills/debug-contact-form.md) | Workflow: Kontaktformular-Kette |
| [skills/local-docker.md](skills/local-docker.md) | Gateway vs. Shared-Hosting-Sim |
| [skills/secrets-and-git.md](skills/secrets-and-git.md) | Projekt-Pfade — generisch: `.ai-brain/sops/secrets-and-git.md` |
| [skills/code-quality-fallow.md](skills/code-quality-fallow.md) | Fallow + spec-driven Quality-Epic |
| [TEMPLATE-session-entry.md](TEMPLATE-session-entry.md) | Vorlage für Session-Log-Einträge |

## Einstiegspfade (Happy Paths)

```
Shared-Hosting Deploy:
  deploy.config.local.json anlegen
  → deploy/build-shared-hosting.ps1
  → deploy/out/ hochladen (Reihenfolge: DB → Mailer → REST → Frontend)

CORS / API kaputt:
  → skills/debug-rest-api-cors.md
  → ping.php / test.php?format=json (danach vom Server löschen)

Lokal Cross-Origin testen:
  → skills/local-docker.md

Kontaktformular / Mailer:
  → skills/deploy-mailer.md
  → skills/debug-contact-form.md

Symptom unklar:
  → memory/troubleshooting-quickref.md
```

## Pflege

- Nach relevanten Sessions: `memory/session-log.md` und ggf. `memory/production-state.md` aktualisieren.
- Neue feste Regeln → `memory/decisions.md`.
- Neue wiederkehrende Workflows → `skills/<name>.md`.
- Root-[AGENTS.md](../AGENTS.md) = Bootstrap (committet)
- Portable Wissen: [.ai-brain/](../.ai-brain/) → Symlink zu `~/.ai-brain`

## Nicht hier (andere Layer)

| Inhalt | Ort |
|--------|-----|
| Generische Standards | `.ai-brain/core/`, `skills/`, `sops/` |
| Menschliche Doku | [README.md](../README.md), [deploy/README.md](../deploy/README.md) |
| Verbindliche ADRs | [docs/adr/](../docs/adr/) (committet) |
| Refactoring-Detail | `docs/refactoring/` (gitignored, lokal) |
| Secrets | `src/Inc/.env.prod` — nie in `.agent/` |
