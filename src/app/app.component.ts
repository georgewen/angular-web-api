import {Component, OnDestroy, OnInit} from '@angular/core';
import {BroadcastService} from "@azure/msal-angular";
import { MsalService} from "@azure/msal-angular";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'graph-tutorial';
  
  loggedIn : boolean;
  public user: any = null;
  private subscription: Subscription;
  public isIframe: boolean;

  constructor(
    private broadcastService: BroadcastService,
    private msalService: MsalService
  ) {
    this.isIframe = window !== window.parent && !window.opener;
    //this.adalService.init(this.secretService.adalConfig);
    //this is moved to app.module.ts
  }
  
  ngOnInit(): void {
    this.subscription = this.broadcastService.subscribe("msal:loginSuccess", 
      (payload) => {
        console.log("login success " + JSON.stringify(payload));    
        this.loggedIn = true;
        this.user = this.msalService.getUser();
      });  
  }
  
  ngOnDestroy() {
    // disconnect from broadcast service on component destroy
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }  
}
