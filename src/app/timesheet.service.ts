import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { AuthService } from './auth.service';
import { Event } from './event';
import { AlertsService } from './alerts.service';
import { TimeSheet } from './timesheet';
import { access } from 'fs';
import { OAuthSettings } from 'src/oauth';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(private authService: AuthService,
    private alertsService: AlertsService,
    private http: HttpClient
    ) { 

      
    }

    
    getTimeSheets():TimeSheet[] {

      var accessToken: string;

    try {

//test code start
      
    this.authService.getAccessToken(OAuthSettings.scopes2).then(data =>
    {
      accessToken = data;
      //alert(accessToken);
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            alert(this.responseText);
      }
      xmlHttp.open("GET", 'https://localhost:44301/api/TimeSheets?ResourceID=QW12038&WeekEnding=2018-10-31', true); // true for asynchronous
      xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      ///xmlHttp.send();
    //test code end

      var header = {headers: new HttpHeaders() 
              .set('Authorization',  'Bearer ' + accessToken)
      }      
    
      //return this.http.get<Array<TimeSheet>>('https://localhost:44301/api/TimeSheets?ResourceID=QW12038&WeekEnding=2018-10-01',header);
      this.http.get<TimeSheet[]>('https://localhost:44301/api/TimeSheets?ResourceID=QW12038&WeekEnding=2018-10-01',header).subscribe(data => {
        //for (let ts of data) {
        //  console.log(ts.TimeID); // 1, "string", false
        //}  
      return data;
        })
    });
      return null;
    } catch (error) {
      this.alertsService.add('Could not get events', JSON.stringify(error, null, 2));
    }
  }

}
