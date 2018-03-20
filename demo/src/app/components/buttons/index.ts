export * from './buttons.component';

import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {NgbdButtons} from './buttons.component';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  // For an unknown (and strange) reason, if we don't include here ReactiveFormsModule
  // (even though it is already exported from NgbdSharedModule), the build fails with
  // "Error: Illegal State: external references changed in demo/src/app/components/buttons/index.ngfactory.ts"
  imports: [NgbdSharedModule, NgbdComponentsSharedModule, ReactiveFormsModule],
  exports: [NgbdButtons],
  declarations: [NgbdButtons, ...DEMO_DIRECTIVES]
})
export class NgbdButtonsModule {}
