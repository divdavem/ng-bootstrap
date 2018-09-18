import {ComponentFixture, inject, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {createGenericTestComponent, createKeyEvent} from '../test/common';
import {Key} from '../util/key';

import {ChangeDetectionStrategy, Component} from '@angular/core';

import {NgbDropdownModule} from './dropdown.module';
import {NgbDropdownConfig} from './dropdown-config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getDropdownEl(tc) {
  return tc.querySelector(`[ngbDropdown]`);
}

function getMenuEl(tc) {
  return tc.querySelector(`[ngbDropdownMenu]`);
}

function createFakeEscapeKeyUpEvent(): Event {
  return createKeyEvent(Key.Escape);
}

const jasmineMatchers = {
  toBeShown: function(util, customEqualityTests) {
    return {
      compare: function(actual, content?, selector?) {
        const dropdownEl = getDropdownEl(actual);
        const menuEl = getMenuEl(actual);
        const isOpen = dropdownEl.classList.contains('show') && menuEl.classList.contains('show');

        return {
          pass: isOpen,
          message: `Expected ${actual.outerHTML} to have the "show class on both container and menu"`
        };
      },
      negativeCompare: function(actual) {
        const dropdownEl = getDropdownEl(actual);
        const menuEl = getMenuEl(actual);
        const isClosed = !dropdownEl.classList.contains('show') && !menuEl.classList.contains('show');

        return {
          pass: isClosed,
          message: `Expected ${actual.outerHTML} not to have the "show class both container and menu"`
        };
      }
    };
  }
};

describe('ngb-dropdown', () => {

  beforeEach(() => {
    jasmine.addMatchers(jasmineMatchers);
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDropdownModule]});
  });

  it('should be closed and down by default', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(compiled).not.toBeShown();
  });

  it('should have dropup CSS class if placed on top', () => {
    const html = `
      <div ngbDropdown placement="top">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
  });

  it('should have dropdown CSS class if placement is other than top', () => {
    const html = `
      <div ngbDropdown placement="bottom">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getDropdownEl(compiled)).toHaveCssClass('dropdown');
  });

  it('should have x-placement attribute reflecting placement', () => {
    const html = `
      <div ngbDropdown placement="bottom-right">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getMenuEl(compiled).getAttribute('x-placement')).toBe('bottom-right');
  });

  it('should be open initially if open expression is true', () => {
    const html = `
      <div ngbDropdown [open]="true">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(compiled).toBeShown();
  });

  it('should toggle open on "open" binding change', () => {
    const html = `
      <div ngbDropdown [open]="isOpen">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(compiled).not.toBeShown();

    fixture.componentInstance.isOpen = true;
    fixture.detectChanges();
    expect(compiled).toBeShown();

    fixture.componentInstance.isOpen = false;
    fixture.detectChanges();
    expect(compiled).not.toBeShown();
  });

  it('should allow toggling dropdown from outside', () => {
    const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown #drop="ngbDropdown">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let buttonEls = compiled.querySelectorAll('button');

    buttonEls[0].click();
    fixture.detectChanges();
    expect(compiled).toBeShown();

    buttonEls[1].click();
    fixture.detectChanges();
    expect(compiled).not.toBeShown();

    buttonEls[2].click();
    fixture.detectChanges();
    expect(compiled).toBeShown();

    buttonEls[2].click();
    fixture.detectChanges();
    expect(compiled).not.toBeShown();
  });

  it('should allow binding to open output', () => {
    const html = `
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown [(open)]="isOpen" #drop="ngbDropdown"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let buttonEl = compiled.querySelector('button');

    expect(fixture.componentInstance.isOpen).toBe(false);

    buttonEl.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen).toBe(true);

    buttonEl.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen).toBe(false);
  });

  it('should not raise open events if open state does not change', () => {
    const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <div ngbDropdown (openChange)="recordStateChange($event)" #drop="ngbDropdown"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let buttonEls = compiled.querySelectorAll('button');

    expect(fixture.componentInstance.isOpen).toBe(false);
    expect(fixture.componentInstance.stateChanges).toEqual([]);

    buttonEls[1].click();  // close a closed one
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(false);
    expect(fixture.componentInstance.stateChanges).toEqual([]);

    buttonEls[0].click();  // open a closed one
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(true);
    expect(fixture.componentInstance.stateChanges).toEqual([true]);

    buttonEls[0].click();  // open an opened one
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(true);
    expect(fixture.componentInstance.stateChanges).toEqual([true]);

    buttonEls[1].click();  // close an opened one
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(false);
    expect(fixture.componentInstance.stateChanges).toEqual([true, false]);
  });
});

