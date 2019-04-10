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

  private timesheets: TimeSheet[];

  constructor(private timesheetService: TimesheetService) { }

  ngOnInit() {
    this.getTimeSheets();
  }
  getTimeSheets() {
    this.timesheetService.getTimeSheets().subscribe(data => {
      this.timesheets = data;
    });
  } 

}
