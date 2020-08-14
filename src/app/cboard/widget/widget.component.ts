import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';
import * as $ from 'jquery';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from '@ism/ng-cores';
import { TreeConfig } from 'src/app/common/treeConfig';
import { TreeComponent, TreeNode } from 'angular-tree-component';


@Component({
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.less']
})
export class WidgetComponent implements OnInit {

    @ViewChild('tree', { static: true }) tree: TreeComponent;
    stateParams: any;
    @ViewChild('expTpl', { static: true }) expTpl: TemplateRef<any>;
    @ViewChild('paramTpl', { static: true }) paramTpl: TemplateRef<any>;
    @ViewChild('vfilterTpl', { static: true }) vfilterTpl: TemplateRef<any>;
    @ViewChild('fGroupTpl', { static: true }) fGroupTpl: TemplateRef<any>;

    updateUrl: string;
    liteMode: boolean;
    provinces: any[];
    tab = 'preview_widget2';
    // tslint:disable-next-line: variable-name
    chart_types: any[];
    // tslint:disable-next-line: variable-name
    chart_types_status: any;
    // tslint:disable-next-line: variable-name
    value_series_types: any[];
    // tslint:disable-next-line: variable-name
    china_map_types: any[];
    // tslint:disable-next-line: variable-name
    value_aggregate_types: any[];
    // tslint:disable-next-line: variable-name
    value_pie_types: any[];
    // tslint:disable-next-line: variable-name
    kpi_styles: any[];
    // tslint:disable-next-line: variable-name
    treemap_styles: any[];
    // tslint:disable-next-line: variable-name
    heatmap_styles: any[];
    // tslint:disable-next-line: variable-name
    heatmap_date_format: any[];
    // tslint:disable-next-line: variable-name
    liquid_fill_style: any[];
    configRule: any;

    // 界面控制
    loading: boolean;
    toChartDisabled: boolean;
    optFlag: string;
    alerts: any[];
    treeData: any[];
    private treeID: string;
    private viewQueryMoal: boolean;
    private loadingPre: boolean;
    private ignoreChanges: boolean;
    keywords: string;

    datasource;
    dataset;
    widgetName: string;
    widgetCategory;
    widgetId;
    curWidget: any;
    previewDivWidth: number;
    expressions: any[];
    customDs: boolean;
    loadFromCache: boolean;
    filterSelect: any;
    verify: any;
    params: any[];
    curDataset;

    datasetList: any[];
    datasourceList: any[];
    widgetList: any[];
    categoryList: any[];
    columns: any[];
    schema: any;

    helpMessage: any;

    dndTransfer: any;
    selectsByFilter: any[];
    selects: any[];
    treeConfig: any;
    cities: any[];

    targetHighlight: any;
    options: any = new TreeConfig();
    private dataService: any;
    private chartService: any;
    private updateService: any;

    constructor(
        private translate: TranslateService,
        private http: HttpClient,
        private modal: NgbActiveModal,
        private dialog: DialogService,
    ) { }

