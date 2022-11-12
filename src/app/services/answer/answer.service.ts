import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Answer } from 'src/app/classes/dto/answer/answer';
import { AnswerView } from 'src/app/classes/view/answer-view/answer-view';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public createAnswer(answer: Answer): Observable<AnswerView> {
    return this.httpClient.post<AnswerView>(`${environment.backendUrl}/answers/actions/create`, answer);
  }

  public updateAnswer(answer: Answer): Observable<AnswerView> {
    return this.httpClient.post<AnswerView>(`${environment.backendUrl}/answers/actions/update`, answer);
  }

  public deleteAnswer(answer: Answer): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${environment.backendUrl}/answers/actions/delete`, {
      body: answer
    });
  }
}
