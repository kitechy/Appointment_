import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface AppointmentTask {
  task: string;
  date: string;
  priority: string;
  imgURL: string;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  @Input() task: AppointmentTask | undefined;
  @Input() index: number | undefined;
  @Output() editAppointment = new EventEmitter<number>();
  @Output() deleteAppointment = new EventEmitter<number>();

  onEdit(): void {
    if (this.index !== undefined) {
      this.editAppointment.emit(this.index);
    }
  }

  onDelete(): void {
    if (this.index !== undefined) {
      this.deleteAppointment.emit(this.index);
    }
  }
}
