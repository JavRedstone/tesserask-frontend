import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, EMPTY, lastValueFrom, take } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/classes/dto/user/user';
import { UserView } from 'src/app/classes/view/user-view/user-view';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { CreateEditItemComponent } from '../../popups/create-edit-item/create-edit-item.component';
import { ViewUserComponent } from '../../popups/view-user/view-user.component';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import dialogConfig from 'src/app/configs/dialog-config';
import snackbarConfig from 'src/app/configs/snackbar-config';

@Component({
  selector: 'app-user-actions',
  templateUrl: './user-actions.component.html',
  styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent {
  public isAuthenticated: boolean = false;
  public hidden: boolean = false;

  public static currentUser: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.setCurrentUser();
    this.hidden = window.innerWidth < 475;
    window.addEventListener('resize', (event: Event) => {
      this.hidden = window.innerWidth < 475;
    });
  }

  private setCurrentUser(): void {
    this.authService.user$.subscribe(
      async ( user: firebase.User ) => {
        await this.setCurrentUserStatus(user);
      }
    );
  }

  public login(): void {
    this.authService.loginViaGoogle().pipe(take(1), catchError(
      (err: any) => {
        return EMPTY;
      }
    )).subscribe(
      ( userCredential: firebase.auth.UserCredential ) => { }
    );
  }

  public logout(): void {
    this.authService.logout().pipe(take(1)).subscribe(
      async () => {
        await AppComponent.redirectWithReload(location.pathname, {}, this.router);
      }
    );
  }

  private abbreviate(s: string[]): string {
    let sAbbreviated: string = '';
    for (let word of s) {
      sAbbreviated += word.charAt(0) + '. ';
    }
    return sAbbreviated;
  }

  private async setCurrentUserStatus(user: firebase.User): Promise<void> {
    if (user != null && user.emailVerified) {
      let userViews: UserView[] = await lastValueFrom(this.userService.getUserByUid(user.uid));
      if (userViews.length == 0) {
        let currentUser: User = new User();
        if (user.uid != null) {
          currentUser.uid = user.uid;
        }
        if (user.displayName != null) {
          let splitName: string[] = user.displayName.split(' ');
          currentUser.title = this.abbreviate(splitName);
        }
        if (user.email != null) {
          currentUser.email = user.email;
        }
        let userView: UserView = await lastValueFrom(this.userService.createUser(currentUser));
        UserActionsComponent.currentUser = userView.user;
        this.snackBar.open('Welcome to Tesserask!');
        await AppComponent.redirectWithReload(location.pathname, {}, this.router);
      }
      else if (userViews[0].user.uid == user.uid && userViews[0].user.email == user.email) {
        UserActionsComponent.currentUser = userViews[0].user;
      }
      else {
        this.snackBar.open('Invalid sign in. Please try again.', 'Close', {
          duration: snackbarConfig.duration
        });
      }
    }
  }
  
  public getCurrentUser(): User {
    return UserActionsComponent.currentUser;
  }

  public openDialog(type: string): void {
    if (type == 'view') {
      this.dialog.open(ViewUserComponent, {
        ...dialogConfig.fullScreen,
        data: {
          user: UserActionsComponent.currentUser
        }
      });
    }
    else if (type == 'edit') {
      this.dialog.open(CreateEditItemComponent, {
        ...dialogConfig.fullScreen,
        data: {
          mode: 'Edit',
          item: UserActionsComponent.currentUser,
          type: 'user'
        }
      });
    }
  }
}