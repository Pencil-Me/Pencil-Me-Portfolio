import type { AppState } from '@app/state';
import type {
  CUSTOMER,
  DATE,
  KNOWLEDGESTATE,
  PROJECT,
  TECH,
  TECHSTACK,
} from '@app/state/knowledge/knowledge.models';

export function createSampleCustomer(overrides: Partial<CUSTOMER> = {}): CUSTOMER {
  return {
    name: 'Customer 1',
    location: 'Location 1',
    last_used_date: new Date('2021-05-01'),
    ...overrides,
  };
}

function createSampleDate(overrides: Partial<DATE> = {}): DATE {
  return {
    start_date: new Date('2020-01-01'),
    end_date: new Date('2021-01-01'),
    ...overrides,
  };
}

function createSampleTech(overrides: Partial<TECH> = {}): TECH {
  return {
    name: 'Tech 1',
    uuid: '1',
    expertise_level: 'expertise_levelTest',
    type: 'typeTest',
    ...overrides,
  };
}

export function createSampleProject(overrides: Partial<PROJECT> = {}): PROJECT {
  return {
    uuid: '1',
    name: 'Project 1',
    position: 'Position 1',
    content: 'Content 1',
    customers: [createSampleCustomer()],
    dates: [createSampleDate()],
    tech: [createSampleTech()],
    type: 'CUST',
    ...overrides,
  };
}

function createEmptyKnowledgeState(): KNOWLEDGESTATE {
  return {
    techStack: {
      error: null,
      loadStatus: 'PENDING',
      data: [],
    },
    projects: {
      error: null,
      loadStatus: 'PENDING',
      data: [],
    },
    selectedProject: {
      loadStatus: 'PENDING',
      error: null,
      data: {
        uuid: '',
        type: '',
        name: '',
        dates: [],
        customers: undefined,
        location: undefined,
        position: undefined,
        content: undefined,
        tech: [],
      },
    },
    customers: {
      loadStatus: 'PENDING',
      error: null,
      data: [],
    },
  };
}

export function createMockAppState(knowledgeOverrides: Partial<KNOWLEDGESTATE> = {}): AppState {
  return {
    knowledge: {
      ...createEmptyKnowledgeState(),
      ...knowledgeOverrides,
    },
  };
}

export function createHomeTechStackFixture(): TECHSTACK[] {
  return [
    {
      name: 'FETech1',
      project_count: 5,
      last_usage_date: new Date('2022-01-01'),
      type: 'FEDEV',
      expertise_level: 80,
      flag_important: false,
      project_dates: [],
    },
    {
      name: 'FETech2',
      project_count: 4,
      last_usage_date: new Date('2023-01-01'),
      type: 'FEDEV',
      expertise_level: 85,
      flag_important: false,
      project_dates: [],
    },
    {
      name: 'BETech1',
      project_count: 10,
      last_usage_date: new Date('2021-01-01'),
      type: 'BEDEV',
      expertise_level: 80,
      flag_important: false,
      project_dates: [],
    },
  ];
}

export function createTechStackMapperFixture(): TECHSTACK[] {
  return [
    ...createHomeTechStackFixture(),
    {
      name: 'OldTech',
      project_count: 3,
      last_usage_date: new Date('2010-01-01'),
      type: 'FEDEV',
      expertise_level: 50,
      flag_important: false,
      project_dates: [],
    },
    {
      name: 'NoProjects',
      project_count: 0,
      last_usage_date: new Date('2024-01-01'),
      type: 'FEDEV',
      expertise_level: 50,
      flag_important: false,
      project_dates: [],
    },
  ];
}
