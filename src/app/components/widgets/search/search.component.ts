import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Space } from 'src/app/classes/dto/space/space';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output() searchContract: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchExpand: EventEmitter<any> = new EventEmitter<any>();

  public spaceAllowed: boolean = false;
  public searchValue: string = '';
  public searchMode: string = 'Question';
  public newWidth: number = 500;
  public hideBar: boolean = false;
  public hideRest: boolean = false;
  public searchModes: string[] = [
    'Question',
    'Category',
    'User',
    'Joined Space',
    'Owned Space',
    'Time Travel Space'
  ];
  private urlPath: string = '';
  private space !: Space;

  constructor(
    private router: Router
  ) {
    this.setSearchModeByUrl();
    this.setResize();
    window.addEventListener('resize', (event: Event) => {
      this.setResize();
    });
  }

  public setSpaceAllowed(result: any) {
    this.spaceAllowed = true;
    if (result != undefined) {
      this.space = result.space;
    }
    this.setSearchModeByUrl();
    this.setSearchValue();
  }

  public setSearchMode(searchMode: string): void {
    this.searchMode = searchMode
  }

  private setSearchModeByUrl() {
    let pathArr: string[] = location.pathname.split('/');
    this.urlPath = pathArr.length == 2 ? pathArr[1] : pathArr[4];
    
    this.searchMode = 'Question';
    switch(this.urlPath) {
      case 'categories':
        this.searchMode = 'Category';
        break;
      case 'users':
        this.searchMode = 'User';
        break;
      case 'joinedspaces':
        this.searchMode = 'Joined Space';
        if (this.searchModes.length > 3) {
          this.searchModes.splice(0, 3);
        }
        break;
      case 'ownedspaces':
        this.searchMode = 'Owned Space';
        if (this.searchModes.length > 3) {
          this.searchModes.splice(0, 3);
        }
        break;
      case 'timetravel':
        this.searchMode = 'Time Travel Space';
        if (this.searchModes.length > 3) {
          this.searchModes.splice(0, 3);
        }
        break;
    }
  }

  private setSearchValue() {
    let halves: string[] = location.href.split('?');
    if (halves.length == 2) {
      let queryParams: string[] = halves[1].split('&');
      for (let queryParam of queryParams) {
        let queryParamPair: string[] = queryParam.split('=');
        if (queryParamPair[0] == 'search') {
          this.searchValue = AppComponent.unformatUri(queryParamPair[1]);
        }
      }
    }
  }

  public async search(search: HTMLInputElement): Promise<void> {
    if (search.value.trim().length > 0) {
      let searchUrl: string = '';
      switch(this.searchMode) {
        case 'Category':
          searchUrl = `spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/categories`;
          break;
        case 'User':
          searchUrl = `spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/users`;
          break;
        case 'Joined Space':
          searchUrl = 'joinedspaces';
          break;
        case 'Owned Space':
          searchUrl = 'ownedspaces';
          break;
        case 'Time Travel Space':
          searchUrl = 'timetravel';
          break;
        default:
          searchUrl = `spaces/${AppComponent.formatUri(this.space.title.toLowerCase())}/${this.space.id}/questions`;
          break;
      }
      await AppComponent.redirectWithReload(`/${searchUrl}`, {
        search: AppComponent.formatUri(search.value)
      }, this.router);
    }
  }

  private setResize(): void {
    if (this.hideRest) {
      this.newWidth = window.innerWidth - 60;
      if (window.innerWidth >= 645) {
        this.contractSearch();
      }
    }
    else {
      this.hideBar = window.innerWidth < 645;
      this.newWidth = window.innerWidth - 445 < 500 ? window.innerWidth - 445 : 500;
    }
  }

  public contractSearch(): void {
    this.searchContract.emit();
    this.hideBar = true;
    this.hideRest = false;
  }

  public expandSearch(): void {
    this.searchExpand.emit();
    this.hideBar = false;
    this.hideRest = true;
    this.setResize();
  }
}
