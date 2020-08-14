import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '@ism/ng-cores';

@Component({
    selector: 'modal-exp',
    templateUrl: './exp.component.html',
    styleUrls: ['./exp.component.less']
})
export class ExpComponent implements OnInit {

    data: any;
    curWidget: any;
    columnObjs: any[];
    aggregate: any;
    expressions: any;
    alerts: any[];
    selects: any[];

    private columns: any[];

    private _scope: any;
    get scope(): any {
        return this._scope;
    }
    @Input() set scope(val: any) {
        this._scope = val;
        this.data = val.data;
        this.curWidget = val.curWidget;
        this.columnObjs = val.columnObjs;
        this.aggregate = val.aggregate;
        this.expressions = val.curWidget.expressions;
        this.alerts = [];
    }

    @Input() modal: NgbActiveModal;

    expAceOpt;
    expAceEditor;
    expAceSession;

    constructor(
        private translate: TranslateService,
        private dialog: DialogService
    ) { }

    ngOnInit() {
        this.columns = _.map(this.columnObjs, o => o.columns);
        // this.expAceOpt = expEditorOptions(this.selects, this.aggregate, (_editor) => {
        //     this.expAceEditor = _editor;
        //     this.expAceSession = _editor.getSesstion();
        //     _editor.focus();
        // });
    }

    addToken(str, agg) {
        let editor = this.expAceEditor;
        editor.session.insert(editor.getCursorPosition(), str);
        editor.focus();
        if (agg) {
            editor.getSelection().moveCursorLeft();
        }
    }

    verify() {
        this.alerts = [];
        // let v = verifyAggExpRegx(this.data.expression);
        // this.alerts = [{
        //     msg: v.isValid ? this.translate.instant('COMMON.SUCCESS') : v.msg,
        //     type: v.isValid ? 'success' : 'danger'
        // }];
    }

    ok() {
        if (!this.data.alias) {
            this.dialog.alert(this.translate.instant('CONFIG.WIDGET.ALIAS') + this.translate.instant('COMMON.NOT_EMPTY'), 'modal-warning');
            return;
        }
        this.data.expression = this.expAceSession.getValue();
        this.modal.close(this.data);
    }


}
