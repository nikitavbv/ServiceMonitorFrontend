import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class UserDataService {
    isAdmin: boolean;

    constructor(private http: HttpClient) {}

    doInit() {
        // TODO: request to init api
    }

}