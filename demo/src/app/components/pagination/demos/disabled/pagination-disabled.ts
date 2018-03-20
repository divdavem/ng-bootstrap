import {Component} from '@angular/core';
import {NgbPaginationConfig} from 'ng_bootstrap/src';

@Component({
  selector: 'ngbd-pagination-disabled',
  templateUrl: './pagination-disabled.html'
})
export class NgbdPaginationDisabled {
  page = 3;
  isDisabled = true;

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }
}
