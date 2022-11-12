import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Space } from 'src/app/classes/dto/space/space';
import { User } from 'src/app/classes/dto/user/user';
import { SpaceView } from 'src/app/classes/view/space-view/space-view';
import spaceConfig from 'src/app/configs/space-config';
import { SpaceService } from 'src/app/services/space/space.service';
import { environment } from 'src/environments/environment';
import { UserActionsComponent } from '../user-actions/user-actions.component';

@Component({
  selector: 'app-space-card',
  templateUrl: './space-card.component.html',
  styleUrls: ['./space-card.component.scss']
})
export class SpaceCardComponent {
  @Input() public urlPath: string = '';
  @Input() public space !: Space;

  public newWidth: number = spaceConfig.width;
  public height: number = spaceConfig.height;
  public currentUser: User = UserActionsComponent.currentUser;

  constructor(
    private spaceService: SpaceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    setTimeout(
      () => {
        this.setResize();
        window.addEventListener('resize', (event: Event) => {
          this.setResize()
        });
      }
    )
  }
  
  private isSpaceJoined(): boolean {
    for (let userView of this.space.users) {
      if (userView.user.id == UserActionsComponent.currentUser.id) {
        return true;
      }
    }
    return false;
  }

  public async joinSpace(): Promise<void> {
    if (!this.isSpaceJoined()) {
      this.space.usersDTO = [];
      for (let userView of this.space.users) {
        this.space.usersDTO.push(userView.user);
      }
      this.space.usersDTO.push(UserActionsComponent.currentUser);
      let spaceView: SpaceView = await lastValueFrom(this.spaceService.updateSpace(this.space));
      this.snackBar.open('Joined shared space successfully.');
    }
    await this.openSpace();
  }

  private setResize(): void {
    this.newWidth = window.innerWidth < spaceConfig.width - 20 ? window.innerWidth - 20 : spaceConfig.width;
  }

  public async openSpace(): Promise<void> {
    await AppComponent.redirectWithReload(`/spaces/${this.space.title.toLowerCase()}/${this.space.id}/questions`, {}, this.router);
  }
}
