// Source: https://bezkoder.com/angular-11-jwt-auth/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

const AUTH_API = 'http://enigmatic-cove-71059.herokuapp.com/v1/';

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

  register(first_name: string, last_name: string, height: string, phone_number: string, address: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      first_name,
      last_name,
      height,
      phone_number,
      address,
      email,
      password
    }, httpOptions);
  }

  bloodpressureGet(): Observable<any> {
    return this.http.get(AUTH_API + 'bloodpressure/sorted', {headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : `Bearer ${this.tokenStorage.getToken()}`})});
  }
  
  calorieGet(): Observable<any> {
    return this.http.get(AUTH_API + 'calories/sorted', {headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : `Bearer ${this.tokenStorage.getToken()}`})});
  }

  heartrateGet(): Observable<any> {
    return this.http.get(AUTH_API + 'heartrate/sorted', {headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : `Bearer ${this.tokenStorage.getToken()}`})});
  }

  routeGet(): Observable<any> {
    return this.http.get(AUTH_API + 'route', {headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : `Bearer ${this.tokenStorage.getToken()}`})});
  }

  weightGet(): Observable<any> {
    return this.http.get(AUTH_API + 'weight/sorted', {headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : `Bearer ${this.tokenStorage.getToken()}`})});
  }


}
