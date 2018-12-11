import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UserDataService } from './userdata.service';
import { Project, CreateProjectResponse, ProjectListResponse } from '../_models';

@Injectable()
export class ProjectService {

  constructor(private http: HttpClient, private userDataService: UserDataService) {}

  getAllProjects() {
    return this.http.get<ProjectListResponse>('/api/v1/project')
      .pipe(map((res:ProjectListResponse) => {
        this.userDataService.projects = res.projects;
        return res;
      }));
  }

  createProject(name: string) {
    return this.http.post<CreateProjectResponse>('/api/v1/project', { name }).pipe(map((res:CreateProjectResponse) => {
      this.userDataService.projects = res.projects;
      return res;
    }));
  }

}
