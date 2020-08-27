import { CBoardKpiRender } from 'src/app/util/CboardKpiRender';
import { TranslateService } from '@ngx-translate/core';


export class ChartKpiService {

    constructor(
        private translate: TranslateService
    ) {}

    render(containerDom, option, scope, persist) {
        let render = new CBoardKpiRender(containerDom, option);
        let html = render.html(persist);
        if (scope) {
            // containerDom.append($compile(html)(scope));
        } else {
            containerDom.html(html);
        }
        return render.realTimeTicket();
    }

    parseOption(data) {
        let option: any = {};
        let config = data.chartConfig;
        let castedKeys = data.keys;
        let castedValues = data.series;
        let aggregateData = data.data;
        let newValuesConfig = data.seriesConfig;

        option.kpiValue = aggregateData.length > 0 ? aggregateData[0][0] : 'N/A';
        if (config.values[0].format) {
            // option.kpiValue = numbro(option.kpiValue).format(config.values[0].format);
        }
        option.kpiName = config.values[0].name;
        option.style = config.values[0].style;
        option.edit = this.translate.instant('COMMON.EDIT');
        option.refresh = this.translate.instant('COMMON.REFRESH');
        option.skip = this.translate.instant('COMMON.SKIP');
        return option;
    }

}
