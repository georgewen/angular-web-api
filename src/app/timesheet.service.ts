import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { AuthService } from './auth.service';
import { Event } from './event';
import { AlertsService } from './alerts.service';
import { TimeSheet } from './timesheet';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(private authService: AuthService,
    private alertsService: AlertsService,
    private http: HttpClient
    ) { 

      
    }

    
   getTimeSheets(): Observable<TimeSheet[]> {
    try {

      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer ${this.authService.getAccessToken()}`)
      }      
      //token = await this.authService.getAccessToken()
      return this.http.get<TimeSheet[]>(`http://localhost:44301/api/TimeSheets?ResourceID=QW12038&WeekEnding=2018-10-01`,header)
    } catch (error) {
      this.alertsService.add('Could not get events', JSON.stringify(error, null, 2));
    }
  }

}
