
import * as $ from 'jquery';


export class CBoardGisRender {

    options: any;
    tall;
    private container: any;
    drill;

    constructor(jqContainer, options, drill) {
        this.options = options;
        this.container = jqContainer;
        this.drill = drill;
        let self = this;

        $(jqContainer).html('<div class="gis_wrapper"></div>');
        $('.map_wrapper').resize(function() {
            self.do(self.tall);
        });
    }

    do(tall, persist?, threeLevelMap?) {
        this.tall = tall;
        this.container = $('.gis_wrapper');
        tall = tall === undefined ? 500 : tall;
        let self = this;

        let render = (o, drillConfig) => {
            self.options = o;
            self.drill.config = drillConfig;
            self.do(self.tall);
        };
        let args = {
            height: tall,
            chartConfig: this.options.chartConfig,
            data: this.options.data,
            container: this.container,
            drill: this.drill,
            render: render
        };

        if (threeLevelMap) {
            threeLevelMap.container = this.container;
            threeLevelMap.map(args);
        }
        $(this.container).css({
            height: `${tall + 40}px`,
            width: '100%'
        });
        $(this.container).css({
            height: `${tall}px`,
            width: '100%'
        });
        if (persist) {
            setTimeout(() => {
                // html2canvas(self.container[0], {
                //     onrendered: function(canvans) {
                //         persist.data = canvans.toDataURL('image/jpeg');
                //         persist.type = 'jpg';
                //     }
                // });
            }, 1000);
        }
        return (o) => {
            this.options = o;
            this.do(this.tall);
        }
    }

}
