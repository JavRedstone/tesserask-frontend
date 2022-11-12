import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { UserActionsComponent } from '../../widgets/user-actions/user-actions.component';
import { Category } from 'src/app/classes/dto/category/category';
import { CategoryView } from 'src/app/classes/view/category-view/category-view';
import { QuestionService } from 'src/app/services/question/question.service';
import { Question } from 'src/app/classes/dto/question/question';
import { QuestionView } from 'src/app/classes/view/question-view/question-view';
import { UserView } from 'src/app/classes/view/user-view/user-view';
import { Answer } from 'src/app/classes/dto/answer/answer';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { AnswerView } from 'src/app/classes/view/answer-view/answer-view';
import { CommentView } from 'src/app/classes/view/comment-view/comment-view';
import { Comment } from 'src/app/classes/dto/comment/comment';
import { CommentService } from 'src/app/services/comment/comment.service';
import { SpaceService } from 'src/app/services/space/space.service';
import { SpaceView } from 'src/app/classes/view/space-view/space-view';
import { Space } from 'src/app/classes/dto/space/space';
import { CategoryService } from 'src/app/services/category/category.service';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { Attachment } from 'src/app/classes/dto/attachment/attachment';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { AttachmentView } from 'src/app/classes/view/attachment-view/attachment-view';
import { CategoryResult } from 'src/app/interfaces/result/category-result';
import { LoadingComponent } from '../loading/loading.component';
import snackbarConfig from 'src/app/configs/snackbar-config';
import { environment } from 'src/environments/environment';
import dialogConfig from 'src/app/configs/dialog-config';
import { User } from 'src/app/classes/dto/user/user';
import questionConfig from 'src/app/configs/question-config';
import answerConfig from 'src/app/configs/answer-config';
import categoryConfig from 'src/app/configs/category-config';
import spaceConfig from 'src/app/configs/space-config';
import userConfig from 'src/app/configs/user-config';
import commentConfig from 'src/app/configs/comment-config';

@Component({
  selector: 'app-create-edit-item',
  templateUrl: './create-edit-item.component.html',
  styleUrls: ['./create-edit-item.component.scss']
})
export class CreateEditItemComponent {
  @ViewChild('createEditItemTitle') private titleElement !: ElementRef;
  @ViewChild('createEditItemDescription') private descriptionElement !: ElementRef;
  @ViewChild('createEditItemCategoryInput') private categoryInputElement !: ElementRef;

