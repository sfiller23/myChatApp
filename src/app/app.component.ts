import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'myChatApp';
  textDir: string = 'ltr';

  constructor(private translate: TranslateService){
    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
    {
      console.log(event.lang);
      if(event.lang == 'ar')
      {
        this.textDir = 'rtl';
      }
      else
      {
        this.textDir = 'ltr';
      }
    });
  }

  ngOnInit(){

  }



}
