import { TimeSheet } from './timesheet';

export class TimeEntry{
    ProjectCode: string;
    TaskUID: number; 
    ActivityCode: string;
    StatusCode: string;
    Mon: TimeSheet;
    Tue: TimeSheet;
    Wed: TimeSheet;
    Thu: TimeSheet;
    Fri: TimeSheet;
    Sat: TimeSheet;
    Sun: TimeSheet;
}