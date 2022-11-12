import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Category } from 'src/app/classes/dto/category/category';
import { CategoryView } from 'src/app/classes/view/category-view/category-view';
import { CategoryResult } from 'src/app/interfaces/result/category-result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private httpClient: HttpClient
  ) { }

  public getCategoryListBySpaceId(id: number, size: number): Observable<CategoryView[]> {
    return this.httpClient.get<CategoryResult>(`${environment.backendUrl}/categories/search/findBySpaceIdOrderByIdAsc?id=${id}&size=${size}`).pipe(
      map(response => response._embedded.categories)
    );
  }

  public getCategoryBySpaceId(id: number, page: number, size: number): Observable<CategoryResult> {
    return this.httpClient.get<CategoryResult>(`${environment.backendUrl}/categories/search/findBySpaceIdOrderByIdAsc?id=${id}&page=${page}&size=${size}`);
  }

  public getCategoryBySpaceIdSearch(id: number, literal: string, page: number, size: number): Observable<CategoryResult> {
    return this.httpClient.get<CategoryResult>(`${environment.backendUrl}/categories/search/findBySpaceIdSearch?id=${id}&literal=${literal}&page=${page}&size=${size}`)
  }
  
  public createCategory(category: Category): Observable<CategoryView> {
    return this.httpClient.post<CategoryView>(`${environment.backendUrl}/categories/actions/create`, category);
  }

  public updateCategory(category: Category): Observable<CategoryView> {
    return this.httpClient.post<CategoryView>(`${environment.backendUrl}/categories/actions/update`, category);
  }

  public deleteCategory(category: Category): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${environment.backendUrl}/categories/actions/delete`, {
      body: category  
    });
  }
}