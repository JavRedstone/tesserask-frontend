import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Space } from 'src/app/classes/dto/space/space';
import { Question } from 'src/app/classes/dto/question/question';
import { User } from 'src/app/classes/dto/user/user';
import { SpaceView } from 'src/app/classes/view/space-view/space-view';
import { QuestionView } from 'src/app/classes/view/question-view/question-view';
import { SpaceService } from 'src/app/services/space/space.service';
import { QuestionService } from 'src/app/services/question/question.service';
import { UserActionsComponent } from '../user-actions/user-actions.component';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-space-moderator',
  templateUrl: './space-moderator.component.html',
  styleUrls: ['./space-moderator.component.scss']
})
export class SpaceModeratorComponent {
  @Input() public showUI: boolean = false;
  
  @Output() private spaceAllowed: EventEmitter<any> = new EventEmitter<any>();

  public currentUser !: User;
  public allowedSpace: boolean = false;
  public existsSpace: boolean = false;
  public existsQuestion: boolean = false;
  public spaceId: number | null = null;
  public questionId: number | null = null;
  private pathname: string = '';
  private spaceTitle: string = '';
  private spacePath: string = '';
  private questionTitle: string = '';
  private space !: Space;
  private question !: Question;
  private fourthUrl: string[] = ['questions', 'categories', 'users'];

  constructor(
    private router: Router,
    private spaceService: SpaceService,
    private questionService: QuestionService
  ) {
    this.router.events.subscribe(
      async () => {
        if (this.pathname != location.pathname) {
          this.resetVariables();
          await this.getUrlComponents();
        }
      }
    )
  }

  private resetVariables(): void {
    this.spaceId = null;
    this.spaceTitle = '';
    this.questionId = null;
    this.questionTitle = '';
    this.allowedSpace = false;
    this.existsSpace = false;
    this.existsQuestion = false;
  }

  private async getUrlComponents(): Promise<void> {
    this.pathname = location.pathname;
    let urlArr: string[] = this.pathname.split('/');
    if (urlArr.length > 2) {
      if (this.fourthUrl.includes(urlArr[4])) {
        this.spaceTitle = urlArr[2];
        if (!isNaN(+urlArr[3])) {
          this.spaceId = +urlArr[3];
        } else {
          this.router.navigateByUrl('');
        }
        this.spacePath = urlArr[4];
        if (urlArr.length == 7) {
          this.questionTitle = urlArr[5];
          if (!isNaN(+urlArr[6])) {
            this.questionId = +urlArr[6];
          } else {
            this.router.navigateByUrl('');
          }
        }
        if (this.spaceId != null && this.questionId != null) {
          await this.getQuestionExists(this.spaceId, this.questionId);
        }
        else if (this.spaceId != null) {
          await this.getSpaceExists(this.spaceId);
        }
      }
    }
    else if (urlArr.length == 2 && urlArr[1] != '') {
      this.waitForAuthentication(false, true);
    }
  }

  private async getSpaceExists(spaceId: number): Promise<void> {
    let spaceViews: SpaceView[] = await lastValueFrom(this.spaceService.getSpaceById(spaceId));
    if (spaceViews.length > 0) {
      this.existsSpace = true;
      this.space = spaceViews[0].space;
      if (this.spaceTitle != AppComponent.formatUri(this.space.title.toLowerCase())) {
        this.router.navigateByUrl(`/spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/${this.spacePath}`);
      }
      if (this.space.title == 'Public') {
        this.spaceAllowed.emit({
          space: this.space
        });
        this.allowedSpace = true;
      }
      this.waitForAuthentication(true, false);
    }
  }

  private async getQuestionExists(spaceId: number, questionId: number): Promise<void> {
    let spaceViews: SpaceView[] = await lastValueFrom(this.spaceService.getSpaceById(spaceId));
    if (spaceViews.length > 0) {
      this.existsSpace = true;
      this.allowedSpace = true;
      this.space = spaceViews[0].space;
      let questionViews: QuestionView[] = await lastValueFrom(this.questionService.getQuestionById(questionId));
      if (questionViews.length > 0 && questionViews[0].question.space.space.id == this.space.id) {
        this.existsQuestion = true;
        this.question = questionViews[0].question;
        if (this.spaceTitle != AppComponent.formatUri(this.space.title.toLowerCase()) || this.questionTitle != AppComponent.formatUri(this.question.title.toLowerCase())) {
          this.router.navigateByUrl(`/spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/questions/${AppComponent.formatUri(this.question.title.toLowerCase())}/${this.question.id}`);
        }
        if (this.space.title == 'Public') {
          this.spaceAllowed.emit({
            space: this.space,
            question: this.question
          });
          this.allowedSpace = true;
        }
        this.waitForAuthentication(true, false);
      }
      else {
        this.waitForAuthentication(false, false);
      }
    }
    else {
      this.waitForAuthentication(false, false);
    }
  }

  private waitForAuthentication(checkAllowed: boolean, emitMessage: boolean): void {
    setTimeout(
      () => {
        if (UserActionsComponent.currentUser != null) {
          this.currentUser = UserActionsComponent.currentUser;
          if (checkAllowed) {
            this.checkSpaceAllowed();
          }
          else  if (emitMessage) {
            this.spaceAllowed.emit();
            this.allowedSpace = true;
          }
        }
        else {
          return this.waitForAuthentication(checkAllowed, emitMessage);
        }
      }
    );
  }

  private checkSpaceAllowed(): void {
    for (let userView of this.space.users) {
      if (userView.user.id == UserActionsComponent.currentUser.id) {
        this.spaceAllowed.emit({
          space: this.space,
          question: this.question
        });
        this.allowedSpace = true;
        return;
      }
    }
  }
}
