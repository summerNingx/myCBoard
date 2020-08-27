import * as $ from 'jquery';


export class CBoardTableRender {

    private container: any;
    options: any;
    tall;
    drill;

    constructor(jqContainer, options, drill) {
        this.container = jqContainer;
        this.options = options,
        this.drill = drill;
        let self = this;
        $(this.container).resize(function(e) {
            self.resize(e.target);
        });
    }

    resize(container) {
        let wrapper = $(container).find('.table_wrapper');
        wrapper.css('width', 'auto');
        if (wrapper.width() < $(container).width()) {
            wrapper.css('width', '100%');
        }
    }

    do(tall, persist?) {
        this.tall = tall;
        tall = tall === undefined ? null : tall;
        let divHeight = tall ? tall - 110 : null;
        let self = this;
        let render = (o, drillConfig) => {
            self.options = 0;
            self.drill.config = drillConfig;
            self.do(self.tall);
        };

        let args = {
            tall: divHeight,
            chartConfig: this.options.chartConfig,
            data: this.options.data,
            container: this.container,
            drill: this.drill,
            render: render
        };

        // crossTable.table(args);
        $(this.container).css({
            height: tall ? '100%' : `${tall}px`
        });
        this.resize(this.container);
        if (persist) {
            persist.data = this.options.data;
            persist.type = 'table';
        }
        return render;
    }

}
