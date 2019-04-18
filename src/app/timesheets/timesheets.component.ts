import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '../timesheet.service';
import { TimeSheet } from '../timesheet';
import { TimeEntry } from '../TimeEntry';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TimesheetComponent } from '../timesheet/timesheet.component';
import { ProjectTask, MyProjects } from '../ProjectTask';


@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css']
})

export class TimesheetsComponent implements OnInit {

  timesheets: TimeSheet[];
  addingmode = false;
  weekview = true;
  selectedTime: TimeSheet;
  //transform timesheet to weekly tabular format
  timeentries:TimeEntry[] =[];
  WeekEndingDate: string;
  weekdayHours: number[] =[0,0,0,0,0,0,0,0];

  myProjects: MyProjects[];
  myProjectTasks: ProjectTask[]

  ProjectTaskList: any; 
  ProjectCode:string;
  TaskUID:number;

  
  constructor(private timesheetService: TimesheetService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { 
    //this.timeentries = new Array();
  }

  ngOnInit() {
        
    var weekending2 = this.route.snapshot.queryParams["q"];
    //var weekending = "2012-05-27";
    var weekending = '2018-10-28';

    if(weekending2){ 
      this.WeekEndingDate = weekending2;
      weekending = weekending2;
    }
    this.WeekEndingDate =  weekending;
    this.getTimeSheets(weekending);
    this.getTasks();
  }

   toggleView()
   {
     this.weekview = !this.weekview;
   }

   //detail view in popup window
   openModalWin(ts:TimeSheet):void
   {
     this.selectedTime = Object.assign({},ts);
    const dialogRef = this.dialog.open(TimesheetComponent, {
      height: '400px',
      width: '600px',
      data: {timesheet: ts} ///here is the most import part:...
    });
    //dialogRef.componentInstance.timeId = id;

    dialogRef.afterClosed().subscribe((result) => {
      //check if changes were made?
      if(result && result.StandardHours !=this.selectedTime.StandardHours){
        //console.log(result);
        this.saveTimeSheet(result);
      }
    });

   }

  AddTime(){
    //add one record to timeentries...first check if exists already with status 'N'
    //todo: update both timesheets and timeentries array
    alert(this.ProjectCode + ":" + this.TaskUID);
    if(this.timesheets.filter( t => t.ProjectCode == this.ProjectCode && t.TaskUID == this.TaskUID && t.StatusCode =="N").length <= 0)
    {
      var ts = { ProjectCode: this.ProjectCode,TaskUID: this.TaskUID, StatusCode: "N", ResourceID: this.timesheets[0].ResourceID, TimeEntryDate: this.subtractDateTime(this.WeekEndingDate,6), ActivityCode: "TECHNICAL", StandardHours:0, OvertimeHours: 0 };
      this.timesheets.push(ts);
      this.refreshTimeEntries(this.timesheets);
    }

    this.ProjectCode = "";
    this.TaskUID = null;

  }
  selectProject(ProjectCode:string){
    //this.ProjectTaskList=[];
    //var idx = this.TasksList.findIndex((i)=> {return i.ProjectCode == ProjectCode});
    this.ProjectTaskList = this.myProjectTasks.filter( p => p.ProjectCode == ProjectCode && p.TaskUID !=0 );
    this.ProjectCode = ProjectCode;

  }
  subtractDateTime(dateTime: string, days:number): string {
    try {
      //return moment.tz(dateTime, timeZone).format();
      return  moment(dateTime).subtract('days',days)
    }
    catch(error) {
      console.log('DateTimeTimeZone conversion error', JSON.stringify(error));
    }
  }

  saveTimeSheet(ts:TimeSheet) {//idx:number){
    if (!ts.TimeID){
      this.timesheetService.addTimeSheet(ts).subscribe((t)=> {
        this.timesheets.push(t);
        alert(t.TimeID);
        this.refreshTimeEntries(this.timesheets);
      }
      )      
    } else{
      //if hours = 0 then delete

      this.timesheetService.updateTimeSheet(ts.TimeID,ts).subscribe( 
        //()=> this.goBack())
    ()=> {
      //replace this.timesheets
      var idx  = this.timesheets.findIndex( t => t.TimeID == ts.TimeID);
      this.timesheets[idx] = ts;
      this.refreshTimeEntries(this.timesheets);
    }
  )
  }
}

deleteTime(ts:TimeSheet){
  this.timesheetService.deleteTimeSheet(ts.TimeID).subscribe(()=>{

    alert("deleted!");

    var idx = this.timesheets.findIndex((t) => {return (t.TimeID==ts.TimeID)}); //this.timesheets.indexOf(ts);

    if(idx >0)  {this.timesheets.splice(idx,1);}
    //delete doesn't work...
    this.refreshTimeEntries(this.timesheets);

  })
}

  goBackward(){
    var weekending = new Date(this.WeekEndingDate);
    weekending.setDate(weekending.getDate()-7);
    this.WeekEndingDate = weekending.toDateString();
    this.getTimeSheets(weekending.toLocaleString());
  }

  goForward(){
    var weekending = new Date(this.WeekEndingDate);
    weekending.setDate(weekending.getDate()+7);
    this.WeekEndingDate = weekending.toDateString();
    this.getTimeSheets(weekending.toLocaleString());
  }

  refreshTimeSheets(){}

  refreshTimeEntries(data:TimeSheet[]){

      this.timeentries = [];
      this.weekdayHours = [0,0,0,0,0,0,0,0];
     //now transform timesheets to timeentries
     data.forEach( (timesheet) =>{

      //push to timeentry array.
      var weekday = (new Date(timesheet.TimeEntryDate)).getDay();
      //subtotal
      this.weekdayHours[0] += timesheet.StandardHours;

      switch(weekday) {
        case 1:
          this.weekdayHours[1] += timesheet.StandardHours;
          break;
        case 2:
          this.weekdayHours[2] += timesheet.StandardHours;
          break;
        case 3:
          this.weekdayHours[3] += timesheet.StandardHours;
          break;
        case 4:
          this.weekdayHours[4] += timesheet.StandardHours;
          break;
        case 5:
          this.weekdayHours[5] += timesheet.StandardHours;
          break;
        case 6:
          this.weekdayHours[6] += timesheet.StandardHours;
          break;
        case 0:
          this.weekdayHours[7] += timesheet.StandardHours;
          break;
      }



      //check if projectcode/taskuid already in
      var exists;
      if (this.timeentries.length > 0)
      {
          exists = this.timeentries.filter(t=> t.ProjectCode==timesheet.ProjectCode && t.TaskUID == timesheet.TaskUID && t.StatusCode == timesheet.StatusCode);                     
          //console.log(this.timeentries.length);
        }          

      if(!exists || exists.length==0)
      {
        // no entry in the array, add new...
        var weekTime = new TimeEntry();
        weekTime.ProjectCode = timesheet.ProjectCode;
        weekTime.TaskUID = timesheet.TaskUID;
        weekTime.StatusCode = timesheet.StatusCode;

        //need to  initialize all weekdays to zero

        weekTime.Mon = { ProjectCode: timesheet.ProjectCode,TaskUID: timesheet.TaskUID, StatusCode: "N", ResourceID: timesheet.ResourceID, TimeEntryDate: this.subtractDateTime(this.WeekEndingDate,6), ActivityCode: "TECHNICAL", StandardHours:0, OvertimeHours: 0 };
        weekTime.Tue = { ProjectCode: timesheet.ProjectCode,TaskUID: timesheet.TaskUID, StatusCode: "N", ResourceID: timesheet.ResourceID, TimeEntryDate: this.subtractDateTime(this.WeekEndingDate,5), ActivityCode: "TECHNICAL", StandardHours:0, OvertimeHours: 0 };
        weekTime.Wed = { ProjectCode: timesheet.ProjectCode,TaskUID: timesheet.TaskUID, StatusCode: "N", ResourceID: timesheet.ResourceID, TimeEntryDate: this.subtractDateTime(this.WeekEndingDate,4), ActivityCode: "TECHNICAL", StandardHours:0, OvertimeHours: 0 };
        weekTime.Thu = { ProjectCode: timesheet.ProjectCode,TaskUID: timesheet.TaskUID, StatusCode: "N", ResourceID: timesheet.ResourceID, TimeEntryDate: this.subtractDateTime(this.WeekEndingDate,3), ActivityCode: "TECHNICAL", StandardHours:0, OvertimeHours: 0 };
        weekTime.Fri = { ProjectCode: timesheet.ProjectCode,TaskUID: timesheet.TaskUID, StatusCode: "N", ResourceID: timesheet.ResourceID, TimeEntryDate: this.subtractDateTime(this.WeekEndingDate,2), ActivityCode: "TECHNICAL", StandardHours:0, OvertimeHours: 0 };
        weekTime.Sat = { ProjectCode: timesheet.ProjectCode,TaskUID: timesheet.TaskUID, StatusCode: "N", ResourceID: timesheet.ResourceID, TimeEntryDate: this.subtractDateTime(this.WeekEndingDate,1), ActivityCode: "TECHNICAL", StandardHours:0, OvertimeHours: 0 };
        weekTime.Sun = { ProjectCode: timesheet.ProjectCode,TaskUID: timesheet.TaskUID, StatusCode: "N", ResourceID: timesheet.ResourceID, TimeEntryDate: this.subtractDateTime(this.WeekEndingDate,0), ActivityCode: "TECHNICAL", StandardHours:0, OvertimeHours: 0 };

        switch(weekday) {
          case 1:
            weekTime.Mon = timesheet;
            break;
          case 2:
          weekTime.Tue = timesheet;
          break;
          case 3:
          weekTime.Wed = timesheet;
          break;
          case 4:
          weekTime.Thu = timesheet;
          break;
          case 5:
          weekTime.Fri = timesheet;
          break;
          case 6:
          weekTime.Sat = timesheet;
          break;
          case 0:
          weekTime.Sun = timesheet;
          break;
        }
        this.timeentries.push(weekTime);
      }
      else{
        //already exists 
        var weekTime = new TimeEntry();
        weekTime.ProjectCode = exists[0].ProjectCode;
        weekTime.TaskUID = exists[0].TaskUID;
        weekTime.StatusCode = exists[0].StatusCode;
        weekTime.Mon = Object.assign({},exists[0].Mon);
        weekTime.Tue = Object.assign({},exists[0].Tue);
        weekTime.Wed = Object.assign({},exists[0].Wed);
        weekTime.Thu = Object.assign({},exists[0].Thu);
        weekTime.Fri = Object.assign({},exists[0].Fri);
        weekTime.Sat = Object.assign({},exists[0].Sat);
        weekTime.Sun = Object.assign({},exists[0].Sun);

        //Object.assign({},exists[0]);
        var index1 = //this.timeentries.indexOf(weekTime);
        this.timeentries.findIndex((t) => {return (t.ProjectCode == weekTime.ProjectCode && t.TaskUID ==weekTime.TaskUID && t.StatusCode ==weekTime.StatusCode)});

        switch(weekday) {
          case 1:
            weekTime.Mon = timesheet;
            break;
          case 2:
          weekTime.Tue = timesheet;
          break;
          case 3:
          weekTime.Wed = timesheet;
          break;
          case 4:
          weekTime.Thu = timesheet;
          break;
          case 5:
          weekTime.Fri = timesheet;
          break;
          case 6:
          weekTime.Sat = timesheet;
          break;
          case 0:
          weekTime.Sun = timesheet;
          break;
        }
        //now update array 
        this.timeentries[index1] = weekTime;
      }
  })
  }

  getTimeSheets(WeekEnding:string) {
    
    //var weekending = "2012-05-27";//'2018-10-28';
    this.timeentries = [];
    this.timesheets = [];
    this.timesheetService.getTimeSheets(WeekEnding).subscribe(data => {
      this.timesheets = data;
      this.refreshTimeEntries(data);
      //console.log(this.timeentries);
    });
  }
  
  getTasks(){
    this.myProjects = [];
    this.timesheetService.getTasks().subscribe(data =>{
      this.myProjectTasks = data;
      data.forEach( (t) =>{
        if(t.TaskUID==0) {this.myProjects.push({ProjectCode: t.ProjectCode, ProjectName: t.TaskName});}
      })      
    });
  }
}
