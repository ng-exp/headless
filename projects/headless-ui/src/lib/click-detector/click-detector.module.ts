import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickDetectorDirective } from './directive';
import { ClickDetectorService } from './service';

@NgModule({
  declarations: [ClickDetectorDirective],
  imports: [CommonModule],
  exports: [ClickDetectorDirective],
  providers: [ClickDetectorService],
})
export class ClickDetectorModule {}
