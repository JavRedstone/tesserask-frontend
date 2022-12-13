import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Space } from 'src/app/classes/dto/space/space';
import { User } from 'src/app/classes/dto/user/user';
import dialogConfig from 'src/app/configs/dialog-config';
import { CreateEditItemComponent } from '../../popups/create-edit-item/create-edit-item.component';
import { JoinUnsharedComponent } from '../../popups/join-unshared/join-unshared.component';
import { UserActionsComponent } from '../user-actions/user-actions.component';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent {
  public currentUser !: User;
  public spaceAllowed: boolean = false;
  public space !: Space;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.waitForAuthentication();
  }

  public setSpaceAllowed(result: any): void {
    if (result != undefined) {
      this.spaceAllowed = true;
      this.space = result.space;
    }
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

  public async redirect(path: string): Promise<void> {
    if (path == 'questions' || path == 'categories' || path == 'users') {
      path = `/spaces/${this.space.title.toLowerCase()}/${this.space.id}/${path}`;
    }
    await AppComponent.redirectWithReload(path, {}, this.router);
  }

  public joinUnshared(): void {
    this.dialog.open(JoinUnsharedComponent, {
      ...dialogConfig.fullScreen,
      data: {
        mode: 'Join'
      }
    });
  }

  public createSpace(): void {
    this.dialog.open(CreateEditItemComponent, {
      data: {
        mode: 'Create',
        type: 'space'
      }
    });
  }
}
