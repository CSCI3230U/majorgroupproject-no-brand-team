// Source: https://bezkoder.com/angular-11-jwt-auth/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

const AUTH_API = 'http://enigmatic-cove-71059.herokuapp.com/v1/';
// const AUTH_API = 'localhost:3000/v1/'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      email,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }

  bloodpressureGet(): Observable<any> {
    return this.http.get(AUTH_API + 'bloodpressure/sorted', {headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : `Bearer ${this.tokenStorage.getToken()}`})});
  }


}
