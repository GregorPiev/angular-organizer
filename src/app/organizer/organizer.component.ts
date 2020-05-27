import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/date.service';
import { TaskService } from '../shared/task.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Task } from '../shared/task.service';
import { Observable, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  constructor(
    public dateService: DateService,
    private taskService: TaskService
  ) { }
  form: FormGroup;
  tasks: Task[] = [];

  ngOnInit() {
    this.dateService.date.pipe(
      switchMap(value => this.taskService.load(value))
    ).subscribe(tasks => {
      this.tasks = tasks;
    });


    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit() {
    const { title } = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };
    this.taskService.create(task).subscribe(tasks => {
      this.tasks.push(tasks);
      console.log('New task: ', tasks);
      this.form.reset();

    }
      , err => console.error(err)
    );
  }

  remove(task: Task) {
    this.taskService.remove(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    },
      err => console.error(err)
    );

  }
}
