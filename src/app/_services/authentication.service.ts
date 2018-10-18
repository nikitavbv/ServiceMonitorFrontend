import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) {}

    initRequest() {
        return this.http.get<any>('/api/v1/init')
            .pipe(map((res:any) => {
                return res;
            }));
    }

    login(username: string, password: string) {
        return this.http.post<any>('/api/v1/login', { username: username, password: password })
            .pipe(map((res:any) => {
                if (!res) throw new Error('No server response');
                if (!res.status) throw new Error('Invalid server response: no status');

                switch (res.status) {
                    case 'ok':
                        if (!res.token) throw new Error('Invalid server response: no token');
                        localStorage.setItem('currentUser', JSON.stringify({ username, token: res.token }));
                        break;
                    case 'error':
                        if (!res.error) throw new Error('Invalid server response: no error code');
                        switch (res.error) {
                            case 'auth_server_error':
                                throw new Error('Unknown server-side error');
                            case 'wrong_credentials':
                                throw new Error('Wrong credentials');
                            default:
                                throw new Error('Unknown error: ' + res.Error.ErrorCode);
                        }
                    default:
                        throw new Error('Unknown response status: ' + res.status);
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        return localStorage && localStorage.getItem('currentUser');
    }

    getUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

}