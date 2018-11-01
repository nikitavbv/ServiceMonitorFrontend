import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserDataService {
    isAdmin: boolean;

    constructor(private http: HttpClient) {}

    doInit () {
        return this.http.get<any>('/api/v1/init')
    }

}