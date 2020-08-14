import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    private datasetList: Array<any>;
    private widgetList: Array<any>;

    public apis: any = {
        datasets: 'datasets',
        aggregate: 'aggregate'
    };

    constructor(private http: HttpClient) { }

    getDatasetList(refresh?: boolean): Observable<any> {
        if (refresh !== true && this.datasetList && this.datasetList.length) {
            return of(this.datasetList).pipe(delay(100))
        } else {
            let subject = new Subject();
            this.http.get('./datas/datasetList.json').subscribe((res: any) => {
                this.datasetList = res.data;
                subject.next(res.data);
            });
            return subject;
        }
    }

    getWidgetList(refresh?: boolean): Observable<any> {
        if (refresh !== true && this.widgetList && this.widgetList.length) {
            return of(this.widgetList).pipe(delay(100));
        } else {
            let subject = new Subject();

            this.http.get('./datas/widgetList.json').subscribe((res: any) => {
                this.widgetList = res.data;
                subject.next(res.data);
            });
            return subject;
        }
    }


    linkDataset(datasetId, chartConfig): Observable<any> {
        if (_.isUndefined(datasetId) || _.isUndefined(chartConfig)) {
            return of(false);
        } else {
            let subject = new Subject();

            this.getDatasetList().subscribe((dsList: any) => {
                let dataset = _.find(dsList, e => e.id === datasetId);

                _.each(chartConfig.filters, (f) => {
                    if (f.group) {
                        let group = _.find(dataset.data.filters, e => e.id === f.id);
                        if (group) {
                            f.filters = group.filters;
                            f.group = group.group;
                        }
                    }
                });

                _.each(chartConfig.values, (v) => {
                    _.each(v.cols, (c) => {
                        if (c.type === 'exp') {
                            let exp = _.find(dataset.data.expressions, e => c.id === e.id);
                            if (exp) {
                                c.exp = exp.exp;
                                c.alias = exp.alias;
                            }
                            c.exp = replaceVariable(dataset.data.expressions, c);
                        }
                    });
                });

                let replaceVariable = (expList, exp) => {
                    let value = exp.exp,
                        loopCnt = 0,
                        context = {};
                    for (let i = 0; i < expList.length; i++) {
                        context[expList[i].alias] = expList[i].exp;
                    }

                    value = value.rander2(context, v => `(${v})`);

                    while (value.match(/\$\{.*?\}/g) !== null) {
                        value = value.render2(context);
                        if (loopCnt++ > 10) {
                            throw `Parser expresion [ ${exp.exp} ] with error`;
                        }
                    }
                    return value;
                }

                let linkFunction = (k) => {
                    if (k.id) {
                        let _level;
                        let _dimension;
                        _.each(dataset.data.schema.dimension, (e) => {
                            if (e.type === 'level') {
                                _.each(e.columns, (c) => {
                                    if (c.id === k.id) {
                                        _dimension = c;
                                        _level = e;
                                    }
                                });
                            } else if (k.id === e.id) {
                                _dimension = e;
                            }
                        });

                        if (_dimension && _dimension.alias) {
                            k.alias = _dimension.alias;
                            if (_level) {
                                k.level = _level.alias;
                            }
                        }
                    }
                };
                _.each(chartConfig.keys, linkFunction);
                _.each(chartConfig.groups, linkFunction);

                subject.next(true);
            });

            return subject;
        }
    }

    private getDimensionConfig(array) {
        let result = [];
        if (array) {
            _.each(array, (e) => {
                if (_.isUndefined(e.group)) {
                    result.push()
                }
            })
        }
    }

}
