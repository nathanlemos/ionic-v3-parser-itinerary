import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, PopoverController, LoadingController, ToastController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service-provider';
import { NewsMenuPage } from '../news-menu/news-menu';

declare var X2JS : any;


@Component({
	selector: 'page-contact',
	templateUrl: 'contact.html',
	providers: [ServiceProvider]

})

export class ContactPage implements OnInit{
	@ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
	@ViewChild('popoverText', { read: ElementRef }) text: ElementRef;

	category : any = {
		name : "Geral",
		url  : "geral.rss"
	};

	news : any = [];
	x2js : any = new X2JS();
	isRefreshing = false;

	constructor(public navCtrl: NavController, 
		private service: ServiceProvider,
		public loadingCtrl: LoadingController, 
		public popoverCtrl: PopoverController,
		public toastCtrl: ToastController) 
	{

	}

	ngOnInit() {
		this.getDataFromCategory(this.category);
	}

	prepareData(data){
		let res = this.x2js.xml_str2json( data._body );
		return res.rss.channel.item;
	}

	presentPopover(ev) {
		let popover = this.popoverCtrl.create(NewsMenuPage, {
			category: this.category
		});

		popover.present({
			ev: ev
		});

		popover.onDidDismiss((category) => {
			
			if( category != null && category != undefined && category !=  "")
			{
				this.category = category;
				this.getDataFromCategory(category);
			}

		})
	}

	presentLoadingDefault(category) {
		if( category != null && category != undefined && category != "" )
		{
			let loading = this.loadingCtrl.create({
				content: 'Carregando notícias em '+category.name
			});

			loading.present();
			return loading;
		}
	}

	getDataFromCategory(category){
		if( category != null && category != undefined )
		{
			this.isRefreshing = true;
			this.news = [];
			let loading = this.presentLoadingDefault(category);
			this.service.getNews(category.url).subscribe(
				data => {
					this.news = this.prepareData( data );
					this.isRefreshing = false;
					loading.dismiss();

				}, err => {
					this.presentToast("Houve um erro na aplicação. Cód: " + err);
					this.isRefreshing = false;
					loading.dismiss();
				});
		}
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