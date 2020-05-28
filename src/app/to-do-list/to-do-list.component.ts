import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { ToDoTaskInterface } from '../interfaces/to-do-task.interface';
import { FormArray, FormControl, FormGroup, Form } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
})
export class ToDoListComponent implements OnInit, OnDestroy {
  toDoListForm: FormGroup;
  _listToShow: Array<ToDoTaskInterface>;
  subArr: Array<Array<Subscription>>;
  scheduleAt: Date;
  minDateAndTime: Date;

  @Output() taskModifyEmmiter = new EventEmitter();
  @Output() takskDeleteEmitter = new EventEmitter<number>();

  // setter input function is used because there is dependent task
  // when data is available form control is generating dynamically
  @Input()
  set listToShow(list: Array<ToDoTaskInterface>) {
    try {
      this._listToShow = list;

      this.toDoListForm = new FormGroup({
        scheduleControls: new FormArray([]),
        editTaskControls: new FormArray([]),
        markAsCompleteCheckBoxArr: new FormArray([]),
      });
      this.generateCheckBoxFormArrayAndEditTaskControls(
        this._listToShow.length
      );
    } catch {}
  }

  constructor() {}

  ngOnInit(): void {
    this.minDateAndTime = new Date();
  }
  generateCheckBoxFormArrayAndEditTaskControls(len: number) {
    this.subArr = [];
    // generate formcontrols
    // mostly of form array logic is written below
    (this.toDoListForm.get('markAsCompleteCheckBoxArr') as FormArray).clear();
    (this.toDoListForm.get('editTaskControls') as FormArray).clear();
    for (let i = 0; i < len; i++) {
      (this.toDoListForm.get('markAsCompleteCheckBoxArr') as FormArray).push(
        new FormGroup({
          isCompleteControl: new FormControl(this._listToShow[i].isComplete),
          scheduleAtControl: new FormControl(this._listToShow[i].scheduleTime),
        })
      );
      (this.toDoListForm.get('editTaskControls') as FormArray).push(
        new FormControl(this._listToShow[i].task)
      );
      // scheduleControls
      (this.toDoListForm.get('scheduleControls') as FormArray).push(
        new FormControl(null)
      );
      this.subArr.push([new Subscription(), new Subscription()]);
    }
    this.triggerValuChangesSubScription();
  }

  triggerValuChangesSubScription() {
    // reactive form is used here therefore we can't use ngModel
    // below code is just subscribing the value changes observable

    (this.toDoListForm.get(
      'markAsCompleteCheckBoxArr'
    ) as FormArray).controls.forEach((item: FormGroup, index) => {
      this.subArr[index][0] = item
        .get('isCompleteControl')
        .valueChanges.subscribe((flag: boolean) => {
          this._listToShow[index].isComplete = flag;
          this.taskModifyEmmiter.emit({
            index: index,
            data: this._listToShow[index],
          });
        });

      this.subArr[index][1] = item
        .get('scheduleAtControl')
        .valueChanges.subscribe((d: Date) => {
          this._listToShow[index].scheduleTime = d;
          this.taskModifyEmmiter.emit({
            index: index,
            data: this._listToShow[index],
            dateChange: true,
          });
        });
    });
  }
  onClickEdit(index: number) {
    // this code show edit-input text box
    this._listToShow[index].editFlag = true;
    this.taskModifyEmmiter.emit({
      index: index,
      data: this._listToShow[index],
    });
  }
  onClickCancelEdit(index: number) {
    // on-click cancel
    // editFlag should become false
    this._listToShow[index].editFlag = false;
    (this.toDoListForm.get('editTaskControls') as FormArray)
      .at(index)
      .setValue(this._listToShow[index].task);
    this._listToShow[index].task;
    this.taskModifyEmmiter.emit({
      index: index,
      data: this._listToShow[index],
    });
  }
  onClickUpdateItem(index: number, item: ToDoTaskInterface) {
    const updatedValue: string = (this.toDoListForm.get(
      'editTaskControls'
    ) as FormArray).at(index).value;
    this._listToShow[index].task = updatedValue;
    this._listToShow[index].editFlag = false;
    this.taskModifyEmmiter.emit({
      index: index,
      data: this._listToShow[index],
    });
  }
  onClickDelete(index: number) {
    // emitting event to parent
    this.takskDeleteEmitter.emit(index);
  }

  getNewDateTime(newDateTime, index) {
    this._listToShow[index].scheduleTime = new Date(newDateTime.value);
    this.taskModifyEmmiter.emit({
      index: index,
      data: this._listToShow[index],
    });
  }

  ngOnDestroy(): void {
    this.subArr.forEach((itemArr: Array<Subscription>) => {
      itemArr[0].unsubscribe();
      itemArr[1].unsubscribe();
    });
  }
}
