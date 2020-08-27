

export class ChartTableService {

    render(containerDom, option, scope, persist, drill) {
        if (option === null) {
            containerDom.html('<div class="alert alert-danger" role="alert">No Data!</div>');
            return;
        }
        let height = scope ? scope.myheight - 20 : null;
        return new CboardTableRender(containerDom, option, drill).do(height, persist);
    }

    parseOption(data, chartDataProcess) {
        return chartDataProcess(data.chartConfig, data.keys, data.series, data.data, data.seriesConfig);
    }

}
