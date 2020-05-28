import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoInputComponent } from './to-do-list.component';

describe('ToDoListComponent', () => {
  let component: ToDoInputComponent;
  let fixture: ComponentFixture<ToDoInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToDoInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