  public window: Window = window;
  public titleFormGroup !: FormGroup;
  public descriptionFormGroup !: FormGroup;
  public categoryControl: FormControl = new FormControl();
  public attachmentList: AttachmentView[] = [];
  public totalAttachmentsSize: number = 0;
  public categoryList: CategoryView[] = [];
  public filteredCategories: Observable<CategoryView[]> = new Observable();
  public sharedSpace: boolean = false;
  public maxAttachmentSize: number = 0;
  public titleType: string = '';
  public attachmentType: string = '';
  public titleLength: number = 0;
  public descriptionLength: number = 0;
  private maxAttachmentAmount: number = 0;
  private pendingAttachmentList: AttachmentView[] = [];
  private pendingDeleteAttachmentList: Attachment[] = [];
  private categories: CategoryView[] = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private attachmentService: AttachmentService,
    private spaceService: SpaceService,
    private userService: UserService,
    private categoryService: CategoryService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private commentService: CommentService
  ) {
    this.setInitialValues();
    this.setFormGroups();
  }

  public async setInitialValues(): Promise<void> {
    switch(this.data.type) {
      case 'space':
        this.maxAttachmentAmount = 1;
        this.maxAttachmentSize = spaceConfig.maxAttachmentSize;
        this.titleType = spaceConfig.titleType;
        this.attachmentType = spaceConfig.attachmentType;
        this.titleLength = spaceConfig.titleLength;
        this.descriptionLength = spaceConfig.descriptionLength;
        if (this.data.mode == 'Create') {
          this.data.item = new Space();
        }
        else if (this.data.mode == 'Edit') {
          this.sharedSpace = this.data.item.shared;
          this.setAttachments();
        }
        break;
      case 'user':
        this.maxAttachmentAmount = 1;
        this.maxAttachmentSize = userConfig.maxAttachmentSize;
        this.titleType = userConfig.titleType;
        this.attachmentType = userConfig.attachmentType;
        this.titleLength = userConfig.titleLength;
        this.descriptionLength = userConfig.descriptionLength;
        if (this.data.mode == 'Create') {
          this.data.item = new User();
        }
        else if (this.data.mode == 'Edit') {
          this.setAttachments();
        }
        break;
      case 'category':
        this.titleLength = categoryConfig.titleLength;
        this.descriptionLength = categoryConfig.descriptionLength;
        this.titleType = categoryConfig.titleType;
        break;
      case 'question':
        this.maxAttachmentAmount = questionConfig.maxAttachmentAmount;
        this.maxAttachmentSize = questionConfig.maxAttachmentSize;
        this.titleType = questionConfig.titleType;
        this.attachmentType = questionConfig.attachmentType;
        this.titleLength = questionConfig.titleLength;
        this.descriptionLength = questionConfig.descriptionLength;
        if (this.data.mode == 'Create') {
          this.data.item = new Question();
        }
        else if (this.data.mode == 'Edit') {
          await this.setAttachments();
        }
        await this.listCategories();
        break;
      case 'answer':
        this.maxAttachmentAmount = answerConfig.maxAttachmentAmount;
        this.maxAttachmentSize = answerConfig.maxAttachmentSize;
        this.attachmentType = answerConfig.attachmentType;
        this.descriptionLength = answerConfig.descriptionLength;
        if (this.data.mode == 'Create') {
          this.data.item = new Answer();
        }
        else if (this.data.mode == 'Edit') {
          await this.setAttachments();
        }
        break;
      case 'comment':
        this.descriptionLength = commentConfig.descriptionLength;
        break;
    }
  }

  private async setAttachments(): Promise<void> {
    for (let i = 0; i < this.maxAttachmentAmount; i++) {
      let attachmentViews: AttachmentView[] = this.data.item.attachments != null ? this.data.item.attachments : [];
      switch(this.data.type) {
        case 'question':
          attachmentViews = await lastValueFrom(this.attachmentService.getAttachmentFromQuestionId(this.data.item.id, i, environment.rateOfFetch));
          break;
        case 'answer':
          attachmentViews = await lastValueFrom(this.attachmentService.getAttachmentFromAnswerId(this.data.item.id, i, environment.rateOfFetch));
          break;
      }
      if (attachmentViews.length > 0) {
        this.attachmentList.push(attachmentViews[0]);
        this.totalAttachmentsSize += attachmentViews[0].attachment.size;
      }
    }
  }

  public setFormGroups(): void {
    this.titleFormGroup = this.formBuilder.group({
      titleControl: new FormControl(this.data.item != null && this.data.item.title != null ? this.data.item.title : '', Validators.required)
    });
    this.descriptionFormGroup = this.formBuilder.group({
      descriptionControl: new FormControl(this.data.item != null && this.data.item.description != null ? this.data.item.description : '', Validators.required)
    });
  }

  public async onFileSelected(event: any): Promise<void> {
    await this.addInputFiles(event.target.files);
    event.target.value = '';
  }

  public async onFileDropped(files: File[]): Promise<void> {
    await this.addInputFiles(files);
  }

  public updateTotalAttachmentsSize(size: number): void {
    this.totalAttachmentsSize = Math.round((this.totalAttachmentsSize + size) * 100) / 100;
  }

  public async removeFromAttachmentList(attachment: Attachment): Promise<void> {
    for (let i = 0; i < this.attachmentList.length; i++) {
      if (attachment.id == this.attachmentList[i].attachment.id) {
        this.attachmentList.splice(i, 1);
        this.updateTotalAttachmentsSize(-attachment.size);
        let inside: boolean = false;
        for (let j = 0; j < this.pendingAttachmentList.length; j++) {
          if (attachment.id == this.pendingAttachmentList[j].attachment.id) {
            inside = true;
            this.pendingAttachmentList.splice(j, 1);
            break;
          }
        }
        if (!inside) {
          this.pendingDeleteAttachmentList.push(attachment);
        }
        break;
      }
    }
  }

  private async addInputFiles(files: File[]): Promise<void> {
    if (this.data.item.attachments != null) {
      files = [files[0]];
    }
    for (let file of files) {
      if (file != null) {
        if (this.data.item.attachments != null) {
          if (file.type.match(/image.*/)) {
            await this.addToAttachmentList(file);
          }
          else {
            this.snackBar.open('You can only upload an image or gif!', 'Close', {
              duration: snackbarConfig.duration
            });
          }
        }
        else {
          await this.addToAttachmentList(file);
        }
      }
    }
  }

  private async addToAttachmentList(file: File) {
    if (this.attachmentList.length < this.maxAttachmentAmount) {
      if (this.totalAttachmentsSize + AppComponent.getFileSizeInMB(file) < this.maxAttachmentSize) {
        let base64: string | ArrayBuffer = await AppComponent.toBase64(file);
        if (typeof base64 == 'string') {
          let attachment: Attachment = new Attachment();
          attachment.id = -this.attachmentList.length - 1
          attachment.name = file.name;
          attachment.type = file.type;
          attachment.size = AppComponent.getFileSizeInMB(file);
          attachment.lastModified = file.lastModified;
          attachment.base64 = base64;
          let attachmentView: AttachmentView = new AttachmentView();
          attachmentView.attachment = attachment;
          if (this.data.item.attachments != null && this.attachmentList.length > 0) {
            await this.removeFromAttachmentList(this.attachmentList[0].attachment);
          }
          this.attachmentList.push(attachmentView);
          this.pendingAttachmentList.push(attachmentView);
          this.updateTotalAttachmentsSize(AppComponent.getFileSizeInMB(file));
        }
      }
      else {
        this.snackBar.open(`Max attachments size is ${this.maxAttachmentSize} MB!`, 'Close', {
          duration: snackbarConfig.duration
        });
      }
    }
    else {
      this.snackBar.open(`You can only upload ${this.maxAttachmentAmount} ${this.maxAttachmentAmount != 1 ? 'attachments' : 'attachment'}!`, 'Close', {
        duration: snackbarConfig.duration
      });
    }
  }

  private async listCategories(): Promise<void> {
    let categoryViews: CategoryView[] = await lastValueFrom(this.categoryService.getCategoryListBySpaceId(this.data.parent.id, categoryConfig.maxListAmount));
    this.categories = categoryViews;
    if (this.data.item != null) {
      this.categoryList = this.data.item.categories;
    }

    this.filteredCategories = this.categoryControl.valueChanges.pipe(
      startWith(null),
      map((c: string | null) => (c ? this.filterCategory(c) : this.categories.slice()))
    );
  }

  private filterCategory(c: string): CategoryView[] {
    return this.categories.filter(value => value.category.title.toLowerCase().includes(c.toLowerCase()));
  }

  public removeCategory(category: CategoryView): void{
    this.categoryList.splice(this.categoryList.indexOf(category), 1);
  }

  private findCategory(categoryTitle: string): CategoryView | null {
    for (let c of this.categories) {
      if (c.category.title == categoryTitle) {
        for (let _c of this.categoryList) {
          if (_c.category.title == categoryTitle) {
            return null;
          }
        }
        return c;
      }
    }
    return null;
  }

  public selectedCategory(event: MatAutocompleteSelectedEvent): void {
    let category: CategoryView | null = this.findCategory(event.option.viewValue);
    if (this.categoryList.length >= categoryConfig.maxQuestionAmount) {
      this.snackBar.open(`You can only add ${categoryConfig.maxQuestionAmount} categories!`, 'Close', {
        duration: snackbarConfig.duration
      });
    }
    else if (category != null) {
      this.categoryList.push(category);
    }
    else {
      this.snackBar.open('Duplicate categories are not allowed!', 'Close', {
        duration: snackbarConfig.duration
      });
    }

    this.categoryInputElement.nativeElement.value = '';
    this.categoryControl.setValue(null);
  }

  public async createEditItem(): Promise<void> {
    switch(this.data.type) {
      case 'user':
        await this.editUser();
        break;
      case 'space':
        await this.createEditSpace();
        break;
      case 'category':
        if (this.data.parent != null) {
          await this.createEditCategory();
        }
        break;
      case 'question':
        if (this.data.parent != null) {
          await this.createEditQuestion();
        }
        break;
      case 'answer':
        if (this.data.parent != null) {
          await this.createEditAnswer();
        }
        break;
      case 'comment':
        if (this.data.parent != null) {
          await this.createEditComment();
        }
        break;
    }
  }

  private async createAttachment(attachment: Attachment, item: any): Promise<void> {
    switch(this.data.type) {
      case 'user':
        attachment.userDTO = item
        break;
      case 'space':
        attachment.spaceDTO = item;
        break;
      case 'question':
        attachment.questionDTO = item;
        break;
      case 'answer':
        attachment.answerDTO = item;
        break;
    }
    let attachmentView: AttachmentView = await lastValueFrom(this.attachmentService.createAttachment(attachment));
  }

  private async setDefaultAttachment(item: any): Promise<void> {
    if (this.data.type == 'user') {
      let userView: UserView = await lastValueFrom(this.userService.updateUser(item));
    }
    else if (this.data.type == 'space') {
      let spaceView: SpaceView = await lastValueFrom(this.spaceService.updateSpace(item));
    }
  }

  private async deleteAttachments(): Promise<void> {
    for (let attachment of this.pendingDeleteAttachmentList) {
      let deleted: boolean = await lastValueFrom(this.attachmentService.deleteAttachment(attachment));
    }
  }

  private async editUser(): Promise<void> {
    this.data.item.title = this.titleElement.nativeElement.value.trim();
    if (this.data.item.title.toLowerCase() == 'tesserask admin') {
      this.snackBar.open(`"${this.data.item.title}" is a restricted user name!`);
      AppComponent.redirectWithReload(location.pathname, {}, this.router);
      return;
    }
    this.data.item.description = this.descriptionElement.nativeElement.value.trim();

    if (this.data.mode == 'Edit') {
      this.dialog.open(LoadingComponent, {
        ...dialogConfig.stayOpen
      });

      let userView: UserView = await lastValueFrom(this.userService.updateUser(this.data.item));
      await this.deleteAttachments();
      if (this.pendingAttachmentList.length > 0) {
        await this.createAttachment(this.pendingAttachmentList[0].attachment, userView.user);
      }
      else {
        await this.setDefaultAttachment(userView.user);
      }
      this.snackBar.open('User successfully edited');
      await AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }

  private async createEditSpace(): Promise<void> {
    let space: Space = this.data.mode == 'Create' ? new Space() : this.data.item;
    space.title = this.titleElement.nativeElement.value.trim();
    if (space.title.toLowerCase() == 'public') {
      this.snackBar.open(`"${space.title}" is a restricted space name!`);
      AppComponent.redirectWithReload(location.pathname, {}, this.router);
      return;
    }
    space.description = this.descriptionElement.nativeElement.value.trim();
    space.shared = this.sharedSpace;
    
    if (this.data.mode == 'Create') {
      this.dialog.open(LoadingComponent, {
        ...dialogConfig.stayOpen
      });

      space.authorDTO = UserActionsComponent.currentUser;
      let spaceView: SpaceView = await lastValueFrom(this.spaceService.createSpace(space));
      spaceView.space.attachments = [];
      if (this.pendingAttachmentList.length > 0) {
        await this.createAttachment(this.pendingAttachmentList[0].attachment, spaceView.space);
      }
      else {
        this.setDefaultAttachment(spaceView.space);
      }
      this.snackBar.open('Space successfully created');
      await AppComponent.redirectWithReload(`/spaces/${spaceView.space.title.toLowerCase()}/${spaceView.space.id}/questions`, {}, this.router);
    }
    else if (this.data.mode == 'Edit') {
      this.dialog.open(LoadingComponent, {
        ...dialogConfig.stayOpen
      });

      let spaceView: SpaceView = await lastValueFrom(this.spaceService.updateSpace(space));
      await this.deleteAttachments();
      if (this.pendingAttachmentList.length > 0) {
        await this.createAttachment(this.pendingAttachmentList[0].attachment, spaceView.space);
      }
      else {
        this.setDefaultAttachment(spaceView.space);
      }
      this.snackBar.open('Space successfully updated');
      await AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }

  private async createEditCategory(): Promise<void> {  
    let category: Category = this.data.mode == 'Create' ? new Category() : this.data.item;
    category.title = this.titleElement.nativeElement.value.trim();
    category.description = this.descriptionElement.nativeElement.value.trim();

    if (this.data.mode == 'Create') {
      let categoryResult: CategoryResult = await lastValueFrom(this.categoryService.getCategoryBySpaceId(this.data.parent.id, 0, environment.rateOfFetch));
      let maxPages: number = categoryResult.page.totalPages;
      if (maxPages < categoryConfig.maxListAmount) {
        this.dialog.open(LoadingComponent, {
          ...dialogConfig.stayOpen
        });

        category.authorDTO = UserActionsComponent.currentUser;
        category.spaceDTO = this.data.parent;
        let categoryView: CategoryView = await lastValueFrom(this.categoryService.createCategory(category));
        this.snackBar.open('Category successfully created');
        await AppComponent.redirectWithReload(location.pathname, {}, this.router);
      }
      else {
        this.snackBar.open(`Category limit of ${categoryConfig.maxListAmount} reached for this space!`, 'Close', {
          duration: snackbarConfig.duration
        });
      }
    }
    else if (this.data.mode == 'Edit') {
      let categoryView: CategoryView = await lastValueFrom(this.categoryService.updateCategory(category));
      this.snackBar.open('Category successfully edited', 'Close', {
        duration: snackbarConfig.duration
      });
    }
  }

  private async createEditQuestion(): Promise<void> {    
    let question: Question = this.data.mode == 'Create' ? new Question() : this.data.item;
    question.title = this.titleElement.nativeElement.value.trim();
    question.description = this.descriptionElement.nativeElement.value.trim();
    if (this.categoryList.length > 0) {
      let categoriesDTO: Category[] = [];
      for (let c of this.categoryList) {
        categoriesDTO.push(c.category);
      }
      question.categoriesDTO = categoriesDTO;
    }

    if (this.data.mode == 'Create') {
      this.dialog.open(LoadingComponent, {
        ...dialogConfig.stayOpen
      });

      question.authorDTO = UserActionsComponent.currentUser;
      question.spaceDTO = this.data.parent;
      let questionView: QuestionView = await lastValueFrom(this.questionService.createQuestion(question));
      for (let attachmentView of this.pendingAttachmentList) {
        await this.createAttachment(attachmentView.attachment, questionView.question);
      }
      this.snackBar.open('Question successfully created');
      await AppComponent.redirectWithReload(`/spaces/${this.data.parent.title.toLowerCase()}/${this.data.parent.id}/questions/${questionView.question.title.toLowerCase()}/${questionView.question.id}`, {}, this.router)
    }
    else if (this.data.mode == 'Edit') {
      this.dialog.open(LoadingComponent, {
        ...dialogConfig.stayOpen
      });

      question.edited = true;
      let questionView: QuestionView = await lastValueFrom(this.questionService.updateQuestion(question));
      await this.deleteAttachments();
      for (let attachmentView of this.pendingAttachmentList) {
        await this.createAttachment(attachmentView.attachment, questionView.question);
      }
      this.snackBar.open('Question successfully edited');
      await AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }

  private async createEditAnswer(): Promise<void> {
    let answer: Answer = this.data.mode == 'Create' ? new Answer() : this.data.item;
    answer.description = this.descriptionElement.nativeElement.value.trim();
    
    if (this.data.mode == 'Create') {
      if (this.data.parent.answers.length < answerConfig.maxListAmount) {
        this.dialog.open(LoadingComponent, {
          ...dialogConfig.stayOpen
        });

        answer.authorDTO = UserActionsComponent.currentUser;
        answer.questionDTO = this.data.parent;
        let answerView: AnswerView = await lastValueFrom(this.answerService.createAnswer(answer));
        for (let attachmentView of this.pendingAttachmentList) {
          await this.createAttachment(attachmentView.attachment, answerView.answer);
        }
        this.snackBar.open('Answer successfully created');
        await AppComponent.redirectWithReload(location.pathname, {}, this.router);
      }
      else {
        this.snackBar.open(`Answer limit of ${answerConfig.maxListAmount} reached for this question!`, 'Close', {
          duration: snackbarConfig.duration
        });
      }
    }
    else if (this.data.mode == 'Edit') {
      this.dialog.open(LoadingComponent, {
        ...dialogConfig.stayOpen
      });

      answer.edited = true;
      let answerView: AnswerView = await lastValueFrom(this.answerService.updateAnswer(answer));
      await this.deleteAttachments();
      for (let attachmentView of this.pendingAttachmentList) {
        await this.createAttachment(attachmentView.attachment, answerView.answer);
      }
      this.snackBar.open('Answer successfully edited');
      await AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }

  private async createEditComment(): Promise<void> {
    let comment: Comment = this.data.mode == 'Create' ? new Comment() : this.data.item;
    comment.description = this.descriptionElement.nativeElement.value.trim();

    if (this.data.mode == 'Create') {
      if (this.data.parent.comments.length < commentConfig.maxListAmount) {
        this.dialog.open(LoadingComponent, {
          ...dialogConfig.stayOpen
        });

        comment.authorDTO = UserActionsComponent.currentUser;
        comment.answerDTO = this.data.parent;
        let commentView: CommentView = await lastValueFrom(this.commentService.createComment(comment));
        this.snackBar.open('Comment successfully created');
        await AppComponent.redirectWithReload(location.pathname, {}, this.router);
      }
      else {
        this.snackBar.open(`Comment limit of ${commentConfig.maxListAmount} reached for this answer!`, 'Close', {
          duration: snackbarConfig.duration
        });
      }
    }
    else if (this.data.mode == 'Edit') {
      comment.edited = true;
      let commentView: CommentView = await lastValueFrom(this.commentService.updateComment(comment));
      this.snackBar.open('Comment successfully edited', 'Close', {
        duration: snackbarConfig.duration
      });
      await AppComponent.redirectWithReload(location.pathname, {}, this.router);
    }
  }
}
