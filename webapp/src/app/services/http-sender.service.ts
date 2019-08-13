import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
        'Content-Type\'': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*'
      })
    };
  }

  get<T>(url: string, params: HttpParams = undefined): Observable<T> {
    return this.httpClient.get<T>(url, HttpSenderService.setOptions(params));
  }

  post<T>(url: string, data: unknown, params: HttpParams = undefined): Observable<T> {
    return this.httpClient.post<T>(url, data, HttpSenderService.setOptions(params));
  }

  delete<T>(url: string, params: HttpParams = undefined): Observable<T> {
    return this.httpClient.delete<T>(url, HttpSenderService.setOptions(params));
  }
}
