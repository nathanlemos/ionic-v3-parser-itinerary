import { Component } from '@angular/core';
import { ViewController, NavParams, ToastController} from 'ionic-angular';
import { ItineraryProvider } from '../../providers/itinerary-provider';
import { ServiceProvider } from '../../providers/service-provider';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'page-itinerary-detail',
	templateUrl: 'itinerary-detail.html',
	providers: [ServiceProvider, ItineraryProvider]
})

export class ItineraryDetailPage {
	line : any;
	headers = [];
	data = [];
	currentHeader : any;
	currentHeaderIndex : any = 0;
	stops = [];
	lineInfo : any;
	isFavorited = false;
	favIcon = "star";

	constructor( private viewCtrl   : ViewController,
		private _navParams : NavParams,
		private itinerary  : ItineraryProvider,
		private toastCtrl  : ToastController,
		private service    : ServiceProvider,
		private storage	: Storage)
	{
		this.currentHeader 		= "line_0";
		this.line 				= _navParams.data.line;
		this.headers 			= _navParams.data.headers;
		this.currentHeaderIndex = 0;
		this.lineInfo 			= _navParams.data.headers[0].description;
		this.data 				= _navParams.data.data;
		this.stops 				= this.data[0];
		this.isFavorited		= _navParams.data.isFavorited;
		this.favIcon = this.isFavorited ? "star" : "star-outline";
	}

	dismiss(data)
	{
		this.viewCtrl.dismiss();
	}

	selectedTabChanged(ev)
	{
		this.currentHeaderIndex = ev.value.split('_')[1];
		this.lineInfo 			= this.headers[this.currentHeaderIndex].description;
		this.stops 				= this.data[this.currentHeaderIndex];
	}

	doRefresh(refresher)
	{
		let line = this.line;

		this.service.getItinerary(line).subscribe(
			data => {
				let res : any = this.itinerary.getItinerary(data);

				if ( !res.isValid ) {
					this.presentToast("Não houve resultados para a linha. Por favor, verifique o horário ou entre em contato com a empresa.");
				} else {
					this.data     = res.currentItinerary.data;
					this.lineInfo = res.currentItinerary.headers[this.currentHeaderIndex].description;
				}
				refresher.complete();
			},
			err => {
				this.presentToast("Houve um erro na aplicação. Cód: " + err)
				refresher.complete();
			})
	}

	simpleReload(){
		let line = this.line;

		this.service.getItinerary(line).subscribe(
			data => {
				let res : any = this.itinerary.getItinerary(data);

				if ( !res.isValid ) {
					this.presentToast("Não houve resultados para a linha. Por favor, verifique o horário ou entre em contato com a empresa.");
				} else {
					this.data     = res.currentItinerary.data;
					this.lineInfo = res.currentItinerary.headers[this.currentHeaderIndex].description;
				}
			},
			err => this.presentToast("Houve um erro na aplicação. Cód: " + err)
			)
	}

	presentToast(msg)
	{
		let toast = this.toastCtrl.create({
			message: msg,
			showCloseButton: true,
			closeButtonText: "Ok",
			duration: 3000
		});
		toast.present();
	}

	toggleFavorites(){
		if ( this.isFavorited )
		{
			this.removeFavorite( this.line.route_id );
		}
		else
		{
			this.addToFavorites();
		}
	}

	removeFavorite(id){
		this.storage.get('favorites').then((val) => {

			let res = JSON.parse(val);
			let favorites = res.data;
			
			let index = favorites.indexOf(id);
			if (index > -1) {
				favorites.splice(index, 1);
			}

			res.data = favorites;
			this.storage.set('favorites', JSON.stringify(res));

			this.isFavorited = false;
			this.favIcon = "star-outline";
			
		});
	}

	addToFavorites()
	{
		let id = this.line.route_id;
		let favs : any;

		this.storage.get('favorites').then((val) => {
			favs = JSON.parse( val );

			if ( favs == null 
				|| favs == undefined
				||favs.data == null 
				|| favs.data == undefined )
			{
				favs = { data : [] };
			}

			if ( favs.data.indexOf(id) == -1 ){
				this.isFavorited = true;
				this.favIcon = "star";
				favs.data.push(id);
			}

			this.storage.set('favorites', JSON.stringify(favs));
		});
		
	}
	
}
