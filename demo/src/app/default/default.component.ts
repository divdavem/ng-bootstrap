import {Component} from '@angular/core';
import version from '../version';

@Component({
  selector: 'ngbd-default',
  templateUrl: './default.component.html'
})
export class DefaultComponent {
  public version: string = version;
}
