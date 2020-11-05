import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickDetectorModule, ClickDetectorService } from '../click-detector';
import { MenuButtonDirective, MenuComponent, MenuItemComponent, MenuItemsComponent } from '.';

@NgModule({
  declarations: [MenuComponent, MenuButtonDirective, MenuItemComponent, MenuItemsComponent],
  imports: [CommonModule, ClickDetectorModule],
  providers: [ClickDetectorService],
  exports: [MenuComponent, MenuButtonDirective, MenuItemComponent, MenuItemsComponent, ClickDetectorModule],
})
export class MenuModule {}
