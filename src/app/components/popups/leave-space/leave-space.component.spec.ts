import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveSpaceComponent } from './leave-space.component';

describe('LeaveSpaceComponent', () => {
  let component: LeaveSpaceComponent;
  let fixture: ComponentFixture<LeaveSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
