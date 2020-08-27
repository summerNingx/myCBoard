
import * as $ from 'jquery';
import * as echarts from 'echarts';


let echartsBasicOption = {
    title: {},
    grid: {
        left: '50',
        right: '20',
        bottom: '15%',
        top: '20%',
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


export class CBoardHeatMapRender {

    private container: any;
    ecc;
    isDeppSpec;
    basicOption;
    options;
    theme = 'theme-fin1';

    constructor(jqContainer, options, isDeepSpec) {
        this.container = jqContainer;
        let heatMap = jqContainer.get(0);
        $(heatMap).css('width', '100%');
        // 判断是否在大屏中显示
        if (!heatMap.id.endsWith('_01')) {
            $(heatMap).css('height', '500px');
        }

        this.ecc = echarts.init(jqContainer.get(0), this.theme);
    }

    chart(group, persist) {
        let self = this;
        let options = this.isDeppSpec === true ? self.options : { ...self.basicOption, ...self.options };

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
        this.ecc.setOption(options);
        this.changeSize(this.ecc);
        this.container.resize(function (e) {
            self.ecc.resize();
            self.changeSize(self.ecc);
        });

        if (group) {
            this.ecc.group = group;
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
        let seriesType = o.series[0] ? o.series[0].type : null;
        if (seriesType === 'pie') {
            let l = o.series.length;
            let b = instance.getWidth() / (l + 1 + l * 8);
            for (let i = 0; i < l; i++) {
                if ((b * 8) < (instance.getHeight() * 0.75)) {
                    o.series[i].radius = [0, b * 4];
                } else {
                    o.series[i].radius = [0, '75%'];
                }
            }
            instance.setOption(o);
        }
    }

}
