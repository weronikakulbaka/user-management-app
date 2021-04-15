import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

export const SESSION_TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private tokenBS: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(localStorage.getItem(SESSION_TOKEN));

  get token(): string | null{
    return this.tokenBS.value;
  }

  get isUserLoggedIn(): boolean {
    return this.tokenBS.value !== null;
  }

  constructor(
    private httpClient: HttpClient
  ) { }

  login(username: string, password: string) {
    return this.httpClient.post<string>(`${environment.apiUrl}/login`, { username, password })
      .pipe(map((reponse: any) => {
        this.registerSuccessfulLogin(reponse.token);
        return reponse.token;
      }));
  }

  registerSuccessfulLogin(token: string): void {
    localStorage.setItem(SESSION_TOKEN, token)
    this.tokenBS.next(token);
  }

}