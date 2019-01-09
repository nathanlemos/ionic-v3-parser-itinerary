import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {AppSettings} from '../strings/app-settings-constants';
import 'rxjs/add/operator/map';

@Injectable()
export class ServiceProvider {
  linhas : any = {};

  constructor(public http: Http) {}
  getLines(){
    return this.linhas = this.http.get(AppSettings.API_ROUTES_ENDPOINT).map(res => res.json());
  }

  getItinerary(line){
    let milliseconds = (new Date).getTime();
    let lineId = line.route_id;
    let res = this.linhas = this.http.get(AppSettings.API_ITINERARY_ENDPOINT +'?prefix=z&codlinha='+lineId+'&city=UBEN&d='+milliseconds).map(res => res); 

    return res;
  }

  getNews(category){
    return this.linhas = this.http.get(AppSettings.API_NEWS_ENDPOINT +category);
  }

}
