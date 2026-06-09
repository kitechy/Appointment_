import { Component } from '@angular/core';

export interface Appointment {
  task: string;
  date: string;
  priority: string;
  imgURL: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  editingIndex: number | null = null;

  handleAddAppointment(appointment: Appointment): void {
    this.appointments.push(appointment);
  }

  handleStartEdit(index: number): void {
    this.editingIndex = index;
    this.selectedAppointment = { ...this.appointments[index] };
  }

  handleUpdateAppointment(event: {
    appointment: Appointment;
    index: number;
  }): void {
    this.appointments[event.index] = event.appointment;
    this.clearEditing();
  }

  handleDeleteAppointment(index: number): void {
    this.appointments.splice(index, 1);

    if (this.editingIndex === index) {
      this.clearEditing();
    } else if (this.editingIndex !== null && this.editingIndex > index) {
      this.editingIndex -= 1;
    }
  }

  handleCancelEdit(): void {
    this.clearEditing();
  }

  private clearEditing(): void {
    this.editingIndex = null;
    this.selectedAppointment = null;
  }
}
