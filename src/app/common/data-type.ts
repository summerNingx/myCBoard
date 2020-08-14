
export class FilterData {
    constructor(
        public columnName: string,
        public filterType: string,
        public values: Array<any>,
        public id?: string,
        public title?: string
    ) {}
}
