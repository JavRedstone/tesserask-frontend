import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './modules/material.module';
import { CdkModule } from './modules/cdk.module';

import { AppRoutingModule } from './app-routing.module';

import { UserService } from './services/user/user.service';
import { SpaceService } from './services/space/space.service';
import { QuestionService } from './services/question/question.service';
import { AnswerService } from './services/answer/answer.service';
import { CommentService } from './services/comment/comment.service';

import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';

import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/widgets/search/search.component';
import { StreamComponent } from './components/pages/stream/stream.component';
import { UserActionsComponent } from './components/widgets/user-actions/user-actions.component';
import { FullQuestionComponent } from './components/pages/full-question/full-question.component';
import { ItemComponent } from './components/widgets/item/item.component';
import { CreateEditItemComponent } from './components/popups/create-edit-item/create-edit-item.component';
import { DeleteItemComponent } from './components/popups/delete-item/delete-item.component';
import { DragNDropDirective } from './directives/drag-n-drop.directive';
import { CrudActivatorComponent } from './components/widgets/crud-activator/crud-activator.component';
import { ViewUserComponent } from './components/popups/view-user/view-user.component';
import { ItemOptionsComponent } from './components/widgets/item-options/item-options.component';
import { DrawerComponent } from './components/widgets/drawer/drawer.component';
import { SpaceModeratorComponent } from './components/widgets/space-moderator/space-moderator.component';
import { AppFirebaseModule } from './modules/app-firebase.module';
import { ViewCategoriesComponent } from './components/popups/view-categories/view-categories.component';
import { JoinUnsharedComponent } from './components/popups/join-unshared/join-unshared.component';
import { SpaceCardComponent } from './components/widgets/space-card/space-card.component';
import { LeaveSpaceComponent } from './components/popups/leave-space/leave-space.component';
import { AttachmentComponent } from './components/widgets/attachment/attachment.component';
import { LoadingComponent } from './components/popups/loading/loading.component';
import { HomeComponent } from './components/pages/home/home.component';
import tooltipConfig from './configs/tooltip-config';

const matRippleConfig: RippleGlobalOptions = {
  animation: {
    enterDuration: 250,
    exitDuration: 500
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    StreamComponent,
    UserActionsComponent,
    FullQuestionComponent,
    ItemComponent,
    CreateEditItemComponent,
    DeleteItemComponent,
    DragNDropDirective,
    CrudActivatorComponent,
    ViewUserComponent,
    ItemOptionsComponent,
    DrawerComponent,
    SpaceModeratorComponent,
    ViewCategoriesComponent,
    JoinUnsharedComponent,
    SpaceCardComponent,
    LeaveSpaceComponent,
    AttachmentComponent,
    LoadingComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    FormsModule,
    ReactiveFormsModule,

    MaterialModule,
    CdkModule,

    AppFirebaseModule
  ],
  providers: [
    UserService,
    SpaceService,
    QuestionService,
    AnswerService,
    CommentService,
    {
      provide: MAT_RIPPLE_GLOBAL_OPTIONS,
      useValue: matRippleConfig
    },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: tooltipConfig
    },
    CookieService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }