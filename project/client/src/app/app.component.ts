import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './core/services/user.service';
import { ConstantService } from './core/services/constant.service';
import { LolChallengeService } from 'src/app/core/services/lolchallenge.service';
import * as _ from "lodash";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'lolsilver';
  selectedCar: string = 'en';
  laplataSettings: any;
  languages = [
   { name:'Amharic'	,code:'am'},
	{ name:'Arabic'	,code:'ar'},
	{ name:'Basque'	,code:'eu'},
	{ name:'Bengali'	,code:'bn'},
	{ name:'Portuguese'	,code:'pt-BR'},
	{ name:'Bulgarian'	,code:'bg'},
	{ name:'Catalan'	,code:'ca'},
	{ name:'Cherokee'	,code:'chr'},
	{ name:'Croatian'	,code:'hr'},
	{ name:'Czech'	,code:'cs'},
	{ name:'Danish'	,code:'da'},
	{ name:'Dutch'	,code:'nl'},
	{ name:'Estonian'	,code:'et'},
	{ name:'Filipino'	,code:'fil'},
	{ name:'Finnish'	,code:'fi'},
	{ name:'French'	,code:'fr'},
	{ name:'German'	,code:'de'},
	{ name:'Greek'	,code:'el'},
	{ name:'Gujarati'	,code:'gu'},
	{ name:'Hebrew'	,code:'iw'},
	{ name:'Hindi'	,code:'hi'},
	{ name:'Hungarian'	,code:'hu'},
	{ name:'Icelandic'	,code:'is'},
	{ name:'Indonesian'	,code:'id'},
	{ name:'Italian'	,code:'it'},
	{ name:'Japanese'	,code:'ja'},
	{ name:'Kannada'	,code:'kn'},
	{ name:'Korean'	,code:'ko'},
	{ name:'Latvian'	,code:'lv'},
	{ name:'Lithuanian'	,code:'lt'},
	{ name:'Malay'	,code:'ms'},
	{ name:'Malayalam'	,code:'ml'},
	{ name:'Marathi'	,code:'mr'},
	{ name:'Norwegian'	,code:'no'},
	{ name:'Polish'	,code:'pl'},
	{ name:'Portuguese'	,code:'pt-PT'},
	{ name:'Romanian'	,code:'ro'},
	{ name:'Russian'	,code:'ru'},
	{ name:'Serbian'	,code:'sr'},
	{ name:'Chinese'	,code:'zh-CN'},
	{ name:'Slovak'	,code:'sk'},
	{ name:'Slovenian'	,code:'sl'},
	{ name:'Spanish'	,code:'es'},
	{ name:'Swahili'	,code:'sw'},
	{ name:'Swedish'	,code:'sv'},
	{ name:'Tamil'	,code:'ta'},
	{ name:'Telugu'	,code:'te'},
	{ name:'Thai'	,code:'th'},
	{ name:'Chinese'	,code:'zh-TW'},
	{ name:'Turkish'	,code:'tr'},
	{ name:'Urdu'	,code:'ur'},
	{ name:'Ukrainian'	,code:'uk'},
	{ name:'Vietnamese'	,code:'vi'},
	{ name:'Welsh'	,code:'cy'}

  ];

  constructor(private router: Router, private userService: UserService, private constantService: ConstantService, private lolChallengeService: LolChallengeService) { }

  ngOnInit(): void {
    // TODO get App context
    // TODO get App constants
    this.constantService.populate();
    this.userService.populate();
    this.getLaplataSettings();
  }

  getLaplataSettings() {
    this.lolChallengeService.getlaplatastats()
      .subscribe(response => {
        console.log("getlaplata", response.data[0]);
        sessionStorage.setItem('laplatasettings', JSON.stringify(response.data[0]));
      });
  }

  changeonSelect() {
    var lang = this.selectedCar
    let languageSelect: any = document.querySelector("select.goog-te-combo");
    if (languageSelect) {
      languageSelect.value = lang;
      languageSelect.dispatchEvent(new Event("change"));
    }
  }
  SelectValue(code: string) {
    var lang = code
    let languageSelect: any = document.querySelector("select.goog-te-combo");
    if (languageSelect) {
      languageSelect.value = lang;
      languageSelect.dispatchEvent(new Event("change"));
    }
  }
}
