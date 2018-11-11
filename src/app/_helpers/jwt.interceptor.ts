import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any> , next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request).pipe(map(data => {
      if ('headers' in data) {
        let authHeaderValue = data.headers.get('authorization');
        if (authHeaderValue) {
          if (authHeaderValue.startsWith('Bearer ')) {
            currentUser.token = authHeaderValue.substring(authHeaderValue.indexOf('Bearer ') + 7);
            localStorage.setItem('currentUser', currentUser);
          } else {
            console.error('Unknown auth token type:', authHeaderValue);
          }
        }
      }

      if ('body' in data) {
        let response = data as any;
        if (response.body === null) return data;

        if (response.body.status === 'error') {
          let error = response.body.error;
          if (error === 'auth_failed') {
            localStorage.removeItem('currentUser');
            this.router.navigate(['/login', { returnUrl: this.router.url }]);
            return data;
          }
        }
      }
      return data;
    }));
  }

}
