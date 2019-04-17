import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { TimeSheet } from './timesheet';
import { ProjectTask } from './ProjectTask';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  accessToken: string;

  constructor(private authService: AuthService,
    private alertsService: AlertsService,
    private http: HttpClient
    ) { 
      //this.authService.getAccessToken(OAuthSettings.scopes2).then(data => {
      //  this.accessToken = data;
      //});       
      this.accessToken = sessionStorage.getItem('api_token'); //or localStorage ?      
    }

    
     getTimeSheets(WeekEnding:string):Observable<TimeSheet[]> {

      var header = {headers: new HttpHeaders() 
        .set('Authorization',  'Bearer ' + this.accessToken)
      }  
      return this.http.get<Array<TimeSheet>>(`https://localhost:44301/api/TimeSheets?WeekEnding=${WeekEnding}`,header);
    }

    getTimeSheet(id:number):Observable<TimeSheet> {
      var header = {headers: new HttpHeaders() 
        .set('Authorization',  'Bearer ' + this.accessToken)
      }  
      return this.http.get<TimeSheet>(`https://localhost:44301/api/TimeSheets/${id}`,header);
    }
  
    //save existing
    updateTimeSheet(id:number, ts:TimeSheet){
      var header = {headers: new HttpHeaders() 
        .set('Authorization',  'Bearer ' + this.accessToken)
      }  
      return this.http.put<TimeSheet>(`https://localhost:44301/api/TimeSheets/${id}`,ts, header);
    }
    //add new timesheet
    addTimeSheet(ts:TimeSheet){
      var header = {headers: new HttpHeaders() 
        .set('Authorization',  'Bearer ' + this.accessToken)
      }  
      return this.http.post<TimeSheet>(`https://localhost:44301/api/TimeSheets`,ts, header);
    }

    //add new timesheet
    deleteTimeSheet(id:number){
      var header = {headers: new HttpHeaders() 
        .set('Authorization',  'Bearer ' + this.accessToken)
      }  
      return this.http.delete<TimeSheet>(`https://localhost:44301/api/TimeSheets/${id}`, header);
    }    

    getTasks():Observable<ProjectTask[]> {
      var header = {headers: new HttpHeaders() 
        .set('Authorization',  'Bearer ' + this.accessToken)
      } 
      return this.http.get<Array<ProjectTask>>(`https://localhost:44301/api/TimeSheets/tasks`,header);
    }
}