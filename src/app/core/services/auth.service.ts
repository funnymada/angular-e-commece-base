import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, tap } from "rxjs"
import { environment } from "../../enviroments/enviroment"
import { User } from "../models/user.model"
import { HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators'
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly TOKEN_KEY = "auth_token"
  private readonly USER_KEY = "current_user"
  private readonly apiUrl = environment.apiUrl

  private authSubject = new BehaviorSubject<boolean>(this.hasToken())
  isAuthenticated$ = this.authSubject.asObservable()

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser())
  currentUser$ = this.currentUserSubject.asObservable()

private tokenCheckedSubject = new BehaviorSubject<boolean>(false)
tokenChecked$ = this.tokenCheckedSubject.asObservable()

  constructor(private http: HttpClient) {
    this.checkToken()
  }
  
init(): Promise<void> {
  return new Promise((resolve) => {
    this.tokenChecked$.pipe(take(1)).subscribe(() => resolve())
    this.checkToken()
  })
}
login(credentials: { username: string; password: string }): Observable<{ token: string; user: User }> {
  // Crea l'header Basic Auth
  const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
  const headers = new HttpHeaders({
    'Authorization': `Basic ${basicAuth}`,
    'Content-Type': 'application/json'
  });

  return this.http.post<{ token: string; user: User }>(`${this.apiUrl}auth`, {}, { headers }).pipe(
    tap((response) => {
      this.setToken(response.token)
      this.setUser(response.user)
      this.authSubject.next(true)
      this.currentUserSubject.next(response.user)
    }),
  )
}



  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.authSubject.next(false)
    this.currentUserSubject.next(null)
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  }

  private hasToken(): boolean {
    return !!this.getToken()
  }

private checkToken(): void {
  if (this.hasToken()) {
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserSubject.next(user)
        this.authSubject.next(true)
        this.tokenCheckedSubject.next(true)
      },
      error: () => {
        this.logout()
        this.tokenCheckedSubject.next(true)
      },
    })
  } else {
    this.tokenCheckedSubject.next(true)
  }
}



  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`)
  }
}

