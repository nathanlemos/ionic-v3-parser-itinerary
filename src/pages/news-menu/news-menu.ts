import { NavController, ViewController, NavParams } from 'ionic-angular/index';
import { Component } from "@angular/core";
/*
  Generated class for the NewsMenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
  	selector: 'page-news-menu',
  	templateUrl: 'news-menu.html'
  })
  export class NewsMenuPage {
  	category : any;
    callback : any;

    categories = [
    { name : 'Capa', url : 'noticias.rss'},
    { name : 'Geral', url : 'geral.rss'},
    { name : 'Cidade', url : 'cidade.rss'},
    { name : 'Variedades', url : 'variedades.rss'},
    { name : 'Esporte', url : 'esporte.rss'},
    { name : 'Polícia', url : 'policia.rss'},
    { name : 'Política', url : 'politica.rss'},
    { name : 'Saúde', url : 'saude.rss'}
    ];

    constructor(private nav: NavController, private params: NavParams, private viewCtrl: ViewController) {
      this.callback = this.params.get('cb')
    }

    ionViewDidLoad() {}

    ngOnInit() {
      if (this.params.data) {
        this.category = this.params.data.category;
      }
    }

    selectNewsCategory(category){
      this.close(category);
    }

    close(category) {
      this.viewCtrl.dismiss(category);
    }

  }
