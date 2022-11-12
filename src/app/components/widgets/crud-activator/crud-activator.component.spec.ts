import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudActivatorComponent } from './crud-activator.component';

describe('CrudActivatorComponent', () => {
  let component: CrudActivatorComponent;
  let fixture: ComponentFixture<CrudActivatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudActivatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudActivatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
