import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuExampleComponent } from './menu-example/menu-example.component';
import { MenuModule } from '@ngexp/headless-ui';
import { TabsExampleComponent } from './tabs-example/tabs-example.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [AppComponent, MenuExampleComponent, TabsExampleComponent, SidebarComponent],
  imports: [BrowserModule, AppRoutingModule, MenuModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
