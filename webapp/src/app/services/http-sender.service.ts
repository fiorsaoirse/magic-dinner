import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

type pu = HttpParams | undefined;

@Injectable({
  providedIn: 'root'
})
export class HttpSenderService {

  constructor(private httpClient: HttpClient,
              @Inject('BASE_URL') private baseUrl: string) {
  }

  private static setOptions(params: pu) {
    const defaultParams = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return params ? { params, ...defaultParams } : defaultParams;
  }

  get<T>(url: string, params: pu = undefined): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}${url}`, HttpSenderService.setOptions(params));
  }

  post<T>(url: string, data: unknown, params: pu = undefined): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}${url}`, data, HttpSenderService.setOptions(params));
  }

  delete<T>(url: string, params: pu = undefined): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseUrl}${url}`, HttpSenderService.setOptions(params));
  }
}
