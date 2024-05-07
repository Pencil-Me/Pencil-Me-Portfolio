import { Injectable } from '@angular/core';
import { ApiClientService } from '@core/services/api/api-client.service';
import { CUSTOMER, PROJECT, TECHSTACK } from '@app/state/knowledge/knowledge.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeService {
  constructor(private apiClient: ApiClientService) {}

  getTechstack(): Observable<TECHSTACK[]> {
    return this.apiClient.get('all_techstacks');
  }

  getProjects(): Observable<PROJECT[]> {
    return this.apiClient.get('all_projects');
  }

  getProject(id: string): Observable<PROJECT> {
    return this.apiClient.get<PROJECT>('get_project/' + id);
  }

  getCustomers(): Observable<CUSTOMER[]> {
    return this.apiClient.get('all_customers');
  }
}
