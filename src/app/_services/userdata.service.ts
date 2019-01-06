import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Project, Agent, Metric, InitResponse } from '../_models';

@Injectable()
export class UserDataService {
    isAdmin: boolean;
    projects: Project[];
    agents: Agent[];

    constructor(private http: HttpClient) {}

    doInit () {
        return this.http.get<InitResponse>('/api/v1/init').pipe(map((res:InitResponse) => {
          this.projects = res.projects;
          this.agents = res.agents;
        }));
    }

}
