import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MenuComponent } from '../menu';
import { MenuModule } from '../menu.module';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClickDetectorService } from '@ngexp/headless-ui';
import { getTestScheduler } from 'jasmine-marbles';

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
class TestWrapperComponent {}

describe('MenuComponent', () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;
  let menu: DebugElement;
  let service: ClickDetectorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWrapperComponent],
      imports: [MenuModule],
      providers: [ClickDetectorService],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestWrapperComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(ClickDetectorService);
        fixture.detectChanges();
      });
  });

  beforeEach(() => {
    menu = fixture.debugElement.query(By.directive(MenuComponent));
  });

  it('should create an instance', () => {
    expect(menu).toBeTruthy();
  });

  it('menu should be closed', () => {
    expect(menu.componentInstance.menuIsOpen).toBeFalse();
  });

  it('menu should be open', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    expect(menu.componentInstance.menuIsOpen).toBeTrue();
  });

  it('should be closed after clicking twice', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    button.click();

    expect(menu.componentInstance.menuIsOpen).toBeFalse();
  });

  it('should stay open when clicked inside', fakeAsync(() => {
    const button = fixture.debugElement.query(By.css('button'));

    menu.componentInstance.openMenu();

    fixture.detectChanges();
    getTestScheduler().flush();

    service.clickEvent$.next(button.nativeElement);
    service.clickEvent$.next(menu.componentInstance._menuItemsComponent.elementRef.nativeElement);
    service.clickEvent$.next(menu.componentInstance._menuItemsComponent._menuItemComponentList.first.elementRef.nativeElement);

    tick();
    fixture.detectChanges();

    expect(menu.componentInstance.menuIsOpen).toBeTrue();
  }));

  it('should close when clicked outside', fakeAsync(() => {
    menu.componentInstance.openMenu();
    tick();
    expect(menu.componentInstance.menuIsOpen).toBeTrue();

    service.clickEvent$.next(document);
    tick();
    expect(menu.componentInstance.menuIsOpen).toBeFalse();
  }));
});
