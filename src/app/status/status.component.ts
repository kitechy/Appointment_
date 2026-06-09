import { Component, Input } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent {
  @Input() appointments: Appointment[] = [];

  get total(): number {
    return this.appointments.length;
  }

  get done(): number {
    return this.appointments.filter((app) => app.completed ?? false).length;
  }

  get active(): number {
    return this.total - this.done;
  }

  get overdue(): number {
    const today = new Date();
    return this.appointments.filter((app) => {
      if (app.completed ?? false) {
        return false;
      }
      const dueDate = new Date(app.date);
      return dueDate < today;
    }).length;
  }
}
