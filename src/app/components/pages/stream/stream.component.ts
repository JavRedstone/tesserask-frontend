import { ChangeDetectorRef, Component } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { ActivatedRoute, ParamMap, Router, UrlSegment } from '@angular/router';
import { User } from 'src/app/classes/dto/user/user';
import { Space } from 'src/app/classes/dto/space/space';
import { QuestionService } from 'src/app/services/question/question.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { UserService } from 'src/app/services/user/user.service';
import { QuestionView } from 'src/app/classes/view/question-view/question-view';
import { CategoryView } from 'src/app/classes/view/category-view/category-view';
import { UserView } from 'src/app/classes/view/user-view/user-view';
import { QuestionResult } from 'src/app/interfaces/result/question-result';
import { CategoryResult } from 'src/app/interfaces/result/category-result';
import { UserResult } from 'src/app/interfaces/result/user-result';
import { lastValueFrom } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AppComponent } from 'src/app/app.component';
import { SpaceView } from 'src/app/classes/view/space-view/space-view';
import { SpaceService } from 'src/app/services/space/space.service';
import { UserActionsComponent } from '../../widgets/user-actions/user-actions.component';
import { SpaceResult } from 'src/app/interfaces/result/space-result';
import { environment } from 'src/environments/environment';
import questionConfig from 'src/app/configs/question-config';
import userConfig from 'src/app/configs/user-config';
import spaceConfig from 'src/app/configs/space-config';
import categoryConfig from 'src/app/configs/category-config';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent {
  public window: Window = window;
  public currentUser !: User;
  public space !: Space;
  public spaceAllowed: boolean = false;
  public maxPages: number = 0;
  public pageIndex: number = 0;
  public urlPath: string = '';
  public type = '';
  public streamStack: any[] = [];
  public itemSizes: any = {
    user: userConfig.height,
    space: spaceConfig.height,
    question: questionConfig.height,
    category: categoryConfig.height
  };
  public itemWidth: number = environment.itemWidth;
  public pageSize: number = environment.pageSize;
  private queryParamMap: any;
  private isLoading: boolean = false;
  private totalPages: number = 0;
  private currentPage: number = 0;
  private isAsc: boolean = false;
  private hasSearch: boolean = false;
  private searchValue: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    private userService: UserService,
    private spaceService: SpaceService,
    private categoryService: CategoryService,
    private questionService: QuestionService,    
    private router: Router
  ) { }

  public setForumAllowed(result: any): void {
    if (!this.spaceAllowed) {
      this.spaceAllowed = true;
      if (result != null) {
        this.space = result.space;
      }
      this.setUpActivatedRoutes();
    }
  }

  private setUpActivatedRoutes(): void {
    this.activatedRoute.url.subscribe(
      ( urlSegments: UrlSegment[] ) => {
        this.urlPath = urlSegments.length == 1 ? urlSegments[0].path : urlSegments[3].path;
      }
    )

    this.activatedRoute.queryParamMap.subscribe(
      async ( paramMap: ParamMap ) => {
        this.queryParamMap = paramMap;

        this.isAsc = this.queryParamMap.has('sort') && this.queryParamMap.get('sort') == 'asc';

        this.hasSearch = this.queryParamMap.has('search');
        if (this.hasSearch) {
          this.searchValue = AppComponent.unformatUri(this.queryParamMap.get('search'));
        }

        let hasPage: boolean = this.queryParamMap.has('page');
        if (hasPage) {
          let pageValue = +this.queryParamMap.get('page');
          if (!isNaN(pageValue) && Number.isInteger(pageValue) && pageValue >= 0) {
            this.pageIndex = pageValue;
          }
          else {
            await AppComponent.redirectWithReload(this.space == null ? this.urlPath : `spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/${this.urlPath}`, this.getRedirectUrl(0, this.isAsc), this.router);
          }
        }
        
        this.streamStack = [];
        await this.getLastItem();
        await this.loadStreamItems();
        this.loadMoreStreamItems();
      }
    );
  }

  private getRedirectUrl(page: number, isAsc: boolean): any {
    return page == 0 ? isAsc ? this.searchValue == '' ? {
      sort: 'asc'
    } : {
      search: this.searchValue,
      sort: 'asc'
    } : this.searchValue == '' ? {} : {
      search: this.searchValue,
    } : isAsc ? this.searchValue == '' ? {
      sort: 'asc',
      page: page
    } : {
      search: this.searchValue,
      sort: 'asc',
      page: page
    } : this.searchValue == '' ? {
      page: page
    } : {
      search: this.searchValue,
      page: page
    };
  }

  private async getLastItem(): Promise<void> {
    switch(this.urlPath) {
      case 'questions':
        let questionResult: QuestionResult = await lastValueFrom(this.hasSearch ? this.questionService.getQuestionBySpaceIdSearch(this.space.id, this.searchValue, 0, 1) : this.questionService.getQuestionBySpaceId(this.space.id, 0, 1));
        this.maxPages = questionResult.page.totalPages / environment.rateOfFetch;
        this.type = 'question';
        document.title = `Questions in ${this.space.title}`;
        break;
      case 'categories':
        let categoryResult: CategoryResult = await lastValueFrom(this.hasSearch ? this.categoryService.getCategoryBySpaceIdSearch(this.space.id, this.searchValue, 0, 1) : this.categoryService.getCategoryBySpaceId(this.space.id, 0, 1));
        this.maxPages = categoryResult.page.totalPages / environment.rateOfFetch;
        this.type = 'category';
        document.title = `Categories in ${this.space.title}`;
        break;
      case 'users':
        let userResult: UserResult = await lastValueFrom(this.hasSearch ? this.userService.getUserBySpaceIdSearch(this.space.id, this.searchValue, 0, 1) : this.userService.getUserBySpaceId(this.space.id, 0, 1));
        this.maxPages = userResult.page.totalPages / environment.rateOfFetch;
        this.type = 'user';
        document.title = `Users in ${this.space.title}`;
        break;
      case 'ownedspaces':
        let ownedSpaceResult: SpaceResult = await lastValueFrom(this.hasSearch ? this.spaceService.getSpacesByAuthorIdSearch(UserActionsComponent.currentUser.id, this.searchValue, 0, 1) : this.spaceService.getSpacesByAuthorId(UserActionsComponent.currentUser.id, 0, 1));
        this.maxPages = ownedSpaceResult.page.totalPages / environment.rateOfFetch;
        this.type = 'space';
        document.title = 'Owned Spaces'
        break;
      case 'joinedspaces':
        let joinedSpaceResult: SpaceResult = await lastValueFrom(this.hasSearch ? this.spaceService.getSpacesByUserIdSearch(UserActionsComponent.currentUser.id, this.searchValue, 0, 1) : this.spaceService.getSpacesByUserId(UserActionsComponent.currentUser.id, 0, 1));
        this.maxPages = joinedSpaceResult.page.totalPages / environment.rateOfFetch;
        this.type = 'space';
        document.title = 'Joined Spaces';
        break;
      case 'timetravel':
        let sharedSpaceResult: SpaceResult = await lastValueFrom(this.hasSearch ? this.spaceService.getSharedSpacesSearch(this.searchValue, 0, 1) : this.spaceService.getSharedSpaces(0, 1));
        this.maxPages = sharedSpaceResult.page.totalPages / environment.rateOfFetch;
        this.type = 'space';
        document.title = 'Time Travel'
        break;
    }
    if ((this.maxPages > 0 && this.maxPages - this.pageIndex * environment.pageSize <= 0) || (this.maxPages == 0 && this.pageIndex > 0)) {
      await AppComponent.redirectWithReload(this.space == null ? this.urlPath : `spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/${this.urlPath}`, this.getRedirectUrl(0, this.isAsc), this.router);
    }
    this.totalPages = this.maxPages - this.pageIndex * environment.pageSize;
    this.currentPage = this.isAsc ? this.maxPages - this.totalPages - 1 : this.totalPages;
  }

  private async loadStreamItems(): Promise<void> {
    this.isLoading = true;
    let amountPerLoad = Math.floor((window.innerHeight - 60) / this.itemSizes[this.type]) + 1;
    for (let i = 0; i < amountPerLoad / environment.rateOfFetch; i++) {
      if (this.streamStack.length < environment.pageSize) {
        await this.loadStreamItem();
      }
    }
    this.isLoading = false;
  }

  private async loadMoreStreamItems() {
    this.scrollDispatcher.scrolled().subscribe(
      async ( cdkScrollable: void | CdkScrollable ) => {
        let cdkScroll: any = cdkScrollable;
        if (!this.isLoading && cdkScroll != undefined && cdkScroll.measureScrollOffset('bottom') < 200) {
          await this.loadStreamItems();
        }
      }
    );
  }

  private async loadStreamItem(): Promise<void> {
    let nextPage: number = this.isAsc ? this.currentPage + 1 : this.currentPage - 1;
      if (this.currentPage >= 0 || this.currentPage <= this.totalPages) {
      switch(this.urlPath) {
        case 'questions':
          let questionResult: QuestionResult = await lastValueFrom(this.hasSearch ? this.questionService.getQuestionBySpaceIdSearch(this.space.id, this.searchValue, nextPage, environment.rateOfFetch) : this.questionService.getQuestionBySpaceId(this.space.id, nextPage, environment.rateOfFetch));
          let questionViews: QuestionView[] = questionResult._embedded.questions;
          if (questionViews.length > 0 && questionResult.page.number == nextPage) {
            for (let questionView of questionViews) {
              this.addStreamItem(questionView.question);
              this.currentPage = nextPage;
            }
          }
          break;
        case 'categories':
          let categoryResult: CategoryResult = await lastValueFrom(this.hasSearch ? this.categoryService.getCategoryBySpaceIdSearch(this.space.id, this.searchValue, nextPage, environment.rateOfFetch) : this.categoryService.getCategoryBySpaceId(this.space.id, nextPage, environment.rateOfFetch));
          let categoryViews: CategoryView[] = categoryResult._embedded.categories;
          if (categoryViews.length > 0 && categoryResult.page.number == nextPage) {
            for (let categoryView of categoryViews) {
              this.addStreamItem(categoryView.category);
              this.currentPage = nextPage;
            }
          }
          break;
        case 'users':
          let userResult: UserResult = await lastValueFrom(this.hasSearch ? this.userService.getUserBySpaceIdSearch(this.space.id, this.searchValue, nextPage, environment.rateOfFetch) : this.userService.getUserBySpaceId(this.space.id, nextPage, environment.rateOfFetch));
          let userViews: UserView[] = userResult._embedded.users;
          if (userViews.length > 0 && userResult.page.number == nextPage) {
            for (let userView of userViews) {
              this.addStreamItem(userView.user);
              this.currentPage = nextPage;
            }
          }
          break;
        case 'ownedspaces':
          let ownedSpaceResult: SpaceResult = await lastValueFrom(this.hasSearch ? this.spaceService.getSpacesByAuthorIdSearch(UserActionsComponent.currentUser.id, this.searchValue, nextPage, environment.rateOfFetch) : this.spaceService.getSpacesByAuthorId(UserActionsComponent.currentUser.id, nextPage, environment.rateOfFetch));
          let ownedSpaceViews: SpaceView[] = ownedSpaceResult._embedded.spaces;
          if (ownedSpaceViews.length > 0 && ownedSpaceResult.page.number == nextPage) {
            for (let ownedSpaceView of ownedSpaceViews) {
              this.addStreamItem(ownedSpaceView.space);
              this.currentPage = nextPage;
            }
          }
          break;
        case 'joinedspaces':
          let joinedSpaceResult: SpaceResult = await lastValueFrom(this.hasSearch ? this.spaceService.getSpacesByUserIdSearch(UserActionsComponent.currentUser.id, this.searchValue, nextPage, environment.rateOfFetch) : this.spaceService.getSpacesByUserId(UserActionsComponent.currentUser.id, nextPage, environment.rateOfFetch));
          let joinedSpaceViews: SpaceView[] = joinedSpaceResult._embedded.spaces;
          if (joinedSpaceViews.length > 0 && joinedSpaceResult.page.number == nextPage) {
            for (let joinedSpaceView of joinedSpaceViews) {
              this.addStreamItem(joinedSpaceView.space);
              this.currentPage = nextPage;
            }
          }
          break;
        case 'timetravel':
          let sharedSpaceResult: SpaceResult = await lastValueFrom(this.hasSearch ? this.spaceService.getSharedSpacesSearch(this.searchValue, nextPage, environment.rateOfFetch) : this.spaceService.getSharedSpaces(nextPage, environment.rateOfFetch));
          let sharedSpaceViews: SpaceView[] = sharedSpaceResult._embedded.spaces;
          if (sharedSpaceViews.length > 0 && sharedSpaceResult.page.number == nextPage) {
            for (let sharedSpaceView of sharedSpaceViews) {
              this.addStreamItem(sharedSpaceView.space);
              this.currentPage = nextPage;
            }
          }
          break;
      }
    }
  }

  private addStreamItem(item: any): void {
    this.streamStack = this.streamStack.concat(item);
    this.changeDetector.detectChanges();
  }

  public async pageChange(pageEvent: PageEvent): Promise<void> {
    environment.pageSize = pageEvent.pageSize;
    if (this.pageIndex != pageEvent.pageIndex) {
      await AppComponent.redirectWithReload(this.space == null ? this.urlPath : `spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/${this.urlPath}`, this.getRedirectUrl(pageEvent.pageIndex, this.isAsc), this.router);
    }
  }

  public async reverseSort(): Promise<void> {
    await AppComponent.redirectWithReload(this.space == null ? this.urlPath : `spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/${this.urlPath}`, this.getRedirectUrl(this.pageIndex, !this.isAsc), this.router);
  }
}