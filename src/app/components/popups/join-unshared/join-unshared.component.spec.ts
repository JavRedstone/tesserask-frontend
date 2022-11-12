import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinUnsharedComponent } from './join-unshared.component';

describe('JoinCodeComponent', () => {
  let component: JoinUnsharedComponent;
  let fixture: ComponentFixture<JoinUnsharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinUnsharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinUnsharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
