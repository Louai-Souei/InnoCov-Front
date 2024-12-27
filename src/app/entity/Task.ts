import {TaskStatus} from "./enums/TaskStatus";
import {Person} from "./Person";

export class Task {

  id:number;
  title:string;
  duration:string;
  description:string;
  priority:number;
  status: TaskStatus;
  assignee: Person

  constructor(data:any = {}) {
    this.id = data.id;
    this.title = data.title;
    this.duration = data.duration;
    this.description = data.description;
    this.priority = data.priority;
    this.status = data.status;
    this.assignee = data.assignee;
  }

}
