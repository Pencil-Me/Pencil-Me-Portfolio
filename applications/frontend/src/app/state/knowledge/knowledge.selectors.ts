import { createSelector } from '@ngrx/store';
import { AppState } from '@app/state';
import { KNOWLEDGESTATE } from '@app/state/knowledge/knowledge.models';

/**
 * Selector function to retrieve the knowledge state from the app state.
 * @param state - The global app state.
 * @returns The knowledge state.
 */
const selectKnowledgeState = (state: AppState): KNOWLEDGESTATE => state.knowledge;

/**
 * Selector to retrieve the tech stack state from the knowledge state.
 */
const selectTechstackState = createSelector(
  selectKnowledgeState,
  (state: KNOWLEDGESTATE) => state.techStack,
);

/**
 * Selector to retrieve the projects state from the knowledge state.
 */
const selectProjectsState = createSelector(
  selectKnowledgeState,
  (state: KNOWLEDGESTATE) => state.projects,
);

/**
 * Selector to retrieve the selected project state from the knowledge state.
 */
const selectProjectState = createSelector(
  selectKnowledgeState,
  (state: KNOWLEDGESTATE) => state.selectedProject,
);

/**
 * Selector to retrieve the customers state from the knowledge state.
 */
const selectCustomersState = createSelector(
  selectKnowledgeState,
  (state: KNOWLEDGESTATE) => state.customers,
);

export { selectProjectsState, selectProjectState, selectTechstackState, selectCustomersState };
