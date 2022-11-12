import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/classes/dto/user/user';
import { AnswerView } from 'src/app/classes/view/answer-view/answer-view';
import { QuestionView } from 'src/app/classes/view/question-view/question-view';
import { UserView } from 'src/app/classes/view/user-view/user-view';
import dialogConfig from 'src/app/configs/dialog-config';
import snackbarConfig from 'src/app/configs/snackbar-config';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { QuestionService } from 'src/app/services/question/question.service';
import { ViewCategoriesComponent } from '../../popups/view-categories/view-categories.component';
import { ViewUserComponent } from '../../popups/view-user/view-user.component';
import { UserActionsComponent } from '../user-actions/user-actions.component';

@Component({
  selector: 'app-item-options',
  templateUrl: './item-options.component.html',
  styleUrls: ['./item-options.component.scss']
})
export class ItemOptionsComponent {
  @Input() public item: any;
  @Input() public parent: any;
  @Input() public type: string = '';

  public currentUser !: User;

  constructor(
    private questionService: QuestionService,
    private answerService: AnswerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.waitForAuthentication();
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

  private getVoteUserIndex(voteUserArray: UserView[]): number {
    for (let i = 0; i < voteUserArray.length; i++) {
      if (voteUserArray[i].user.id == UserActionsComponent.currentUser.id) {
        return i;
      }
    }
    return -1;
  }

  public async vote(mode: string): Promise<void> {
    let currentUserView: UserView = new UserView();
    currentUserView.user = UserActionsComponent.currentUser;

    let upvoteUsers = this.item.upvoteUsers;
    let downvoteUsers = this.item.downvoteUsers;

    let upvoteUserIndex: number = this.getVoteUserIndex(upvoteUsers);
    let downvoteUserIndex: number = this.getVoteUserIndex(downvoteUsers);
    
    if (mode == 'up') {
      if (downvoteUserIndex != -1) {
        downvoteUsers.splice(downvoteUserIndex, 1);
      }
      if (upvoteUserIndex == -1) {
        upvoteUsers.push(currentUserView);
      }
      else {
        upvoteUsers.splice(upvoteUserIndex, 1);
      }
    }
    else if (mode == 'down') {
      if (upvoteUserIndex != -1) {
        upvoteUsers.splice(upvoteUserIndex, 1);
      }
      if (downvoteUserIndex == -1) {
        downvoteUsers.push(currentUserView);
      }
      else {
        downvoteUsers.splice(downvoteUserIndex, 1);
      }
    }

    this.item.upvoteUsersDTO = [];
    for (let upvoteUserView of upvoteUsers) {
      this.item.upvoteUsersDTO.push(upvoteUserView.user);
    }

    this.item.downvoteUsersDTO = [];
    for (let downvoteUserView of downvoteUsers) {
      this.item.downvoteUsersDTO.push(downvoteUserView.user);
    }

    if (this.type == 'question') {
      let questionView: QuestionView = await lastValueFrom(this.questionService.updateQuestion(this.item));
    }
    else if (this.type == 'answer') {
      let answerView: AnswerView = await lastValueFrom(this.answerService.updateAnswer(this.item));
    }
  }

  public async accept(): Promise<void> {
    this.item.accepted = !this.item.accepted;
    let answerView: AnswerView = await lastValueFrom(this.answerService.updateAnswer(this.item));
    this.snackBar.open(`Answer successfully ${this.item.accepted ? '' : 'un'}accepted`, 'Close', {
      duration: snackbarConfig.duration
    });
  }

  public openDialog(type: string): void {
    if (type == 'category') {
      this.dialog.open(ViewCategoriesComponent, {
        ...dialogConfig.fullScreen,
        data: {
          item: this.item
        }  
      });
    }
    else if (type == 'user') {
      this.dialog.open(ViewUserComponent, {
        ...dialogConfig.fullScreen,
        data: {
          user: this.item.author.user
        }
      });
    }
  }
}
