import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuExampleComponent } from './menu-example/menu-example.component';
import { MenuModule } from '@ng-exp/headless-ui';

@NgModule({
  declarations: [AppComponent, MenuExampleComponent],
  imports: [BrowserModule, AppRoutingModule, MenuModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
