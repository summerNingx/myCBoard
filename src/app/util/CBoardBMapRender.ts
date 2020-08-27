import * as $ from 'jquery';
import * as echarts from 'echarts';
import { echartsBasicOption } from './CBoardEChartRender';


export class CBoardBMapRender {

    private container;
    ecc;
    isDeppSpec;
    basicOption: any;
    options: any;
    theme = 'theme-fin1';

    constructor(jqContainer, options, isDeepSpec) {
        this.container = jqContainer;
        let bMap = jqContainer.get(0);

        $(bMap).css('width', '100%');

        // 判断是否在大屏中显示
        if (!bMap.id.endsWith('_01')) {
            $(bMap).css('height', `${$(bMap).parent().context.clientHeight}px`);
        }

        this.ecc = echarts.init(jqContainer.get(0), this.theme);
        this.isDeppSpec = isDeepSpec;
        this.basicOption = echartsBasicOption;
        this.options = options;
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
        self.ecc.setOption(options);
        self.changeSize(self.ecc);

        self.container.resize(function (e) {
            self.ecc.resize();
            self.changeSize(self.ecc);
        }); // 图表大小自适应

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
