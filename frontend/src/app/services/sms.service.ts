import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SEND_OTP, SEND_SMS, VERIFY_OTP } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  constructor(private http: HttpClient) {}

  // Send OTP
  sendOTP(to: string): Observable<any> {
    return this.http.post(SEND_OTP, { to });
  }

  // Verify OTP
  verifyOTP(to: string, otp: string): Observable<any> {
    return this.http.post(VERIFY_OTP, { to, otp });
  }
  // Testing purposes
  sendSMS(to: string, text: string): Observable<any> {
    return this.http.post(SEND_SMS, { to, text });
  }
}
