import { UpdateService } from './update.service';
import { Defer } from '@ism/ng-cores';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';



export class DataService {

    datasetList: any[];

    constructor(
        private updateService: UpdateService,
        private http: HttpClient
    ) { }

    viewQuery(params, callback) {
        params.config = { ...params.config };
        this.updateService.updateConfig(params.config);

        this.linkDataset(params.datasetId, params.config).then(() => {
            let dataSeries = this.getDataSeries(params.config);
            let cfg: any = { rows: [], columns: [], filters: [] };
            cfg.rows = this.getDimensionConfig(params.config.keys);
            cfg.columns = this.getDimensionConfig(params.config.groups);
            cfg.filters = this.getDimensionConfig(params.config.filters);
            cfg.filters = cfg.filters.concat(this.getDimensionConfig(params.config.boardFilters));
            cfg.values = _.map(dataSeries, s => {
                return { column: s.name, aggType: s.aggregate };
            });

            this.http.get('./datas/viewAggDataQuery.json').subscribe((res: any) => {
                callback(res.data[0]);
            });
        });
    }

    getDimensionConfig(array) {
        let result = [];
        if (array && array.length) {
            array.forEach(e => {
                if (e.group === undefined) {
                    result.push({ columnName: e.col, filterType: e.type, values: e.values, id: e.id });
                } else {
                    if (e.filters && e.filters.length > 0) {
                        e.filters.forEach(f => {
                            result.push({ columnName: f.col, filterType: f.type, values: f.values });
                        });
                    }
                }
            });
        }
        return result;
    }

    getColumns(option) {
        this.http.get('./datas/getColumns.json').subscribe((res: any) => {
            option.callback(res.data);
        });
    }

    getDimensionValues(datasource, query, datasetId, columnName, chartConfig, callback) {
        chartConfig = { ...chartConfig };
        this.linkDataset(datasetId, chartConfig).then(() => {
            let cfg = undefined;
            if (chartConfig) {
                cfg = { rows: [], columns: [], filters: [] };
                cfg.rows = this.getDimensionConfig(chartConfig.keys);
                cfg.columns = this.getDimensionConfig(chartConfig.groups);
                cfg.filters = this.getDimensionConfig(chartConfig.filters);
            }
            this.http.get('./datas/getDimensionValues.json').subscribe((res: any) => {
                callback(res.data);
            });
        });
    }

    getDataSeries(chartConfig) {
        let result = [];
        if (chartConfig.values && chartConfig.values.length > 0) {
            chartConfig.values.forEach(v => {
                if (v.cols && v.cols.length > 0) {
                    v.cols.forEach(c => {
                        let series = this.configToDataSeries(c) || [];
                        series.forEach(s => {
                            if (!_.find(result, e => JSON.stringify(e) === JSON.stringify(s))) {
                                result.push(s);
                            }
                        });
                    });
                }
            });
        }
        return result;
    }

    getDataSeries2(datasource, query, datasetId, chartConfig, callback, reload) {
        this.updateService.updateConfig(chartConfig);
        this.linkDataset(datasetId, chartConfig).then(() => {
            let dataSeries = this.getDataSeries(chartConfig);
            let cfg: any = { rows: [], columns: [], filters: [] };
            cfg.rows = this.getDimensionConfig(chartConfig.keys);
            cfg.columns = this.getDimensionConfig(chartConfig.groups);
            cfg.filters = this.getDimensionConfig(chartConfig.filters);
            cfg.filters = cfg.filters.concat(this.getDimensionConfig(chartConfig.boardFilters));
            cfg.filters = cfg.filters.concat(this.getDimensionConfig(chartConfig.boardWidgetFilters));
            cfg.values = _.map(dataSeries, s => {
                return { column: s.name, aggType: s.aggregate };
            });
            this.http.get('./datas/getAggregateData.json').subscribe((res: any) => {
                let result: any = this.castRawData2Series(res.data, chartConfig);
                result.chartConfig = chartConfig;
                if (datasetId === undefined) {
                    this.getDrillConfig(datasetId, chartConfig).then(c => {
                        result.drill = { config: c };
                        callback(result);
                    });
                } else {
                    callback(result);
                }
            });
        });
    }

