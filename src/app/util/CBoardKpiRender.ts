import * as $ from 'jquery';


export class CBoardKpiRender {

    private container: any;
    options: any;
    template = `
        <div class="small-box {style}">
            <div class="inner">
                <h3>{kpiValue}</h3>
                <p>{kpiName}</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars></i>
            </div>
            <a class="small-box-footer">
                <span (click)="skip(widget)" *ngIf="widget.extenal" style="cursor: pointer">{skip}<i class="fa fa-share"></i></span>
                <span name="reload_{{widget.widget.id}}" (click)="reload(widget)" style="cursor: pointer">{refresh}<i class="fa fa-refresh"></i></span>
                <span (click)="config(widget)" *ngIf="widgetCfg" style="cursor: pointer">{edit}<i class="fa fa-wrench"></i></span>
            </a>
        </div>
    `;

    constructor(jqContainer, options) {
        this.container = jqContainer;
        this.options = options;
    }

    html(persist) {
        let self = this;
        let temp: any = `${self.template}`;
        let html = temp.render(self.options);
        if (persist) {
            setTimeout(() => {
                self.container.css('background', '#fff');
                // html2canvas(self.container, {
                //     onrendered: function(canvas) {
                //         persist.data = canvas.toDataURL('image/jpeg');
                //         persist.type = 'jpg';
                //         persist.widgetType = 'kpi';
                //     }
                // });
            }, 1000);
        }
        return html;
    }

    realTimeTicket() {
        let self = this;
        return (o) => {
            $(self.container).find('h3').html(o.kpiValue);
        };
    }

    do() {
        let self = this;
        // $(self.container).html(self.rendered());
    }

}
