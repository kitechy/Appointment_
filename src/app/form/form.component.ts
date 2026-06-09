import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnChanges {
  @Input() selectedAppointment: Appointment | null = null;
  @Input() selectedIndex: number | null = null;
  @Output() addAppointment = new EventEmitter<Appointment>();
  @Output() updateAppointment = new EventEmitter<{
    appointment: Appointment;
    index: number;
  }>();
  @Output() cancelEdit = new EventEmitter<void>();

  appointment: Appointment = this.createEmptyAppointment();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAppointment']) {
      this.appointment = this.selectedAppointment
        ? { ...this.selectedAppointment }
        : this.createEmptyAppointment();
    }
  }

  submit(): void {
    if (!this.appointment.task || !this.appointment.date) {
      return;
    }

    if (this.selectedIndex !== null && this.selectedIndex !== undefined) {
      this.updateAppointment.emit({
        appointment: { ...this.appointment },
        index: this.selectedIndex,
      });
    } else {
      this.addAppointment.emit({ ...this.appointment });
      this.appointment = this.createEmptyAppointment();
    }
  }

  clear(): void {
    this.appointment = this.createEmptyAppointment();
    this.cancelEdit.emit();
  }

  private createEmptyAppointment(): Appointment {
    return {
      task: '',
      date: '',
      priority: 'low',
      imgURL: '',
      completed: false,
    };
  }
}
