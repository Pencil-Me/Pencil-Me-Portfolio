# Ideas Backlog

Vorgeschlagene **nächste Schritte** und **Follow-up-Ideen** — nur **offene** Arbeit, keine erledigten Tasks.

## Zweck

| Ordner | Inhalt |
|--------|--------|
| [plans/](../plans/) | Spec-driven Epics mit Akzeptanzkriterien (aktive Arbeit) |
| **ideas/** | Offene Ideen (P0–P3) bis Plan-Überführung oder Abschluss |

Erledigtes gehört **nicht** hierher — siehe [Lifecycle](#lifecycle).

## Wann der Agent hier schreibt

- Am Ende eines Plan-Phasenabschlusses (neue offene Follow-ups)
- Wenn sinnvolle nächste Schritte auftauchen (nicht sofort umsetzen)
- **Nicht** für abgeschlossene Arbeit (→ Ziel-Doku)

## Dateistruktur

| Datei | Rolle |
|-------|-------|
| **[index.md](index.md)** | Übersicht nur **offener** Ideen (P0→P3) |
| **`IDEA-NNN-<slug>.md`** | Eine Datei pro offener Idee |

Neue Idee: nächste freie `IDEA-NNN`, Datei anlegen, Zeile in `index.md`.

### Einzeldatei (Pflichtfelder)

```markdown
# IDEA-NNN — Kurztitel

| Feld | Wert |
|------|------|
| Priority | P0 / P1 / P2 / P3 |
| Status | open / in-plan |
| Impact | … |
| Risk | Low / Medium / High — … |
| Effort | S / M / L |
| Source | z. B. vue-admin-fallow-vitest, Session 2026-05-29 |

## Beschreibung
…

## Nächste Aktion
…
```

Status **`done`** und **`dropped`** gibt es in `ideas/` nicht — siehe Lifecycle.

## Lifecycle

```text
open → in-plan → [Ziel-Doku] → Datei + Index-Zeile entfernen
```

| Status | In `ideas/`? | Aktion bei Abschluss |
|--------|--------------|----------------------|
| `open` | Ja | — |
| `in-plan` | Ja | Link in `docs/plans/<epic>.md` |
| **erledigt** | **Nein** | Inhalt in Ziel-Doku überführen, `IDEA-NNN-*.md` löschen, `index.md` aktualisieren |
| **abgelehnt** | **Nein** | Kurzgrund in `session-log.md` oder `decisions.md`, Datei löschen |

### Ziel-Doku (wo erledigte Ideen landen)

| Idee-Typ | Ziel |
|----------|------|
| Epic abgeschlossen | `docs/plans/<epic>.md` (Status, Verification) |
| Architektur / Konvention | `.agent.example/memory/decisions.md`, `AGENTS.md` |
| Agent-Session | `.agent.example/memory/session-log.md` |
| Skill / Workflow | `.agent.example/skills/` |
| Abgelehnt | `session-log.md` oder `decisions.md` (ein Satz) |

**IDEA-IDs werden nicht wiederverwendet** — Lücken in der Nummerierung sind normal.

## Portable Regel

`.ai-brain/sops/spec-driven-plans.md` · `.ai-brain/sops/ideas-backlog.md`