    ngOnInit(): void {
        this.translate.addLangs(['en', 'zh-cn']);
        this.translate.setDefaultLang('zh-cn');
        this.translate.use('zh-cn');
        let self = this;
        this.updateUrl = './datas/updateWidget.json';
        this.chart_types = [
            {
                name: this.translate.instant('CONFIG.WIDGET.TABLE'), value: 'table', class: 'cTable',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.LINE_BAR'), value: 'line', class: 'cLine',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.CONTRAST'), value: 'contrast', class: 'cContrast',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_2')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.SCATTER'), value: 'scatter', class: 'cScatter',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.PIE'), value: 'pie', class: 'cPie',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.KPI'), value: 'kpi', class: 'cKpi',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.FUNNEL'), value: 'funnel', class: 'cFunnel',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.SANKEY'), value: 'sankey', class: 'cSankey',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.RADAR'), value: 'radar', class: 'cRadar',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.MAP'), value: 'map', class: 'cMap',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.GAUGE'), value: 'gauge', class: 'cGauge',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.WORD_CLOUD'), value: 'wordCloud', class: 'cWordCloud',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.TREE_MAP'), value: 'treeMap', class: 'cTreeMap',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.HEAT_MAP_CALENDER'), value: 'heatMapCalendar', class: 'cHeatMapCalendar',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.HEAT_MAP_TABLE'), value: 'heatMapTable', class: 'cHeatMapTable',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.LIQUID_FILL'), value: 'liquidFill', class: 'cLiquidFill',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.AREA_MAP'), value: 'areaMap', class: 'cAreaMap',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.CHINA_MAP'), value: 'chinaMap', class: 'cChinaMap',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.CHINA_MAP_BMAP'), value: 'chinaMapBmap', class: 'cChinaMapBmap',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.RELATION'), value: 'relation', class: 'cRelation',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_2'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_2'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }, {
                name: this.translate.instant('CONFIG.WIDGET.WORLD_MAP'), value: 'worldMap', class: 'cWorldMap',
                row: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.translate.instant('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }
        ];
        this.chart_types_status = {
            line: true,
            pie: true,
            kpi: true,
            table: true,
            funnel: true,
            sankey: true,
            radar: true,
            map: true,
            scatter: true,
            gauge: true,
            wordCloud: true,
            treeMap: true,
            heatMapCalendar: true,
            heatMapTable: true,
            liquidFill: true,
            areaMap: true,
            contrast: true,
            chinaMap: true,
            chinaMapBmap: true,
            relation: true,
            worldMap: true
        };
        this.value_series_types = [
            { name: this.translate.instant('CONFIG.WIDGET.LINE'), value: 'line' },
            { name: this.translate.instant('CONFIG.WIDGET.AREA_LINE'), value: 'arealine' },
            { name: this.translate.instant('CONFIG.WIDGET.STACKED_LINE'), value: 'stackline' },
            { name: this.translate.instant('CONFIG.WIDGET.PERCENT_LINE'), value: 'percentline' },
            { name: this.translate.instant('CONFIG.WIDGET.BAR'), value: 'bar' },
            { name: this.translate.instant('CONFIG.WIDGET.STACKED_BAR'), value: 'stackbar' },
            { name: this.translate.instant('CONFIG.WIDGET.PERCENT_BAR'), value: 'percentbar' }
        ];
        this.china_map_types = [
            { name: this.translate.instant('CONFIG.WIDGET.SCATTER_MAP'), value: 'scatter' },
            { name: this.translate.instant('CONFIG.WIDGET.HEAT_MAP'), value: 'heat' },
            { name: this.translate.instant('CONFIG.WIDGET.MARK_LINE_MAP'), value: 'markLine' }
        ];
        this.value_aggregate_types = [
            { name: 'sum', value: 'sum' },
            { name: 'count', value: 'count' },
            { name: 'avg', value: 'avg' },
            { name: 'max', value: 'max' },
            { name: 'min', value: 'min' },
            { name: 'distinct', value: 'distinct' }
        ];
        this.value_pie_types = [
            { name: this.translate.instant('CONFIG.WIDGET.PIE'), value: 'pie' },
            { name: this.translate.instant('CONFIG.WIDGET.DOUGHNUT'), value: 'doughnut' },
            { name: this.translate.instant('CONFIG.WIDGET.COXCOMB'), value: 'coxcomb' }
        ];
        this.kpi_styles = [
            { name: this.translate.instant('CONFIG.WIDGET.AQUA'), value: 'bg-aqua' },
            { name: this.translate.instant('CONFIG.WIDGET.RED'), value: 'bg-red' },
            { name: this.translate.instant('CONFIG.WIDGET.GREEN'), value: 'bg-green' },
            { name: this.translate.instant('CONFIG.WIDGET.YELLOW'), value: 'bg-yellow' }
        ];

        this.load();
        this.treemap_styles = [
            { name: this.translate.instant('CONFIG.WIDGET.RANDOM'), value: 'random' },
            { name: this.translate.instant('CONFIG.WIDGET.MULTI'), value: 'multi' },
            { name: this.translate.instant('CONFIG.WIDGET.BLUE'), value: 'blue' },
            { name: this.translate.instant('CONFIG.WIDGET.RED'), value: 'red' },
            { name: this.translate.instant('CONFIG.WIDGET.GREEN'), value: 'green' },
            { name: this.translate.instant('CONFIG.WIDGET.YELLOW'), value: 'yellow' },
            { name: this.translate.instant('CONFIG.WIDGET.PURPLE'), value: 'purple' }
        ];
        this.heatmap_styles = [
            { name: this.translate.instant('CONFIG.WIDGET.BLUE'), value: 'blue' },
            { name: this.translate.instant('CONFIG.WIDGET.RED'), value: 'red' },
            { name: this.translate.instant('CONFIG.WIDGET.GREEN'), value: 'green' },
            { name: this.translate.instant('CONFIG.WIDGET.YELLOW'), value: 'yellow' },
            { name: this.translate.instant('CONFIG.WIDGET.PURPLE'), value: 'purple' }
        ];
        this.heatmap_date_format = [
            { name: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
            { name: 'yyyy/MM/dd', value: 'yyyy/MM/dd' },
            { name: 'yyyyMMdd', value: 'yyyyMMdd' }
        ];
        this.liquid_fill_style = [
            { name: this.translate.instant('CONFIG.WIDGET.CIRCLE'), value: 'circle' },
            { name: this.translate.instant('CONFIG.WIDGET.PIN'), value: 'pin' },
            { name: this.translate.instant('CONFIG.WIDGET.RECT'), value: 'rect' },
            { name: this.translate.instant('CONFIG.WIDGET.ARROW'), value: 'arrow' },
            { name: this.translate.instant('CONFIG.WIDGET.TRIANGLE'), value: 'triangle' },
            { name: this.translate.instant('CONFIG.WIDGET.ROUND_RECT'), value: 'roundRect' },
            { name: this.translate.instant('CONFIG.WIDGET.SQUARE'), value: 'square' },
            { name: this.translate.instant('CONFIG.WIDGET.DIAMOND'), value: 'diamond' }
        ];
        this.configRule = {
            line: { keys: 2, groups: -1, filters: -1, values: 2 },
            pie: { keys: 2, groups: -1, filters: -1, values: 2 },
            kpi: { keys: 0, groups: 0, filters: -1, values: 1 },
            table: { keys: -1, groups: -1, filters: -1, values: -1 },
            funnel: { keys: -1, groups: 0, filters: -1, values: 2 },
            sankey: { keys: 2, groups: 2, filters: -1, values: 1 },
            radar: { keys: 2, groups: -1, filters: -1, values: 2 },
            map: { keys: 2, groups: -1, filters: -1, values: 2 },
            scatter: { keys: 2, groups: -1, filters: -1, values: 2 },
            gauge: { keys: 0, groups: 0, filters: -1, values: 1 },
            wordCloud: { keys: 2, groups: 0, filters: -1, values: 1 },
            treeMap: { keys: 2, groups: 0, filters: -1, values: 1 },
            areaMap: { keys: 2, groups: -1, filters: -1, values: 1 },
            heatMapCalendar: { keys: 1, groups: 0, filters: -1, values: 1 },
            heatMapTable: { keys: 2, groups: 2, filters: -1, values: 1 },
            liquidFill: { keys: 0, groups: 0, filters: -1, values: 1 },
            contrast: { keys: 1, groups: 0, filters: -1, values: 2 },
            chinaMap: { keys: 2, groups: -1, filters: -1, values: 2 },
            chinaMapBmap: { keys: 2, groups: -1, filters: -1, values: 2 },
            relation: { keys: 2, groups: 2, filters: -1, values: 1 },
            worldMap: { keys: 2, groups: -1, filters: -1, values: 1 }
        };

        this.loading = false;
        this.toChartDisabled = true;
        this.optFlag = '';
        this.alerts = [];
        this.treeData = [];
        this.options.actionMapping = {
            mouse: {
                dblClick: (tree, node, $event) => {
                    if (!node.hasChildren) {
                        self.editNode(node);
                    }
                }
            },
            keys: {
                46: (tree, node, $event) => {
                    self.deleteNode();
                }
            }
        };
        // Set to a same value with treeDom
        this.treeID = 'widgetTreeID';
        this.curWidget = {};
        this.previewDivWidth = 12;
        this.expressions = [];
        this.customDs = false;
        this.loadFromCache = true;
        this.filterSelect = {};
        this.verify = { widgetName: true };
        this.params = [];

        this.dndTransfer = {
            toCol: (list, index, item, type) => {
                if (type === 'key' || type === 'group' || type === 'filter') {
                    list[index] = { col: item.col, aggregate_type: 'sum' };
                } else if (type === 'select' || type === 'measure') {
                    list[index] = { col: item.column, aggregate_type: 'sum' };
                }
                this.onDragCancle();
            },
            toSelect: (list, index, item, type) => {
                if (type === 'col') {
                    list[index] = item.col;
                } else if (type === 'key' || type === 'group' || type === 'filter') {
                    list[index] = item.col;
                }
            },
            toKeysGroups: (list, index, item, type) => {
                if (type === 'col') {
                    list[index] = { col: item.col, type: 'eq', values: [], sort: 'asc' };
                } else if (type === 'dimension' || type === 'select') {
                    list[index] = {
                        alias: item.alias,
                        col: item.column,
                        level: item.level,
                        type: 'eq',
                        values: [],
                        sort: 'asc'
                    };
                    if (type === 'dimension') {
                        list[index].id = item.id;
                    }
                }
            },
            attachLevel: (column, level) => {
                column.level = level.alias;
                return column;
            }
        };
        this.selectsByFilter = [];
        this.selects = [];
        $(`#${this.treeID}`).keyup(function (e) {
            if (e.keyCode === 46) {
                self.deleteNode();
            }
        });

        this.targetHighlight = { row: false, column: false, value: false, filter: false };
    }

    async load() {
        let res: any = await this.http.get('./datas/citycode.json').toPromise();
        this.provinces = (res && res.provinces) || [];
        await this.loadDataset();
        await this.getWidgetList();
    }

    // 删除spl语句错误提示
    closeAlert(alert: any) {
        this.alerts.splice(this.alerts.indexOf(alert), 1);
    }

    buildTree(list: any[], root?: any, name?: string): Array<any> {
        if (!name) {
            name = 'Root';
        }
        let listOut = [{
            id: 'root',
            name: name,
            isExpanded: true,
            children: []
        }];
        let node: any;
        if (root) {
            listOut[0] = root;
        }

        node = listOut[0];
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let attrs = item.categoryName ? item.categoryName.split('/') : [];
            attrs.forEach((name: string, index: number) => {
                node = this.getRoot(node, item.categoryId || attrs.splice(0, index + 1).join('/'), name);
            });

            if (!node.children) {
                node.children = [];
            }
            node.children.push(item);
            node = listOut[0];
        }
        return listOut;
    }

    getRoot(root: any, id: string, name: string): any {
        let node = null;
        if (root.children) {
            for (let i = 0; i < root.children.length; i++) {
                let item = root.children[i];

                if (item.id === id) {
                    node = item;
                    break;
                }
            }
        } else {
            root.children = [];
        }

        if (node === null) {
            node = {
                id: id,
                name: name,
                isExpanded: true,
                children: []
            };
            root.children.push(node);
        }
        return node;
    }

    find(list: any[], str: string) {
        let fd;
        list.forEach(item => {

        });
    }

    switchLiteMode(mode) {
        if (mode) {
            this.liteMode = mode;
        } else {
            this.liteMode = !this.liteMode;
        }
    }

    async loadDataset(callback?) {
        let res: any = await this.http.get('./datas/datasetList.json').toPromise();
        if (res.success) {
            this.datasetList = res.data || [];
            if (callback) {
                callback();
            }
        }
    }

    async getDatasourceList() {
        let res: any = await this.http.get('./datas/datasourceList.json').toPromise();
        if (res.success) {
            this.datasourceList = res.data || [];
            this.getCategoryList();
            this.getWidgetList(() => {
                if (this.stateParams.id) {
                    this.editWgt(_.find(this.widgetList, w => w.id === this.stateParams.id));
                } else if (this.stateParams.id === null && this.stateParams.datasetId) {
                    this.newWgt({ datasetId: parseInt(this.stateParams.datasetId) });
                    this.loadDataset();
                }
            });
        }
    }

    getCurDatasetName() {
        if (this.customDs) {
            return this.translate.instant('CONFIG.WIDGET.NEW_QUERY');
        } else {
            var curDS = _.find(this.datasetList, ds => ds.id === this.curWidget.datasetId);
            return curDS ? curDS.name : null;
        }
    }

    datasetGroup(item) {
        return item.categoryName;
    }

    async getWidgetList(callback?) {
        let res: any = await this.http.get('./datas/widgetList.json').toPromise();
        if (res.success) {
            this.widgetList = (res && res.data) || [];
            if (callback) {
                callback();
            }
            this.searchNode();
        }
    }

    async getCategoryList() {
        let res: any = await this.http.get('./datas/widgetCategoryList.json').toPromise();
        if (res.success) {
            this.categoryList = (res && res.data) || [];
            $('#widgetName').autocomplete({
                source: this.categoryList
            });
        }
    }

    viewExp(exp) {
        // this.modal.
        // alert
        this.dialog.alert(this.translate.instant('CONFIG.COMMON.CUSTOM_EXPRESSION') + ': ' + exp.alias);
    }

    expScope: any;
    editExp(col) {
        let ok;
        this.expScope = {
            columnObjs: this.schemaToSelect(this.schema),
            data: { expressions: '' },
            curWidget: this.curWidget,
            aggregate: this.value_aggregate_types
        };
        if (!col) {
            ok = (dt) => {
                this.curWidget.expressions.push({
                    type: 'exp',
                    exp: dt.expressions,
                    alias: dt.alias
                });
            };
        } else {
            this.expScope.data.expressions = col.exp;
            this.expScope.data.alias = col.alias;
            ok = (dt) => {
                col.exp = dt.expressions;
                col.alias = dt.alias;
            };
        }

        this.dialog.open(this.expTpl).result.then((res) => {
            console.log(res);
            ok(res);
        });
    }

    loadData() {
        this.toChartDisabled = false;
        this.newConfig();
        this.filterSelect = {};
        this.loadDataset(() => {
            this.curWidget.expressions = [];
            this.loadDsExpressions();
            this.curWidget.filterGroups = [];
            this.loadDsFilterGroups();
            this.buildSchema();
        });
        this.cleanPreview();
    }

    newWgt(curWidget) {
        this.curWidget = {};
        if (curWidget) {
            this.curWidget = curWidget;
        }

        this.curWidget = {
            ...this.curWidget,
            ...{
                config: { option: {} },
                expressions: [],
                filterGroups: [],
                query: {}
            }
        };

        this.datasource = null;
        this.widgetName = null;
        this.widgetCategory = null;
        this.widgetId = null;
        this.optFlag = 'new';
        this.customDs = false;
        this.schema = null;
        this.liteMode = false;
        this.cleanPreview();
        this.addValidateWatch();
    }

    loadDsFilterGroups() {
        if (!this.customDs) {
            let find = _.find(this.datasetList, ds => ds.id === this.curWidget.datasetId) || {};
            let fg = (find && find.data && find.data.filters) || [];
            if (fg && fg.length > 0) {
                fg.forEach(e => {
                    this.curWidget.filterGroups.push(e);
                });
            }
        }
    }

    isDsExpression(o) {
        if (this.customDs) {
            return false;
        } else {
            let find = _.find(this.datasetList, ds => ds.id === this.curWidget.datasetId) || {};
            let dsExp = (find && find.data && find.data.expressions) || [];
            let exp;
            if (dsExp && dsExp.length > 0) {
                exp = _.find(dsExp, e => (e.id && o.id === e.id) || o.alias === e.alias);
            }
            return !_.isUndefined(exp);
        }
    }

    isDsFilter(o) {
        if (this.customDs) {
            return false;
        } else {
            let find = _.find(this.datasetList, ds => ds.id === this.curWidget.datasetId) || {};
            let fg = (find && find.data && find.data.filters) || [];
            let f;
            if (fg && fg.length > 0) {
                f = _.find(fg, e => e.id && o.id === e.id);
            }
            return !_.isUndefined(f);
        }
    }

    loadDsExpressions() {
        if (!this.customDs) {
            let find = _.find(this.datasetList, ds => ds.id === this.curWidget.datasetId) || {};
            let dsExp = (find && find.data && find.data.expressions) || [];
            if (dsExp && dsExp.length > 0) {
                dsExp.forEach(e => {
                    this.curWidget.expressions.push(e);
                });
            }
        }
    }

    addWatch() {
        // addWatch
        this.addHelpMessage();
        this.addValidateWatch();
    }

    addHelpMessage() {
        let rowKey = `HELP_MESSAGE.${this.curWidget.config.chart_type.toUpperCase()}.ROW`;
        let columnKey = `HELP_MESSAGE.${this.curWidget.config.chart_type.toUpperCase()}.COLUMN`;
        let filterKey = `HELP_MESSAGE.${this.curWidget.config.chart_type.toUpperCase()}.FILTER`;
        let valueKey = `HELP_MESSAGE.${this.curWidget.config.chart_type.toUpperCase()}.VALUE`;
        let row = this.translate.instant(rowKey) === rowKey ? null : this.translate.instant(rowKey);
        let column = this.translate.instant(columnKey) === columnKey ? null : this.translate.instant(columnKey);
        let filter = this.translate.instant(filterKey) === filterKey ? null : this.translate.instant(filterKey);
        let value = this.translate.instant(valueKey) === valueKey ? null : this.translate.instant(valueKey);
        this.helpMessage = { row: row, column: column, filter: filter, value: value };
    }

    addValidateWatch() {

    }

    clearAlert() {
        this.alerts = [];
        this.verify = { widgetName: true };
    }

    validation() {
        this.alerts = [];
        this.verify = { widgetName: true };
        if (!this.widgetName) {
            this.alerts = [{
                msg: this.translate.instant('CONFIG.WIDGET.WIDGET_NAME') + this.translate.instant('COMMON.NOT_EMPTY'),
                type: 'danger'
            }];
            this.verify = { widgetName: false };
            $('#widgetName').focus();
            return false;
        }
        if (this.customDs === false && this.curWidget.datasetId === undefined) {
            this.alerts = [{
                msg: this.translate.instant('CONGIF.WIDGET.DATASET') + this.translate.instant('COMMON.NOT_EMPTY'),
                type: 'danger'
            }];
            return false;
        }
        if (this.customDs === true) {
            for (let i = 0; i < this.params.length; i++) {
                let name = this.params[i].name;
                let label = this.params[i].label;
                let required = this.params[i].required;
                let value = this.params[i].required;
                if (required === true && value !== 0 && (value === undefined || value === '')) {
                    let pattern = /([\w_\s\.]+)/;
                    let msg = pattern.exec(label);
                    if (msg && msg.length > 0) {
                        msg = this.translate.instant(msg[0]);
                    } else {
                        msg = label;
                    }
                    this.alerts = [{
                        msg: `[${msg}]${this.translate.instant('COMMON.NOT_EMPTY')}`,
                        type: 'danger'
                    }];
                    this.verify[name] = false;
                    return false;
                }
            }
        }
        return true;
    }

    changeChartStatus() {
        for (let type in this.chart_types_status) {
            let rule = this.configRule[type];
            let config = this.curWidget.config;
            let flattenValues = [];
            if (config.values && config.values.length > 0) {
                config.values.forEach(v => {
                    flattenValues = flattenValues.concat(v.cols);
                });
            }

            let r;

            if (_.size(config.keys) === 0 && _.size(config.groups) === 0 && _.size(flattenValues) === 0) {
                r = false;
            } else {
                for (let k in rule) {
                    r = true;
                    if (rule[k] === 2) {
                        if (k === 'values') {
                            r = (_.size(flattenValues) >= 1);
                            if (type === 'contrast') {
                                r = (_.size(flattenValues) === 2); // 限制values数量为2
                            }
                        } else {
                            r = (_.size(config[k]) >= 1);
                        }
                    } else if (rule[k] !== -1) {
                        if (k === 'values') {
                            r = (_.size(flattenValues) === rule[k]);
                        } else {
                            r = (_.size(config[k]) === rule[k]);
                        }
                    }
                    if (!r) {
                        this.chart_types_status[type] = r;
                        break;
                    }
                }
            }

            this.chart_types_status[type] = r;
        }
    }

    // tslint:disable-next-line: variable-name
    changeChart(chart_type) {
        if (!this.chart_types_status[chart_type]) {
            return;
        }

        let oldConfig = { ...this.curWidget.config };
        this.curWidget.config = { option: {}, chart_type: chart_type };

        this.cleanPreview();

        this.curWidget.config.selects = oldConfig.selects;
        this.curWidget.config.keys = oldConfig.keys;
        this.curWidget.config.groups = oldConfig.groups;
        this.curWidget.config.values = [];

        this.addHelpMessage();

        this.curWidget.config.filters = oldConfig.filters;
        switch (this.curWidget.config.chart_type) {
            case 'line':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                this.curWidget.config.valueAxis = 'vertical';
                for (let i = 0; i < this.curWidget.config.values.length; i++) {
                    let v = this.curWidget.config.values[i];
                    v.series_type = 'line';
                    v.type = 'value';
                }
                break;
            case 'pie':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                for (let i = 0; i < this.curWidget.config.values.length; i++) {
                    let v = this.curWidget.config.values[i];
                    v.series_type = 'pie';
                    v.type = 'value';
                }
                break;
            case 'kpi':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let i = 0; i < v.cols.length; i++) {
                        let c = v.cols[i];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                this.curWidget.config.selects = [...this.columns];
                for (let i = 0; i < this.curWidget.config.values.length; i++) {
                    let v = this.curWidget.config.values[i];
                    v.style = 'bg-aqua';
                }
                break;
            case 'scatter':
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        if (i >= 3) {
                            this.curWidget.config.selects.push(c.col);
                            return;
                        }
                        if (!this.curWidget.config.values[i]) {
                            this.curWidget.config.values[i] = { name: '', cols: [] };
                        }
                        this.curWidget.config.values[i].cols.push(c);
                    }
                }
                for (let i = 0; i < 3; i++) {
                    if (!this.curWidget.config.values[i]) {
                        this.curWidget.config.values[i] = { name: '', cols: [] };
                    }
                }
                break;
            case 'gauge':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                this.curWidget.config.selects = [...this.columns];
                this.curWidget.config.styles = [
                    { proportion: '0.2', color: '#228b22' },
                    { proportion: '0.8', color: '#48b' },
                    { proportion: '1', color: '#ff4500' }
                ];
                break;
            case 'heatMapCalendar':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                this.curWidget.config.selects = [...this.columns];
                for (let i = 0; i < this.curWidget.config.values.length; i++) {
                    let v = this.curWidget.config.values[i];
                    v.dateFormat = 'yyyy-MM-dd';
                    v.style = 'blue';
                }
                break;
            case 'heatMapTable':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                this.curWidget.config.selects = [...this.columns];
                for (let j = 0; j < this.curWidget.config.values.length; j++) {
                    let v = this.curWidget.config.values[j];
                    v.style = 'blue';
                }
                break;
            case 'liquidFill':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                this.curWidget.config.selects = [...this.columns];
                this.curWidget.config.animation = 'static';
                for (let j = 0; j < this.curWidget.config.values.length; j++) {
                    let v = this.curWidget.config.values[j];
                    v.style = 'circle';
                }
                break;
            case 'chinaMap':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                this.curWidget.config.valueAxis = 'vertival';
                for (let j = 0; j < this.curWidget.config.values.length; j++) {
                    let v = this.curWidget.config.values[j];
                    v.series_type = 'scatter';
                    v.type = 'value';
                }
                break;
            case 'chinaMapBmap':
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                this.curWidget.config.valueAxis = 'vertical';
                for (let i = 0; i < this.curWidget.config.values.length; i++) {
                    let v = this.curWidget.config.values[i];
                    v.series_type = 'scatter';
                    v.type = 'value';
                }
                break;
            default:
                this.curWidget.config.values.push({ name: '', cols: [] });
                for (let i = 0; i < oldConfig.values.length; i++) {
                    let v = oldConfig.values[i];
                    for (let j = 0; j < v.cols.length; j++) {
                        let c = v.cols[j];
                        this.curWidget.config.values[0].cols.push(c);
                    }
                }
                break;
        }
        for (let i = 0; i < this.curWidget.config.values.length; i++) {
            let v = this.curWidget.config.values[i];
            for (let j = 0; j < v.cols.length; j++) {
                let c = v.cols[j];
                delete c.formatter;
            }
        }
        this.preview();
    }

    newConfig() {
        this.curWidget.config = {};
        this.curWidget.config.option = {};
        this.curWidget.config.chart_type = 'table';

        this.cleanPreview();
        this.curWidget.config.selects = [...this.columns];
        this.curWidget.config.keys = [];
        this.curWidget.config.groups = [];
        this.curWidget.config.values = [{ name: '', cols: [] }];
        this.curWidget.config.filters = [];
        this.addWatch();
    }

    cleanPreview() {
        $('#preview_widget').html('');
        $('#viewQuery_widget').html('');
        this.viewQueryMoal = false;
    }

    previewQuery() {
        $('#viewQuery_widget').html('');
        setTimeout(() => {
            $('#viewQuery_widget_tab').trigger('click');
        });
        this.loadingPre = true;
        this.dataService.viewQuery({
            config: this.curWidget.config,
            datasource: this.datasource ? this.datasource.id : null,
            query: this.curWidget.query,
            datasetId: this.customDs ? undefined : this.curWidget.datasetId
        }, (query) => {
            let querybr = query.trim().replace(/\n/g, '<br/>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
            $('#viewQuery_widget').html(`<div class="alert alert-info" role="alert" style="text-align: left;"><p style="color: black">${querybr}</p></div>`);
            this.loadingPre = false;
            this.viewQueryMoal = true;
        });
    }

    preview() {
        $('#preview_widget').html('');
        setTimeout(() => {
            $('#preview_widget_tab').trigger('click');
        });
        this.loadingPre = true;

        // ---- start ----
        // 添加echarts3.6.2后这里除了第一次加载echarts图表，再次加载无法显示图表
        // 完全无法找到问题下，出于无奈嵌套了一层后发现可以显示图表
        $('#preview_widget').html(`<div id="preview" style="min-height: 450px; user-select: text;"></div>`);

        // ----- end ----
        let charType = this.curWidget.config.chart_type;
        // 百度地图特殊处理
        if (charType === 'chinaMapBmap') {
            this.chartService.render($('#preview'), {
                config: this.curWidget.config,
                datasource: this.datasource ? this.datasource.id : null,
                query: this.curWidget.query,
                datasetId: this.customDs ? undefined : this.curWidget.datasetId
            });
            this.loadingPre = false;
        } else {
            this.chartService.render($('#preview'), {
                config: this.curWidget.config,
                datasource: this.datasource ? this.datasource.id : null,
                query: this.curWidget.query,
                datasetId: this.customDs ? undefined : this.curWidget.datasetId
            }, (option) => {
                switch (this.curWidget.config.chart_type) {
                    case 'line':
                        this.previewDivWidth = 12;
                        option.toolbox = {
                            feature: {
                                dataView: { show: true, readOnly: true }
                            }
                        };
                        break;
                    case 'pie':
                        this.previewDivWidth = 12;
                        option.toolbox = {
                            feature: {
                                dataView: { show: true, readOnly: true }
                            }
                        };
                        break;
                    case 'kpi':
                        this.previewDivWidth = 6;
                        break;
                    case 'table':
                        this.previewDivWidth = 12;
                        break;
                    case 'funnel':
                        this.previewDivWidth = 12;
                        option.toolbox = {
                            feature: {
                                dataView: { show: true, readOnly: true }
                            }
                        };
                        break;
                    case 'sankey':
                        this.previewDivWidth = 12;
                        option.toolbox = {
                            feature: {
                                dataView: { show: true, readOnly: true }
                            }
                        };
                        break;
                    case 'map':
                        this.previewDivWidth = 12;
                        break;
                    case 'areaMap':
                        this.previewDivWidth = 12;
                        break;
                    case 'chinaMap':
                        this.previewDivWidth = 12;
                        break;
                    case 'relation':
                        this.previewDivWidth = 12;
                        break;
                }
                this.loadingPre = false;
            }, null, !this.loadFromCache);
        }
    }

    add_value() {
        this.curWidget.config.values.push({
            name: '', series_type: 'line', type: 'value', cols: []
        });
    }

    add_pie_value() {
        this.curWidget.config.values.push({
            name: '', series_type: 'pie', type: 'value', cols: []
        });
    }

    add_china_map_value() {
        this.curWidget.config.values.push({
            name: '', series_type: 'scatter', type: 'value', cols: []
        });
    }

    add_style() {
        this.curWidget.config.styles.push({
            proportion: '', color: ''
        });
    }

    initColorPicker(index) {
        setTimeout(() => {
            $(`#color_${index}`).colorpicker()
                .on('changeColor', (e) => {
                    if (this.curWidget.config.styles[e.target.id.split('_')[1]]) {
                        this.curWidget.config.styles[e.target.id.split('_')[1]].color = e.color.toHex();
                    }
                });
        }, 100, true);
    }

    saveWgtCallBack(serviceStatus) {
        if (serviceStatus.status === '1') {
            this.getWidgetList();
            this.getCategoryList();
            this.dialog.alert(this.translate.instant('COMMON.SUCCESS'), 'modal-success');
        } else {
            this.dialog.alert(serviceStatus.msg, 'modal-warning');
        }
    }

    saveWgt() {
        this.liteMode = false;
        if (!this.validation) {
            return;
        }
        let o: any = {
            name: this.widgetName.slice(this.widgetName.lastIndexOf('/') + 1).trim(),
            categoryName: this.widgetName.substring(0, this.widgetName.lastIndexOf('/')).trim()
        };
        if (o.categoryName === '') {
            o.categoryName = this.translate.instant('COMMON.DEFAULT_CATEGORY');
        }
        o.data = {
            config: this.curWidget.config
        };
        if (this.customDs) {
            o.data.query = this.curWidget.query;
            o.data.datasource = this.datasource.id;
        } else {
            o.data.datasetId = this.curWidget.datasetId;
        }
        o.data.datasetId = _.filter(this.curWidget.expressions, e => !this.isDsExpression(e));
        o.data.filterGroups = _.filter(this.curWidget.filterGroups, e => !this.isDsFilter(e));
        this.alerts = [];
        this.verify = { widgetName: true };

        if (o.name === null || o.name === '') {
            this.alerts = [{
                msg: this.translate.instant('CONFIG.WIDGET.WIDGET_NAME') + this.translate.instant('COMMON.NOT_EMPTY'),
                type: 'danger'
            }];
            this.verify = { widgetName: false };
            $('#widgetName').focus();
            return;
        } else if (o.data.datasetId === undefined && this.customDs === false) {
            this.alerts = [{
                msg: this.translate.instant('CONFIG.WIDGET.DATASET') + this.translate.instant('COMMON.NOT_EMPTY'),
                type: 'danger'
            }];
            return;
        }

        if (this.optFlag === 'new') {
            this.http.post('./datas/saveNewWidget.json', { json: o }).subscribe((serviceStatus: any) => {
                if (serviceStatus.status === '1') {
                    this.getWidgetList();
                    this.getCategoryList();
                    this.dialog.alert(this.translate.instant('COMMON.SUCCESS'), 'modal-success');
                } else {
                    this.alerts = [{ msg: serviceStatus.msg, type: 'danger' }];
                }
            });
        } else if (this.optFlag === 'edit') {
            o.id = this.widgetId;
            this.http.post(this.updateUrl, { json: o }).subscribe((serviceStatus: any) => {
                if (serviceStatus.status === '1') {
                    this.getWidgetList();
                    this.getCategoryList();
                    this.dialog.alert(this.translate.instant('COMMON.SUCCESS'), 'modal-success');
                } else {
                    this.alerts = [{ msg: serviceStatus.msg, type: 'danger' }];
                }
            });
        }
    }

    editWgt(widget) {
        let fd = this.widgetList.find(w => w.id === widget.id);
        if (fd) {
            this.doEditWgt(widget);
            if (this.customDs === true) {
                this.doConfigParams();
            }
        } else {
            let d = widget.data.datasetId ? 'CONFIG.WIDGET.DATASET' : 'CONFIG.WIDGET.DATA_SOURCE';
            this.dialog.alert(`${this.translate.instant('ADMIN.CONTACT_ADMIN')}: ${this.translate.instant(d)}`, 'modal-danger');
        }
        // this.http.post('./datas/checkWidget.json', { id: widget.id }).subscribe((response: any) => {
        //     if (response.status === '1') {
        //         this.doEditWgt(widget);
        //         if (this.customDs === true) {
        //             this.doConfigParams();
        //         }
        //     } else {
        //         let d = widget.data.datasetId ? 'CONFIG.WIDGET.DATASET' : 'CONFIG.WIDGET.DATA_SOURCE';
        //         this.dialog.alert(`${this.translate.instant('ADMIN.CONTACT_ADMIN')}: ${this.translate.instant(d)}/${response.msg}`, 'modal-danger');
        //     }
        // });
    }

    editCurWgt() {
        let wgt = _.find(this.widgetList, w => w.id === this.widgetId);
        if (wgt) {
            this.editWgt(wgt);
        }
    }

    doEditWgt(widget) {
        this.cleanPreview();
        $('#preview_widget').html('');
        this.curWidget = { ...widget.data };
        if (this.curWidget.config.chart_type === 'kpi') {
            this.changeChart('kpi');
        }
        if (!this.curWidget.expressions) {
            this.curWidget.expressions = [];
        }
        if (!this.curWidget.filterGroups) {
            this.curWidget.filterGroups = [];
        }

        // this.updateService.updateConfig(this.curWidget.config);
        this.datasource = _.find(this.datasourceList, ds => ds.id === widget.data.datasource);

        this.widgetName = `${widget.categoryName}/${widget.name}`;

        this.widgetId = widget.id;
        this.optFlag = 'edit';
        this.customDs = _.isUndefined(this.curWidget.datasetId);
        this.loadDataset(() => {
            this.loadDsExpressions();
            this.loadDsFilterGroups();
            this.buildSchema();
            this.dataService.linkDataset(this.curWidget.datasetId, this.curWidget.config);
        });
        this.addWatch();
    }

    doCancel() {
        if (this.optFlag === 'new') {
            this.newConfig();
            this.filterSelect = {};
            this.cleanPreview();
        } else {
            this.editCurWgt();
        }
    }

    filterDimension(e) {
        if (e.type === 'level') {
            return true;
        }
        let keys = _.find(this.curWidget.config.keys, k => k.col === e.column);
        let groups = _.find(this.curWidget.config.groups, k => k.col === e.column);
        return !(keys || groups);
    }

    filterExpressions(e) {
        let result = false;
        for (let i = 0; i < this.curWidget.config.values.length; i++) {
            let v = this.curWidget.config.values[i];
            for (let j = 0; j < v.cols.length; j++) {
                let c = v.cols[j];
                if (c.type === 'exp') {
                    if (e.id === c.id && e.alias === c.alias) { }
                    result = true;
                }
            }
        }
        return !result;
    }

    filterFilterGroup(e) {
        let result = false;
        for (let i = 0; i < this.curWidget.config.filters.length; i++) {
            let f = this.curWidget.config.filters[i];
            if (f.group) {
                if (e.id === f.id && e.group === f.group) {
                    result = true;
                }
            }
        }
        return !result;
    }

    refreshSchema() {
        this.loadDataset(() => {
            this.curWidget.expressions = [];
            this.loadDsExpressions();
            this.curWidget.filterGroups = [];
            this.loadDsFilterGroups();
            this.buildSchema();
        });
    }

    buildSchema() {
        let loadFromDataset = false;
        if (!this.customDs) {
            this.dataset = _.find(this.datasetList, ds => ds.id === this.curWidget.datasetId) || {};
            if (this.dataset.data && this.dataset.data.schema && (this.dataset.data.schema.measure.length > 0 || this.dataset.data.schema.dimension.length > 0)) {
                loadFromDataset = true;
            }
        }
        if (loadFromDataset) {
            this.schema = this.dataset.data.schema;
            this.alerts = [];
            this.switchLiteMode(true);
        } else {
            this.loading = true;
            this.dataService.getColumns({
                datasource: this.datasource ? this.datasource.id : null,
                query: this.curWidget.query,
                datasetId: this.customDs ? undefined : this.curWidget.datasetId,
                reload: !this.loadFromCache,
                callback: (dps: any) => {
                    this.loading = false;
                    this.alerts = [];
                    if (dps.msg === '1') {
                        this.schema = { selects: [] };
                        for (let i = 0; i < dps.columns.length; i++) {
                            let e = dps.columns[i];
                            this.schema.selects.push({ column: e });
                        }
                        this.switchLiteMode(true);
                    } else {
                        this.alerts = [{ msg: dps.msg, type: 'danger' }];
                    }
                }
            });
        }
    }

    deleteWgt(widget) {
        this.dialog.confirm(this.translate.instant('COMMON.CONFIRM_DELETE'), 'modal-info').result.then((res) => {
            this.http.post('./datas/deleteWidget.json', { id: widget.id }).subscribe((serviceStatus: any) => {
                if (serviceStatus.status === '1') {
                    this.getWidgetList();
                } else {
                    this.dialog.alert(serviceStatus.msg, 'modal-warning');
                }
                this.optFlag = 'none';
            });
        });
    }

    copyWgt(widget) {
        let o = { ...widget };
        o.name = `${o.name}_copy`;
        this.http.post('./datas/saveNewWidget.json', { json: o }).subscribe((serviceStatus: any) => {
            if (serviceStatus.status === '1') {
                this.getWidgetList();
                this.dialog.alert(this.translate.instant('COMMON.SUCCESS'), 'modal-success');
            } else {
                this.dialog.alert(serviceStatus.msg, 'modal-warning');
            }
            this.optFlag = 'none';
        });
    }

    getQueryView() {
        if (this.datasource && this.datasource.name) {
            return `./datas/getConfigView.json?type=${this.datasource.type}`;
        }
    }

    getChartView() {
        // if (this.curWidget.config && this.curWidget.config.chart_type) {
        //     return `./datas/`
        // }
    }

    getOptionsView() {
        let basePath = '';
        if (this.curWidget.config && this.curWidget.config.chart_type) {
            return basePath + this.curWidget.config.chart_type + '.html';
        }
    }

    delteValue(cols) {
        for (let i = 0; i < cols.length; i++) {
            let e = cols[i];
            if (e.type === 'exp') {
                this.expressions.push(e);
            }
        }
    }

    editFilter(setbackArr, setbackIdx) {
        // this.dialog.open(this.paramTpl);
    }

    getSelects(setbackArr, setbackIdx) {
        return (byFilter, column, callback) => {
            let config = undefined;
            if (byFilter) {
                config = { ...this.curWidget.config };
                let arr = _.findKey(this.curWidget.config, o => o === setbackArr);
                config[arr].splice(setbackIdx, 1);
            }
            this.dataService.getDimensionValues(this.datasource ? this.datasource.id : null, this.curWidget.query, this.customDs ? undefined : this.curWidget.datasetId, column, config, (filtered) => {
                callback(filtered);
            });
        };
    }

    sltVfilter: any;
    editVFilter(o) {
        this.sltVfilter = o;
        this.dialog.open(this.vfilterTpl).result.then(res => {
            o = { ...o, ...res };
        });
    }

    schemaToSelect(schema) {
        if (schema.selects) {
            return [...schema.selects];
        } else {
            let selects = [];
            selects = selects.concat(schema.measure);
            for (let i = 0; i < schema.dimension.length; i++) {
                let e = schema.dimension[i];
                if (e.type === 'level') {
                    for (let j = 0; j < e.columns.length; j++) {
                        let c = e.columns[j];
                        selects.push(c);
                    }
                } else {
                    selects.push(e);
                }
            }
            return [...selects];
        }
    }

    fgroup: any;
    columnObjs: any;
    editFilterGroup(col) {
        this.columnObjs = this.schemaToSelect(this.schema);
        if (col) {
            this.fgroup = { ...col };
        } else {
            this.fgroup = { group: '', filters: [] };
        }

        this.dialog.open(this.fGroupTpl).result.then(res => {
            if (col) {
                col.group = res.group;
                col.filters = res.filters;
            } else {
                this.curWidget.filterGroups.push(res);
            }
        });
    }

    editSort(o) {
        switch (o.sort) {
            case 'asc':
                o.sort = 'desc';
                break;
            case 'desc':
                o.sort = undefined;
            default:
                o.sort = 'asc';
                break;
        }
    }

    cleanVSort() {
        for (let i = 0; i < this.curWidget.config.values.length; i++) {
            let v = this.curWidget.config.values[i];
            for (let j = 0; j < v.cols.length; j++) {
                let c = v.cols[j];
                c.sort = undefined;
            }
        }
    }

    editAlign(o) {
        switch (o.align) {
            case undefined:
                o.align = 'left';
                break;
            case 'left':
                o.align = 'right';
            default:
                o.align = undefined;
                break;
        }
    }

    cleanRowSort(o) {
        let sort = o.sort;
        for (let i = 0; i < this.curWidget.config.keys.length; i++) {
            let k = this.curWidget.config.keys[i];
            k.sort = undefined;
        }
        this.cleanVSort();
        o.sort = sort;
    }

    getSelectedWidget(node?: TreeNode) {
        let selectNode = node || this.tree.treeModel.getActiveNode();

        return this.widgetList.filter(ds => ds.id === selectNode.id)[0];
    }

    checkTreeNode(actionType: string, tree: TreeComponent): boolean {
        let selectedNodes = tree.treeModel.getActiveNodes();
        if (selectedNodes.length === 0) {
            this.dialog.alert('Please, select one widget first!');
            return false;
        } else if (typeof (selectedNodes[0].children) !== 'undefined') {
            this.dialog.alert(`Can't ${actionType} a folder!`);
            return false;
        }
        return true;
    }

    showInfo() {
        if (!this.checkTreeNode('info', this.tree)) {
            return;
        }
        let content = this.getSelectedWidget();
        this.dialog.alert(content, 'modal-info')
    }

    copyNode() {
        if (!this.checkTreeNode('copy', this.tree)) {
            return;
        }
        this.copyWgt(this.getSelectedWidget());
    }

    editNode(node?: TreeNode) {
        if (!node && !this.checkTreeNode('edit', this.tree)) {
            return;
        }

        this.editWgt(this.getSelectedWidget(node));
    }

    deleteNode() {
        if (!this.checkTreeNode('delete', this.tree)) {
            return;
        }
        this.deleteWgt(this.getSelectedWidget());
    }

    searchNode() {
        let para = { wgtName: '', dsName: '', dsrName: '' };

        if (!this.widgetList) {
            return;
        }

        let list = this.widgetList.map(w => {
            let ds = _.find(this.datasetList, obj => obj.id === w.data.datasetId);
            let dsrName = '';
            let dsr;
            if (ds) {
                dsr = _.find(this.datasourceList, obj => obj.id === ds.data.datasource);
            } else if (w.data.datasource) {
                dsr = _.find(this.datasourceList, obj => obj.id === w.data.datasource);
            }
            return {
                id: w.id,
                name: w.name,
                categoryName: w.categoryName,
                datasetName: ds ? ds.name : '',
                datasourceName: dsr ? dsr.name : dsrName
            };
        });

        // split search keywords
        if (this.keywords) {
            if (this.keywords.indexOf(' ') === -1 && this.keywords.indexOf(':') === -1) {
                para.wgtName = this.keywords;
            } else {
                let keys = this.keywords.split(' ');
                for (let i = 0; i < keys.length; i++) {
                    let w = keys[i].trim();
                    if (w.split(':')[0] === 'wg') {
                        para['wgtName'] = w.split(':')[1];
                    }
                    if (w.split(':')[0] === 'ds') {
                        para['dsName'] = w.split(':')[1];
                    }
                    if (w.split(':')[0] === 'dsr') {
                        para['dsrName'] = w.split(':')[1];
                    }
                }
            }
            this.treeData = this.buildTree(list.filter(item => item.name.indexOf(para.dsName) > -1 && item.name.indexOf(para.wgtName) > -1 && item.datasourceName.indexOf(para.dsrName) > -1));
        } else {
            this.treeData = this.buildTree(list);
        }

        // 异步更新数以及默认展开树
        setTimeout(() => {
            if (this.tree && this.tree.treeModel) {
                this.tree.treeModel.update();
                this.tree.treeModel.expandAll();
            }
        }, 500);
    }

    doConfigParams() {
        this.http.get('./datas/getConfigParams.json', {
            params: { type: this.datasource.type, datasourceId: this.datasource.id, page: 'widget.html' }
        }).subscribe((res: any) => {
            this.params = res.data;
        });
    }

    changeDs() {
        this.curWidget.query = {};
        this.http.get('./datas/getConfigParams.json', {
            params: { type: this.datasource.type, datasourceId: this.datasource.id, page: 'widget.html' }
        }).subscribe((res: any) => {
            this.params = res.data;
            for (let i in this.params) {
                let name = this.params[i].name;
                let value = this.params[i].value;
                let checked = this.params[i].checked;
                let type = this.params[i].type;

                if (type === 'checkbox' && checked === true) {
                    this.curWidget.query[name] = true;
                }
                if (type === 'number' && value !== '' && !isNaN(value)) {
                    this.curWidget.query[name] = Number(value);
                } else if (value !== '') {
                    this.curWidget.query[name] = value;
                }
            }
        });
    }

    setCities() {
        this.cities = [];
        let province = _.find(this.provinces, e => e.code === this.curWidget.config.province.code);
        if (province && province.cities) {
            this.cities = province.cities;
        } else if (this.curWidget.config.city && this.curWidget.config.city.code) {
            this.curWidget.config.city.code = '';
        }
    }

    onDragstart(type) {
        switch (type) {
            case 'dimension':
                this.targetHighlight = { row: true, column: true, value: false, filter: true };
                break;
            case 'measure':
            case 'exp':
                this.targetHighlight = { row: false, column: false, value: true, filter: false };
                break;
            case 'filterGroup':
                this.targetHighlight.filter = true;
                break;
            case 'select':
                this.targetHighlight = { row: true, column: true, value: true, filter: true };
                break;
        }
    }

    onDragCancle() {
        setTimeout(() => {
            this.targetHighlight = { row: false, column: false, value: false, filter: false };
        }, 500);
    }

}
