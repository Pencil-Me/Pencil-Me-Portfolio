# Pencil-Me-Portfolio — Agent-Leitfaden (Bootstrap)

Committet Einstieg für Cursor, Claude Code, Codex und zukünftige Agenten.

## Zwei-Ebenen-Wissenssystem

```text
┌─ PORTABLE (umziehbar) ─────────────────────────────┐
│  .ai-brain/  →  Symlink zu  ~/.ai-brain/           │
│  core/ · skills/ · sops/ · external-repos/        │
└────────────────────────────────────────────────────┘
┌─ PROJECT (gitignored) ─────────────────────────────┐
│  .agent/     — aus .agent.example/ initialisieren   │
│  docs/refactoring/ — lokales Arbeitsarchiv         │
└────────────────────────────────────────────────────┘
┌─ COMMITTED BOOTSTRAP ──────────────────────────────┐
│  AGENTS.md · docs/adr/ · .agent.example/           │
└────────────────────────────────────────────────────┘
```

## Lesereihenfolge (jede Session)

1. Diese Datei (`AGENTS.md`)
2. `.ai-brain/core/ai-workflows.md`
3. `.agent/README.md` (falls vorhanden — sonst `.agent.example/README.md` lesen und `.agent/` anlegen)
4. Task-spezifische `skills/` oder `sops/`

## Harte Trennungsregeln

| Erlaubt | Verboten |
|---------|----------|
| Generische Patterns in `.ai-brain/` | Projekt-URLs in `.ai-brain/` |
| Domains, Production-State in `.agent/` | Generische Tutorials in `.agent/` |
| ADRs in `docs/adr/` | Externe Repos 1:1 kopieren |
| Menschliche Doku in `README.md` | Secrets in jeder Knowledge-Datei |

## Erstsetup (Entwickler)

```powershell
# 1) Portable Brain (einmalig global)
#    Inhalt liegt in %USERPROFILE%\.ai-brain\

# Einzeiler (empfohlen)
.\scripts\setup-ai-knowledge.ps1

# Manuell: Junction (ohne Admin)
cmd /c mklink /J .ai-brain %USERPROFILE%\.ai-brain
Copy-Item -Recurse .agent.example .agent
# Dann .agent/memory/production-state.md mit echten URLs pflegen
```

## Projektziel (Kurz)

Monorepo: **Angular** (öffentlich), **PHP REST** + **Mailer**, optional **Vue Admin** / **Python** (Docker).  
Production: **Shared Hosting** (FTP + PHP).

| Rolle | Production-URL |
|-------|----------------|
| Frontend | `https://pencil-me.de` |
| REST API | `https://api.pencil-me.eu` |
| Mailer | `https://mapi.pencil-me.eu` |

Details: `.agent/memory/` (nicht committet).

## Kritische Projektregeln

1. `.env.prod` > `.env.dev` (`EnvLoader::resolveEnvFilePath`)
2. CORS in PHP; API-`.htaccess` nur Rewrite
3. Cross-Origin: `API_KEY_IN_QUERY` im Frontend
4. Nie `.env.prod`, `deploy.config.local.json` committen
5. Generisch „Shared Hosting“ im Code — keine Hoster-Namen

## Entscheidungsmatrix

| Anfrage | Ort |
|---------|-----|
| Coding / Lesbarkeit / Standards | `.ai-brain/core/coding-standards.md` |
| Colocation / SOLID / Discover-first | `.ai-brain/core/architecture.md` |
| Testing allgemein | `.ai-brain/core/testing.md` |
| Angular / PHP / Docker / Fallow Skill | `.ai-brain/skills/` |
| Branch-Coverage-Gaps | `.ai-brain/skills/branch-coverage-gaps.md` |
| Feature / Debug / Deploy SOP | `.ai-brain/sops/` |
| Production deployen | `.agent/skills/deploy-shared-hosting.md` |
| CORS / API | `.agent/skills/debug-rest-api-cors.md` |
| Kontaktformular | `.agent/skills/debug-contact-form.md` |
| Frontend Code Quality / Fallow | `.agent/skills/code-quality-fallow.md` |
| Frontend layout/view/feature | `.agent/skills/frontend-architecture.md` |
| Vue Admin Quality / Fallow | `.agent/skills/vue-admin-quality.md` |
| Spec-driven Epic / Phasenende | `.ai-brain/sops/spec-driven-plans.md` |
| Ideen-Backlog (nächste Schritte) | `docs/ideas/index.md` · `IDEA-NNN-*.md` · `.ai-brain/sops/ideas-backlog.md` |
| Commit-Message (English, bullets) | `.ai-brain/sops/commits.md` |
| Architektur-Entscheidung | `docs/adr/` + `.agent/memory/decisions.md` |
| Secrets / Commit | `.ai-brain/sops/secrets-and-git.md` |

## Agent-Verhalten (hart)

1. **Plan-Phasenende:** Verification → Plan sync → Ideen in [docs/ideas/](docs/ideas/index.md) (eine Datei pro IDEA, [spec-driven-plans](.ai-brain/sops/spec-driven-plans.md), [ideas-backlog](.ai-brain/sops/ideas-backlog.md))
2. **Commit-Message:** **nur vorschlagen** — Englisch, Stichpunkte ([commits](.ai-brain/sops/commits.md))
3. **Git:** Agent führt **niemals** `git commit`, `git push` oder Staging für den User aus — Commits nur manuell durch den Menschen
4. **Code:** Discover-first, Colocation, SOLID/DRY, Lesbarkeit, **Third-party-Facade** ([coding-standards](.ai-brain/core/coding-standards.md), [architecture](.ai-brain/core/architecture.md)); **Frontend:** layout · view · feature · core · shared ([frontend-architecture](.agent/skills/frontend-architecture.md))

## Self-Improvement (nach Änderungen)

### Portable?

- [ ] Neues generisches Pattern? → `.ai-brain/skills/` oder `sops/`
- [ ] Quelle genutzt? → `.ai-brain/external-repos/extracted-patterns.md`

### Project?

- [ ] Architektur geändert? → `docs/adr/` + `.agent/memory/decisions.md`
- [ ] Deploy/Production? → `.agent/memory/production-state.md`
- [ ] Neue Schuld/Roadmap? → `tech-debt.md` / `roadmap.md`
- [ ] Session dokumentieren? → `session-log.md`

## Externe Wissensquellen

Index: `.ai-brain/external-repos/repo-index.md`  
Mapping: `mapped-skills.md`  
Nur konzeptionell extrahieren — siehe `.ai-brain/core/ai-workflows.md`.

## Referenzen

- [.agent.example/](.agent.example/) — Project-Template (committet)
- [.ai-brain/README.md](.ai-brain/README.md) — Portable Brain (Symlink)
- [docs/adr/](docs/adr/)
- [deploy/README.md](deploy/README.md)
