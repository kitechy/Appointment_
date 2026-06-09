import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppointmentService } from './appointment.service';
import { Appointment } from './models/appointment.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  searchTerm = '';
  selectedAppointment: Appointment | null = null;
  editingIndex: number | null = null;
  errorMessage: string | null = null;
  private appointmentsSubscription?: Subscription;
  private errorSubscription?: Subscription;
  private authSubscription?: Subscription;
  isAuthenticated = false;

  constructor(
    private appointmentService: AppointmentService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.appointmentsSubscription =
      this.appointmentService.appointments$.subscribe((appointments) => {
        this.appointments = appointments;
      });

    this.errorSubscription = this.appointmentService.error$.subscribe(
      (message) => {
        this.errorMessage = message;
      },
    );

    this.authSubscription = this.auth.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.appointmentsSubscription?.unsubscribe();
    this.errorSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (err: any) {
      this.errorMessage = err?.message || String(err);
    }
  }

  get filteredAppointments(): Appointment[] {
    if (!this.searchTerm) {
      return this.appointments;
    }

    return this.appointments.filter((appointment) => {
      const normalizedTerm = this.searchTerm.toLowerCase();
      return [
        appointment.task,
        appointment.priority,
        appointment.date,
        appointment.imgURL,
      ].some((field) => field?.toLowerCase().includes(normalizedTerm));
    });
  }

  handleSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }

  handleAddAppointment(appointment: Appointment): void {
    this.appointmentService.addAppointment(appointment);
  }

  handleStartEdit(index: number): void {
    this.editingIndex = index;
    this.selectedAppointment = { ...this.appointments[index] };
  }

  handleUpdateAppointment(event: {
    appointment: Appointment;
    index: number;
  }): void {
    const appointmentToUpdate = this.appointments[event.index];
    if (!appointmentToUpdate?.id) {
      return;
    }

    this.appointmentService.updateAppointment(
      appointmentToUpdate.id,
      event.appointment,
    );
    this.clearEditing();
  }

  handleDeleteAppointment(index: number): void {
    const appointmentToDelete = this.appointments[index];
    if (!appointmentToDelete?.id) {
      return;
    }

    this.appointmentService.deleteAppointment(appointmentToDelete.id);

    if (this.editingIndex === index) {
      this.clearEditing();
    } else if (this.editingIndex !== null && this.editingIndex > index) {
      this.editingIndex -= 1;
    }
  }

  handleToggleComplete(event: { index: number; completed: boolean }): void {
    const appointmentToToggle = this.appointments[event.index];
    if (!appointmentToToggle?.id) {
      return;
    }

    this.appointmentService.updateAppointment(appointmentToToggle.id, {
      ...appointmentToToggle,
      completed: event.completed,
    });
  }

  handleCancelEdit(): void {
    this.clearEditing();
  }

  private clearEditing(): void {
    this.editingIndex = null;
    this.selectedAppointment = null;
  }
}
