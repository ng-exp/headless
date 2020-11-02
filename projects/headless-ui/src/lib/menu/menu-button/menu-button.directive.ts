import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[hMenuButton]',
})
export class MenuButtonDirective {
  @Output() readonly buttonClick = new EventEmitter<Event>();

  /** A11y settings */
  @HostBinding('attr.aria-haspopup') _ariaHasPopup = 'listbox';

  /** Listen and inform the menu component when the button is pressed. */
  @HostListener('click', ['$event']) onClick(event: Event) {
    this.buttonClick.next(event);
  }
}
