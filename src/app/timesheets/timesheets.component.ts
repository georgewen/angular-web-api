import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '../timesheet.service';
import { TimeSheet } from '../timesheet';
import { TimeEntry } from '../TimeEntry';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { projection } from '@angular/core/src/render3';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css']
})

export class TimesheetsComponent implements OnInit {

  timesheets: TimeSheet[];
  addingmode = false;
  weekview = false;
  selectedTime: TimeSheet;
  //transform timesheet to weekly tabular format
  timeentries:TimeEntry[] =[];
  WeekEndingDate: string;
  //ProjectList = [{ProjectCode:"7060533",ProjectName:"7060533"},{ProjectCode:"7060506",ProjectName:"7060506"}];
  TasksList = //[{"0000123", Tasks:[10,20,30]},{"0000235", Tasks: [1,2,3]}]
  [{
    ProjectCode: "7060533",
    Tasks: ['Miami', 'Ft.Lauderdale', 'Tampa']
  }, {
    ProjectCode: "7060506",
    Tasks: ['San Diego', 'San Francisco', 'L.A.']
  }, {
    ProjectCode: "0000235",
    Tasks: ['Dallas', 'San Antonio', 'Anywhere USA']
  }
];
ProjectTaskList: string[];
ProjectCode:string;
TaskUID:string;

  
  constructor(private timesheetService: TimesheetService,private route: ActivatedRoute) { 
    //this.timeentries = new Array();
  }

  ngOnInit() {
        
    var weekending2 = this.route.snapshot.queryParams["q"];
    var weekending = "2012-05-27";//'2018-10-28';

    if(weekending2){ 
      this.WeekEndingDate = weekending2;
      weekending = weekending2;
    }
    this.WeekEndingDate =  weekending;
    this.getTimeSheets(weekending);
  }

   toggleView()
   {
     this.weekview = !this.weekview;
   }

  AddTime(){
    //add one record to timeentries...first check if exists already with status 'N'
    //todo: update both timesheets and timeentries array

    alert(this.ProjectCode + ":" + this.TaskUID);

  }
  selectProject(ProjectCode:string){
    this.ProjectTaskList=[];
    var idx = this.TasksList.findIndex((i)=> {return i.ProjectCode == ProjectCode});
    this.ProjectTaskList = this.TasksList[idx].Tasks;
    //this.ProjectCode = ProjectCode;
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
      }
      )      
    } else{
    this.timesheetService.updateTimeSheet(ts.TimeID,ts).subscribe( 
        //()=> this.goBack())
    ()=> {
      //alert("Saved!");
    }
  )
  }
  this.refreshTimeEntries(this.timesheets);
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

     //now transform timesheets to timeentries
     data.forEach( (timesheet) =>{
      //push to timeentry array.
      var weekday = (new Date(timesheet.TimeEntryDate)).getDay();
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
        weekTime.Mon = new TimeSheet();
        weekTime.Mon.ProjectCode = timesheet.ProjectCode;
        weekTime.Mon.TaskUID = timesheet.TaskUID;
        weekTime.Mon.StatusCode = "N";

        var tempdate = new Date(this.WeekEndingDate);
        tempdate.setDate(tempdate.getDate()- 6 );
        weekTime.Mon.TimeEntryDate = tempdate.toDateString();

        weekTime.Tue = new TimeSheet();
        weekTime.Tue.ProjectCode = timesheet.ProjectCode;
        weekTime.Tue.TaskUID = timesheet.TaskUID;
        weekTime.Tue.StatusCode = "N";
        var tempdate = new Date(this.WeekEndingDate);
        tempdate.setDate(tempdate.getDate()- 5 );
        weekTime.Tue.TimeEntryDate = tempdate.toDateString();

        weekTime.Wed = new TimeSheet();
        weekTime.Wed.ProjectCode = timesheet.ProjectCode;
        weekTime.Wed.TaskUID = timesheet.TaskUID;
        weekTime.Wed.StatusCode = "N";
        var tempdate = new Date(this.WeekEndingDate);
        tempdate.setDate(tempdate.getDate()- 4 );
        weekTime.Wed.TimeEntryDate = tempdate.toDateString();

        weekTime.Thu = new TimeSheet();
        weekTime.Thu.ProjectCode = timesheet.ProjectCode;
        weekTime.Thu.TaskUID = timesheet.TaskUID;
        weekTime.Thu.StatusCode = "N";
        var tempdate = new Date(this.WeekEndingDate);
        tempdate.setDate(tempdate.getDate()- 3 );
        weekTime.Thu.TimeEntryDate = tempdate.toDateString();

        weekTime.Fri = new TimeSheet();
        weekTime.Fri.ProjectCode = timesheet.ProjectCode;
        weekTime.Fri.TaskUID = timesheet.TaskUID;
        weekTime.Fri.StatusCode = "N";
        var tempdate = new Date(this.WeekEndingDate);
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
