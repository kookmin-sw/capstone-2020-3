import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirm-msg-modal-component',
    template: `
        <div class="modal-header">
            <h5 class="modal-title text-center">{{ title }}</h5>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">{{ message }}</div>
        <div class="modal-footer">
            <div class="left-side">
                <button type="button" class="btn btn-default btn-link" (click)="activeModal.close('Close click')">{{ 'BUTTONS.TITLE.NO' | translate }}</button>
            </div>
            <div class="divider"></div>
            <div class="right-side">
                <button type="button" class="btn btn-danger btn-link" (click)="closeModal('Y')">{{ 'BUTTONS.TITLE.YES' | translate }}</button>
            </div>
        </div>
    `
})
export class ConfirmMsgModalComponent {
    @Input() title;
    @Input() message;

    constructor(public activeModal: NgbActiveModal) {}

    /**
   * modal 닫기
   */
  closeModal(data: any){
    if(data){
      this.activeModal.dismiss(data);
    }else{
      this.activeModal.dismiss();
    }
  }
}