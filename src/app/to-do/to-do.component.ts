import { Component, OnInit } from '@angular/core';
import { ToDoTaskInterface } from '../interfaces/to-do-task.interface';
import { PythonService } from '../services/python.service';
import { take, map } from 'rxjs/operators';
@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css'],
})
export class ToDoComponent implements OnInit {
  listToShow: Array<ToDoTaskInterface>;
  constructor(private pythonService: PythonService) {}

  ngOnInit(): void {
    this.getToDoListFromDB();
  }
  getToDoListFromDB() {
    // get Data from database and convert it into ToDoTaskInterface interface
    // converting logic written inside the map rxjs operator
    this.pythonService
      .getToDoList()
      .pipe(
        take(1),
        map((resp: []) => {
          const itemArr = resp.map((element) => {
            let item = {};
            item['id'] = element['id'];
            item['task'] = element['task'];
            item['editFlag'] = element['editFlag']
              ? element['editFlag']
              : false;
            item['scheduleTime'] = element['scheduleTime'];
            item['isComplete'] = element['isComplete'];
            return item;
          });
          return itemArr;
        })
      )
      .subscribe((resp: ToDoTaskInterface[]) => {
        this.listToShow = null;
        this.listToShow = resp;
        console.log(this.listToShow);
      });
  }
  getDataFromToDoInputComponent(data: string) {
    const objToPush: ToDoTaskInterface = {
      task: data,
      editFlag: false,
      scheduleTime: null,

      isComplete: false,
    };
    this.pythonService.insertItemInList(objToPush).subscribe((resp) => {
      console.log(resp);
      this.getToDoListFromDB();
    });
  }
  getModifiedDataFromToDoListComponent(obj: {
    index: string;
    data: ToDoTaskInterface;
    dateChange?: boolean;
  }) {
    this.listToShow[obj.index] = this.getDeepCopy(obj.data);
    this.pythonService
      .updateItemInList(obj.data.id, obj.data)
      .subscribe((resp) => console.log(resp));

    if (obj.dateChange && !obj.data.isComplete) {
      const timer = setInterval(() => {
        const d: Date = new Date();

        if (d >= obj.data.scheduleTime) {
          const tmpArr: Array<ToDoTaskInterface> = this.getDeepCopy(
            this.listToShow
          );
          tmpArr[obj.index].isComplete = true;
          this.listToShow = null;
          this.listToShow = this.getDeepCopy(tmpArr);
          alert('Reminder : ' + obj.data.task);
          this.pythonService
            .updateItemInList(
              this.listToShow[obj.index]['id'],
              this.listToShow[obj.index]
            )
            .subscribe((resp) => console.log(resp));
          clearInterval(timer);
        }
      }, 1000);
    }
  }
  getDeepCopy(item) {
    if (item) {
      return JSON.parse(JSON.stringify(item));
    }
  }
  deleteTask(index: number) {
    const tmpArr: Array<ToDoTaskInterface> = this.getDeepCopy(this.listToShow);
    this.pythonService
      .deleteIteminList(tmpArr[index]['id'])
      .subscribe((resp) => console.log(resp));
    tmpArr.splice(index, 1);
    this.listToShow = null;
    this.listToShow = this.getDeepCopy(tmpArr);
  }
}
