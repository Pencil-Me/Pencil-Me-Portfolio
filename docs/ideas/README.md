# Ideas Backlog

Vorgeschlagene **nächste Schritte** und **Follow-up-Ideen** aus Agent-Sessions — nicht committete Epics.

## Zweck

| Ordner | Inhalt |
|--------|--------|
| [plans/](../plans/) | Spec-driven Epics mit Akzeptanzkriterien (aktive Arbeit) |
| **ideas/** | Ranked Ideen, Impact/Risk — bis jemand sie in einen Plan oder Task überführt |

## Wann der Agent hier schreibt

- Am Ende eines Plan-Phasenabschlusses (neue oder aktualisierte Einträge)
- Wenn während der Arbeit sinnvolle Follow-ups auftauchen (nicht sofort umsetzen)
- **Nicht** für erledigte Epics ohne offene Ideen

## Dateistruktur

| Datei | Rolle |
|-------|-------|
| **[index.md](index.md)** | Übersicht P0→P3 mit Links zu allen Ideen |
| **`IDEA-NNN-<slug>.md`** | **Eine Datei pro Idee** (Standard) |
| **`IDEA-NNN-<thema>.md`** | Optional: **mehrere zusammenhängende** Ideen in einer Datei (Abschnitte pro IDEA) |

Neue Idee: nächste freie `IDEA-NNN`, Datei anlegen, Zeile in `index.md` ergänzen.

### Einzeldatei (Pflichtfelder)

```markdown
# IDEA-NNN — Kurztitel

| Feld | Wert |
|------|------|
| Priority | P0 / P1 / P2 / P3 |
| Status | open / in-plan / done / dropped |
| Impact | … |
| Risk | Low / Medium / High — … |
| Effort | S / M / L |
| Source | z. B. vue-admin-fallow-vitest, Session 2026-05-29 |

## Beschreibung
…

## Nächste Aktion
…
```

Agent aktualisiert Status in der Idee-Datei und in `index.md`, wenn die Idee in `docs/plans/` landet oder erledigt ist.

## Portable Regel

`.ai-brain/sops/spec-driven-plans.md` · `.ai-brain/sops/ideas-backlog.md`
