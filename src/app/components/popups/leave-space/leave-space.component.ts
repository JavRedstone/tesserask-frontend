import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { SpaceView } from 'src/app/classes/view/space-view/space-view';
import { SpaceService } from 'src/app/services/space/space.service';
import { UserActionsComponent } from '../../widgets/user-actions/user-actions.component';

@Component({
  selector: 'app-leave-space',
  templateUrl: './leave-space.component.html',
  styleUrls: ['./leave-space.component.scss']
})
export class LeaveSpaceComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    private spaceService: SpaceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  public async leaveSpace(): Promise<void> {
    this.data.space.usersDTO = [];
    for (let userView of this.data.space.users) {
      if (userView.user.id != UserActionsComponent.currentUser.id) {
        this.data.space.usersDTO.push(userView.user);
      }
    }
    let spaceView: SpaceView = await lastValueFrom(this.spaceService.updateSpace(this.data.space));
    this.snackBar.open(`Left space successfully.`);
    await AppComponent.redirectWithReload(location.pathname, {}, this.router);
  }
}
