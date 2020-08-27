import { CBoardEChartRender } from '../util/CBoardEChartRender';
import { Defer } from '@ism/ng-cores';
import { DataService } from './data.service';
import { ChartLineService } from './chart/chartLine.service';
import { ChartPieService } from './chart/chartPie.service';
import { ChartKpiService } from './chart/chartKpi.service';


export class ChartService {

    theme: string;

    constructor(
        private dataService: DataService,
        private chartLineService: ChartLineService,
        private chartPieService: ChartPieService,
        private chartKpiService: ChartKpiService
    ) { }

    render(containerDom, widget, optionFilter, scope, reload, persist, relations, isCockpit) {
        if (isCockpit) {
            this.theme = 'dark';
        } else {
            this.theme = 'theme-fin1';
        }

        let defer = new Defer();
        let chart = this.getChartServices(widget.config);
        // this.dataService.getDataSeries2(widget.datasource, widget.query, widget.datasetId, widget.config, (data) => {
        //     try {

        //     } catch (error) {

        //     }
        // })
    }

    getChartServices(chartConfig) {
        let chart;
        switch (chartConfig.chart_type) {
            case 'line':
                chart = this.chartLineService;
                break;
            case 'pie':
                chart = this.chartPieService;
                break;
            case 'kpi':
                chart = this.chartKpiService;
                break;
            case 'table':
                chart = this.chartTableService;
                break;
            case 'funnel':
                chart = this.chartFunnelService;
                break;
            case 'sankey':
                chart = this.chartSankeyService;
                break;
            case 'radar':
                chart = this.chartRadarService;
                break;
            case 'map':
                chart = this.chartMapService;
                break;
            case 'scatter':
                chart = this.chartScatterService;
                break;
            case 'gauge':
                chart = this.chartGaugeService;
                break;
            case 'wordCloud':
                chart = this.chartWordCloudService;
                break;
            case 'treeMap':
                chart = this.chartTreeMapService;
                break;
            case 'areaMap':
                chart = this.chartAreaMapService;
                break;
            case 'heatMapCalendar':
                chart = this.chartHeatMapCalendarService;
                break;
            case 'heatMapTable':
                chart = this.chartHeatMapTableService;
                break;
            case 'liquidFill':
                chart = this.chartLiquidFillService;
                break;
            case 'contrast':
                chart = this.chartContrastService;
                break;
            case 'chinaMap':
                chart = this.chartChinaMapService;
                break;
            case 'chinaMapBmap':
                chart = this.chartChinaMapBmapService;
                break;
            case 'relation':
                chart = this.chartRelationService;
                break;
            case 'worldMap':
                chart = this.chartWorldMapService;
                break;
        }
    }

}


