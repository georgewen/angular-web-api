import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TimesheetService } from '../timesheet.service';
import { TimeSheet } from '../timesheet';
import { toString } from '@ng-bootstrap/ng-bootstrap/util/util';

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

  saveTimeSheet(ts:TimeSheet) {//idx:number){
      //alert(idx);
      //this.timeService.updateTimeSheet(this.timesheets[idx].TimeID,this.timesheets[idx]).subscribe( 
      this.timeService.updateTimeSheet(ts.TimeID,ts).subscribe( 
          //()=> this.goBack())
      ()=>alert("Saved!")
    )
  }

  deleteTime(ts:TimeSheet){
    this.timeService.deleteTimeSheet(ts.TimeID).subscribe(()=>{
      alert("deleted!");
      var idx = this.timesheets.indexOf(ts);
      if(idx >0)
      {
        this.timesheets.splice(idx,1);
      }
    })
  }

  goBack(): void {
    this.location.back();
  }
}
