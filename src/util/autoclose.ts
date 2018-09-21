import {Injectable, NgZone, Inject} from '@angular/core';
import {fromEvent, Observable, race, NEVER} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil, filter} from 'rxjs/operators';
import {Key} from './key';

const isHTMLElementContainedIn = (element: HTMLElement, array?: HTMLElement[]) =>
    array ? array.some(item => item.contains(element)) : false;

@Injectable({providedIn: 'root'})
export class AutoClose {
  constructor(private _ngZone: NgZone, @Inject(DOCUMENT) private _document: any) {}

  install(
      autoClose: boolean | 'inside' | 'outside', close: () => void, closeEvent: Observable<any>,
      insideElements: HTMLElement[], ignoreElements?: HTMLElement[]) {
    if (autoClose) {
      this._ngZone.runOutsideAngular(() => {
        // We don't know what triggered popup opening.
        // If it was opened with a click, we're currently inside the click handler on a trigger element.
        // Once the click event bubbles to the document level, the handler we're about to set up will close popup
        // immediately.
        // To prevent this, we're using requestAnimationFrame to disable click handling in the current tick.
        let justOpened = true;
        requestAnimationFrame(() => justOpened = false);

        const escapes$ =
            fromEvent<KeyboardEvent>(this._document, 'keydown').pipe(filter(event => event.which === Key.Escape));

        const clicks$ = (autoClose === 'inside' && insideElements.length === 0) ?
            NEVER :
            fromEvent<MouseEvent>(this._document, 'click')
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
