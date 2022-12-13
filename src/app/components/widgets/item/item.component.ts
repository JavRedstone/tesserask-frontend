import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Attachment } from 'src/app/classes/dto/attachment/attachment';
import { User } from 'src/app/classes/dto/user/user';
import { AttachmentView } from 'src/app/classes/view/attachment-view/attachment-view';
import answerConfig from 'src/app/configs/answer-config';
import questionConfig from 'src/app/configs/question-config';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { environment } from 'src/environments/environment';
import { UserActionsComponent } from '../user-actions/user-actions.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() public item: any;
  @Input() public parent: any;
  @Input() public type: string = '';
  @Input() public width: number = 0;
  @Input() public height: number = 0;
  @Input() public resize: boolean = true;

  @ViewChild('itemDescription') private itemDescriptionElement !: ElementRef;

  public newWidth: number = 0;
  public currentUser !: User;
  public hasQuestionId: boolean = false;
  public loadingAttachments: boolean = false;
  public attachmentList: Attachment[] = [];
  private hasSpaceId: boolean = false;
  private spaceId: string | null = null;
  private spaceTitle: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private attachmentService: AttachmentService
  ) {
    this.waitForAuthentication();
    this.setUpActivatedRoutes();
  }

  private waitForAuthentication(): void {
    setTimeout(
      () => {
        if (UserActionsComponent.currentUser != null) {
          this.currentUser = UserActionsComponent.currentUser;
        }
        else {
          return this.waitForAuthentication();
        }
      }
    );
  }

  private setUpActivatedRoutes(): void {    
    this.activatedRoute.paramMap.subscribe(
      () => {
        this.hasSpaceId = this.activatedRoute.snapshot.paramMap.has('spaceId');
        if (this.hasSpaceId) {
          this.spaceId = this.activatedRoute.snapshot.paramMap.get('spaceId');
          this.spaceTitle = AppComponent.unformatUri(this.activatedRoute.snapshot.paramMap.get('spaceTitle'));
        }
        this.hasQuestionId = this.activatedRoute.snapshot.paramMap.has('questionId');        
        setTimeout(
          () => {
            if (this.hasQuestionId) {
              this.setMultipleAttachments();
              this.setStyles();
            }
            this.setResize();
            window.addEventListener('resize', (event: Event) => {
              this.setResize()
            });
          }
        );
      }
    )
  }

  private async setMultipleAttachments(): Promise<void> {
    this.loadingAttachments = true;
    for (let i = 0; i < (this.type == 'question' ? questionConfig.maxAttachmentAmount : answerConfig.maxAttachmentAmount); i++) {
      let attachmentViews: AttachmentView[] = [];
      switch(this.type) {
        case 'question':
          attachmentViews = await lastValueFrom(this.attachmentService.getAttachmentFromQuestionId(this.item.id, i, environment.rateOfFetch));
          break;
        case 'answer':
          attachmentViews = await lastValueFrom(this.attachmentService.getAttachmentFromAnswerId(this.item.id, i, environment.rateOfFetch));
          break;
      }
      if (attachmentViews.length > 0) {
        this.attachmentList.push(attachmentViews[0].attachment);
      }
    }
    this.loadingAttachments = false;
  }

  private setStyles(): void {
    AppComponent.formatText(this.itemDescriptionElement, this.item != null && this.itemDescriptionElement != null);
  }

  private setResize(): void {
    this.newWidth = this.resize && window.innerWidth - 90 < environment.itemWidth ? window.innerWidth - 90 - environment.itemWidth + this.width : this.width;
  }

  public async seeFullQuestion(): Promise<void> {
    if (this.hasSpaceId) {
      await AppComponent.redirectWithReload(`/spaces/${AppComponent.formatUri(this.spaceTitle.toLowerCase())}/${this.spaceId}/questions/${AppComponent.formatUri(this.item.title.toLowerCase())}/${this.item.id}`, {}, this.router);
    }
  }
}
