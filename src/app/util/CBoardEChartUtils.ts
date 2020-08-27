import { echartsBasicOption } from './CBoardEChartRender';


let updateEChartOptions = (tuningOpt, rawOpt) => {
    if (tuningOpt) {
        if (tuningOpt.dataZoom === true) {
            rawOpt.dataZoom = {
                show: true,
                start: 0,
                end: 100
            };
        }

        rawOpt.grid = rawOpt.grid === undefined ? echartsBasicOption.grid : null;

        if (tuningOpt.legendShow === false) {
            rawOpt.grid.top = '5%';
            rawOpt.legend.show = false;
        } else {
            rawOpt.legend = rawOpt.legend === undefined ? echartsBasicOption.legend : null;
            rawOpt.legend.x = tuningOpt.legendX ? tuningOpt.legendX : null;
            rawOpt.legend.y = tuningOpt.legendY ? tuningOpt.legendY : null;
            rawOpt.legend.orient = tuningOpt.legendOrient ? tuningOpt.legendOrient : null;
        }

        if (tuningOpt.gridCustom === true) {
            rawOpt.grid.top = tuningOpt.gridTop ? tuningOpt.gridTop : null;
            rawOpt.grid.bottom = tuningOpt.gridBottom ? tuningOpt.gridBottom : null;
            rawOpt.grid.left = tuningOpt.gridLeft ? tuningOpt.gridLeft : null;
            rawOpt.grid.right = tuningOpt.gridRight ? tuningOpt.gridRight : null;
        }
    }
}
