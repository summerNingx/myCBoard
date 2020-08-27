
import * as echarts from 'echarts';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { DialogService } from '@ism/ng-cores';

declare const window: any;
declare const document: any;


export const echartsBasicOption = {
    title: {},
    grid: {
        left: 50,
        right: 20,
        bottom: '15%',
        top: '15%',
        containLabel: false
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        x: 'left',
        itemWidth: 15,
        itemHeight: 10
    }
};

export class CBoardEChartRender {

    private container: any;
    private ecc: any;
    private isDeppSepc: boolean;
    private dialogService: DialogService;
    basicOption: any;
    options: any;
    theme = 'theme-fin1';

    constructor(jqContainer, options, dialogService, isDeepSpec?) {
        this.container = jqContainer; // jquery object
        this.ecc = echarts.init(jqContainer.get(0), this.theme);
        this.isDeppSepc = isDeepSpec;

        this.basicOption = echartsBasicOption;
        this.options = options;
    }

    chart(group, persist) {
        let self = this;
        let options = this.isDeppSepc === true ? self.options : { ...self.basicOption, ...self.options };
        if (options.visualMap !== undefined) {
            $(this.container).css({
                height: '500px',
                width: '100%'
            });
        }

        if (options.legend.data && options.legend.data.length > 35) {
            options.grid.top = '5%';
            options.legend.show = false;
        }
        if (persist) {
            options.animation = false;
        }

        self.ecc.setOption(options);
        self.changeSize(self.ecc);

        // 图表大小自适应
        self.container.resize(e => {
            self.ecc.resize();
            self.changeSize(self.ecc);
        });

        if (group) {
            self.ecc.group = group;
            echarts.connect(group);
        }
        if (persist) {
            setTimeout(() => {
                persist.data = self.ecc.getDataURL({
                    type: 'jpeg',
                    pixelRatio: 2,
                    backgroundColor: '#fff'
                });
                persist.type = 'jpg';
                persist.widgetType = 'echarts';
            }, 1000);
        }
        return (o) => {
            o = { ...self.basicOption, ...o };
            self.ecc.setOption(o, true);
        };
    }

    changeSize(instance) {
        let o = instance.getOption();
        if ((o.series[0] ? o.series[0].type : null) === 'pie') {
            let l = o.series.length;
            let b = instance.getWidth() / (l + 1 + l * 8);
            for (let i = 0; i < l; i++) {
                let seriesType = o.series[i] ? o.series[i].realType : null;
                if ((b * 8) < (instance.getHeight() * 0.75)) {
                    if (seriesType === 'doughnut') {
                        o.series[i].radius = [b * 3, b * 4];
                    } else if (seriesType === 'coxcomb') {
                        o.series[i].radius = [b * 0.8, b * 4];
                    } else {
                        o.series[i].radius = [0, b * 4];
                    }
                } else {
                    if (seriesType === 'doughnut') {
                        o.series[i].radius = ['50%', '75%'];
                    } else if (seriesType === 'coxcomb') {
                        o.series[i].radius = ['15%', '75%'];
                    } else {
                        o.series[i].radius = ['0', '75%'];
                    }
                }
            }
        }
        instance.setOption(o);
    }

