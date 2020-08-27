import { CBoardEChartRender, echartsBasicOption } from 'src/app/util/CBoardEChartRender';
import { DialogService } from '@ism/ng-cores';

import * as _ from 'lodash';



export class ChartLineService {

    constructor(
        private dialogService: DialogService
    ) { }

    render(containerDom, option, persist, drill, relation, chartConfig) {
        let render = new CBoardEChartRender(containerDom, option, this.dialogService);
        render.addClick(chartConfig, relation);

        return render.chart(null, persist);
    }

    parseOption(data, updateEchartOptions) {
        let chartConfig = data.chartConfig;
        let castedKeys = data.keys;
        let castedValues = data.series;
        let aggregateData = data.data;
        let newValuesConfig = data.seriesConfig;
        let seriesData = [];
        let stringKeys = _.map(castedKeys, key => {
            return key.join('-');
        });
        let tunningOpt = chartConfig.option;
        let zipDataWithCfg = _.chain(aggregateData).map((data, i) => {
            let joinedValues = castedValues[i].join('-');
            let s = newValuesConfig[joinedValues];
            s.key = joinedValues;
            s.data = data;
            return s;
        }).value();

        let sumData = _.chain(zipDataWithCfg).groupBy(item => {
            return item.valueAxisIndex;
        }).map(axisSeries => {
            let sumArr = [];
            for (let i = 0; i < axisSeries[0].data.length; i++) {
                let sumItem = 0;
                for (let j = 0; j < axisSeries.length; j++) {
                    let cell = axisSeries[j].data[i];
                    sumItem += cell ? Number(cell) : 0;
                }

                sumArr.push(sumItem);
            }
            return sumArr;
        }).value();

        for (let j = 0; j < aggregateData.length; j++) {
            for (let i = 0; i < aggregateData.length; i++) {
                aggregateData[i][j] = aggregateData[i][j] ? Number(aggregateData[i][j]) : 0;
            }
        }

        for (let i = 0; i < zipDataWithCfg.length; i++) {
            let s = zipDataWithCfg[i];
            s.name = s.key;
            let sData = sumData[s.valueAxisIndex];
            if (s.type.indexOf('percent') > -1) {
                if (chartConfig.valueAxis === 'horizontal') {
                    s.data = _.map(s.data, (e, i) => (e / sData[i] * 100).toFixed(2));
                } else {
                    s.data = _.map(s.data, (e, i) => [i, (e / sData[i] * 100).toFixed(e), e]);
                }
            }
            s.coordinateSystem = chartConfig.coordinateSystem;

            switch (s.type) {
                case 'stackbar':
                case 'percentbar':
                    s.type = 'bar';
                    s.stack = s.valueAxisIndex.toString();
                    break;
                case 'arealine':
                    s.type = 'line';
                    s.areaStyle = { normal: {} };
                    break;
                case 'stackline':
                case 'percentline':
                    s.type = 'line';
                    s.stack = s.valueAxisIndex.toString();
                    s.areaStyle = { normal: {} };
                    break;
            }

            if (chartConfig.valueAxis === 'horizontal') {
                s.xAxisIndex = s.valueAxisIndex;
            } else {
                s.yAxisIndex = s.valueAxisIndex;
            }
            seriesData.push(s);
        }

        let valueAxis = [...chartConfig.values];
        if (valueAxis && valueAxis.length > 0) {
            valueAxis.forEach((axis, index) => {
                axis.axisLabel = {
                    formatter: (value) => {
                        return `${value}`;
                    }
                };

                if (axis.series_type === 'percentbar' || axis.series_type === 'percentline') {
                    axis.min = 0;
                    axis.max = 100;
                } else {
                    axis.min = axis.min ? axis.min : null;
                    axis.max = axis.max ? axis.max : null;
                }
                if (index > 0) {
                    axis.splitLine = false;
                }
                axis.scale = true;
            });
        }

        let labelInterval, labelRotate;
        if (tunningOpt) {
            labelInterval = tunningOpt.ctgLabelInterval ? tunningOpt.ctgLabelInterval : 'auto';
            labelRotate = tunningOpt.ctgLabelRotate ? tunningOpt.ctgLabelRotate : 0;
        }

        let categoryAxis = {
            type: 'category',
            data: stringKeys,
            axisLabel: {
                interval: labelInterval,
                rotate: labelRotate
            },
            boundaryGap: false
        };

        if (valueAxis && valueAxis.length > 0) {
            valueAxis.forEach(axis => {
                let _stype = axis.series_type;
                if (_stype.indexOf('bar') !== -1) {
                    categoryAxis.boundaryGap = true;
                }
            });
        }

        let echartOption: any = {
            grid: {...echartsBasicOption.grid},
            legend: {
                data: _.map(castedValues, (v) => {
                    return v.join('-');
                })
            },
            tooltip: {
                formatter: function(params) {
                    let name = params[0].name;
                    let s = `${name}</bar>`;
                    for (let i = 0; i < params.length; i++) {
                        let item = params[i];
                        s += `<span style="display: inline-block; margin-right: 5px; border-radius: 10px; width: 9px; height: 9px; background-color: ${item.color}"></span>`;
                        if (item.value instanceof Array) {
                            s += `${item.seriesName} : ${item.value[1]} % (${item.value[2]})<br>`;
                        } else {
                            s += `${item.seriesName} : ${item.value}<br>`
                        }
                    }
                    return s;
                },
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            series: seriesData
        };

        if (chartConfig.coordinateSystem === 'polar') {
            echartOption.angleAxis = chartConfig.valueAxis === 'horizontal' ? valueAxis : categoryAxis;
            echartOption.radiusAxis = chartConfig.valueAxis === 'horizontal' ? categoryAxis : valueAxis;
            echartOption.polar = {};
        } else {
            echartOption.xAxis = chartConfig.valueAxis === 'horizontal' ? valueAxis : categoryAxis;
            echartOption.yAxis = chartConfig.valueAxis === 'horizontal' ? categoryAxis : valueAxis;
        }

        if (chartConfig.valueAxis === 'horizontal') {
            echartOption.grid.left = 'left';
            echartOption.grid.containLabel = true;
            echartOption.grid.bottom = '5%';
        }

        if (chartConfig.valueAxis === 'vertical' && chartConfig.values.length > 1) {
            echartOption.grid.right = 40;
        }

        updateEchartOptions(tunningOpt, echartOption);

        return echartOption;
    }

}