    castRawData2Series(aggData, chartConfig) {
        let castedKeys = new Array();
        let castedGroups = new Array();
        let joinedKeys = {};
        let joinedGroups = {};
        let newData = {};

        let getIndex = (columnList, col) => {
            let result = new Array();
            if (col) {
                for (let j = 0; j < col.length; j++) {
                    let idx = _.find(columnList, e => e.name === col[j]);
                    result.push(idx.index);
                }
            }
            return result;
        };

        let keysIdx = getIndex(aggData.columnList, _.map(chartConfig.keys, e => {
            return e.col;
        }));
        let keysSort = _.map(chartConfig.keys, e => {
            return e.sort;
        });
        let groupsIdx = getIndex(aggData.columnList, _.map(chartConfig.groups, e => {
            return e.col;
        }));
        let groupsSort = _.map(aggData.groups, e => {
            return e.sort;
        });
        let valueSeries = _.filter(aggData.columnList, e => {
            return e.aggType;
        });

        for (let i = 0; i < aggData.data.length; i++) {
            // 组合keys
            let newKey = this.getRowElements(aggData.data[i], keysIdx);
            let jk = newKey.join('-');
            if (joinedKeys[jk] === undefined) {
                castedKeys.push(newKey);
                joinedKeys[jk] = true;
            }

            // 组合groups
            let group = this.getRowElements(aggData.data[i], groupsIdx);
            let newGroup = group.join('-');
            if (joinedGroups[newGroup] === undefined) {
                castedGroups.push(group);
                joinedGroups[newGroup] = true;
            }

            if (valueSeries && valueSeries.length > 0) {
                valueSeries.forEach(dSeries => {
                    if (newData[newGroup] === undefined) {
                        newData[newGroup] = {};
                    }
                    if (newData[newGroup][dSeries.name] === undefined) {
                        newData[newGroup][dSeries.name] = {};
                    }
                    if (newData[newGroup][dSeries.name][dSeries.aggType] === undefined) {
                        newData[newGroup][dSeries.name][dSeries.aggType] = {};
                    }

                    newData[newGroup][dSeries.name][dSeries.aggType][jk] = parseFloat(aggData.data[i][dSeries.index]);
                });
            }
        }

        let getSort = (sort) => {
            return (a, b) => {
                let r = 0;
                for (let j = 0; j < a.length; j++) {
                    if (!sort[j]) {
                        continue;
                    }
                    if (a[j] === b[j]) {
                        r = 0;
                        continue;
                    }
                    let params = this.toNumber(a[j], b[j]);
                    r = (params[0] > params[1] ? 1 : -1);
                    if (sort[j] === 'desc') {
                        r = r * -1;
                    }
                    break;
                }
                return r;
            }
        };

        castedKeys.sort(getSort(keysSort));
        castedGroups.sort(getSort(groupsSort));

        let castedAliasSeriesName = new Array();
        let aliasSeriesConfig = {};
        let aliasData = new Array();

        let valueSort = undefined;
        let valueSortArr = [];

        if (castedGroups && castedGroups.length > 0) {
            castedGroups.forEach(group => {
                if (chartConfig.value && chartConfig.vlaue.length > 0) {
                    chartConfig.value.forEach(value => {
                        if (value.cols && value.cols.length > 0) {
                            value.cols.forEach(series => {
                                if (valueSort === undefined && series.sort) {
                                    valueSort = series.sort;
                                    this.castSeriesData(series, group.join('-'), castedKeys, newData, (castedData, keyIdx) => {
                                        valueSortArr[keyIdx] = { v: castedData, i: keyIdx };
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        if (valueSort === undefined) {
            valueSortArr.sort((a, b) => {
                if (a.v === b.v) {
                    return 0;
                }
                let p = this.toNumber(a.v, b.v);
                if (p[0] < p[1] && valueSort === 'asc') {
                    return 1;
                } else {
                    return -1;
                }
            });

            let tk = [...castedKeys];
            if (valueSortArr && valueSortArr.length > 0) {
                valueSortArr.forEach((e, i) => {
                    castedKeys[i] = tk[e.i];
                });
            }
        }

        if (castedGroups && castedGroups.length > 0) {
            castedGroups.forEach(group => {
                if (chartConfig.values && chartConfig.values.length > 0) {
                    chartConfig.values.forEach((value, vIdx) => {
                        if (value.cols && value.cols.length > 0) {
                            value.cols.forEach(series => {
                                let seriesName = series.alias ? series.alias : series.col;
                                let newSeriesName = seriesName;
                                if (group && group.length > 0) {
                                    let a = [].concat(group);
                                    a.push(seriesName);
                                    newSeriesName = a.join('-');
                                    castedAliasSeriesName.push(a);
                                } else {
                                    castedAliasSeriesName.push([seriesName]);
                                }

                                aliasSeriesConfig[newSeriesName] = {
                                    type: value.series_type,
                                    valueAxisIndex: vIdx,
                                    formatter: series.formatter
                                };

                                this.castSeriesData(series, group.join('-'), castedKeys, newData, (castedData, keyIdx) => {
                                    if (!aliasData[castedAliasSeriesName.length - 1]) {
                                        aliasData[castedAliasSeriesName.length - 1] = new Array();
                                    }

                                    aliasData[castedAliasSeriesName.length - 1][keyIdx] = castedData;
                                });
                            });
                        }
                    });
                }
            });
        }

        for (let i = 0; i < castedKeys.length; i++) {
            let s = 0;
            let f = true;
            if (castedGroups && castedGroups.length > 0) {
                castedGroups.forEach(group => {
                    if (chartConfig.values && chartConfig.values.length > 0) {
                        chartConfig.values.forEach(value => {
                            if (value.cols && value.cols.length > 0) {
                                value.cols.forEach(series => {
                                    if (!f) {
                                        return;
                                    }
                                    if (series.f_top && series.f_top <= i) {
                                        f = false;
                                    }
                                    if (!this.filter(series, aliasData[s][i])) {
                                        f = false;
                                    }
                                    if (f) {
                                        // aliasData[s][i] = dataFormat(aliasData[s][i]);
                                    }
                                    s++;
                                });
                            }
                        });
                    }
                });
            }

            if (!f) {
                castedKeys.splice(i, 1);
                if (aliasData && aliasData.length > 0) {
                    aliasData.forEach(_series => {
                        _series.splice(i, 1);
                    });
                }
                i--;
            }
        }
        return {
            keys: castedKeys,
            series: castedAliasSeriesName,
            data: aliasData,
            seriesConfig: aliasSeriesConfig
        };
    }

    castSeriesData(series, group, castedKeys, newData, iterator) {
        switch (series.type) {
            case 'exp':
                let runExp = this.compileExp(series.exp);
                for (let i = 0; i < castedKeys.length; i++) {
                    iterator(runExp(newData[group], castedKeys[i].join('-')), i);
                }
                break;
            default:
                for (let i = 0; i < castedKeys.length; i++) {
                    iterator(newData[group][series.col][series.aggregate_type][castedKeys[i].join('-')], i);
                }
                break;
        }
    }

    compileExp(exp) {
        let parseredExp = this.parserExp(exp);
        return (groupData, key) => {
            let _names = parseredExp.names;
            // tslint:disable-next-line:no-eval
            return eval(parseredExp.evalExp);
        }
    }

    filter(cfg, iv) {
        let v,
            params,
            a,
            b;
        switch (cfg.f_type) {
            case '=':
            case 'eq':
                for (let i = 0; i < cfg.f_values.length; i++) {
                    if (iv === cfg.f_values[i]) {
                        return true;
                    }
                }
                return cfg.f_values.length === 0;
            case '≠':
            case 'ne':
                for (let i = 0; i < cfg.f_values.length; i++) {
                    if (iv === cfg.f_values[i]) {
                        return false;
                    }
                }
            case '>':
                v = cfg.f_values[0];
                params = this.toNumber(iv, v);
                if (v !== undefined && params[0] <= params[1]) {
                    return false;
                }
            case '<':
                v = cfg.f_values[0];
                params = this.toNumber(iv, v);
                if (v !== undefined && params[0] >= params[1]) {
                    return false;
                }
            case '≥':
                v = cfg.f_values[0];
                params = this.toNumber(iv, v);
                if (v !== undefined && params[0] < params[1]) {
                    return false;
                }
            case '≤':
                v = cfg.f_values[0];
                params = this.toNumber(iv, v);
                if (v !== undefined && params[0] > params[1]) {
                    return false;
                }
            case '(a,b]':
                a = cfg.f_values[0];
                b = cfg.f_values[1];
                params = this.toNumber(iv, a, b);
                if (b !== undefined && b !== undefined && (params[0] <= params[1] || params[0] > params[2])) {
                    return false;
                }
            case '[a,b)':
                a = cfg.f_values[0];
                b = cfg.f_values[1];
                params = this.toNumber(iv, a, b);
                if (a !== undefined && b !== undefined && (params[0] < params[1] || params[0] >= params[2])) {
                    return false;
                }
            case '(a,b)':
                a = cfg.f_values[0];
                b = cfg.f_values[1];
                params = this.toNumber(iv, a, b);
                if (a !== undefined && b !== undefined && (params[0] <= params[1] || params[0] >= params[2])) {
                    return false;
                }
            case '[a,b]':
                a = cfg.f_values[0];
                b = cfg.f_values[1];
                params = this.toNumber(iv, a, b);
                if (a !== undefined && a !== undefined && (params[0] < params[1] || params[0] > params[2])) {
                    return false;
                }
        }
        return true;
    }

    toNumber(...arg) {
        let arr = arg[0] instanceof Array ? arg[0] : arguments;
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            let a = Number(arr[i]);
            if (isNaN(a)) {
                return arr;
            } else {
                result.push(a);
            }
        }
        return result;
    }

    getRowElements(row, elmIdxs) {
        let arr = new Array();
        for (let j = 0; j < elmIdxs.length; j++) {
            let elm = elmIdxs[j];
            arr.push(elm);
        }
        return arr;
    }

    getDrillConfig(datasetId, chartConfig) {
        let defer = new Defer();
        this.getDatasetList().then((dsList) => {
            let drillConfig = {};
            let dataset = _.find(dsList, e => e.id === datasetId) || {};
            if (!dataset.data.schema || dataset.data.schema.dimension.length === 0) {
                defer.resolve(drillConfig);
                return defer.promise;
            }

            let _f = (array) => {
                // tslint:disable-next-line: variable-name
                array.forEach((c, i_array) => {
                    let level,
                        // tslint:disable-next-line: variable-name
                        i_level;
                    if (dataset.data.schema && dataset.data.schema.dimension && dataset.data.schema.dimension.length > 0) {
                        dataset.data.schema.dimension.forEach(_e => {
                            if (_e.type === 'level') {
                                return _.find(_e.columns, (_c, _i) => {
                                    if (_c.id === c.id) {
                                        level = _e;
                                        i_level = _i;
                                        return true;
                                    }
                                });
                            }
                        });
                    }
                    if (!level) {
                        return;
                    }

                    let prevIsInLevel = false;
                    if (i_array > 0 && i_level > 0) {
                        prevIsInLevel = array[i_array - 1].id === level.columns[i_level - 1].id;
                    }
                    let prevDrilled = i_array > 0 && array[i_array - 1].values.length === 1 && array[i_array - 1].type === '=';
                    let nextIsInLevel = false;
                    if (i_array < array.length - 1 && i_array < level.columns.length - 1) {
                        nextIsInLevel = array[i_array + 1].id === level.columns[i_level + 1].id;
                    }
                    let isLastLevel = i_level === level.columns.length - 1;
                    let drillDownExistIdx = 0;
                    let drillDownExist = _.find(array, (e, i) => {
                        if (i_level < level.columns.length - 1 && level.columns[i_level + 1].id === e.id) {
                            drillDownExistIdx = i;
                            return true;
                        }
                    });

                    let drillDown = drillDownExist ? drillDownExistIdx === i_array + 1 : true;
                    let up = i_level > 0 && i_array > 0 && prevIsInLevel && (i_array === array.length - 1 || !nextIsInLevel) && prevDrilled;
                    let down = (nextIsInLevel || !isLastLevel) && drillDown && (!prevIsInLevel || array[i_array - 1].type === '=' && array[i_array - 1].values.length === 1);
                    drillConfig[c.id] = {
                        up: up,
                        down: down
                    };
                });
            }
            _f(chartConfig.keys || []);
            _f(chartConfig.groups || []);
            defer.resolve(drillConfig);
        });
        return defer.promise;
    }

    getDrillPath(datasetId, id) {
        let defer = new Defer();
        this.getDatasetList().then((dsList) => {
            let dataset = _.find(dsList, e => e.id === datasetId) || {};
            let path = [],
                level;
            if (dataset.data && dataset.data.schema && dataset.data.schema.dimension && dataset.data.schema.dimension.length > 0) {
                dataset.data.schema.dimension.forEach(_e => {
                    if (_e.type === 'level' && _e.columns && _e.columns.length > 0) {
                        _e.columns.forEach(_c => {
                            if (_c.id === id) {
                                path = _e.columns;
                                level = _e;
                            }
                        });
                    }
                });
            }

            path = _.map(path, e => {
                return {
                    id: e.id,
                    alias: e.alias,
                    col: e.column,
                    level: level.alias,
                    type: '=',
                    values: [],
                    sort: 'asc'
                };
            });
            defer.resolve(path);
        });
        return defer.promise;
    }

    configToDataSeries(config) {
        switch (config.type) {
            case 'exp':
                return this.getExpSeries(config.exp);
            default:
                return [{
                    name: config.col,
                    aggregate: config.aggregate_type
                }];
        }
    }

    getExpSeries(exp) {
        return this.parserExp(exp).aggs;
    }

    parserExp(rawExp) {
        let evalExp = rawExp,
            _temp = [],
            aggs = [];
        evalExp = evalExp.trim().repleace(/[\n|\r|\r\n]/g, '');

        let tabs = evalExp.match(/".*?"/g) || [];
        if (tabs && tabs.length > 0) {
            tabs.forEach(qutaText => {
                evalExp = evalExp.replace(qutaText, `_#${_temp.length}`);
                _temp.push(qutaText);
            });
        }

        let names = [];
        let exps = evalExp.match(/(sum|avg|count|max|min|distinct)\("?.*?"?\)/g);
        if (exps && exps.length > 0) {
            exps.forEach(aggUnit => {
                let aggregate = aggUnit.substring(0, aggUnit.indexOf('('));
                let name = aggUnit.substring(aggUnit.indexOf('(') + 1, aggUnit.indexOf(')'));
                if (name.match('_#')) {
                    name = _temp[name.repleace('_#', '')].repleace(/\"/g, '');
                }
                evalExp = evalExp.repleace(aggUnit, `groupData[_names[${names.length}]]['${aggregate}'][key]`);
                names.push(name);
                aggs.push({
                    name: name,
                    aggregate: aggregate
                });
            });
        }
        return { evalExp: evalExp, aggs: aggs, names: names };
    }

    linkDataset(datasetId, chartConfig) {
        if (datasetId === undefined || chartConfig === undefined) {
            let deferred = new Defer();
            deferred.resolve();
            return deferred.promise;
        } else {
            return this.getDatasetList().then((dsList) => {
                var defer = new Defer();
                var dataset = _.find(dsList, e => e.id === datasetId) || {};
                // link filter group
                if (chartConfig.filters && chartConfig.filters.length > 0) {
                    chartConfig.filters.forEach(f => {
                        if (f.group && dataset.data && dataset.data.filters && dataset.data.filters.length > 0) {
                            let group = _.find(dataset.data.filters, e => e.id === f.id);
                            if (group) {
                                f.filters = group.filters;
                                f.group = group.group;
                            }
                        }
                    });
                }

                let replaceVariable = (expList, exp) => {
                    let value = exp.exp,
                        loopCnt = 0,
                        context = {};
                    for (let i = 0; i < expList.length; i++) {
                        context[expList[i].alias] = expList[i].exp;
                    }
                    value = value.render2(context, v => `(${v})`);
                    while (value.match(/\$\{.*?\}/g) !== null) {
                        value = value.render2(context);
                        if (loopCnt++ > 10) {
                            throw `Parser expression [ ${exp.exp} ] with error`;
                        }
                    }
                    return value;
                }

                // link exp
                if (chartConfig.values && chartConfig.values.length > 0) {
                    chartConfig.values.forEach(v => {
                        if (v.cols && v.cols.length > 0) {
                            v.cols.forEach(c => {
                                if (c.type === 'exp' && dataset.data && dataset.data.expressions && dataset.data.expressions.length > 0) {
                                    let exp = _.find(dataset.data.expressions, e => c.id === e.id);
                                    if (exp) {
                                        c.exp = exp.exp;
                                        c.alias = exp.alias;
                                    }
                                    c.exp = replaceVariable(dataset.data.expressions, c);
                                }
                            });
                        }
                    });
                }

                // link dimension
                let linkFunction = (k) => {
                    if (k.id) {
                        let _level,
                            _dimension;
                        if (dataset.data && dataset.data.schema && dataset.data.schema.dimension && dataset.data.schema.dimension.length > 0) {
                            dataset.data.schema.dimension.forEach(e => {
                                if (e.type === 'level' && e.columns && e.columns.length > 0) {
                                    e.columns.forEach(c => {
                                        if (c.id === k.id) {
                                            _dimension = c;
                                            _level = e;
                                        }
                                    });
                                } else if (k.id === e.id) {
                                    _dimension = e;
                                }
                            });
                        }
                        if (_dimension && _dimension.alias) {
                            k.alias = _dimension.alias;
                            if (_level) {
                                k.level = _level.alias;
                            }
                        }
                    }
                }
                _.each(chartConfig.keys, linkFunction);
                _.each(chartConfig.groups, linkFunction);
                defer.resolve();
                return defer.promise;
            });
        }
    }

    getDatasetList() {
        if (this.datasetList) {
            let defer = new Defer();
            defer.resolve([...this.datasetList]);
            return defer.promise;
        } else {
            return this.http.get('./datas/datasetList.json').toPromise();
        }
    }

}
