import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Master-Key': '2dabee31384bcc47c30b772f6fa69587c0039ffeca28f1d92578b04ac207220423ca2c615967ec9c0720153d0a3f6700a798b6c620016f35f96e8f3ba1160533'
        }
      });
      return next.handle(authReq);
    }

    const apiReq = req.clone({
      setHeaders: {
        'X-Master-Key': '2dabee31384bcc47c30b772f6fa69587c0039ffeca28f1d92578b04ac207220423ca2c615967ec9c0720153d0a3f6700a798b6c620016f35f96e8f3ba1160533'
      }
    });

    return next.handle(apiReq);
  }
}