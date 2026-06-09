import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { Appointment } from './models/appointment.model';
import { firebaseConfig } from './firebase-config';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private firestore = getFirestore(initializeApp(firebaseConfig));
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor() {
    this.connectRealtimeAppointments();
  }

  private connectRealtimeAppointments(): void {
    const appointmentsCollection = collection(this.firestore, 'appointments');
    const appointmentsQuery = query(appointmentsCollection, orderBy('date'));

    onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const appointments = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Appointment),
        }));
        this.appointmentsSubject.next(appointments);
        this.errorSubject.next(null);
      },
      (error) => {
        const message = `Firestore connection failed: ${error?.message || error}`;
        console.error(message);
        this.errorSubject.next(message);
      },
    );
  }

  addAppointment(appointment: Appointment): Promise<void> {
    const newAppointment = {
      task: appointment.task,
      date: appointment.date,
      priority: appointment.priority,
      imgURL: appointment.imgURL,
      completed: appointment.completed ?? false,
    };

    this.errorSubject.next(null);
    return addDoc(collection(this.firestore, 'appointments'), newAppointment)
      .then((docRef) => {
        const current = this.appointmentsSubject.value;
        this.appointmentsSubject.next([
          ...current,
          { id: docRef.id, ...newAppointment },
        ]);
      })
      .catch((error) => {
        const message = `Failed to add appointment to Firestore: ${error?.message || error}`;
        console.error(message);
        this.errorSubject.next(message);
        throw error;
      });
  }

  updateAppointment(id: string, appointment: Appointment): Promise<void> {
    const appointmentDoc = doc(this.firestore, 'appointments', id);
    const updateData = {
      task: appointment.task,
      date: appointment.date,
      priority: appointment.priority,
      imgURL: appointment.imgURL,
      completed: appointment.completed ?? false,
    };
    this.errorSubject.next(null);
    return updateDoc(appointmentDoc, updateData).catch((error) => {
      const message = `Failed to update appointment in Firestore: ${error?.message || error}`;
      console.error(message);
      this.errorSubject.next(message);
      throw error;
    });
  }

  deleteAppointment(id: string): Promise<void> {
    const appointmentDoc = doc(this.firestore, 'appointments', id);
    this.errorSubject.next(null);
    return deleteDoc(appointmentDoc).catch((error) => {
      const message = `Failed to delete appointment from Firestore: ${error?.message || error}`;
      console.error(message);
      this.errorSubject.next(message);
      throw error;
    });
  }
}
