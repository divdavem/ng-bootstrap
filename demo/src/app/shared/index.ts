import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// The dependency on HttpClientModule has been temporarily removed because
// it causes an issue with ts_devserver, cf https://github.com/angular/angular/issues/22866
// import {HttpClientModule} from '@angular/common/http';

import {NgbModule} from 'ng_bootstrap/src';

import {ComponentWrapper} from './component-wrapper/component-wrapper.component';
import {PageWrapper} from './page-wrapper/page-wrapper.component';
import {SideNavComponent} from './side-nav/side-nav.component';
import {Analytics} from './analytics/analytics';

export {componentsList} from './side-nav/side-nav.component';

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [
    CommonModule,
    RouterModule,
    ComponentWrapper,
    PageWrapper,
    SideNavComponent,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule
  ],
  declarations: [
    ComponentWrapper,
    PageWrapper,
    SideNavComponent,
  ],
  providers: [Analytics]
})
export class NgbdSharedModule {
}
