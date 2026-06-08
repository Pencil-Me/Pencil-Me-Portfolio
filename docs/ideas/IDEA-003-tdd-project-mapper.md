# IDEA-003 — TDD `project.mapper`

| Feld | Wert |
|------|------|
| Priority | P1 |
| Status | open |
| Impact | CRAP/Health für `project.mapper.ts` senken; Fallow-Score robuster |
| Risk | Low |
| Effort | S |
| Source | vue-admin-fallow-vitest, Fallow health findings |

## Beschreibung

Specs in `applications/backend/src/utils/mappers/project.mapper.spec.ts` erweitern für `normalizeProjects`, `sortProjectsForList` (deckt `getProjectLastEndDate` ab).

## Nächste Aktion

- TDD: `project.mapper.spec.ts` — Red → Green