describe('ngb-dropdown-toggle', () => {
  beforeEach(() => {
    jasmine.addMatchers(jasmineMatchers);
    TestBed.configureTestingModule({declarations: [TestComponent, TestClickCloseOnPush], imports: [NgbDropdownModule]});
  });

  it('should toggle dropdown on click', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let buttonEl = compiled.querySelector('button');

    expect(dropdownEl).not.toHaveCssClass('show');
    expect(buttonEl.getAttribute('aria-haspopup')).toBe('true');
    expect(buttonEl.getAttribute('aria-expanded')).toBe('false');

    buttonEl.click();
    fixture.detectChanges();
    expect(compiled).toBeShown();
    expect(buttonEl.getAttribute('aria-expanded')).toBe('true');

    buttonEl.click();
    fixture.detectChanges();
    expect(compiled).not.toBeShown();
    expect(buttonEl.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle dropdown on click of child of toggle', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>
            <span class="toggle">Toggle dropdown</span>
          </button>
          <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    const toggleEl = compiled.querySelector('.toggle');

    expect(compiled).not.toBeShown();

    toggleEl.click();
    fixture.detectChanges();
    expect(compiled).toBeShown();

    toggleEl.click();
    fixture.detectChanges();
    expect(compiled).not.toBeShown();
  });

  it('should close on outside click', fakeAsync(() => {
       const html = `
      <button>Outside</button>
      <div ngbDropdown [open]="true">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

       const fixture = createTestComponent(html);
       const compiled = fixture.nativeElement;
       const buttonEl = compiled.querySelector('button');

       expect(compiled).toBeShown();

       tick(16);

       buttonEl.click();
       fixture.detectChanges();
       expect(compiled).not.toBeShown();
     }));

  it('should close on inside click, outside click and escape when inside the OnPush component', fakeAsync(() => {
       const fixture = createTestComponent(`<test-click-close-on-push></test-click-close-on-push>`);
       const compiled = fixture.nativeElement;
       const toggleEl = compiled.querySelector('button');
       const outsideEl = compiled.querySelector('.outside');
       const insideEl = compiled.querySelector('.inside');

       const reopen = () => {
         toggleEl.click();
         fixture.detectChanges();
         expect(compiled).toBeShown();
       };

       // inside click
       tick(16);
       insideEl.click();
       fixture.detectChanges();
       expect(compiled).not.toBeShown();


       // outside click
       reopen();
       tick(16);
       outsideEl.click();
       fixture.detectChanges();
       expect(compiled).not.toBeShown();


       // escape
       reopen();
       document.dispatchEvent(createFakeEscapeKeyUpEvent());
       fixture.detectChanges();
       expect(compiled).not.toBeShown();
     }));

  it('should not close on outside click if right button click', () => {
    const html = `
      <button>Outside</button>
      <div ngbDropdown [open]="true">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    const buttonEl = compiled.querySelector('button');

    expect(compiled).toBeShown();

    const evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 2, null);
    buttonEl.dispatchEvent(evt);
    fixture.detectChanges();
    expect(compiled).toBeShown();
  });

  it('should not close on outside click if autoClose is set to false', () => {
    const html = `
      <button>Outside</button>
      <div ngbDropdown [open]="true" [autoClose]="false">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let buttonEl = compiled.querySelector('button');

    expect(compiled).toBeShown();

    buttonEl.click();
    fixture.detectChanges();
    expect(compiled).toBeShown();
  });

  describe('escape closing', () => {

    it('should close on ESC from anywhere', () => {
      const fixture = createTestComponent(`
          <div ngbDropdown [open]="true" [autoClose]="true">
              <button ngbDropdownToggle>Toggle dropdown</button>
              <div ngbDropdownMenu></div>
          </div>`);

      const compiled = fixture.nativeElement;
      expect(compiled).toBeShown();

      document.dispatchEvent(createFakeEscapeKeyUpEvent());
      fixture.detectChanges();
      expect(compiled).not.toBeShown();
    });

    it('should close on ESC from the toggling button', () => {
      const fixture = createTestComponent(`
        <div ngbDropdown [open]="true" [autoClose]="true">
            <button ngbDropdownToggle>Toggle dropdown</button>
            <div ngbDropdownMenu></div>
        </div>`);
      const compiled = fixture.nativeElement;
      const buttonElement = compiled.querySelector('button');

      expect(compiled).toBeShown();

      buttonElement.dispatchEvent(createFakeEscapeKeyUpEvent());
      fixture.detectChanges();
      expect(compiled).not.toBeShown();
    });

    it('should not close on ESC from the toggling button if autoClose is set to false', () => {
      const fixture = createTestComponent(`
        <div ngbDropdown [open]="true" [autoClose]="false">
            <button ngbDropdownToggle>Toggle dropdown</button>
            <div ngbDropdownMenu></div>
        </div>`);
      const compiled = fixture.nativeElement;
      const buttonElement = compiled.querySelector('button');

      expect(compiled).toBeShown();

      buttonElement.dispatchEvent(createFakeEscapeKeyUpEvent());
      fixture.detectChanges();
      expect(compiled).toBeShown();

      buttonElement.click();
      fixture.detectChanges();
      expect(compiled).not.toBeShown();
    });

    it('should not close on ESC from anywhere if autoClose is set to false', () => {
      const fixture = createTestComponent(`
          <div ngbDropdown [open]="true" [autoClose]="false">
              <button ngbDropdownToggle>Toggle dropdown</button>
              <div ngbDropdownMenu></div>
          </div>`);
      const compiled = fixture.nativeElement;
      const buttonElement = compiled.querySelector('button');

      expect(compiled).toBeShown();

      document.dispatchEvent(createFakeEscapeKeyUpEvent());
      fixture.detectChanges();
      expect(compiled).toBeShown();

      buttonElement.click();
      fixture.detectChanges();
      expect(compiled).not.toBeShown();
    });
  });

  it('should not close on item click if autoClose is set to false', () => {
    const html = `
      <div ngbDropdown [open]="true" [autoClose]="false">
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">Action</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    const linkEl = compiled.querySelector('a');

    expect(compiled).toBeShown();

    linkEl.click();
    fixture.detectChanges();
    expect(compiled).toBeShown();
  });

  it('should close on item click by default', fakeAsync(() => {
       const html = `
      <div ngbDropdown [open]="true">
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div ngbDropdownMenu aria-labelledby="dropdownMenu1">
            <a class="dropdown-item">Action</a>
          </div>
      </div>`;

       const fixture = createTestComponent(html);
       const compiled = fixture.nativeElement;
       const linkEl = compiled.querySelector('a');

       expect(compiled).toBeShown();

       tick(16);
       linkEl.click();
       fixture.detectChanges();
       expect(compiled).not.toBeShown();
     }));


  it('should close on other dropdown click', fakeAsync(() => {
       const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown 1</button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">Action 1</a>
          </div>
      </div>
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown 2</button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">Action 2</a>
          </div>
      </div>`;

       const fixture = createTestComponent(html);
       const compiled = fixture.nativeElement;

       const buttonEls = compiled.querySelectorAll('button');
       const dropdownEls = compiled.querySelectorAll('div[ngbDropdown]');

       fixture.detectChanges();
       expect(dropdownEls[0]).not.toHaveCssClass('show');
       expect(dropdownEls[1]).not.toHaveCssClass('show');

       buttonEls[0].click();
       fixture.detectChanges();
       expect(dropdownEls[0]).toHaveCssClass('show');
       expect(dropdownEls[1]).not.toHaveCssClass('show');

       tick(16);
       buttonEls[1].click();
       fixture.detectChanges();
       expect(dropdownEls[0]).not.toHaveCssClass('show');
       expect(dropdownEls[1]).toHaveCssClass('show');
     }));

  describe('outside and inside clicks', () => {

    it('should not close on menu clicks when the "outside" option is used', fakeAsync(() => {

         const html = `
      <div ngbDropdown [open]="true" autoClose="outside">
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">Action</a>
          </div>
      </div>`;

         const fixture = createTestComponent(html);
         const compiled = fixture.nativeElement;
         const buttonEl = compiled.querySelector('button');
         const linkEl = compiled.querySelector('a');

         expect(compiled).toBeShown();

         tick(16);

         // remains open on item click
         linkEl.click();
         fixture.detectChanges();
         expect(compiled).toBeShown();

         // but closes on toggle button click
         buttonEl.click();
         fixture.detectChanges();
         expect(compiled).not.toBeShown();
       }));

    it('should not close on outside clicks when the "inside" option is used', fakeAsync(() => {

         const html = `
      <button id="outside">Outside</button>
      <div ngbDropdown [open]="true" autoClose="inside">
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">Action</a>
          </div>
      </div>`;

         const fixture = createTestComponent(html);
         const compiled = fixture.nativeElement;
         const buttonEl = compiled.querySelector('#outside');
         const linkEl = compiled.querySelector('a');

         expect(compiled).toBeShown();

         tick(16);

         // remains open on outside click
         buttonEl.click();
         fixture.detectChanges();
         expect(compiled).toBeShown();

         // but closes on item click
         linkEl.click();
         fixture.detectChanges();
         expect(compiled).not.toBeShown();
       }));

  });

  describe('Custom config', () => {
    let config: NgbDropdownConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({imports: [NgbDropdownModule]});
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
      <div ngbDropdown>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`
        }
      });
    });

    beforeEach(inject([NgbDropdownConfig], (c: NgbDropdownConfig) => {
      config = c;
      config.placement = 'top-right';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbDropdownConfig();
    config.placement = 'top-right';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbDropdownModule], providers: [{provide: NgbDropdownConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = createTestComponent(`
      <div ngbDropdown>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropup item</a>
            <a class="dropdown-item">dropup item</a>
          </div>
      </div>`);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  isOpen = false;
  stateChanges = [];

  recordStateChange($event) {
    this.stateChanges.push($event);
    this.isOpen = $event;
  }
}

@Component({
  selector: 'test-click-close-on-push',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ngbDropdown [open]="true">
      <button ngbDropdownToggle>Toggle dropdown</button>
      <div ngbDropdownMenu>
        <a class="dropdown-item inside">Action</a>
      </div>
    </div>
    <button class="outside">Outside</button>
  `
})
class TestClickCloseOnPush {
}
