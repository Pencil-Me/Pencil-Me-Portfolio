import { createSelector } from '@ngrx/store';
import { AppState } from '@app/state';
import { KNOWLEDGESTATE } from '@app/state/knowledge/knowledge.models';

const selectKnowledgeState = (state: AppState) => state.knowledge;

const selectTechstackState = createSelector(selectKnowledgeState, (state: KNOWLEDGESTATE) => state.techStack);
const selectProjectsState = createSelector(selectKnowledgeState, (state: KNOWLEDGESTATE) => state.projects);
const selectProjectState = createSelector(selectKnowledgeState, (state: KNOWLEDGESTATE) => state.selectedProject);
const selectCustomersState = createSelector(selectKnowledgeState, (state: KNOWLEDGESTATE) => state.customers);

export { selectProjectsState, selectProjectState, selectTechstackState, selectCustomersState };
