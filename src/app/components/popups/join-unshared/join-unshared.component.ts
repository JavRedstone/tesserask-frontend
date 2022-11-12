import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Space } from 'src/app/classes/dto/space/space';
import { SpaceView } from 'src/app/classes/view/space-view/space-view';
import snackbarConfig from 'src/app/configs/snackbar-config';
import { SpaceService } from 'src/app/services/space/space.service';
import { UserActionsComponent } from '../../widgets/user-actions/user-actions.component';

@Component({
  selector: 'app-join-unshared',
  templateUrl: './join-unshared.component.html',
  styleUrls: ['./join-unshared.component.scss']
})
export class JoinUnsharedComponent {
  @ViewChild('joinUnsharedCode') private joinUnsharedCodeElement !: ElementRef;
  
  private space !: Space;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    private spaceService: SpaceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  private isSpaceJoined(): boolean {
    for (let userView of this.space.users) {
      if (userView.user.id == UserActionsComponent.currentUser.id) {
        this.snackBar.open('You have already joined this space', 'Close', {
          duration: snackbarConfig.duration
        })
        return true;
      }
    }
    return false;
  }

  public async joinUnshared(): Promise<void> {
    if (this.joinUnsharedCodeElement.nativeElement.value.trim().length > 0) {
      let spaceViews: SpaceView[] = await lastValueFrom(this.spaceService.getSpaceByCode(this.joinUnsharedCodeElement.nativeElement.value.trim()));
      if (spaceViews.length > 0) {
        this.space = spaceViews[0].space;
        if (!this.isSpaceJoined()) {
          this.space.usersDTO = [];
          for (let userView of this.space.users) {
            this.space.usersDTO.push(userView.user);
          }
          this.space.usersDTO.push(UserActionsComponent.currentUser);
          let spaceView: SpaceView = await lastValueFrom(this.spaceService.updateSpace(this.space));
          this.snackBar.open(`Joined unshared space successfully.`);
          AppComponent.redirectWithReload(`/spaces/${this.space.title.toLowerCase()}/${this.space.id}/questions`, {}, this.router);
        }
      }
      else {
        this.snackBar.open('This space does not exist. Try again.', 'Close', {
          duration:  snackbarConfig.duration
        })
      }
    }
    else {
      this.snackBar.open('You cannot enter nothing. Try again.', 'Close', {
        duration: snackbarConfig.duration
      })
    }
  }

  public async  copyCode(): Promise<void> {
    await navigator.clipboard.writeText(this.data.code);
  }
}