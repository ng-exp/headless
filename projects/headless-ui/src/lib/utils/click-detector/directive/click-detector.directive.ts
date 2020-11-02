import { Directive, HostListener } from '@angular/core';
import { ClickDetectorService } from '../service';

@Directive({
  selector: '[hClickDetector]',
})
export class ClickDetectorDirective {
  @HostListener('click', ['$event']) clicked(event: Event) {
    this.clickDetectorService.clickEvent$.next(event.target);
  }

  constructor(private clickDetectorService: ClickDetectorService) {}
}
