import {NgbdModalBasic} from './basic/modal-basic';
import {NgbdModalComponent, NgbdModalContent} from './component/modal-component';
import {NgbdModalDismissall} from './dismissall/modal-dismissall';
import {NgbdModalOptions} from './options/modal-options';

export const DEMO_DIRECTIVES = [NgbdModalBasic, NgbdModalComponent, NgbdModalDismissall, NgbdModalOptions];
export {NgbdModalContent} from './component/modal-component';

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/modal-basic'),
    'markup': require('!!raw-loader!./basic/modal-basic.html')},
  'component': {
    'code': require('!!raw-loader!./component/modal-component'),
    'markup': require('!!raw-loader!./component/modal-component.html')},
  'dismissall': {
    'code': require('!!raw-loader!./dismissall/modal-dismissall'),
    'markup': require('!!raw-loader!./dismissall/modal-dismissall.html')},
  'options': {
    'code': require('!!raw-loader!./options/modal-options'),
    'markup': require('!!raw-loader!./options/modal-options.html')}
};
