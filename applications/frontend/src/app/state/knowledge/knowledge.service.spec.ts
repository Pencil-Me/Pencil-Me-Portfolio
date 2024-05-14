import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { KnowledgeService } from './knowledge.service';
import { ApiClientService } from '@core/services/api/api-client.service';
import { CUSTOMER, DATE, PROJECT, TECH, TECHSTACK } from '@app/state/knowledge/knowledge.models';

describe('KnowledgeService', () => {
  let service: KnowledgeService;
  let apiClientService: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    const apiClientSpy = jasmine.createSpyObj('ApiClientService', ['get']);

    TestBed.configureTestingModule({
      providers: [KnowledgeService, { provide: ApiClientService, useValue: apiClientSpy }],
    });

    service = TestBed.inject(KnowledgeService);
    apiClientService = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  it('should return techstack data', () => {
    const techstackBasic: TECHSTACK = {
      type: 'FEDEV',
      name: 'Angular',
      expertise_level: 70,
      last_usage_date: new Date('2023-02-05'),
      flag_important: false,
      project_count: 5,
    };
    const techstack: TECHSTACK[] = [{ ...techstackBasic }];
    apiClientService.get.and.returnValue(of(techstack));

    service.getTechstack().subscribe((data) => {
      expect(data).toEqual(techstack);
    });

    expect(apiClientService.get).toHaveBeenCalledWith('all_techstacks');
  });

  it('should return projects data', () => {
    const customerBasic: CUSTOMER = { name: 'Customer 1', location: 'Location 1', last_used_date: new Date('2021-05-01') };
    const dateBasic: DATE = { start_date: new Date('2020-01-01'), end_date: new Date('2021-01-01') };
    const techBasic: TECH = { name: 'Tech 1', uuid: '1', expertise_level: 'expertise_levelTest', type: 'typeTest' };
    const projectBasic: PROJECT = {
      uuid: '1',
      name: 'Project 1',
      position: 'Position 1',
      content: 'Content 1',
      customers: [customerBasic],
      dates: [dateBasic],
      tech: [techBasic],
      type: 'FEDEV',
    };
    const projects: PROJECT[] = [{ ...projectBasic }];
    apiClientService.get.and.returnValue(of(projects));

    service.getProjects().subscribe((data) => {
      expect(data).toEqual(projects);
    });

    expect(apiClientService.get).toHaveBeenCalledWith('all_projects');
  });

  it('should return project data by id', () => {
    const customerBasic: CUSTOMER = { name: 'Customer 1', location: 'Location 1', last_used_date: new Date('2021-05-01') };
    const dateBasic: DATE = { start_date: new Date('2020-01-01'), end_date: new Date('2021-01-01') };
    const techBasic: TECH = { name: 'Tech 1', uuid: '1', expertise_level: 'expertise_levelTest', type: 'typeTest' };
    const projectBasic: PROJECT = {
      uuid: '1',
      name: 'Project 1',
      position: 'Position 1',
      content: 'Content 1',
      customers: [customerBasic],
      dates: [dateBasic],
      tech: [techBasic],
      type: 'FEDEV',
    };
    const project: PROJECT = { ...projectBasic };
    const projectId = '1';
    apiClientService.get.and.returnValue(of(project));

    service.getProject(projectId).subscribe((data) => {
      expect(data).toEqual(project);
    });

    expect(apiClientService.get).toHaveBeenCalledWith('get_project/' + projectId);
  });

  it('should return customers data', () => {
    const customersBasic: CUSTOMER = { name: 'Customer 1', location: 'Location 1', last_used_date: new Date('2021-05-01') };
    const customers: CUSTOMER[] = [{ ...customersBasic }];
    apiClientService.get.and.returnValue(of(customers));

    service.getCustomers().subscribe((data) => {
      expect(data).toEqual(customers);
    });

    expect(apiClientService.get).toHaveBeenCalledWith('all_customers');
  });
});
