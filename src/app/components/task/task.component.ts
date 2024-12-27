import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../services/task-service.service";
import {Task} from "../../entity/Task";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit{

  tasks: any[] = []

  first = 0;

  rows = 10;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getAllTasks().subscribe({
      next: (data)  => this.tasks = data,
      error: () => console.log("error"),
      complete: () => console.log("complete")
    })
  }

  loadTasks(){

  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.tasks ? this.first === this.tasks.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.tasks ? this.first === 0 : true;
  }
}
