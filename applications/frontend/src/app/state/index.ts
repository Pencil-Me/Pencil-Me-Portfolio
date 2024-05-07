import { Action, ActionReducer } from '@ngrx/store';
import { KnowledgeEffects } from '@app/state/knowledge/knowledge.effects';
import { fromKnowledge } from '@app/state/knowledge';
import { KNOWLEDGESTATE } from '@app/state/knowledge/knowledge.models';

export interface AppState {
  knowledge: KNOWLEDGESTATE;
}
export interface AppStore {
  knowledge: ActionReducer<KNOWLEDGESTATE, Action>;
}

export const appStore: AppStore = {
  knowledge: fromKnowledge.reducers,
};

export const appEffects = [KnowledgeEffects];
