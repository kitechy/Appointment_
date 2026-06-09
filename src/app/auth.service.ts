import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { firebaseConfig } from './firebase-config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = getAuth(initializeApp(firebaseConfig));
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor() {
    onAuthStateChanged(
      this.auth,
      (user) => {
        this.userSubject.next(user || null);
        this.errorSubject.next(null);
      },
      (err) => {
        const message = `Auth state error: ${err?.message || err}`;
        console.error(message);
        this.errorSubject.next(message);
      },
    );
  }

  async signUp(email: string, password: string): Promise<void> {
    this.errorSubject.next(null);
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (err: any) {
      const message = err?.message || String(err);
      console.error('Sign up failed:', message);
      this.errorSubject.next(message);
      throw err;
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    this.errorSubject.next(null);
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (err: any) {
      const message = err?.message || String(err);
      console.error('Sign in failed:', message);
      this.errorSubject.next(message);
      throw err;
    }
  }

  async signOut(): Promise<void> {
    this.errorSubject.next(null);
    try {
      await firebaseSignOut(this.auth);
    } catch (err: any) {
      const message = err?.message || String(err);
      console.error('Sign out failed:', message);
      this.errorSubject.next(message);
      throw err;
    }
  }
}
