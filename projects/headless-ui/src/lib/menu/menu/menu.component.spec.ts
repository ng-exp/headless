import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickDetectorService } from '@lib/utils';
import { Component } from '@angular/core';
import { MenuComponent } from '@lib/menu';
import { MenuModule } from '@ng-exp/headless-ui';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissingMenuItemsTestComponent],
      imports: [MenuModule],
      providers: [ClickDetectorService],
    }).compileComponents();
  });

  it('Menu without menu button should throw', () => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    expect(() => fixture.detectChanges()).toThrowError('<h-menu> must have a <h-menu-button> child.');
  });

  it('Menu without menu items should throw', () => {
    const localFixture = TestBed.createComponent(MissingMenuItemsTestComponent);
    expect(() => localFixture.detectChanges()).toThrowError('<h-menu> must have a <h-menu-items> child.');
  });
});

@Component({
  template: `
    <h-menu>
      <button hMenuButton>Some button</button>
    </h-menu>
  `,
})
class MissingMenuItemsTestComponent {}
