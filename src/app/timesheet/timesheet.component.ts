import { Component, OnInit, Input } from '@angular/core';
import { TimeSheet } from '../timesheet';
import { TimesheetService } from '../timesheet.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  @Input() timesheet: TimeSheet;

  constructor(
    private timeService: TimesheetService,
    private location: Location
    ) { }

  ngOnInit() {
  }

  getTimeSheet(id:number) {
    this.timeService.getTimeSheet(id).subscribe( (timesheet)=> this.timesheet = timesheet);
  }

  goBack():void{
    this.location.back();
  }
  saveTimeSheet(){

    //if timeid is null then create new otherwise update.
    if (!this.timesheet.TimeID){
      this.timeService.addTimeSheet(this.timesheet).subscribe((t)=>alert("new time saved!" + t.TimeID));
    }
    else
    {
    this.timeService.updateTimeSheet(this.timesheet.TimeID,this.timesheet).subscribe( 
      //()=> this.goBack())
      ()=>alert("Saved!")
    )
    }
  }
}
