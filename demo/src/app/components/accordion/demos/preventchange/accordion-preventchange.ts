import {Component} from '@angular/core';
import {NgbPanelChangeEvent} from 'ng_bootstrap/src';

@Component({
  selector: 'ngbd-accordion-preventchange',
  templateUrl: './accordion-preventchange.html',
})
export class NgbdAccordionPreventchange {
  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId === 'preventchange-2') {
      $event.preventDefault();
    }

    if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
      $event.preventDefault();
    }
  };
}
