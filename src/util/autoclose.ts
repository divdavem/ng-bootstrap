import {Injectable, NgZone, Inject} from '@angular/core';
import {fromEvent, Observable, race} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil, filter} from 'rxjs/operators';
import {Key} from './key';

const isHTMLElementContainedIn = (element: HTMLElement, array?: HTMLElement[]) =>
    array ? array.some(item => item.contains(element)) : false;

@Injectable({providedIn: 'root'})
export class AutoClose {
  constructor(private _ngZone: NgZone, @Inject(DOCUMENT) private _document: any) {}

  installAutoClose(
      autoClose: boolean | 'inside' | 'outside', close: () => void, closeEvent: Observable<any>,
      insideElements?: HTMLElement[], ignoreElements?: HTMLElement[]) {
    if (autoClose) {
      this._ngZone.runOutsideAngular(() => {
        // prevents automatic closing right after an opening by putting a guard for the time of one event handling
        // pass
        // use case: click event would reach an element opening the popover first, then reach the autoClose handler
        // which would close it

        let justOpened = true;
        requestAnimationFrame(() => justOpened = false);

        const escapes$ =
            fromEvent<KeyboardEvent>(this._document, 'keyup').pipe(filter(event => event.which === Key.Escape));

        const clicks$ = fromEvent<MouseEvent>(this._document, 'click')
                            .pipe(filter(() => !justOpened), filter((event: MouseEvent) => {
                                    const element = event.target as HTMLElement;
                                    if (isHTMLElementContainedIn(element, ignoreElements)) {
                                      return false;
                                    }
                                    if (autoClose === 'inside') {
                                      return isHTMLElementContainedIn(element, insideElements);
                                    } else if (autoClose === 'outside') {
                                      return !isHTMLElementContainedIn(element, insideElements);
                                    } else /* if (autoClose === true) */ {
                                      return true;
                                    }
                                  }));

        race<Event>([escapes$, clicks$]).pipe(takeUntil(closeEvent)).subscribe(() => this._ngZone.run(() => close()));
      });
    }
  }
}
