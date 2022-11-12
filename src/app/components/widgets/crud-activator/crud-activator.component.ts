import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Answer } from 'src/app/classes/dto/answer/answer';
import { Category } from 'src/app/classes/dto/category/category';
import { Comment } from 'src/app/classes/dto/comment/comment';
import { Question } from 'src/app/classes/dto/question/question';
import { Space } from 'src/app/classes/dto/space/space';
import { User } from 'src/app/classes/dto/user/user';
import dialogConfig from 'src/app/configs/dialog-config';
import { CreateEditItemComponent } from '../../popups/create-edit-item/create-edit-item.component';
import { DeleteItemComponent } from '../../popups/delete-item/delete-item.component';
import { JoinUnsharedComponent } from '../../popups/join-unshared/join-unshared.component';
import { LeaveSpaceComponent } from '../../popups/leave-space/leave-space.component';
import { UserActionsComponent } from '../user-actions/user-actions.component';

@Component({
  selector: 'app-crud-activator',
  templateUrl: './crud-activator.component.html',
  styleUrls: ['./crud-activator.component.scss']
})
export class CrudActivatorComponent {
  @Input() public item: any;
  @Input() public parent: any;
  @Input() public type: string = '';

  public currentUser !: User;
  public hasQuestionId: boolean = false;
  public isVisible: boolean = true;

  public crudAllowed: any = [
    'space',
    'category',
    'question',
    'answer',
    'comment'
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.waitForAuthentication();
    this.setUpHasQuestionId();
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

  private setUpHasQuestionId(): void {    
    this.activatedRoute.paramMap.subscribe(
      ( paramMap: ParamMap ) => {
        this.hasQuestionId = paramMap.has('questionId');
      }
    );
  }

  public isSpaceJoined(): boolean {
    for (let userView of this.item.users) {
      if (userView.user.id == UserActionsComponent.currentUser.id) {
        return true;
      }
    }
    return false;
  }

  private getItem(): any {
    switch (this.type) {
      case 'space': return new Space();
      case 'category': return new Category();
      case 'question': return new Question();
      case 'answer': return new Answer();
      case 'comment': return new Comment();
    }
  }

  public activateCrud(mode: string): void {
    this.dialog.closeAll();
    if (this.currentUser != null) {
      switch(mode) {
        case 'Create':
          this.dialog.open(CreateEditItemComponent, {
            ...dialogConfig.fullScreen,
            data: {
              mode: mode,
              item: this.getItem(),
              parent: this.parent,
              type: this.type
            }
          });
          break;
        case 'Edit':
          this.dialog.open(CreateEditItemComponent, {
            ...dialogConfig.fullScreen,
            data: {
              mode: mode,
              item: this.item,
              parent: this.parent,
              type: this.type
            }
          });
          break;
        case 'Delete':
          this.dialog.open(DeleteItemComponent, {
            data: {
              item: this.item,
              type: this.type
            }
          });
          break;
        case 'Response':
          let responseType: string = '';
          if (this.type == 'question') {
            responseType = 'answer'
          }
          else if (this.type == 'answer') {
            responseType = 'comment';
          }
          this.dialog.open(CreateEditItemComponent, {
            ...dialogConfig.fullScreen,
            data: {
              mode: 'Create',
              item: this.getItem(),
              parent: this.item,
              type: responseType
            }
          });
          break;
        case 'Code':
          this.dialog.open(JoinUnsharedComponent, {
            data: {
              mode: 'Code',
              code: this.item.code
            }
          });
          break;
        case 'Leave':
          this.dialog.open(LeaveSpaceComponent, {
            data: {
              space: this.item
            }
          });
          break;
      }
    }
  }
}
