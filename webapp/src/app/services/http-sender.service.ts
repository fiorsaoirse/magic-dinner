import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpSenderService {

  constructor(private httpClient: HttpClient) {
  }

  private static setOptions(params: HttpParams) {
    return {
      params,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  get<T>(url: string, params: HttpParams = undefined): Observable<T> {
    return this.httpClient.get<T>(`${environment.restAPI}${url}`, HttpSenderService.setOptions(params));
  }

  post<T>(url: string, data: unknown, params: HttpParams = undefined): Observable<T> {
    return this.httpClient.post<T>(`${environment.restAPI}${url}`, data, HttpSenderService.setOptions(params));
  }

  delete<T>(url: string, params: HttpParams = undefined): Observable<T> {
    return this.httpClient.delete<T>(`${environment.restAPI}${url}`, HttpSenderService.setOptions(params));
  }
}
