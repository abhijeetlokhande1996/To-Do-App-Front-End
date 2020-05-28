import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-to-do-input',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
})
export class ToDoInputComponent implements OnInit {
  toDoInputForm: FormGroup;
  @Output() toDoFormDataEmitter: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.toDoInputForm = new FormGroup({
      toDoInput: new FormControl(null, [Validators.required]),
    });
  }
  onSubmitToDoInputForm() {
    // emit user input to parent component to process
    const toDoInput = this.toDoInputForm.get('toDoInput').value;
    this.toDoInputForm.get('toDoInput').setValue(null);
    this.toDoFormDataEmitter.emit(toDoInput);
  }
}
