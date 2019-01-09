import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PrepareJson provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  	*/
  @Injectable()
  export class ItineraryProvider {

  	constructor(public http: Http) {}

  	getItinerary(data){
  		var res = {
  			isValid : false,
  			currentItinerary : {
  				headers : [],
  				data : []
  			}
  		};

  		var div = document.createElement('div');
  		div.innerHTML = data._body;
  		let next : any;
  		let i : number;

  		//Reset data


  		// Get headers from data
  		if (!div.firstChild 
  			|| !div.firstChild.firstChild
  			|| !div.firstChild.firstChild.firstChild
  			|| !div.firstChild.firstChild.firstChild.firstChild )
  		{
  			return res;
  		}

  		next = div.firstChild.firstChild.firstChild.firstChild;
  		i = 0;

  		while (next != null){
  			res.currentItinerary.headers.push({
  				"index" : i,
  				"header" : "line_"+i,
  				"description" : next.innerHTML.replace(/(<([^>]+)>)/ig,"")
  			});			
  			next = next.nextSibling;
  			i++;
  		}

  		// Get data from each table
  		if (!div.firstChild.firstChild.lastChild
  			|| !div.firstChild.firstChild.lastChild.firstChild )
  		{
  			return res;
  		}

  		next = div.firstChild.firstChild.lastChild.firstChild;
  		i = 0;

  		let checkData  : any= false;

  		while (next != null){
  			let resJson = this.tableToJson( next.firstChild );
  			checkData  = resJson.length || checkData;
  			res.currentItinerary.data.push( resJson );
  			next = next.nextSibling;
  			i++;
  		}

  		if(checkData){
  			res.isValid = true;
  			return res;
  		}

  		return res;
  	}

  	tableToJson(table) {
  		var data = [];

  		// first row needs to be headers
  		var headers = ["time", "icon", "description"];

  		// go through cells
  		if ( !table.rows )
  		{
  			return [];
  		}

  		for (var i=0; i<table.rows.length; i++) {

  			var tableRow = table.rows[i];
  			var rowData = {};

  			for (var j=0; j<tableRow.cells.length; j++) {
  				if (j == 1 && tableRow.cells[j].innerHTML != "" ) {
  					rowData[ headers[j] ] = this.getIcon( tableRow.cells[j].innerHTML );
  				} else {
  					rowData[ headers[j] ] = tableRow.cells[j].innerHTML;
  				}
  			}

  			if ( rowData['description'] != "" ) {
  				data.push(rowData);
  			}
  		}       

  		return data;
  	}

  	getIcon( data ){
      let newIcons = [["ios-flag-outline", "ios-arrow-round-down", "ios-flag", "ios-flag-outline", "ios-bus-outline"],
                      ["ios-flag-outline", "ios-arrow-round-up",   "ios-flag", "ios-flag-outline", "ios-bus-outline"]];


      let regex = /<img.*?src="images\/(.*?).gif"/;
      let src = regex.exec(data);
      let index : any = src[1].slice(-1);

      let setIndex = src[1].charAt(1) == "i" ? 1 : 0;
      console.log();

  		if ( newIcons[setIndex][ index -1 ] != null && newIcons[setIndex][ index -1 ] != undefined  ) {
  			return newIcons[setIndex][ index -1];
  		}
  		return "alert";
  	}

  }
