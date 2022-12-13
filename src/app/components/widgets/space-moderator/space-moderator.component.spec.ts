import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceModeratorComponent } from './space-moderator.component';

describe('ForumModeratorComponent', () => {
  let component: SpaceModeratorComponent;
  let fixture: ComponentFixture<SpaceModeratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceModeratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceModeratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
