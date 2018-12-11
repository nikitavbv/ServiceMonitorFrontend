import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Project } from '../_models';

@Injectable()
export class UserDataService {
    isAdmin: boolean;
    projects: Project[];

    constructor(private http: HttpClient) {}

    doInit () {
        return this.http.get<any>('/api/v1/init')
    }

}
