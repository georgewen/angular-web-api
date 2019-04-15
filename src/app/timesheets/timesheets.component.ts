import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '../timesheet.service';
import { TimeSheet } from '../timesheet';
import { TimeEntry } from '../TimeEntry';
@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css']
})

export class TimesheetsComponent implements OnInit {

  timesheets: TimeSheet[];
  addingmode = false;
  selectedTime: TimeSheet;
  //transform timesheet to weekly tabular format
  timeentries:TimeEntry[] =[];
  
  constructor(private timesheetService: TimesheetService) { 
    //this.timeentries = new Array();
  }

  ngOnInit() {
    this.getTimeSheets();
  }

  getTimeSheets() {
    
    var weekending = "2012-05-27";//'2018-10-28';

    this.timesheetService.getTimeSheets(weekending).subscribe(data => {
      this.timesheets = data;
      //now transform timesheets to timeentries
      data.forEach( (timesheet) =>{
          //push to timeentry array.
          var weekday = (new Date(timesheet.TimeEntryDate)).getDay();
          //check if projectcode/taskuid already in
          var exists;
          if (this.timeentries.length > 0)
          {
              exists = this.timeentries.filter(t=> t.ProjectCode==timesheet.ProjectCode && t.TaskUID == timesheet.TaskUID && t.StatusCode == timesheet.StatusCode);                     
              console.log(this.timeentries.length);
            }          

          if(!exists || exists.length==0)
          {
            // no entry in the array, add new...
            var weekTime = new TimeEntry();
            weekTime.ProjectCode = timesheet.ProjectCode;
            weekTime.TaskUID = timesheet.TaskUID;
            weekTime.StatusCode = timesheet.StatusCode;

            //need to  initialize all weekdays to zero
            weekTime.Mon = new TimeSheet();
            weekTime.Mon.ProjectCode = timesheet.ProjectCode;
            weekTime.Mon.TaskUID = timesheet.TaskUID;
            weekTime.Mon.StatusCode = timesheet.StatusCode;

            var tempdate = new Date(weekending);
            tempdate.setDate(tempdate.getDate()- 6 );
            weekTime.Mon.TimeEntryDate = tempdate.toDateString();

            weekTime.Tue = new TimeSheet();
            weekTime.Tue.ProjectCode = timesheet.ProjectCode;
            weekTime.Tue.TaskUID = timesheet.TaskUID;
            var tempdate = new Date(weekending);
            tempdate.setDate(tempdate.getDate()- 5 );
            weekTime.Tue.TimeEntryDate = tempdate.toDateString();

            weekTime.Wed = new TimeSheet();
            weekTime.Wed.ProjectCode = timesheet.ProjectCode;
            weekTime.Wed.TaskUID = timesheet.TaskUID;
            var tempdate = new Date(weekending);
            tempdate.setDate(tempdate.getDate()- 4 );
            weekTime.Wed.TimeEntryDate = tempdate.toDateString();

            weekTime.Thu = new TimeSheet();
            weekTime.Thu.ProjectCode = timesheet.ProjectCode;
            weekTime.Thu.TaskUID = timesheet.TaskUID;
            var tempdate = new Date(weekending);
            tempdate.setDate(tempdate.getDate()- 3 );
            weekTime.Thu.TimeEntryDate = tempdate.toDateString();

            weekTime.Fri = new TimeSheet();
            weekTime.Fri.ProjectCode = timesheet.ProjectCode;
            weekTime.Fri.TaskUID = timesheet.TaskUID;
            var tempdate = new Date(weekending);
            tempdate.setDate(tempdate.getDate()- 2 );
            weekTime.Fri.TimeEntryDate = tempdate.toDateString();

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
      console.log(this.timeentries);
    });
  } 

  //to be added
  // move week backward or forward

  getTimeSheet(id:number){
    //this.timesheetService.getTimeSheet(id).subscribe
  }
  updateTimeSheet(id:number, ts:TimeSheet){}
  addTimeSheet(ts:TimeSheet){}
  deleteTimeSheet(id:number){}
  //get , update, add, delete


}
