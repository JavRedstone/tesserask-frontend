import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Category } from 'src/app/classes/dto/category/category';
import { CategoryView } from 'src/app/classes/view/category-view/category-view';
import { QuestionView } from 'src/app/classes/view/question-view/question-view';
import dialogConfig from 'src/app/configs/dialog-config';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { QuestionService } from 'src/app/services/question/question.service';
import { SpaceService } from 'src/app/services/space/space.service';
import { UserActionsComponent } from '../../widgets/user-actions/user-actions.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    private spaceService: SpaceService,
    private categoryService: CategoryService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private commentService: CommentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  public async deleteItem(): Promise<void> {
    this.dialog.open(LoadingComponent, {
      ...dialogConfig.stayOpen
    });
    switch(this.data.type) {
      case 'space':
        await this.deleteSpace();
        break;
      case 'category':
        await this.deleteCategory();
        break;
      case 'question':
        await this.deleteQuestion();
        break;
      case 'answer':
        this.deleteAnswer();
        break;
      case 'comment':
        this.deleteComment();
        break;
    }
  }

  private async deleteSpace(): Promise<void> {
    let deleted: boolean = await lastValueFrom(this.spaceService.deleteSpace(this.data.item));
    if (deleted) {
      this.snackBar.open('Deleted space successfully');
      AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }

  private async deleteCategory(): Promise<void> {
    let questionViews: QuestionView[] = await lastValueFrom(this.questionService.getQuestionByCategoryId(this.data.item.id));
      for (let q of questionViews) {
        let categories: Category[] = [];
        for (let category of q.question.categories) {
          if (category.category.id != this.data.item.id) {
            categories.push(category.category);
          }
        }
        q.question.categoriesDTO = categories;
        let questionView: QuestionView = await lastValueFrom(this.questionService.updateQuestion(q.question));
      }
    let deleted: boolean = await lastValueFrom(this.categoryService.deleteCategory(this.data.item));
    if (deleted) {
      this.snackBar.open('Deleted category successfully');
      AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }

  private async deleteQuestion(): Promise<void> {
    this.data.item.authorDTO = UserActionsComponent.currentUser;
    let deleted: boolean = await lastValueFrom(this.questionService.deleteQuestion(this.data.item));
    if (deleted) {
      this.snackBar.open('Deleted question successfully');
      await AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }

  private async deleteAnswer(): Promise<void> {
    this.data.item.authorDTO = UserActionsComponent.currentUser;
    let deleted: boolean = await lastValueFrom(this.answerService.deleteAnswer(this.data.item));
    if (deleted) {
      this.snackBar.open('Deleted answer successfully');
      AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }

  private async deleteComment(): Promise<void> {
    this.data.item.authorDTO = UserActionsComponent.currentUser;
    let deleted: boolean = await lastValueFrom(this.commentService.deleteComment(this.data.item));
    if (deleted) {
      this.snackBar.open('Deleted comment successfully');
      AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }
}