    addClick(chartConfig, relations) {
        if (!chartConfig || !relations) {
            return;
        }
        let self = this;
        self.ecc.on('click', (param) => {
            let sourceField = relations.sourceField;
            let links = relations.relations;

            let relationsOld = JSON.parse($('#relations').val());
            let relationsNew = [];
            if (relationsOld && relationsOld.length > 0) {
                relationsOld.forEach(relationOld => {
                    let exists = false;
                    if (links && links.length > 0) {
                        links.forEach(relation => {
                            if (relationOld.targetId === relation.targetId) {
                                exists = true;
                                return;
                            }
                        });
                    }

                    if (!exists) {
                        relationsNew.push(relationOld);
                    }
                });
            }

            let groups = _.map(chartConfig.groups, (group, index) => {
                return { index: index, name: group.col };
            });
            let keys = _.map(chartConfig.keys, (key, index) => {
                return { index: index, name: key.col };
            });

            let paramValues = [];
            switch (chartConfig.chart_type) {
                case 'line':
                case 'contrast':
                case 'scatter':
                case 'pie':
                    if (sourceField && sourceField.length > 0) {
                        sourceField.forEach(field => {
                            if ($.inArray(field, _.map(groups, (group) => {
                                return group.name;
                            })) !== -1 || $.inArray(field, _.map(keys, (key) => {
                                return key.name;
                            })) !== -1) {
                                if (groups && groups.length > 0) {
                                    groups.forEach(group => {
                                        if (group.name === field) {
                                            paramValues.push(param.seriesName.split('-')[group.index]);
                                        }
                                    });
                                }
                                if (keys && keys.length > 0) {
                                    keys.forEach(key => {
                                        if (key.name === field) {
                                            paramValues.push(param.name.split('-')[key.index]);
                                        }
                                    });
                                }
                            } else {
                                paramValues.push('noMatch');
                            }
                        });
                    }
                    break;
                case 'funnel':
                    if (sourceField && sourceField.length > 0) {
                        sourceField.forEach(field => {
                            if ($.inArray(field, _.map(keys, (key) => {
                                return key.name;
                            })) !== -1) {
                                if (keys && keys.length > 0) {
                                    keys.forEach(key => {
                                        if (key.name === field) {
                                            paramValues.push(param.seriesName.split('-')[key.index]);
                                        }
                                    });
                                }
                            } else {
                                paramValues.push('noMatch');
                            }
                        });
                    }
                    break;
                case 'sankey':
                    if (param.dataType === 'edge' && sourceField && sourceField.length > 0) {
                        sourceField.forEach(field => {
                            if ($.inArray(field, _.map(keys, (key) => {
                                return key.name;
                            })) !== -1 || $.inArray(field, _.map(groups, (group) => {
                                return group.name;
                            })) !== -1) {
                                if (keys && keys.length > 0) {
                                    keys.forEach(key => {
                                        if (key.name === field) {
                                            paramValues.push(param.data.source.split('-')[key.index]);
                                        }
                                    });
                                }
                                if (groups && groups.length > 0) {
                                    groups.forEach(group => {
                                        if (group.name === field) {
                                            paramValues.push(param.data.target.split('-')[group.index]);
                                        }
                                    });
                                }
                            } else {
                                paramValues.push('noMatch');
                            }
                        });
                    }
                case 'radar':
                    if (chartConfig.asRow) { // 雷达行维
                        if (sourceField && sourceField.length > 0) {
                            sourceField.forEach(field => {
                                if ($.inArray(field, _.map(keys, (key) => { return key.name })) !== -1) {
                                    if (keys && keys.length > 0) {
                                        keys.forEach(key => {
                                            if (key.name === field) {
                                                paramValues.push(param.name.split('-')[key.index]);
                                            }
                                        });
                                    }
                                } else {
                                    paramValues.push('noMatch');
                                }
                            });
                        }
                    } else {
                        if (sourceField && sourceField.length > 0) {
                            sourceField.forEach(field => {
                                if ($.inArray(field, _.map(groups, group => { return group.name; })) !== -1) {
                                    if (groups && groups.length > 0) {
                                        groups.forEach(group => {
                                            if (group.name === field) {
                                                paramValues.push(param.name.split('-')[group.index]);
                                            }
                                        });
                                    }
                                } else {
                                    paramValues.push('noMatch');
                                }
                            });
                        }
                    }
                    break;
                case 'wordCloud':
                    if (sourceField && sourceField.length > 0) {
                        sourceField.forEach(field => {
                            if ($.inArray(field, _.map(keys, key => { return key.name; })) !== -1) {
                                if (keys && keys.length > 0) {
                                    keys.forEach(key => {
                                        if (key.name === field) {
                                            paramValues.push(param.name.split('-')[key.index]);
                                        }
                                    });
                                }
                            } else {
                                paramValues.push('noMatch');
                            }
                        });
                    }
                    break;
                case 'treeMap':
                    if (sourceField && sourceField.length > 0) {
                        sourceField.forEach(field => {
                            if ($.inArray(field, _.map(keys, key => { return key.name.toUpperCase(); })) !== -1) {
                                if (keys && keys.length > 0) {
                                    keys.forEach(key => {
                                        if (key.name.toUpperCase() === field && param.treePathInfo(key.index + 1)) {
                                            paramValues.push(param.treePathInfo[key.index + 1].name);
                                        }
                                    });
                                }
                            } else {
                                paramValues.push('noMatch');
                            }
                        });
                    }
                    break;
                default:
                    break;
            }

            if (links && links.length > 0) {
                links.forEach(relation => {
                    let record: any = {};
                    record.targetId = relation.targetId;
                    record.params = [];
                    for (let i = 0; i < relation.targetField.length; i++) {
                        let e: any = {};
                        e.targetField = relation.targetField[i];
                        e.value = paramValues[i];
                        record.params.push(e);
                    }
                    record.params = _.filter(record.params, e => e.value !== 'noMatch');
                    relationsNew.push(record);
                });

                $('#relations').val(JSON.stringify(relationsNew));
                // 触发关联图表刷新
                let wFilters = _.filter(links, e => e.type === 'widget') || [];
                wFilters.forEach(relation => {
                    let button = document.getElementsByName(`reload_${relation.targetId}`);
                    if (button && button.length > 0) {
                        button[button.length - 1].click();
                    }
                });

                // 触发弹出看板
                let bFilters = _.filter(links, e => e.type === 'board') || [];
                bFilters.forEach(relation => {
                    let url = document.location.href('mine.view', { id: relation.targetId });
                    let param = JSON.stringify(_.find(relationsNew, e => e.targetId === relation.targetId));
                    window.open(encodeURI(`${url}?${param}`), '_black');
                });
            }

        });
    }

    updateEchartOptions(tuningOpt, rawOpt) {
        if (tuningOpt) {
            if (tuningOpt.dataZoom === true) {
                rawOpt.dataZoom = {
                    show: true,
                    start: 0,
                    end: 100
                };
            }

            rawOpt.grid = rawOpt.grid === undefined ? {...echartsBasicOption.grid} : null;

            if (tuningOpt.legendShow === false) {
                rawOpt.grid.top = '5%';
                rawOpt.legend.show = false;
            } else {
                rawOpt.legend = rawOpt.legend === undefined ? {...echartsBasicOption.grid} : null;
                tuningOpt.legend.x = tuningOpt.legendX ? tuningOpt.legendX : null;
                tuningOpt.legend.y = tuningOpt.legendY ? tuningOpt.legendY : null;
                tuningOpt.legend.orient = tuningOpt.legendOrient ? tuningOpt.legendOrient : null;
            }

            if (tuningOpt.gridCustom === true) {
                tuningOpt.grid.top = tuningOpt.gridTop ? tuningOpt.gridTop : null;
                tuningOpt.grid.bottom = tuningOpt.gridBottom ? tuningOpt.gridBottom : null;
                tuningOpt.grid.left = tuningOpt.gridLeft ? tuningOpt.gridLeft : null;
                tuningOpt.grid.right = tuningOpt.gridRight ? tuningOpt.gridRight : null;
            }
        }
    }
}

