import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullQuestionComponent } from './components/pages/full-question/full-question.component';
import { StreamComponent } from './components/pages/stream/stream.component';

const routes: Routes = [
  { path: 'joinedspaces', component: StreamComponent },
  { path: 'ownedspaces', component: StreamComponent },
  { path: 'timetravel', component: StreamComponent },

  { path: 'spaces/:spaceTitle/:spaceId/questions', component: StreamComponent },
  { path: 'spaces/:spaceTitle/:spaceId/questions/:questionTitle/:questionId', component: FullQuestionComponent },
   
  { path: 'spaces/:spaceTitle/:spaceId/categories', component: StreamComponent },

  { path: 'spaces/:spaceTitle/:spaceId/users', component: StreamComponent },

  { path: '', redirectTo: '', pathMatch: 'full' },

  { path: 'spaces/:spaceTitle/:spaceId', redirectTo: 'spaces/:spaceTitle/:spaceId/questions', pathMatch: 'full' },
  { path: '**', redirectTo: 'spaces/public/1/questions', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public static routes: Routes = routes;
}