import {Observable, EMPTY, merge} from 'rxjs';
import {share, filter, delay, map} from 'rxjs/operators';

export class Trigger {
  constructor(public open: string, public close?: string) {
    if (!close) {
      this.close = open;
    }
  }

  isManual() { return this.open === 'manual' || this.close === 'manual'; }
}

const DEFAULT_ALIASES = {
  'hover': ['mouseenter', 'mouseleave']
};

export function parseTriggers(triggers: string, aliases = DEFAULT_ALIASES): Trigger[] {
  const trimmedTriggers = (triggers || '').trim();

  if (trimmedTriggers.length === 0) {
    return [];
  }

  const parsedTriggers = trimmedTriggers.split(/\s+/).map(trigger => trigger.split(':')).map((triggerPair) => {
    let alias = aliases[triggerPair[0]] || triggerPair;
    return new Trigger(alias[0], alias[1]);
  });

  const manualTriggers = parsedTriggers.filter(triggerPair => triggerPair.isManual());

  if (manualTriggers.length > 1) {
    throw 'Triggers parse error: only one manual trigger is allowed';
  }

  if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
    throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
  }

  return parsedTriggers;
}

export function observeTriggers(renderer: any, nativeElement: any, triggers: string, isOpenedFn: () => boolean) {
  const parsedTriggers = parseTriggers(triggers);

  if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
    return EMPTY;
  }
  return new Observable<boolean>(subscriber => {
    const listeners = [];
    const openFn = () => subscriber.next(true);
    const closeFn = () => subscriber.next(false);
    const toggleFn = () => subscriber.next(!isOpenedFn());

    parsedTriggers.forEach((trigger: Trigger) => {
      if (trigger.open === trigger.close) {
        listeners.push(renderer.listen(nativeElement, trigger.open, toggleFn));
      } else {
        listeners.push(
            renderer.listen(nativeElement, trigger.open, openFn),
            renderer.listen(nativeElement, trigger.close, closeFn));
      }
    });

    return () => { listeners.forEach(unsubscribeFn => unsubscribeFn()); };
  });
}

export function subscribeTriggers(observable: Observable<boolean>, openFn, closeFn) {
  const subscription = observable.subscribe(next => (next ? openFn() : closeFn()));
  return () => subscription.unsubscribe();
}

export function triggerDelay(openDelay: number, closeDelay: number, isOpenedFn: () => boolean) {
  return (input$: Observable<boolean>) => {
    let pending = null;
    const filteredInput$ = input$.pipe(
        map(open => ({open})), filter(event => {
          const currentlyOpen = isOpenedFn();
          if (currentlyOpen !== event.open && (!pending || pending.open === currentlyOpen)) {
            pending = event;
            return true;
          }
          if (pending && pending.open !== event.open) {
            pending = null;
          }
          return false;
        }),
        share());
    const delayedOpen$ = filteredInput$.pipe(filter(event => event.open), delay(openDelay));
    const delayedClose$ = filteredInput$.pipe(filter(event => !event.open), delay(closeDelay));
    return merge(delayedOpen$, delayedClose$)
        .pipe(
            filter(event => {
              if (event === pending) {
                pending = null;
                return event.open !== isOpenedFn();
              }
              return false;
            }),
            map(event => event.open));
  };
}

export function listenToTriggers(
    renderer: any, nativeElement: any, triggers: string, isOpenedFn: () => boolean, openFn, closeFn, openDelay = 0,
    closeDelay = 0) {
  let observable = observeTriggers(renderer, nativeElement, triggers, isOpenedFn);
  if (openDelay > 0 || closeDelay > 0) {
    observable = observable.pipe(triggerDelay(openDelay, closeDelay, isOpenedFn));
  }
  return subscribeTriggers(observable, openFn, closeFn);
}
