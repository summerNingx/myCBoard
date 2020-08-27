import { CBoardEChartRender } from 'src/app/util/CBoardEChartRender';
import { DialogService } from '@ism/ng-cores';

import * as _ from 'lodash';



export class ChartPieService {

    constructor(
        private dialogService: DialogService
    ) { }

    render(containerDom, option, persist, drill, relations, chartConfig) {
        let render = new CBoardEChartRender(containerDom, option, this.dialogService);
        render.addClick(chartConfig, relations);
        return render.chart(null, persist);
    }

    parseOption(data, updateEchartOptions) {
        let chartConfig = data.chartConfig;
        let castedKeys = data.keys;
        let castedValues = data.series;
        let aggregateData = data.data;
        let newValuesConfig = data.seriesConfig;

        let series = new Array();
        let stringKeys = _.map(castedKeys, key => { return key.join('-'); });
        let stringValue = _.map(castedValues, value => { return value.join('-'); });

        let b = 100 / (castedValues.length * 9 + 1);
        let titles = [];
        for (let i = 0; i < aggregateData.length; i++) {
            let joinedValues = castedValues[i].join('-');

            let realType = { ...newValuesConfig[joinedValues] }.type;
            let s: any = {
                name: stringValue[i],
                type: 'pie',
                realType: realType,
                center: [`${5 * b + i * 9 * b}%`, '50%'],
                data: [],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{b}: {d}%'
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    labelLine: { show: true }
                }
            };

            if (realType === 'coxcomb') {
                s.roseType = 'angle';
            }

            titles.push({
                textAlign: 'center',
                textStyle: {
                    fontSize: 10,
                    fontWeight: 'normal'
                },
                text: stringValue[i],
                left: `${5 * b + i * 9 * b}%`,
                top: '90%'
            });
            for (let j = 0; j < aggregateData[i].length; j++) {
                s.data.push({
                    name: stringKeys[j],
                    value: aggregateData[i][j] === undefined ? 0 : aggregateData[i][j]
                });
            }

            series.push(s);
        }

        let echartOption: any = {
            title: titles,
            legend: {
                orient: 'vertical',
                x: 'left',
                data: stringKeys
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: false,
            series: series
        };

        updateEchartOptions(chartConfig.option, echartOption);
        return echartOption;
    }

}
