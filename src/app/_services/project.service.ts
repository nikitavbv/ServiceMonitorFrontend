import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Project } from '../_models';

@Injectable()
export class ProjectService {

  constructor(private http: HttpClient) {}

  getAllProjects() {
    return this.http.get<any>('/api/v1/project');
  }

}
