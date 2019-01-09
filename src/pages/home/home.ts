import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, NavController, ModalController, ToastController, Tab, Searchbar } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service-provider';
import { ItineraryProvider } from '../../providers/itinerary-provider';
import { ItineraryDetailPage } from '../itinerary-detail/itinerary-detail';
import { Storage } from '@ionic/storage';

import { AppLiterals } from '../../strings/app-literals-constants';


//import { AppLiterals } from '../../strings/app-literals-constants';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [ServiceProvider, ItineraryProvider]
})

export class HomePage implements OnInit{
	@ViewChild('searchbar') searchbar:Searchbar;

	routes : any = [];
	route_count : any = [];
	searchQuery : any = "";
	isSearching : any = "";
	tabIndex = 0;
	favorites = [];
	lit = AppLiterals;

	viewTitle = ["Linhas de Uberaba", "Favoritos"];



	constructor( public navCtrl: NavController, 
		public service : ServiceProvider, 
		public itinerary : ItineraryProvider,
		public modalCtrl: ModalController, 
		public loadingCtrl: LoadingController, 
		public toastCtrl: ToastController,
		public tab : Tab,
		private storage	: Storage) {
		this.tabIndex = tab.index;

		this.updateFavorites(false);

	}

	ionViewDidLeave(){
		if ( this.tabIndex == 0 && this.isSearching )
		{
			this.searchHeader();
		}
	}

	ionViewDidEnter() {		
		this.updateFavorites(false);
	}

	checkFavorites(id){
		return this.favorites.indexOf(id);
	}

	updateFavorites(showLoad = true){
		this.storage.get('favorites').then((val) => {
			let res = JSON.parse(val);
			
			if(res != undefined && res != null && res.data != undefined && res.data != null){
				this.favorites = res.data;
			}
			if (showLoad) this.presentToast("Seus favoritos foram atualizados")
		});
	}

	removeFavorite(id){
		this.storage.get('favorites').then((val) => {
			let res = JSON.parse(val);
			let index = this.favorites.indexOf(id);
			if (index > -1) {
				this.favorites.splice(index, 1);
			}

			res.data = this.favorites;
			this.storage.set('favorites', JSON.stringify(res));
		});
	}

	initializeItems(){
		return this.routes;
	}

	ngOnInit(){
		this.getLines();
	}

	getLines(){
		this.service.getLines().subscribe(
			data => {
				this.routes = this.route_count = data;
			},
			err => this.presentToast("Houve um erro na aplicação. Cód: " + err)
			)
	}

	getItinerary(line, loading){
		this.service.getItinerary(line).subscribe(
			data => {
				let res = this.itinerary.getItinerary(data);

				if ( !res.isValid ) {
					this.presentToast("Não houve resultados para a linha. Por favor, verifique o horário ou entre em contato com a empresa.");
				} else {
					let modal = this.modalCtrl.create(ItineraryDetailPage, {
						line		: line,
						headers		: res.currentItinerary.headers,
						data 		: res.currentItinerary.data,
						isFavorited : ( this.checkFavorites(line.route_id) > -1 )
					});

					modal.onDidDismiss(data => {
						this.updateFavorites(false);
					});


					modal.present();
				}
				loading.dismiss();
			},
			err => {
				this.presentToast("Houve um erro na aplicação. Cód: " + err);
				loading.dismiss();
			})		

	}


	detail(line){
		let loading = this.presentLoadingDefault(line.route_description);
		this.getItinerary(line, loading);
	}

	getItems(searchbar) {
		var q = this.searchQuery;
		if (!q) {
			this.routes = this.route_count;
			return;
		}

		this.routes = this.route_count.filter((v) => {
			if(v.route_description && q) {
				if (v.route_description.toLowerCase().indexOf(q.toLowerCase()) > -1 
					|| v.route_id.toLowerCase().indexOf(q.toLowerCase()) > -1 
					|| q == "") {
					return true;
			}
			return false;
		}
	});
	}

	presentLoadingDefault(lineDesc) {
		let loading = this.loadingCtrl.create({
			content: 'Buscando itinerário da linha '+lineDesc
		});

		loading.present();
		return loading;
	}

	searchHeader() {
		this.isSearching = !this.isSearching;
		if ( this.isSearching )
		{
			setTimeout(() => {
				this.searchbar.setFocus();
			});
		}
		this.searchQuery = "";
		this.getLines();
	}

	presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			showCloseButton: true,
			closeButtonText: "Ok",
			duration: 3000
		});
		toast.present();
	}	
}
