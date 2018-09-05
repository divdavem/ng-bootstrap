import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  Directive,
  TemplateRef,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {NgbTabsetConfig} from './tabset-config';
import {NgbTabContent, NgbTabChangeEvent, NgbSelfControlledTabset} from './tabset-directives';

/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
@Directive({selector: 'ng-template[ngbTabTitle]'})
export class NgbTabTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * A directive representing an individual tab.
 */
@Directive({selector: 'ngb-tab'})
export class NgbTab {
  /**
   * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
   */
  @Input() id: string;
  /**
   * Simple (string only) title. Use the "NgbTabTitle" directive for more complex use-cases.
   */
  @Input() title: string;
  /**
   * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
   */
  @Input() disabled = false;

  titleTpl: NgbTabTitle | null;
  contentTpl: NgbTabContent | null;

  @ContentChildren(NgbTabTitle, {descendants: false}) titleTpls: QueryList<NgbTabTitle>;
  @ContentChildren(NgbTabContent, {descendants: false}) contentTpls: QueryList<NgbTabContent>;

  ngAfterContentChecked() {
    // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
    // only @ContentChildren allows us to specify the {descendants: false} option.
    // Without {descendants: false} we are hitting bugs described in:
    // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
    this.titleTpl = this.titleTpls.first;
    this.contentTpl = this.contentTpls.first;
  }
}

/**
 * A component that makes it easy to create tabbed interface.
 */
@Component({
  selector: 'ngb-tabset',
  exportAs: 'ngbTabset',
  template: `
    <ul ngbTabset selfControlled
      (tabChange)="tabChange.next($event)"
      [type]="type"
      [justify]="justify"
      [orientation]="orientation"
      [destroyOnHide]="destroyOnHide"
      [activeId]="activeId"
      #tabset="ngbTabset"
    >
      <li ngbTab [domId]="tab.id" [disabled]="tab.disabled" *ngFor="let tab of tabs">
        <a ngbTabLink>{{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template></a>
        <ng-template ngbTabContent><ng-template [ngTemplateOutlet]="tab.contentTpl?.templateRef"></ng-template></ng-template>
      </li>
    </ul>
    <div [ngbTabsetOutlet]="tabset"></div>
  `
})
export class NgbTabset {
  @ContentChildren(NgbTab) tabs: QueryList<NgbTab>;
  @ViewChild(NgbSelfControlledTabset) control: NgbSelfControlledTabset;

  /**
   * An identifier of an initially selected (active) tab. Use the "select" method to switch a tab programmatically.
   */
  @Input() activeId: string;

  /**
   * Whether the closed tabs should be hidden without destroying them
   */
  @Input() destroyOnHide = true;

  /**
   * The horizontal alignment of the nav with flexbox utilities. Can be one of 'start', 'center', 'end', 'fill' or
   * 'justified'
   * The default value is 'start'.
   */
  @Input() justify: 'start' | 'center' | 'end' | 'fill' | 'justified';

  /**
   * The orientation of the nav (horizontal or vertical).
   * The default value is 'horizontal'.
   */
  @Input() orientation: 'horizontal' | 'vertical';

  /**
   * Type of navigation to be used for tabs. Can be one of Bootstrap defined types ('tabs' or 'pills').
   * Since 3.0.0 can also be an arbitrary string (for custom themes).
   */
  @Input() type: 'tabs' | 'pills' | string;

  /**
   * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<NgbTabChangeEvent>();

  constructor(config: NgbTabsetConfig) {
    this.type = config.type;
    this.justify = config.justify;
    this.orientation = config.orientation;
  }

  /**
   * Selects the tab with the given id and shows its associated pane.
   * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
   */
  select(tabId: string) { this.control.select(tabId); }
}
