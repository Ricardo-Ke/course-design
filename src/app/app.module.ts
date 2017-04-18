import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HotWordsComponent } from './home/hot-words/hot-words.component';
import { TissueOrganismComponent } from './home/tissue-organism/tissue-organism.component';
import { ReposOmicsComponent } from './home/repos-omics/repos-omics.component';

import { DatasetService } from './service/dataset.service';
import { AppConfig } from './app.config';

@NgModule({
  declarations: [
    AppComponent,
    HotWordsComponent,
    TissueOrganismComponent,
    ReposOmicsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    DatasetService,
    AppConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
