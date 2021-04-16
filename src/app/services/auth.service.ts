import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export const SESSION_TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenBS: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(localStorage.getItem(SESSION_TOKEN));

  get token(): string | null {
    return this.tokenBS.value;
  }

  get isUserLoggedIn(): boolean {
    return this.tokenBS.value !== null;
  }

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string): Observable<string> {
    return this.httpClient.post<string>(`${environment.apiUrl}/login`, { username, password })
      .pipe(map((reponse: any) => {
        this.registerSuccessfulLogin(reponse.token);
        return reponse.token;
      }));
  }

  register(username: string, password: string): Observable<{id: number, token: string}>{
    return this.httpClient.post<{id: number, token: string}>(`${environment.apiUrl}/register`, { username, password })
    .pipe(map((reponse: any) => {
      this.registerSuccessfulLogin(reponse.token);
      return reponse;
    }));
  }

  logout(): void {
    localStorage.removeItem(SESSION_TOKEN);
    this.tokenBS.next(null);
    this.router.navigate(['login']);
  }
  registerSuccessfulLogin(token: string): void {
    localStorage.setItem(SESSION_TOKEN, token)
    this.tokenBS.next(token);
  }



}