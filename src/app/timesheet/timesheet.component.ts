import { Component, OnInit } from '@angular/core';
import { TimeSheet } from '../timesheet';
import { TimesheetService } from '../timesheet.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  timesheets: TimeSheet[];
  addingmode = false;
  selectedTime: TimeSheet;

  constructor(private timesheetService: TimesheetService) { }

  ngOnInit() {
    this.getTimeSheets();
  }
  getTimeSheets() {
    this.timesheetService.getTimeSheets('2018-10-01').subscribe(data => {
      this.timesheets = data;
    });
  } 

  getTimeSheet(id:number){
    //this.timesheetService.getTimeSheet(id).subscribe
  }
  updateTimeSheet(id:number, ts:TimeSheet){}
  addTimeSheet(ts:TimeSheet){}
  deleteTimeSheet(id:number){}
  //get , update, add, delete


}
