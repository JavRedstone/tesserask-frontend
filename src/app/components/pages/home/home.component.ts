import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public randBackground: number = 1 + Math.floor(Math.random() * 13);

  constructor(
    private router: Router
  ) {}

  public async redirect(path: string): Promise<void> {
    await AppComponent.redirectWithReload(path, {}, this.router);
  }
}
