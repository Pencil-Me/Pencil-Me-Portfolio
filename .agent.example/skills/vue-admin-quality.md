# Skill: Code Quality & Fallow (Vue Admin)

Projektspezifischer Workflow für `applications/backend/`.

## Wann nutzen

- Refactoring an Mappern, Services oder Pinia-Stores
- Vor größeren Admin-UI-Änderungen
- Nach Feature-PRs als Quality-Gate

## Tooling

| Befehl | Zweck |
|--------|-------|
| `npm run test:unit` | Vitest watch (TDD-Loop) |
| `npm run test:unit:ci` | Vitest + Coverage (v8) |
| `npx fallow dead-code` | Ungenutzte Dateien / Exports |
| `npx fallow dupes` | Duplikat-Cluster (min 3 Vorkommen) |
| `npx fallow health --coverage coverage/coverage-final.json --min-score 90` | Health-Score-Gate (Komplexität informativ) |
| `npm run quality:ci` | lint + type-check + tests + Fallow |

| Datei | Rolle |
|-------|-------|
| `.fallowrc.json` | Entry (`main.ts`, Specs, Cypress), dupes, health |
| `vitest.config.ts` | Coverage-Scope (utils/services/pinia/types), Thresholds |

## Spec-driven Plan

Epic-Plan (committet): `docs/plans/vue-admin-fallow-vitest.md`

| Phase | Inhalt |
|-------|--------|
| 0 | Fallow-Config, Vitest Coverage |
| 1 | TDD: `date.ts`, `customer.mapper`, `techstack.mapper` |
| 2 | Dead Code, `quality:ci` + Fallow, Docs |

## Patterns (empfohlen)

1. Pure Utils/Mapper zuerst testen — Stores/Services mit `vi.mock` an HTTP-Grenze
2. Interne Mapper-Helfer nicht exportieren (Fallow dead-code)
3. Views importieren `@/utils/date` direkt — keine ungenutzten Composable-Barrels
4. `fallow:analyze` vor jedem Quality-PR
5. Coverage-Thresholds nur nach messbarem TDD-Fortschritt anheben

## Verification

```powershell
cd applications/backend
npm run quality:ci
```

Erwartung: 55 Tests, Coverage lines ≥ 70 %, Fallow dead-code/dupes 0/0, Health ≥ 90.

## Phasenabschluss (Agent)

Siehe `.ai-brain/sops/spec-driven-plans.md` — nach jeder Phase: Verify-Tabelle, Plan-Checkboxen, nächste Schritte mit Risk.
