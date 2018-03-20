import {enableProdMode} from '@angular/core';
// import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {platformBrowser} from '@angular/platform-browser';

// import {NgbdModule} from './app/app.module';
import {NgbdModuleNgFactory} from './app/app.module.ngfactory';

// depending on the env mode, enable prod mode or add debugging modules
//if (process.env.ENV === 'build') {
//  enableProdMode();
//}

// platformBrowserDynamic().bootstrapModule(NgbdModule);
platformBrowser().bootstrapModuleFactory(NgbdModuleNgFactory);
