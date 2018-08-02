import {fakeAsync, tick} from '@angular/core/testing';
import {Subject, Subscription, Observable} from 'rxjs';
import {parseTriggers, triggerDelay} from './triggers';

describe('triggers', () => {

  describe('parseTriggers', () => {

    it('should parse single trigger', () => {
      const t = parseTriggers('foo');

      expect(t.length).toBe(1);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('foo');
    });

    it('should parse open:close form', () => {
      const t = parseTriggers('foo:bar');

      expect(t.length).toBe(1);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('bar');
    });

    it('should parse multiple triggers', () => {
      const t = parseTriggers('foo:bar bar:baz');

      expect(t.length).toBe(2);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('bar');
      expect(t[1].open).toBe('bar');
      expect(t[1].close).toBe('baz');
    });

    it('should parse multiple triggers with mixed forms', () => {
      const t = parseTriggers('foo bar:baz');

      expect(t.length).toBe(2);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('foo');
      expect(t[1].open).toBe('bar');
      expect(t[1].close).toBe('baz');
    });

    it('should properly trim excessive white-spaces', () => {
      const t = parseTriggers('foo   bar  \n baz ');

      expect(t.length).toBe(3);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('foo');
      expect(t[1].open).toBe('bar');
      expect(t[1].close).toBe('bar');
      expect(t[2].open).toBe('baz');
      expect(t[2].close).toBe('baz');
    });

    it('should lookup and translate special aliases', () => {
      const t = parseTriggers('hover');

      expect(t.length).toBe(1);
      expect(t[0].open).toBe('mouseenter');
      expect(t[0].close).toBe('mouseleave');
    });

    it('should detect manual triggers', () => {
      const t = parseTriggers('manual');

      expect(t[0].isManual).toBeTruthy();
    });

    it('should ignore empty inputs', () => {
      expect(parseTriggers(null).length).toBe(0);
      expect(parseTriggers(undefined).length).toBe(0);
      expect(parseTriggers('').length).toBe(0);
    });

    it('should throw when more than one manual trigger detected', () => {
      expect(() => {
        parseTriggers('manual click manual');
      }).toThrow('Triggers parse error: only one manual trigger is allowed');
    });

    it('should throw when manual trigger is mixed with other triggers', () => {
      expect(() => {
        parseTriggers('click manual');
      }).toThrow(`Triggers parse error: manual trigger can\'t be mixed with other triggers`);
    });

  });

  describe('triggerDelay', () => {
    let subject$: Subject<boolean>;
    let delayed$: Observable<boolean>;
    let subscription: Subscription;
    let spy: jasmine.Spy;

    beforeEach(() => {
      subject$ = new Subject();
      spy = jasmine.createSpy();
      delayed$ = subject$.asObservable().pipe(triggerDelay(5000, 1000));
      subscription = delayed$.subscribe(spy);
    });

    afterEach(() => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });

    it('delays open', fakeAsync(() => {
         subject$.next(true);
         tick(4999);
         expect(spy).not.toHaveBeenCalled();
         tick(2);
         expect(spy).toHaveBeenCalledWith(true);
         tick(100000);
         expect(spy.calls.count()).toBe(1);
       }));

    it('delays close', fakeAsync(() => {
         subject$.next(false);
         tick(999);
         expect(spy).not.toHaveBeenCalled();
         tick(2);
         expect(spy).toHaveBeenCalledWith(false);
         tick(100000);
         expect(spy.calls.count()).toBe(1);
       }));

    it('ignores extra open during openDelay', fakeAsync(() => {
         subject$.next(true);
         tick(200);
         subject$.next(true);
         tick(100);
         subject$.next(true);
         tick(200);
         tick(4499);
         expect(spy).not.toHaveBeenCalled();
         tick(2);
         expect(spy).toHaveBeenCalledWith(true);
         tick(100000);
         expect(spy.calls.count()).toBe(1);
       }));

    it('ignores extra close during closeDelay', fakeAsync(() => {
         subject$.next(false);
         tick(200);
         subject$.next(false);
         tick(100);
         subject$.next(false);
         tick(200);
         tick(499);
         expect(spy).not.toHaveBeenCalled();
         tick(2);
         expect(spy).toHaveBeenCalledWith(false);
         tick(100000);
         expect(spy.calls.count()).toBe(1);
       }));

    it('cancels open when receiving close during openDelay', fakeAsync(() => {
         subject$.next(true);
         tick(4998);
         subject$.next(false);
         tick(100000);
         expect(spy).not.toHaveBeenCalled();
       }));

    it('cancels close when receiving open during closeDelay', fakeAsync(() => {
         subject$.next(false);
         tick(998);
         subject$.next(true);
         tick(100000);
         expect(spy).not.toHaveBeenCalled();
       }));
  });
});
