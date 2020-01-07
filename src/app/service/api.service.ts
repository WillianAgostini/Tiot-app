import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  HttpClient,
  HttpParams,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements HttpInterceptor, HttpInterceptor {
  constructor(public storage: Storage, public http: HttpClient) {}

  public static token: string;
  apiUrl = 'http://localhost:3000/';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + ApiService.token
      }
    });

    //    return next.handle(request);
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          //this.authenticationService.logout();
          //location.reload(true);
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }

  async setLocalUser(user: User) {
    try {
      await this.storage.set('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing item', error);
    }
  }
  async getLocalUser() {
    try {
      let data = await this.storage.get('user');
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  async hasUser() {
    let x = await this.getLocalUser();
    return x != null;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(
        this.apiUrl + 'login',
        { username, password },
        { observe: 'response' }
      )
      .pipe(
        map(data => {
          if (data) {
            ApiService.token = data.body.token;
          }
          return data;
        })
      );
  }

  signup(username: string, password: string, fullName: string) {
    return this.http
      .post<any>(
        this.apiUrl + 'signup',
        { username, password, fullName },
        { observe: 'response' }
      )
      .pipe(
        map(data => {
          if (data) {
            ApiService.token = data.body.token;
          }
          return data;
        })
      );
  }

  me() {
    return this.http
      .get<User>(this.apiUrl + 'users/me', { observe: 'response' })
      .pipe(
        map(data => {
          if (data) {
            data.body.token = ApiService.token;
            this.setLocalUser(data.body);
          }
          return data;
        })
      );
  }
}
