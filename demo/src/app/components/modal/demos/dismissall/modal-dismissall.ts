import {Component} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-dismissall',
  templateUrl: './modal-dismissall.html',
  styles: [`
    .modal-dismissall-always-visible {
      position: absolute;
      z-index: 200000;
      background-color: white;
      border-radius: 5px;
    }
    .modal-dismissall-space {
      height: 100px;
    }
  `]
})
export class NgbdModalDismissall {
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  open(content) {
    this.modalService.open(content);
  }

  dismissAll() {
    this.modalService.dismissAll();
  }

}
