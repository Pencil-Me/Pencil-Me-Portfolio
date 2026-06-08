# Skill: Code Quality & Fallow (Frontend)

Projektspezifischer Workflow für `applications/frontend/`.

## Wann nutzen

- Refactoring / Lesbarkeit / Inkonsistenzen
- Vor größeren Frontend-Änderungen
- Nach Feature-PRs als Quality-Gate

## Tooling

| Befehl | Zweck |
|--------|-------|
| `npx fallow dead-code` | Ungenutzte Dateien / Type-Exports |
| `npx fallow dupes` | Duplikat-Cluster (min 3 Vorkommen) |
| `npx fallow health --coverage coverage/portfolio/coverage-final.json` | Refactoring-Ziele, MI-Score |
| `npm run ci-test` | Unit-Tests + Karma-Coverage |

| Datei | Rolle |
|-------|-------|
| `.fallowrc.json` | Fallow Entry, dupes, health |
| `karma.conf.js` | Coverage-Thresholds (branches 78 %) |

## Spec-driven Plan

Epic-Plan (committet): `docs/plans/code-quality-improvements.md`

| Phase | Inhalt |
|-------|--------|
| A | Dead Code, Featured-Filter, zentrale User-Messages |
| B | Branch-Coverage ≥ 78 %, Error-Pfad-Tests |
| C | PHP BaseController-Docs, Quality-Gates in README |

## Patterns (empfohlen)

1. Keine ungenutzten Barrel-Exports (`index.ts` nur wenn konsumiert)
2. Eine Filter-/Validierungsfunktion pro Business-Regel
3. User-facing Strings in `shared/constants/user-messages.ts`
4. Fallow `dead-code` vor jedem Quality-PR
5. Branch-Gaps aus `coverage-final.json` priorisieren (Utils/Mapper zuerst)

## Verification

```powershell
cd applications/frontend
npm run ci-test
npx fallow dead-code
npx fallow dupes
```
