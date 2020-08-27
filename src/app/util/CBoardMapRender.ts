

import * as $ from 'jquery';
import * as _ from 'lodash';


export class CBoardMapRender {
    private container: any;
    tall;
    options;
    drill;

    constructor(jqContainer, options, drill) {
        this.options = options;
        this.container = jqContainer;
        this.drill = drill;

        let self = this;
        $(jqContainer).html("<div class='map_wrapper'></div>");
        $('.map_wrapper').resize(function () {
            self.do(self.tall);
        });
    }

    do(tall, persist?, threeLevelMap?) {
        this.tall = tall;
        this.container = this.container;
        tall = _.isUndefined(tall) ? 500 : tall;
        var args = {
            height: tall - 20,
            chartConfig: this.options.chartConfig,
            data: this.options.data,
            container: this.container,
            drill: this.drill
        };
        try {
            if (threeLevelMap) {
                threeLevelMap.map(args);
            }
        } catch (err) {
        }
        $(this.container).css({
            height: `${tall + 40}px`,
            width: '100%'
        });
        $(this.container).css({
            height: `${tall}px`,
            width: '100%'
        });
        var self = this;
        if (persist) {
            setTimeout(function () {
                // html2canvas(_this.container[0], {
                //     onrendered: function (canvas) {
                //         persist.data = canvas.toDataURL('image/jpeg');
                //         persist.type = 'jpg';
                //     }
                // });
            }, 1000);
        }
        return function (o) {
            self.options = o;
            self.do(self.tall);
        }
    }
}
