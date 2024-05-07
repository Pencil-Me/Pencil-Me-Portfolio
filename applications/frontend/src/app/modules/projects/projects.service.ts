import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/state';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectTitle } from '@app/state/knowledge/knowledge.reducer';
import { fromKnowledge } from '@app/state/knowledge';
import { IProject, IProjectsCategory, IProjectTech } from '@modules/projects/projects.models';
import { selectProjectsState, selectProjectState, selectTechstackState } from '@app/state/knowledge/knowledge.selectors';
import { PROJECT, PROJECTSDATASTATE, PROJECTDATASTATE, TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  date = moment();
  storeProjects$: Observable<PROJECTSDATASTATE> = this.store.select(selectProjectsState);
  storeProject$: Observable<PROJECTDATASTATE> = this.store.select(selectProjectState);
  storeTech$: Observable<TECHSTACKDATASTATE> = this.store.select(selectTechstackState);

  private _project$ = new BehaviorSubject<IProject>({} as IProject);
  readonly project$ = this._project$ as Observable<IProject>;

  private _projects$ = new BehaviorSubject<IProjectsCategory[]>([]);
  readonly projects$ = this._projects$ as Observable<IProjectsCategory[]>;

  private _tech$ = new BehaviorSubject<IProjectTech[]>([]);
  readonly tech$ = this._tech$ as Observable<IProjectTech[]>;

  constructor(private readonly store: Store<AppState>) {
    this.store.dispatch(fromKnowledge.actions.GetProjectServiceData());

    this.storeProjects$.subscribe((e) => {
      const projects: IProjectsCategory[] = this.convertProjects(e.data ?? []);
      this._projects$.next(projects);
    });

    this.storeTech$.subscribe((e: TECHSTACKDATASTATE) => {
      const givenTech = [...e.data];
      const sortedTech = givenTech.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      const tech: IProjectTech[] = sortedTech.map((e) => ({ name: e.name })) ?? [];
      this._tech$.next(tech);
    });

    this.storeProject$.subscribe((e) => {
      const project: IProject = this.convertProject(e.data ?? ({} as PROJECT));
      this._project$.next(project);
    });
  }

  selectProject(id: string | undefined) {
    if (!id) {
      this.store.dispatch(fromKnowledge.actions.ResetProject());
      return;
    }
    this.store.dispatch(fromKnowledge.actions.GetProject({ id: id }));
  }
  convertProject(project: PROJECT): IProject {
    return {
      id: project.uuid ?? '',
      label: project.name ?? '',
      position: project.position?.replace(/\//g, ' / ') ?? '',
      content: project.content ?? '',
      customer: project.customers?.map((e) => e.name).join(', ') ?? '',
      location:
        project.customers
          ?.map((e) => e.location)
          .filter((value, index, array) => array.indexOf(value) === index)
          .join(', ') ?? '',
      org_dates: project.dates ?? [],
      dates:
        project.dates?.map((e) => ({
          start_date: moment(e.start_date).format('MMM.YYYY'),
          end_date: e.end_date ? moment(e.end_date).format('MMM.YYYY') : 'heute',
        })) ?? [],
      tech: project.tech?.map((e) => ({ name: e.name, id: e.uuid })) ?? [],
    };
  }
  convertProjects(simpProject: PROJECT[]): IProjectsCategory[] {
    const projects: IProjectsCategory[] = [];
    const orgProjects = [...simpProject];

    orgProjects.forEach((item: PROJECT) => {
      const objectDataToPush: IProject = {
        id: item.uuid,
        label: item.name,
        position: item.position?.replace(/\//g, ' / ') ?? '',
        content: item.content ?? '',
        customer: item.customers?.map((e) => e.name).join(', ') ?? '',
        location:
          item.customers
            ?.map((e) => e.location)
            .filter((value, index, array) => array.indexOf(value) === index)
            .join(', ') ?? '',
        org_dates: item.dates,
        dates:
          item.dates.map((e) => ({
            start_date: moment(e.start_date).format('MMM.YYYY'),
            end_date: e.end_date ? moment(e.end_date).format('MMM.YYYY') : 'heute',
          })) ?? [],
        tech: item.tech.map((e) => ({ name: e.name, id: e.uuid })) ?? [],
      };
      const itemTitle = ProjectTitle[item.type] ?? item.type;
      const obj = projects.find((x) => x.title === itemTitle);
      const index = obj ? projects.indexOf(obj) : -1;

      if (index !== -1) {
        projects[index].data.push(objectDataToPush);
      } else {
        projects.push({
          title: itemTitle,
          data: [objectDataToPush],
        });
      }
    });

    projects.forEach((e) => {
      e.data = this.sortProjects([...e.data]);
    });

    return projects;
  }

  sortProjects(simpProject: IProject[]): IProject[] {
    const projects = [...simpProject];

    projects.sort((a, b) => {
      let aEndDate: number = new Date('01.01.1900').getTime();
      let bEndDate: number = new Date('01.01.1900').getTime();

      a.org_dates.forEach((e) => {
        if (!e.end_date) aEndDate = new Date().getTime();
        if (e.end_date && new Date(e.end_date).getTime() > aEndDate) aEndDate = new Date(e.end_date).getTime();
      });
      b.org_dates.forEach((e) => {
        if (!e.end_date) bEndDate = new Date().getTime();
        if (e.end_date && new Date(e.end_date).getTime() > bEndDate) bEndDate = new Date(e.end_date).getTime();
      });

      return bEndDate - aEndDate;
    });

    return projects;
  }
}
