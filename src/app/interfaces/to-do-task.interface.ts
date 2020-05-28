export interface ToDoTaskInterface {
  id?: number;
  task: string;
  editFlag?: boolean;
  scheduleTime: Date;
  isComplete: boolean;
}
