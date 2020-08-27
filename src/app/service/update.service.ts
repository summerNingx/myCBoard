
import * as _ from 'lodash';


export class UpdateService {

    updateConfig(config) {
        let toFilterConfig = function(e) {
            if (typeof e === 'string') {
                return {col: e, type: 'eq', values: []};
            }
            return e;
        };

        config.keys = _.map(config.keys, toFilterConfig);
        config.groups = _.map(config.groups, toFilterConfig);
        if (!config.filters) {
            config.filters = [];
        }

        switch (config.chart_type) {
            case 'pie':
                if (!config.groups) {
                    config.groups = [];
                }
                break;
            case 'line':
                if (!config.valueAxis) {
                    config.valueAxis = 'vertical';
                }
                break;
        }
    }

    updateBoard(board) {
        if (board.layout === undefined) {
            return;
        }
        if (board.layout && board.layout.rows && board.layout.rows.length > 0) {
            board.layout.rows.forEach(row => {
                if (!row.type) {
                    row.type = 'widget';
                }
            });
        }
    }

}
