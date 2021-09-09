import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly message = 'This request has some errors';

  constructor( private readonly httpClient: HttpClient) { }

  getUpcomingCount(): Observable<any[]> {
    const endpoint = 'https://api.spacexdata.com/v3/launches/upcoming';
    return this.httpClient.get(endpoint).pipe(
      map((res: any) => res),
      catchError(this.errorHandler)
    );
  }

  getPastCount(): Observable<any[]> {
    const endpoint = 'https://api.spacexdata.com/v3/launches/past';
    return this.httpClient.get(endpoint).pipe(
      map((res: any) => res),
      catchError(this.errorHandler)
    );
  }

  getAllLaunchesCount(): Observable<any[]> {
    const endpoint = 'https://api.spacexdata.com/v3/launches';
    return this.httpClient.get(endpoint).pipe(
      map((res: any) => res),
      catchError(this.errorHandler)
    );
  }

  getAllLocationData(): Observable<any[]> {
    const endpoint = 'https://api.spacexdata.com/v3/launchpads';
    return this.httpClient.get(endpoint).pipe(
      map((res: any) => res),
      catchError(this.errorHandler)
    );
  }

  private readonly errorHandler = (error: HttpErrorResponse) =>
    throwError(this.message);
}
