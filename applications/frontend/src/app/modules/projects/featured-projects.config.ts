import type { IProject, IProjectsCategory } from '@modules/projects/projects.models';

interface FeaturedProjectNarrative {
  /** Teilstring des Projektnamens aus der API — stabil gegen UUID-Formatierung */
  nameMatch: string;
  tag: string;
  problem: string;
  role: string;
  outcome: string;
}

export interface IFeaturedProject extends IProject {
  tag: string;
  problem: string;
  role: string;
  outcome: string;
}

const FEATURED_PROJECT_NARRATIVES: FeaturedProjectNarrative[] = [
  {
    nameMatch: 'NetworX, als zentrales',
    tag: 'Enterprise · Angular',
    problem:
      'Internationales Verwaltungstool mit wachsendem Team — Angular-Upgrade und Qualität, ohne den Betrieb zu bremsen.',
    role: 'Senior Frontend im Nx-Monorepo: Migration Richtung Angular 17, Jest/Cypress, Mentoring im Team.',
    outcome:
      'Release-fähige Basis, eingespielte Testpipeline — das Team kann eigenständig weiterentwickeln.',
  },
  {
    nameMatch: 'Bordercontrol System für Kambodscha',
    tag: 'GovTech · Technical Lead',
    problem:
      'Grenzkontroll-Workflows mit sensiblen Dokumentdaten — Oberfläche muss unter Echtzeitdruck zuverlässig bleiben.',
    role: 'Technical Lead Frontend: Architektur, Interpol-Workflow, Reporting, Schulung und Kundenkontakt.',
    outcome: 'Schnellere Dokumentenprüfung, erweitertes Reporting, geschultes Team vor Ort.',
  },
  {
    nameMatch: 'Produktion-Manager direkt im Werk',
    tag: 'Industrial · IoT',
    problem:
      'Produktionsanlage im Werk — Steuerung und Live-Daten aus der SPS in einer verständlichen Web-Oberfläche.',
    role: 'Frontend und Architektur: Angular-Screens, Python-Anbindung, Werksdarstellung mit Echtzeitdaten.',
    outcome: 'Bedienung direkt am Band, transparente Anlagenübersicht für Produktion und Technik.',
  },
];

/**
 * Löst kuratierte Highlight-Projekte aus geladenen Kategorien auf (Reihenfolge laut Config).
 */
export function resolveFeaturedProjects(categories: IProjectsCategory[]): IFeaturedProject[] {
  const allProjects = categories.flatMap((category) => category.data);

  return FEATURED_PROJECT_NARRATIVES.map((narrative) => {
    const project = allProjects.find((item) => item.label.includes(narrative.nameMatch));
    if (!project) return null;

    return {
      ...project,
      tag: narrative.tag,
      problem: narrative.problem,
      role: narrative.role,
      outcome: narrative.outcome,
    };
  }).filter((project): project is IFeaturedProject => project !== null);
}
