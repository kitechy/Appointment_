import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnDestroy {
  email = '';
  password = '';
  userEmail: string | null = null;
  errorMessage: string | null = null;

  private subs: Subscription[] = [];

  constructor(private auth: AuthService) {
    this.subs.push(
      this.auth.user$.subscribe((u) => (this.userEmail = u?.email || null)),
    );
    this.subs.push(this.auth.error$.subscribe((e) => (this.errorMessage = e)));
  }

  async signUp(): Promise<void> {
    if (!this.email || !this.password) return;
    try {
      await this.auth.signUp(this.email, this.password);
      this.email = '';
      this.password = '';
    } catch {
      // errorMessage set from service
    }
  }

  async signIn(): Promise<void> {
    if (!this.email || !this.password) return;
    try {
      await this.auth.signIn(this.email, this.password);
      this.email = '';
      this.password = '';
    } catch {
      // errorMessage set from service
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch {
      // handled by service
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
