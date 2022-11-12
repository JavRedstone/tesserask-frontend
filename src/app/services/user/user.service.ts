import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/classes/dto/user/user';
import { UserView } from 'src/app/classes/view/user-view/user-view';
import { UserResult } from 'src/app/interfaces/result/user-result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(
    private httpClient: HttpClient
  ) { }

  public getUserByUid(uid: string): Observable<UserView[]> {
    return this.httpClient.get<UserResult>(`${environment.backendUrl}/users/search/findByUid?uid=${uid}`).pipe(
      map(response => response._embedded.users)
    );
  }

  public getUserBySpaceId(id: number, page: number, size: number): Observable<UserResult> {
    return this.httpClient.get<UserResult>(`${environment.backendUrl}/users/search/findBySpacesIdOrderByIdAsc?id=${id}&page=${page}&size=${size}`);
  }

  public getUserBySpaceIdSearch(id: number, literal: string, page: number, size: number): Observable<UserResult> {
    return this.httpClient.get<UserResult>(`${environment.backendUrl}/users/search/findBySpacesIdSearch?id=${id}&literal=${literal}&page=${page}&size=${size}`)
  }
  
  public createUser(user: User): Observable<UserView> {
    return this.httpClient.post<UserView>(`${environment.backendUrl}/users/actions/create`, user);
  }

  public updateUser(user: User): Observable<UserView> {
    return this.httpClient.post<UserView>(`${environment.backendUrl}/users/actions/update`, user);
  }
}