import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {initDomAdapter} from '@angular/platform-browser/src/browser';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';

import {User} from '../models/user';

@Injectable({providedIn: 'root'})
export class ApiService implements HttpInterceptor, HttpInterceptor {
  constructor(
      public storage: Storage, public http: HttpClient, public router: Router) {
    this.init();
  }

  async init() {
    let user = await this.getLocalUser();
    if (user && user.token) ApiService.token = user.token;
  }
  public static token: string;
  // apiUrl = 'http://191.52.140.35:3000/';
  apiUrl = 'http://127.0.0.1:3000/';

  intercept(request: HttpRequest<any>, next: HttpHandler):
      Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    request = request.clone(
        {setHeaders: {Authorization: 'Bearer ' + ApiService.token}});

    //    return next.handle(request);
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.storage.remove('user');
        this.router.navigate(['']);
        // location.reload(true);
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
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
      return null;
    }
  }

  async hasUser() {
    let x = await this.getLocalUser();
    return x != null;
  }

  login(username: string, password: string) {
    return this.http
        .post<any>(
            this.apiUrl + 'login', {username, password}, {observe: 'response'})
        .pipe(map(data => {
          if (data) {
            ApiService.token = data.body.token;
          }
          return data;
        }));
  }


  signup(username: string, password: string, fullName: string) {
    return this.http
        .post<any>(
            this.apiUrl + 'signup', {username, password, fullName},
            {observe: 'response'})
        .pipe(map(data => {
          if (data) {
            ApiService.token = data.body.token;
          }
          return data;
        }));
  }

  me() {
    return this.http.get<User>(this.apiUrl + 'users/me', {observe: 'response'})
        .pipe(map(data => {
          if (data) {
            data.body.token = ApiService.token;
            this.setLocalUser(data.body);
          }
          return data;
        }));
  }

  get(route: string) {
    return this.http.get(this.apiUrl + route, {observe: 'response'})
        .pipe(retry(2));
  }

  post(route: string, obj: any) {
    return this.http.post(this.apiUrl + route, obj, {observe: 'response'});
  }

  put(route: string, obj: any) {
    return this.http.put(this.apiUrl + route, obj);
  }

  delete(id: string) {
    return this.http.delete(this.apiUrl + id, {observe: 'response'});
  }
}
