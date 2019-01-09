import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';

import {NavParams} from 'ionic-angular';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {
	// this tells the tabs component which Pages
	// should be each tab's root Page
	tab1Root: any = HomePage;
	tab2Root: any = HomePage;
	tab3Root: any = ContactPage;
	currentTab =0;
	
	constructor(
		private params: NavParams) {

	}

	tabSelected(tab) {
		this.currentTab =  tab.index;
	}

	getCurrentTab(){
		return this.currentTab;
	}
}
