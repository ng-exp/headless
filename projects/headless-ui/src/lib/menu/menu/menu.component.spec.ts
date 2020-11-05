import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ClickDetectorService } from '../../click-detector';
import { Component, DebugElement } from '@angular/core';
import { MenuComponent } from '../menu';
import { MenuModule } from '../menu.module';
import { By } from '@angular/platform-browser';

describe('MenuComponent', () => {
  describe('failing menus that throws', () => {
    let fixture: ComponentFixture<MenuComponent>;
    let component: MenuComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [MissingMenuItemsTestComponent],
        imports: [MenuModule],
        providers: [ClickDetectorService],
      }).compileComponents();
    });

    it('menu without h-menu-button should throw', () => {
      fixture = TestBed.createComponent(MenuComponent);
      component = fixture.componentInstance;
      expect(() => fixture.detectChanges()).toThrowError('<h-menu> must have a <h-menu-button> child.');
    });

    it('menu without h-menu-items should throw', () => {
      const localFixture = TestBed.createComponent(MissingMenuItemsTestComponent);
      expect(() => localFixture.detectChanges()).toThrowError('<h-menu> must have a <h-menu-items> child.');
    });
  });

  describe('standard menu setup', () => {
    let fixture: ComponentFixture<DefaultMenuSetupTestComponent>;
    let debugComponent: DebugElement;
    let component: DefaultMenuSetupTestComponent;
    let menu: DebugElement;
    let button: DebugElement;
    let service: ClickDetectorService;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [DefaultMenuSetupTestComponent],
        imports: [MenuModule],
        providers: [ClickDetectorService],
      }).compileComponents();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(DefaultMenuSetupTestComponent);
      debugComponent = fixture.debugElement;
      component = fixture.componentInstance;
      menu = fixture.debugElement.query(By.directive(MenuComponent));
      button = fixture.debugElement.query(By.css('button'));
      service = TestBed.inject(ClickDetectorService);
      fixture.detectChanges();
    });

    it('should open menu when button is clicked', () => {
      button.nativeElement.click();
      fixture.detectChanges();
      expect(menu.componentInstance.menuIsOpen).toBeTrue();
    });

    it('should focus on first item when menu opens', fakeAsync(() => {
      button.nativeElement.click();
      tick();
      fixture.detectChanges();
      expect(menu.componentInstance._menuItemsComponent._menuItemComponentList.first.isActive).toBeTrue();
    }));

    it('should stay open when clicked inside', fakeAsync(() => {
      menu.componentInstance.menuIsOpen = true;

      tick();
      fixture.detectChanges();

      service.clickEvent$.next(button.nativeElement);
      service.clickEvent$.next(menu.componentInstance._menuItemsComponent.elementRef.nativeElement);
      service.clickEvent$.next(menu.componentInstance._menuItemsComponent._menuItemComponentList.first.elementRef.nativeElement);

      tick();
      fixture.detectChanges();

      expect(menu.componentInstance.menuIsOpen).toBeTrue();
    }));

    it('should close when clicked outside', fakeAsync(() => {
      button.nativeElement.click();
      tick();
      expect(menu.componentInstance._menuItemsComponent._menuItemComponentList.first.isActive).toBeTrue();
      service.clickEvent$.next(null);
      tick();
      expect(menu.componentInstance._menuItemsComponent._menuItemComponentList.first.isActive).toBeFalse();
    }));
  });
});

@Component({
  template: `
    <h-menu>
      <button hMenuButton>button</button>
    </h-menu>
  `,
})
class MissingMenuItemsTestComponent {}

@Component({
  template: `
    <h-menu>
      <button hMenuButton>button</button>
      <h-menu-items>
        <h-menu-item>Item 1</h-menu-item>
        <h-menu-item>Item 2</h-menu-item>
        <h-menu-item>Item 3</h-menu-item>
      </h-menu-items>
    </h-menu>
  `,
})
class DefaultMenuSetupTestComponent {}
