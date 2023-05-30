import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // import HttpClientModule
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module'; // import the routing module

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule // add the routing module to imports
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
