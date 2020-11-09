import {
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MenuButtonDirective } from '../menu-button';
import { ClickDetectorService } from '../../click-detector';

@Component({
  selector: 'h-menu-item',
  templateUrl: './menu-item.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MenuItemComponent {
  /** Set to true if this is the currently focused item */
  isActive = false;

  /** Make it focusable */
  @HostBinding('attr.tabindex') _tabindex = 0;

  /** Update the parent menu items component with info that it got the focus. */
  @HostListener('focus') _focus() {
    this.parent.menuItemGotFocus(this);
  }

  constructor(private elementRef: ElementRef, @Inject(forwardRef(() => MenuItemsComponent)) private parent: MenuItemsComponent) {}

  /** Focus the component */
  focus() {
    this.elementRef.nativeElement.focus();
  }
}

@Component({
  selector: 'h-menu-items',
  templateUrl: './menu-items.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MenuItemsComponent implements OnInit, OnDestroy {
  /** This subscription listens to the parent if the menu should be opened or closed. */
  private _openStateSub: Subscription;
  private _activeMenuItem = null;

  @ContentChildren(MenuItemComponent) _menuItemComponentList: QueryList<MenuItemComponent>;

  /** A11y settings */
  @HostBinding('attr.role') _role = 'listbox';

  /** Make it focusable */
  @HostBinding('attr.tabindex') _tabindex = -1;

  /** Handles up/down home/end keys and locks the tab key to the menu item */
  @HostListener('keydown', ['$event']) _keydown(event: KeyboardEvent) {
    let currentMenuItem = this._activeMenuItem;
    currentMenuItem = this.directionKeys(event, currentMenuItem);
    currentMenuItem = this.focusLockWithTabKey(event, currentMenuItem);
    if (currentMenuItem === this._activeMenuItem) {
      return;
    }

    const selected = this._menuItemComponentList.filter((element, index) => currentMenuItem === index);
    if (selected.length === 1) {
      // The menuItem will inform us when it got focus so we can update the activeMenuItem.
      selected[0].focus();
    }
  }

  constructor(private elementRef: ElementRef, @Inject(forwardRef(() => MenuComponent)) private parent: MenuComponent) {}

  ngOnInit(): void {
    this._openStateSub = this.parent?.openState.pipe(delay(0)).subscribe((open) => {
      if (open) {
        if (this._menuItemComponentList.length > 0) {
          this._menuItemComponentList.first.focus();
        } else {
          this.focus();
        }
      } else {
        this.menuItemGotFocus(null);
      }
    });
  }

  ngOnDestroy(): void {
    this._openStateSub?.unsubscribe();
  }

  /** Select new activeMenuItem based on movement key */
  directionKeys(event: KeyboardEvent, currentMenuItem): number {
    switch (event.key) {
      case 'ArrowDown':
        currentMenuItem += 1;
        if (currentMenuItem >= this._menuItemComponentList.length) {
          currentMenuItem = 0;
        }
        break;

      case 'ArrowUp':
        currentMenuItem -= 1;
        if (currentMenuItem < 0) {
          currentMenuItem = this._menuItemComponentList.length - 1;
        }
        break;

      case 'Home':
        currentMenuItem = 0;
        break;

      case 'End':
        currentMenuItem = this._menuItemComponentList.length - 1;
        break;
    }

    return currentMenuItem;
  }

  /** Lock tabbing inside the list, if tab key would leave the component, prevent and select first/last item instead. */
  focusLockWithTabKey(event: KeyboardEvent, currentMenuItem: number): number {
    if (event.key === 'Tab') {
      if (event.shiftKey && currentMenuItem === 0) {
        event.preventDefault();
        currentMenuItem = this._menuItemComponentList.length - 1;
      } else if (!event.shiftKey && currentMenuItem === this._menuItemComponentList.length - 1) {
        event.preventDefault();
        currentMenuItem = 0;
      }
    }

    return currentMenuItem;
  }

  /** Child component informs us that it received focus */
  menuItemGotFocus(menuItem: MenuItemComponent) {
    this._activeMenuItem = null;
    this._menuItemComponentList.forEach((element, index) => {
      if (element === menuItem) {
        element.isActive = true;
        this._activeMenuItem = index;
      } else {
        element.isActive = false;
      }
    });
  }

  /** Focus the component */
  focus() {
    this.elementRef.nativeElement.focus();
  }
}

@Component({
  selector: 'h-menu',
  templateUrl: './menu.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements AfterViewInit, OnDestroy {
  @Output() openState = new EventEmitter<boolean>();

  /** True if the menu is open. */
  private _menuIsOpen = false;
  get menuIsOpen(): any {
    return this._menuIsOpen;
  }

  /** Subscription to the buttonDirective for clicks. */
  private buttonClickSub: Subscription;
  /** Subscription to the click detector service for global clicks. */
  private clickDetectorSub: Subscription;

  @ContentChild(MenuButtonDirective) _menuButtonDirective: MenuButtonDirective;
  @ContentChild(MenuItemsComponent) _menuItemsComponent: MenuItemsComponent;

  /** Close the menu if the user clicks escape. */
  @HostListener('keydown', ['$event']) _keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  constructor(private elementRef: ElementRef, private clickDetectorService: ClickDetectorService) {}

  ngAfterViewInit(): void {
    if (!this._menuButtonDirective) {
      throw new Error('<h-menu> must have a <h-menu-button> child.');
    }
    if (!this._menuItemsComponent) {
      throw new Error('<h-menu> must have a <h-menu-items> child.');
    }

    // Handle click events from the buttonDirective to handle the open state of the menu.
    this.buttonClickSub = this._menuButtonDirective.buttonClick.subscribe(() => {
      if (this.menuIsOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.buttonClickSub) {
      this.buttonClickSub.unsubscribe();
    }
    if (this.clickDetectorSub) {
      this.clickDetectorSub.unsubscribe();
    }
  }

  openMenu() {
    if (this._menuIsOpen) {
      return;
    }
    this._menuIsOpen = true;
    this.openState.emit(true);

    // Subscribe to global click events, if the click target is outside of us, close the menu.
    this.clickDetectorSub = this.clickDetectorService.clickEvent$.subscribe((target) => {
      if (!this.elementRef.nativeElement.contains(target)) {
        this.closeMenu();
      }
    });
  }

  closeMenu() {
    if (!this._menuIsOpen) {
      return;
    }
    this._menuIsOpen = false;
    this.openState.emit(false);
    // When the menu is closed, unsubscribe to global click events for performance.
    this.clickDetectorSub.unsubscribe();
  }
}
