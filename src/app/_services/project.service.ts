import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UserDataService } from './userdata.service';
import {
  Project,
  Metric,
  CreateProjectResponse,
  ProjectListResponse,
  DeleteProjectResponse
} from '../_models';

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

  rename(project: Project, name: string) {
    return this.http.put<any>(`/api/v1/project/${project.id}`, { name }).pipe(map((res:any) => {
      project.name = name;
      return project;
    }));
  }

  deleteProject(project: Project) {
    return this.http.delete<DeleteProjectResponse>(`/api/v1/project/${project.id}`).pipe(map((res:DeleteProjectResponse) => {
      this.userDataService.projects = res.projects;
      return res;
    }));
  }

  starMetric(projectID: number, metric: Metric) {
    return this.http.put<any>(`/api/v1/project/${projectID}/starMetric`, { metricID: metric.id }).pipe(map((res:any) => {
      this.userDataService.projects.forEach((project) => {
        if (project.id === projectID) {
          if (!project.starredMetrics.includes(metric.id)) {
            project.starredMetrics.push(metric.id);
          }
        }
      });
      return res;
    }));
  }

  unstarMetric(projectID: number, metric: Metric) {
    return this.http.put<any>(`/api/v1/project/${projectID}/unstarMetric`, { metricID: metric.id }).pipe(map((res:any) => {
      this.userDataService.projects.forEach((project) => {
        if (project.id === projectID) {
          let metricIndex = project.starredMetrics.indexOf(metric.id);
          if (metricIndex !== -1) {
            project.starredMetrics.splice(metricIndex, 1);
          }
        }
      });
    }));
  }

}
