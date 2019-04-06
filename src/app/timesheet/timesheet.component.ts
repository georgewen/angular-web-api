import { Component, OnInit } from '@angular/core';
import { TimeSheet } from '../timesheet';
import { TimesheetService } from '../timesheet.service';
import { AlertsService } from '../alerts.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  private timesheets: Observable<TimeSheet[]>;

  constructor(private timesheetService: TimesheetService) { }

  ngOnInit() {
    this.timesheets = this.timesheetService.getTimeSheets();
  }

}
