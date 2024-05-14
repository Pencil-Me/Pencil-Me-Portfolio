import { Injectable } from '@angular/core';
import { ApiClientService } from '@core/services/api/api-client.service';
import { CUSTOMER, PROJECT, TECHSTACK } from '@app/state/knowledge/knowledge.models';
import { Observable } from 'rxjs';

/**
 * KnowledgeService is responsible for fetching data related to tech stacks, projects, and customers.
 * This service acts as an abstraction layer between the API client and the application.
 */
@Injectable({
  providedIn: 'root',
})
export class KnowledgeService {
  constructor(private apiClient: ApiClientService) {}

  /**
   * Fetches the list of tech stacks from the API.
   * @returns An Observable that emits an array of TECHSTACK objects.
   */
  getTechstack(): Observable<TECHSTACK[]> {
    return this.apiClient.get('all_techstacks');
  }

  /**
   * Fetches the list of projects from the API.
   * @returns An Observable that emits an array of PROJECT objects.
   */
  getProjects(): Observable<PROJECT[]> {
    return this.apiClient.get('all_projects');
  }

  /**
   * Fetches a specific project by its ID from the API.
   * @param id - The ID of the project to fetch.
   * @returns An Observable that emits a PROJECT object.
   */
  getProject(id: string): Observable<PROJECT> {
    return this.apiClient.get<PROJECT>(`get_project/${id}`);
  }

  /**
   * Fetches the list of customers from the API.
   * @returns An Observable that emits an array of CUSTOMER objects.
   */
  getCustomers(): Observable<CUSTOMER[]> {
    return this.apiClient.get('all_customers');
  }
}
