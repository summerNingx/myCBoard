import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from '@ism/ng-cores';

@Component({
    selector: 'modal-fgroup',
    templateUrl: './filterGroup.component.html',
    styleUrls: [
        './filterGroup.component.less'
    ]
})
export class FilterGroupComponent implements OnInit {

    @Input() data: any;
    @Input() columnObjs: any[];
    @Input() modal: NgbActiveModal;

    @ViewChild('paramTpl', {static: false}) paramTpl: TemplateRef<any>;

    constructor(
        private dialog: DialogService
    ) { }

    ngOnInit() { }

    addColumn(str) {
      this.data.filters.push({col: str, type: '=', values: []});
    }

    ok() {
        this.modal.close(this.data);
    }

    editFilter(filter) {
        this.dialog.open(this.paramTpl).result.then((res) => {

        });
    }

}
