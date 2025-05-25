import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://server-angular-jac.dev.aws.r-s.cloud/api/api';
  private readonly masterKey = '2dabee31384bcc47c30b772f6fa69587c0039ffeca28f1d92578b04ac207220423ca2c615967ec9c0720153d0a3f6700a798b6c620016f35f96e8f3ba1160533';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on service initialization
    const token = this.getStoredToken();
    if (token) {
      this.tokenSubject.next(token);
      this.getCurrentUser().subscribe();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, {
      headers: {
        'X-Master-Key': this.masterKey
      }
    }).pipe(
      tap(response => {
        if (response.token) {
          this.storeToken(response.token);
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.removeStoredToken();
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`, {
      headers: {
        'Authorization': `Bearer ${this.getStoredToken()}`,
        'X-Master-Key': this.masterKey
      }
    }).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(error => {
        console.error('Get current user error:', error);
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private storeToken(token: string): void {
    this.tokenSubject.next(token);
  }

  private getStoredToken(): string | null {
    return this.tokenSubject.value;
  }

  private removeStoredToken(): void {
    this.tokenSubject.next(null);
  }
}