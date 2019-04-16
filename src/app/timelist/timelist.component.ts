import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TimesheetService } from '../timesheet.service';
import { TimeSheet } from '../timesheet';

@Component({
  selector: 'app-timelist',
  templateUrl: './timelist.component.html',
  styleUrls: ['./timelist.component.css']
})
export class TimelistComponent implements OnInit {
  WeekEnding: string;
  timesheets: TimeSheet[];

  constructor(private route: ActivatedRoute,
    private location: Location,
    private timeService: TimesheetService
    ) { }

  ngOnInit() {
    this.WeekEnding = this.route.snapshot.queryParams["q"];
    this.getTimeSheets(this.WeekEnding);
  }

  getTimeSheets(WeekEnding:string) {
    
    //var weekending = "2012-05-27";//'2018-10-28';
    this.timesheets = [];
    this.timeService.getTimeSheets(WeekEnding).subscribe(data => {
      this.timesheets = data;
    })
  }

  saveTimeSheet(idx:number){
      //alert(idx);
      this.timeService.updateTimeSheet(this.timesheets[idx].TimeID,this.timesheets[idx]).subscribe( 
      //()=> this.goBack())
      ()=>alert("Saved!")
    )
  }

  goBack(): void {
    this.location.back();
  }
}
