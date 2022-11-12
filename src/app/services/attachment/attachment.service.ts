import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Attachment } from 'src/app/classes/dto/attachment/attachment';
import { AttachmentView } from 'src/app/classes/view/attachment-view/attachment-view';
import { AttachmentResult } from 'src/app/interfaces/result/attachment-result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  constructor(
    private httpClient: HttpClient
  ) { }

  public getAttachmentFromQuestionId(id: number, page: number, size: number): Observable<AttachmentView[]> {
    return this.httpClient.get<AttachmentResult>(`${environment.backendUrl}/attachments/search/findByQuestionIdOrderByIdAsc?id=${id}&page=${page}&size=${size}`).pipe(
      map(response => response._embedded.attachments)
    );
  }
  
  public getAttachmentFromAnswerId(id: number, page: number, size: number): Observable<AttachmentView[]> {
    return this.httpClient.get<AttachmentResult>(`${environment.backendUrl}/attachments/search/findByAnswerIdOrderByIdAsc?id=${id}&page=${page}&size=${size}`).pipe(
      map(response => response._embedded.attachments)
    );
  }
  
  public createAttachment(attachment: Attachment): Observable<AttachmentView> {
    return this.httpClient.post<AttachmentView>(`${environment.backendUrl}/attachments/actions/create`, attachment);
  }

  public deleteAttachment(attachment: Attachment): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${environment.backendUrl}/attachments/actions/delete`, {
      body: attachment  
    });
  }
}
