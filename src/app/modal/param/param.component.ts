import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';


@Injectable()
@Component({
    selector: 'modal-param',
    templateUrl: './param.component.html',
    styleUrls: ['./param.component.less']
})
export class ParamComponent implements OnInit {

    @Input() modal: NgbActiveModal;
    @Input() curWidget: any;
    @Input() setbackIdx: number;
    @Input() setbackArr: any[];
    @Output() getSelects: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
    }

    param() {
        let item = this.setbackArr[this.setbackIdx];
        if (item.col) {
            if (item.type === 'eq') {
                item.type = '=';
            } else if (item.type === 'ne') {
                item.type = '≠';
            }
            return { ...item };
        } else {
            return { col: item, type: '=', values: [] };
        }
    }

    filter() {
        return true;
    }

    ok() {
        this.modal.close((param) => {
            this.setbackArr[this.setbackIdx] = param;
        });
    }

}
