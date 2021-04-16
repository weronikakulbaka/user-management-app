import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  getUsers(page: number): Observable<any> {
    const httpParams: HttpParams = new HttpParams().set('page',`${page}`);
    return this.httpClient.get(`${environment.apiUrl}/users`, {params: httpParams});
  }

  deleteUser(user: User): Observable<any>{
    return this.httpClient.delete(`${environment.apiUrl}/users/${user.id}`);
  }
}
