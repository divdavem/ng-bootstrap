import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTabset, NgbTab, NgbTabTitle} from './tabset';
import {
  NgbTabContent,
  NgbTabsetDirective,
  NgbTabDirective,
  NgbTabLinkDirective,
  NgbTabsetOutlet,
  NgbSelfControlledTabset
} from './tabset-directives';

export {NgbTabset, NgbTab, NgbTabTitle} from './tabset';
export {
  NgbTabContent,
  NgbTabsetDirective,
  NgbTabDirective,
  NgbTabLinkDirective,
  NgbTabsetOutlet,
  NgbTabChangeEvent,
  NgbSelfControlledTabset
} from './tabset-directives';
export {NgbTabsetConfig} from './tabset-config';

const NGB_TABSET_DIRECTIVES = [
  NgbTabset, NgbTab, NgbTabContent, NgbTabsetDirective, NgbTabDirective, NgbTabLinkDirective, NgbTabTitle,
  NgbTabsetOutlet, NgbSelfControlledTabset
];

@NgModule({declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule]})
export class NgbTabsetModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbTabsetModule}; }
}
