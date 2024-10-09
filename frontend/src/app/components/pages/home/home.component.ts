import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SmsService } from '../../../services/sms.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private smsService = inject(SmsService);

  // Method to send SMS
  sendSms(): void {
    this.smsService
      .sendSMS('+639683799097', 'Welcome to MIHIS New User!')
      .subscribe({
        next: (response) => {
          console.log('SMS sent successfully', response);
        },
        error: (err) => {
          console.error('Error sending SMS', err);
        },
      });
  }
}
