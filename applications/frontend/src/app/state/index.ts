import { Action, ActionReducer } from '@ngrx/store';
import { KnowledgeEffects } from '@app/state/knowledge/knowledge.effects';
import { fromKnowledge } from '@app/state/knowledge';
import { KNOWLEDGESTATE } from '@app/state/knowledge/knowledge.models';

// Define the shape of the entire application state
export interface AppState {
  knowledge: KNOWLEDGESTATE;
}

// Define the structure of the app's store
export interface AppStore {
  knowledge: ActionReducer<KNOWLEDGESTATE, Action>;
}

// Define the initial store configuration
export const appStore: AppStore = {
  knowledge: fromKnowledge.reducers,
};

// Define the list of effects used in the application
export const appEffects = [KnowledgeEffects];
