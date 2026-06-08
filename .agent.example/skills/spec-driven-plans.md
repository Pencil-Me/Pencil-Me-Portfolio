# Skill: Spec-Driven Plans (Pencil-Me-Portfolio)

Projekt-Anwendung des portable SOP: `.ai-brain/sops/spec-driven-plans.md`

## Aktive / abgeschlossene Epics

| Plan | Status |
|------|--------|
| [code-quality-improvements.md](../../docs/plans/code-quality-improvements.md) | Frontend Phase A–C ✅ |
| [vue-admin-fallow-vitest.md](../../docs/plans/vue-admin-fallow-vitest.md) | Phase 0–2 ✅ |

## Verification (Portfolio)

| App | Volle Pipeline |
|-----|----------------|
| Frontend | `cd applications/frontend && npm run quality:ci` |
| Vue Admin | `cd applications/backend && npm run quality:ci` |
| PHP REST | `cd applications/php-rest-api && composer test` |

## Agent-Pflicht am Phasenende

1. Befehle **ausführen**, Ergebnis tabellarisch melden
2. Plan-Checkboxen + Baseline-Zahlen aktualisieren
3. Offene Ideen in **`docs/ideas/IDEA-NNN-*.md`** + **`index.md`**; erledigte in Ziel-Doku überführen und aus `ideas/` entfernen — `.ai-brain/sops/ideas-backlog.md`
4. Commit-Message **vorschlagen** (nie `git commit`) — `.ai-brain/sops/commits.md`

## Commit-Vorlage (dieses Repo)

```text
<type>(<scope>): <summary> [(Phase N)]

- Bullet (outcome)
- Bullet (metrics wenn möglich)
```

Beispiele: `feat(backend): … Phase 0`, `test(backend): … Phase 1`, `chore(backend): … Phase 2`
