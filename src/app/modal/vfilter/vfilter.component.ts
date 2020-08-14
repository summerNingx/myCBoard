import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'modal-vfilter',
    templateUrl: './vfilter.component.html',
    styleUrls: ['./vfilter.component.less']
})
export class VfilterComponent implements OnInit {

    private _data: any;
    get data() {
        return this._data;
    }
    @Input() set data(o: any) {
        this._data = o;
        this.f_type = o.f_type ? o.f_type : '>';
        this.f_values = o.f_values ? o.f_values : [];
        this.f_top = o.f_top ? o.f_top : '';
    }
    @Input() modal: NgbActiveModal;
    types: string[];
    // tslint:disable-next-line:variable-name
    f_type: string;
    // tslint:disable-next-line:variable-name
    f_values: any[];
    // tslint:disable-next-line:variable-name
    f_top: string;

    constructor() { }

    ngOnInit() {
        this.types = ['=', '≠', '>', '<', '≥', '≤', '(a,b]', '[a,b)', '(a,b)', '[a,b]'];
    }

    ok() {
        let dt = {...this.data};
        dt.f_type = this.f_type;
        dt.f_values = this.f_values;
        dt.f_top = this.f_top;
        this.modal.close(dt);
    }

}
