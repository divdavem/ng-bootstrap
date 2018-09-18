import {Injectable, NgZone, Inject} from '@angular/core';
import {fromEvent, Observable, race} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil, filter} from 'rxjs/operators';
import {Key} from './key';

@Injectable({providedIn: 'root'})
export class AutoClose {
  constructor(private _ngZone: NgZone, @Inject(DOCUMENT) private _document: any) {}

  installAutoClose(
      shouldCloseFromMouseEvent: (event: MouseEvent) => boolean, close: () => void, closeEvent: Observable<any>) {
    this._ngZone.runOutsideAngular(() => {
      // prevents automatic closing right after an opening by putting a guard for the time of one event handling
      // pass
      // use case: click event would reach an element opening the popover first, then reach the autoClose handler
      // which would close it
      let justOpened = true;
      requestAnimationFrame(() => justOpened = false);

      const escapes$ = fromEvent<KeyboardEvent>(this._document, 'keyup')
                           .pipe(takeUntil(closeEvent), filter(event => event.which === Key.Escape));

      const clicks$ = fromEvent<MouseEvent>(this._document, 'click')
                          .pipe(takeUntil(closeEvent), filter(() => !justOpened), filter(shouldCloseFromMouseEvent));

      race<Event>([escapes$, clicks$]).subscribe(() => this._ngZone.run(() => close()));
    });
  }
}
