import {
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MenuButtonDirective } from '@lib/menu/menu-button';
import { delay } from 'rxjs/operators';
import { ClickDetectorService } from '@lib/utils';

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
    this.isActive = true;
  }

  constructor(private elementRef: ElementRef, @Inject(forwardRef(() => MenuItemsComponent)) private parent: MenuItemsComponent) {}

  /** Focus the component */
  focus() {
    this.isActive = true;
    this.elementRef.nativeElement.focus();
  }
}

@Component({
  selector: 'h-menu-items',
  templateUrl: './menu-items.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MenuItemsComponent implements OnDestroy {
  /** This observable tells menu what state it needs to be in, open or closed. */
  openMenu$ = new Subject<boolean>();
  private openMenuSub = this.openMenu$.pipe(delay(0)).subscribe((open) => {
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
  private activeMenuItem = 0;

  @ContentChildren(MenuItemComponent) _menuItemComponentList: QueryList<MenuItemComponent>;

  /** A11y settings */
  @HostBinding('attr.role') _role = 'listbox';

  /** Make it focusable */
  @HostBinding('attr.tabindex') _tabindex = -1;

  /** Handles up/down home/end keys and locks the tab key to the menu item */
  @HostListener('keydown', ['$event']) _keydown(event: KeyboardEvent) {
    this.menuItemGotFocus(null);
    this.directionKeys(event);
    this.focusLockWithTabKey(event);
    const selected = this._menuItemComponentList.filter((element, index) => this.activeMenuItem === index);
    if (selected.length === 1) {
      selected[0].focus();
    }
  }

  constructor(private elementRef: ElementRef, @Inject(forwardRef(() => MenuComponent)) private parent: MenuComponent) {}

  ngOnDestroy(): void {
    if (this.openMenuSub) {
      this.openMenuSub.unsubscribe();
    }
  }

  /** Select new activeMenuItem based on movement key */
  directionKeys(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        this.activeMenuItem += 1;
        if (this.activeMenuItem >= this._menuItemComponentList.length) {
          this.activeMenuItem = 0;
        }
        break;

      case 'ArrowUp':
        this.activeMenuItem -= 1;
        if (this.activeMenuItem < 0) {
          this.activeMenuItem = this._menuItemComponentList.length - 1;
        }
        break;

      case 'Home':
        this.activeMenuItem = 0;
        break;

      case 'End':
        this.activeMenuItem = this._menuItemComponentList.length - 1;
        break;
    }
  }

  /** Lock tabbing inside the list, if tab key would leave the component, prevent and select first/last item instead. */
  focusLockWithTabKey(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      if (event.shiftKey && this.activeMenuItem === 0) {
        event.preventDefault();
        this.activeMenuItem = this._menuItemComponentList.length - 1;
      } else if (!event.shiftKey && this.activeMenuItem === this._menuItemComponentList.length - 1) {
        event.preventDefault();
        this.activeMenuItem = 0;
      }
    }
  }

  /** Child component informs us that it received focus */
  menuItemGotFocus(menuItem: MenuItemComponent) {
    this._menuItemComponentList.forEach((element, index) => {
      if (element === menuItem) {
        this.activeMenuItem = index;
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
  /** True if the menu is open. */
  menuIsOpen = false;
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
      this.menuIsOpen = !this.menuIsOpen;
      this._menuItemsComponent.openMenu$.next(this.menuIsOpen);
      if (this.menuIsOpen) {
        // Global click events, if the click target is outside of us, close the menu.
        this.clickDetectorSub = this.clickDetectorService.clickEvent$.subscribe((target) => {
          if (!this.elementRef.nativeElement.contains(target)) {
            this.closeMenu();
          }
        });
      } else {
        // When the menu is closed, unsubscribe to global click events for performance.
        this.clickDetectorSub.unsubscribe();
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

  closeMenu() {
    this.menuIsOpen = false;
    this._menuItemsComponent.openMenu$.next(false);
  }
}
