import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AnalyticSession } from './models/analytic-session';
import { HttpClient  } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './environment/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'dynastyanalytics';
  sessionId= "4Bo8jk0MUdEPIkbJ/A4e0vJ8gvVR_PuP2M";
  analyticSession : AnalyticSession;
  platform = "STC";
  userId: string;
  fullName: string;
  userName: string;
  intervalObj:any;
  /**
   *
   */
  constructor(private http:HttpClient,
    private router : Router) {

  }

  ngOnInit(): void { 
    this.checkSaveLocalStorageId(this);
    this.intervalObj = setInterval(()=> {this.checkSaveLocalStorageId(this)}, environment.analyticSessionFreqTimeSec * 1000);
  }

  checkSaveLocalStorageId(context):void{
    let strAnalyticSession = localStorage.getItem(environment.analyticSessionKey);
    if(strAnalyticSession){
      console.log("Session Found", strAnalyticSession);
      context.logSession();
      context.analyticSession = JSON.parse(strAnalyticSession);
      let maxIgnoredTimeForAnalytics = new Date(new Date(context.analyticSession.updatedOn).getTime() + environment.maxAllowedMinutesForBeatSkipMinutes*60000);
      if(maxIgnoredTimeForAnalytics>=new Date()){
        context.analyticSession.updatedOn = new Date();
        localStorage.setItem(environment.analyticSessionKey, JSON.stringify(context.analyticSession));
        console.log("Session changed on:", context.analyticSession.updatedOn);
      } else {        
        console.log("Session found but time expirted");
        context.createSession(context);
      }
    } else {
      console.log("Session not found");
      context.createSession(context);
    }
  }
  checkSaveSessionId():void{
    let analyticSession = sessionStorage.getItem(environment.analyticSessionKey);
    if(analyticSession){
      console.log("Session Found", analyticSession);
    } else {
      console.log("Session not found", analyticSession);
      sessionStorage.setItem(environment.analyticSessionKey,this.sessionId);
    }
  }
  createSession(context):void{
    context.analyticSession = new AnalyticSession();
    context.analyticSession.createdOn = new Date();
    context.analyticSession.updatedOn = context.analyticSession.createdOn;
    context.analyticSession.pageUrl =  context.router.url;
    context.analyticSession.platform = context.platform;
    context.analyticSession.sessionId = context.sessionId;
    context.analyticSession.userId = context.userId;
    context.analyticSession.fullName = context.fullName;
    context.analyticSession.userName = context.userName;
    localStorage.setItem(environment.analyticSessionKey, JSON.stringify(context.analyticSession));
  }
  logSession():void{

  }
}
