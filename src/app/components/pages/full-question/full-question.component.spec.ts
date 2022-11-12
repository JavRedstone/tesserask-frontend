import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullQuestionComponent } from './full-question.component';

describe('FullQuestionComponent', () => {
  let component: FullQuestionComponent;
  let fixture: ComponentFixture<FullQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
