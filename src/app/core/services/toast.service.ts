import { Injectable } from "@angular/core"
import { Subject } from "rxjs"

export interface Toast {
  message: string
  type: "success" | "error" | "info" | "warning"
  id: number
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toasts$ = new Subject<Toast>()
  toasts = this.toasts$.asObservable()

  private id = 0

  show(message: string, type: "success" | "error" | "info" | "warning" = "info"): void {
    this.toasts$.next({
      message,
      type,
      id: this.id++,
    })
  }
}

