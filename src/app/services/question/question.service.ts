import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Question } from 'src/app/classes/dto/question/question';
import { QuestionView } from 'src/app/classes/view/question-view/question-view';
import { QuestionResult } from 'src/app/interfaces/result/question-result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getQuestionById(id: number): Observable<QuestionView[]> {
    return this.httpClient.get<QuestionResult>(`${environment.backendUrl}/questions/search/findById?id=${id}&page=0&size=1`).pipe(
      map(response => response._embedded.questions),
    );
  }

  public getQuestionBySpaceId(id: number, page: number, size: number): Observable<QuestionResult> {
    return this.httpClient.get<QuestionResult>(`${environment.backendUrl}/questions/search/findBySpaceIdOrderByIdAsc?id=${id}&page=${page}&size=${size}`);
  }

  public getQuestionBySpaceIdSearch(id: number, literal: string, page: number, size: number): Observable<QuestionResult> {
    return this.httpClient.get<QuestionResult>(`${environment.backendUrl}/questions/search/findBySpaceIdSearch?id=${id}&literal=${literal}&page=${page}&size=${size}`)
  }

  public getQuestionByCategoryId(id: number): Observable<QuestionView[]> {
    return this.httpClient.get<QuestionResult>(`${environment.backendUrl}/questions/search/findByCategoriesId?id=${id}`).pipe(
      map(response => response._embedded.questions)
    );
  }

  public createQuestion(question: Question): Observable<QuestionView> {
    return this.httpClient.post<QuestionView>(`${environment.backendUrl}/questions/actions/create`, question);
  }

  public updateQuestion(question: Question): Observable<QuestionView> {
    return this.httpClient.post<QuestionView>(`${environment.backendUrl}/questions/actions/update`, question);
  }

  public deleteQuestion(question: Question): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${environment.backendUrl}/questions/actions/delete`, {
      body: question  
    });
  }
}