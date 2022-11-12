import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Space } from 'src/app/classes/dto/space/space';
import { SpaceView } from 'src/app/classes/view/space-view/space-view';
import { SpaceResult } from 'src/app/interfaces/result/space-result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getSpaceById(id: number): Observable<SpaceView[]> {
    return this.httpClient.get<SpaceResult>(`${environment.backendUrl}/spaces/search/findById?id=${id}`).pipe(
      map(response => response._embedded.spaces)
    );
  }

  public getSpacesByAuthorId(id: number, page: number, size: number): Observable<SpaceResult> {
    return this.httpClient.get<SpaceResult>(`${environment.backendUrl}/spaces/search/findByAuthorIdOrderByIdAsc?id=${id}&page=${page}&size=${size}`);
  }

  public getSpacesByAuthorIdSearch(id: number, literal: string, page: number, size: number): Observable<SpaceResult> {
    return this.httpClient.get<SpaceResult>(`${environment.backendUrl}/spaces/search/findByAuthorIdSearch?id=${id}&literal=${literal}&page=${page}&size=${size}`);
  }

  public getSpacesByUserId(id: number, page: number, size: number): Observable<SpaceResult> {
    return this.httpClient.get<SpaceResult>(`${environment.backendUrl}/spaces/search/findByUsersIdOrderByIdAsc?id=${id}&page=${page}&size=${size}`);
  }

  public getSpacesByUserIdSearch(id: number, literal: string, page: number, size: number): Observable<SpaceResult> {
    return this.httpClient.get<SpaceResult>(`${environment.backendUrl}/spaces/search/findByUsersIdSearch?id=${id}&literal=${literal}&page=${page}&size=${size}`);
  }

  public getSharedSpaces(page: number, size: number): Observable<SpaceResult> {
    return this.httpClient.get<SpaceResult>(`${environment.backendUrl}/spaces/search/findBySharedOrderByIdAsc?shared=True&page=${page}&size=${size}`);
  }

  public getSharedSpacesSearch(literal: string, page: number, size: number): Observable<SpaceResult> {
    return this.httpClient.get<SpaceResult>(`${environment.backendUrl}/spaces/search/findBySharedSearch?shared=True&literal=${literal}&page=${page}&size=${size}`);
  }

  public getSpaceByCode(code: string): Observable<SpaceView[]> {
    return this.httpClient.get<SpaceResult>(`${environment.backendUrl}/spaces/search/findByCode?code=${code}`).pipe(
      map(response => response._embedded.spaces)
    );
  }
 
  public createSpace(space: Space): Observable<SpaceView> {
    return this.httpClient.post<SpaceView>(`${environment.backendUrl}/spaces/actions/create`, space);
  }

  public updateSpace(space: Space): Observable<SpaceView> {
    return this.httpClient.post<SpaceView>(`${environment.backendUrl}/spaces/actions/update`, space);
  }

  public deleteSpace(space: Space): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${environment.backendUrl}/spaces/actions/delete`, {
      body: space  
    });
  }
}