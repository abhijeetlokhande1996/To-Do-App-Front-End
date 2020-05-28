import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config/config.mode';
import { ToDoTaskInterface } from '../interfaces/to-do-task.interface';

@Injectable({
  providedIn: 'root',
})
export class PythonService {
  url = Config.apiUrl;
  constructor(private http: HttpClient) {}

  getToDoList() {
    return this.http.get(`${this.url}/to-do/`);
  }
  updateItemInList(id: number, item: ToDoTaskInterface) {
    return this.http.put(`${this.url}/to-do/${id}/`, item);
  }
  deleteIteminList(id: number) {
    return this.http.delete(`${this.url}/to-do/${id}/`);
  }
  insertItemInList(item: ToDoTaskInterface) {
    console.log(item);
    return this.http.post(`${this.url}/to-do/`, item);
  }
}
