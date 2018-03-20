import {Router, NavigationEnd} from '@angular/router';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Analytics} from './shared/analytics/analytics';
import {componentsList} from './shared';

@Component({
  selector: 'ngbd-app',
  templateUrl: './app.component.html',
  styleUrls: ['./style/style.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  navbarCollapsed = true;

  components = componentsList;

  constructor(private _analytics: Analytics, router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const { fragment } = router.parseUrl(router.url);
        if (fragment) {
          const element = document.querySelector(`#${fragment}`);
          if (element) {
            element.scrollIntoView();
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this._analytics.trackPageViews();
  }
}
