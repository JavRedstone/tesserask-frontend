import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { CommentView } from 'src/app/classes/view/comment-view/comment-view';
import { Comment } from 'src/app/classes/dto/comment/comment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public createComment(comment: Comment): Observable<CommentView> {
    return this.httpClient.post<CommentView>(`${environment.backendUrl}/comments/actions/create`, comment);
  }

  public updateComment(comment: Comment): Observable<CommentView> {
    return this.httpClient.post<CommentView>(`${environment.backendUrl}/comments/actions/update`, comment);
  }

  public deleteComment(comment: Comment): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${environment.backendUrl}/comments/actions/delete`, {
      body: comment
    });
  }
}
