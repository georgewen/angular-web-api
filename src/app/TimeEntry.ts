import { TimeSheet } from './timesheet';

export class TimeEntry{
    ProjectCode: string;
    TaskUID: number; 
    ActivityCode: string;
    StatusCode: string;
    //how about use Dict: Map<string,TimeSheet>() 
    Mon: TimeSheet;
    Tue: TimeSheet;
    Wed: TimeSheet;
    Thu: TimeSheet;
    Fri: TimeSheet;
    Sat: TimeSheet;
    Sun: TimeSheet;
}